const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { addDays } = require('../utils/date');
const { reduceError } = require('./error-tracker');

// Interval schedule in days per mastery level
const INTERVALS = {
  0: 1,    // level 0 → review tomorrow
  1: 3,    // level 1 → review in 3 days
  2: 7,    // level 2 → review in 1 week
  3: 14,   // level 3 → review in 2 weeks
  4: 30,   // level 4 → review in 1 month
  5: 90    // level 5 (mastered) → review in 3 months
};

function getIntervalDays(level) {
  return INTERVALS[Math.min(level, 5)] || 1;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function interleaveDueItems(rows, limit) {
  const wordQueue = rows.filter((row) => row.item_type === 'word');
  const phraseQueue = rows.filter((row) => row.item_type === 'phrase');
  const result = [];
  let preferWords = wordQueue.length >= phraseQueue.length;

  while (result.length < limit && (wordQueue.length > 0 || phraseQueue.length > 0)) {
    const primary = preferWords ? wordQueue : phraseQueue;
    const secondary = preferWords ? phraseQueue : wordQueue;

    if (primary.length > 0) {
      result.push(primary.shift());
    }
    if (result.length >= limit) break;

    if (secondary.length > 0) {
      result.push(secondary.shift());
    }

    preferWords = !preferWords;
  }

  return result.slice(0, limit);
}

async function initMastery(itemType, itemId, date) {
  const nextReview = addDays(date, INTERVALS[0]);
  await run(
    `INSERT OR IGNORE INTO word_mastery
     (item_type, item_id, mastery_level, review_count, correct_streak, next_review_date, last_review_date, created_at)
     VALUES (?, ?, 0, 0, 0, ?, NULL, ?)`,
    [itemType, itemId, nextReview, date]
  );
}

// questionMode: 'typing' | 'choice' | 'hint' | 'listen'
// Score deltas: typing/listen correct = +1, choice/hint correct = +0.5, wrong = -1.5
async function updateMastery(itemType, itemId, isCorrect, date, questionMode) {
  const row = await queryOne(
    'SELECT * FROM word_mastery WHERE item_type = ? AND item_id = ?',
    [itemType, itemId]
  );
  if (!row) {
    await initMastery(itemType, itemId, date);
    return updateMastery(itemType, itemId, isCorrect, date, questionMode);
  }

  let newLevel, newStreak, newWrongStreak, nextReview;
  if (isCorrect) {
    newLevel = Math.min(row.mastery_level + 1, 5);
    newStreak = row.correct_streak + 1;
    newWrongStreak = 0;
    nextReview = addDays(date, getIntervalDays(newLevel));
  } else {
    newLevel = 0;
    newStreak = 0;
    newWrongStreak = (row.wrong_streak || 0) + 1;
    nextReview = addDays(date, 1);
  }

  // Calculate score delta based on question mode and correctness
  let scoreDelta;
  if (isCorrect) {
    const base = (questionMode === 'choice' || questionMode === 'hint') ? 0.5 : 1;
    // Streak bonus: 3+ consecutive correct → +0.2 extra (fixed, not cumulative)
    scoreDelta = newStreak >= 3 ? base + 0.2 : base;
    // High-practice, low-error bonus: review_count ≥ 20 with low lifetime error rate
    // accelerates pausing so well-mastered items leave the quiz pool sooner
    const preReviewCount = row.review_count || 0;
    if (preReviewCount >= 20) {
      const errorRate = preReviewCount > 0 ? (row.total_wrong || 0) / preReviewCount : 0;
      if (errorRate < 0.05) scoreDelta += 0.3;
      else if (errorRate < 0.10) scoreDelta += 0.2;
      else if (errorRate < 0.12) scoreDelta += 0.1;
    }
  } else {
    const base = -1.5;
    // Wrong streak penalty: 2+ consecutive wrong → extra -0.1 cumulative
    // 1st wrong: -1.5, 2nd: -1.5, 3rd: -1.6, 4th: -1.7, ...
    const extraPenalty = newWrongStreak > 2 ? (newWrongStreak - 2) * 0.1 : 0;
    scoreDelta = base - extraPenalty;
  }
  // Round to 1 decimal place (half-up) to avoid float drift like 10.400000001
  const rawScore = Math.max(0, Math.min(12, (row.score || 0) + scoreDelta));
  const newScore = Math.round(rawScore * 10) / 10;
  const newPaused = newScore >= 12 ? 1 : (row.paused || 0);
  const hintInc = questionMode === 'hint' ? 1 : 0;

  await run(
    `UPDATE word_mastery
     SET mastery_level = ?, review_count = review_count + 1, correct_streak = ?,
         wrong_streak = ?, next_review_date = ?, last_review_date = ?,
         score = ?, paused = ?, hint_count = COALESCE(hint_count, 0) + ?,
         total_wrong = COALESCE(total_wrong, 0) + ?,
         just_unpaused = 0
     WHERE item_type = ? AND item_id = ?`,
    [newLevel, newStreak, newWrongStreak, nextReview, date, newScore, newPaused, hintInc, isCorrect ? 0 : 1, itemType, itemId]
  );

  // Every 2 consecutive correct answers, reduce 1 error count
  if (isCorrect && newStreak > 0 && newStreak % 2 === 0) {
    await reduceError(itemType, itemId);
  }

  saveDb();
}

// Called when daily learning is completed. Paused items decay each day so mastery eventually
// falls back below the pause threshold. Decay is tiered by practice volume + lifetime error rate:
//   - ≥100 attempts & err ≥15% → -0.7  (volatile despite heavy practice)
//   - ≥75 attempts & err ≤ 5%  → -0.4  (well-mastered, decay slower)
//   - ≥50 attempts & err ≥15%  → -0.6
//   - otherwise                 → -0.5
// If score drops below 6, unpause and mark just_unpaused.
async function decayPausedItems() {
  await run(`
    UPDATE word_mastery SET score = ROUND(score - CASE
      WHEN review_count >= 100
           AND review_count > 0
           AND (COALESCE(total_wrong, 0) * 1.0 / review_count) >= 0.15 THEN 0.7
      WHEN review_count >= 75
           AND review_count > 0
           AND (COALESCE(total_wrong, 0) * 1.0 / review_count) <= 0.05 THEN 0.4
      WHEN review_count >= 50
           AND review_count > 0
           AND (COALESCE(total_wrong, 0) * 1.0 / review_count) >= 0.15 THEN 0.6
      ELSE 0.5
    END, 1)
    WHERE paused = 1
  `);
  await run(`UPDATE word_mastery SET paused = 0, just_unpaused = 1 WHERE paused = 1 AND score < 6`);
  saveDb();
}

// Error-rate priority: lifetime total_wrong / review_count, ignored under MIN_ATTEMPTS.
const ERROR_RATE_MIN_ATTEMPTS = 4;

function computePriorityScore(row, avgReview) {
  const reviewCount = row.review_count || 0;
  const totalWrong = row.total_wrong || 0;

  // Error rate: items with more mistakes float up (needs 4+ reviews to be reliable)
  const errorRate = reviewCount >= ERROR_RATE_MIN_ATTEMPTS ? totalWrong / reviewCount : 0;

  // Fresh bonus: 0.5 for never-quizzed, scales to 0 at 1.5× the current avg.
  // avgReview is always the real average so this is always relative, not absolute.
  const baseline = avgReview > 0 ? avgReview * 1.5 : 1;
  const freshBonus = reviewCount === 0 ? 0.5 : Math.max(0, 0.5 * (1 - reviewCount / baseline));

  return errorRate + freshBonus;
}

async function getAverageReviewCount() {
  return await queryScalar('SELECT AVG(review_count) FROM word_mastery WHERE review_count > 0') || 0;
}

// Returns a Set of "type:id" strings for items with error_rate > threshold (default 10%).
// Only items with review_count >= ERROR_RATE_MIN_ATTEMPTS qualify.
async function getHighErrorRateSet(threshold = 0.10) {
  const rows = await queryAll(`
    SELECT item_type, item_id FROM word_mastery
    WHERE review_count >= ? AND total_wrong * 1.0 / review_count > ?
  `, [ERROR_RATE_MIN_ATTEMPTS, threshold]);
  return new Set(rows.map(r => `${r.item_type}:${r.item_id}`));
}

async function getDueReviews(date, limit = 40, roundNumber = 1) {
  const candidateLimit = Math.max(limit * 3, limit);
  const avgReview = roundNumber >= 2 ? await getAverageReviewCount() : 0;

  const rows = await queryAll(`
    SELECT wm.item_type, wm.item_id, wm.mastery_level, wm.review_count,
           COALESCE(wm.total_wrong, 0) as total_wrong,
           wm.correct_streak, COALESCE(wm.wrong_streak, 0) as wrong_streak,
           COALESCE(wm.just_unpaused, 0) as just_unpaused,
           wm.next_review_date, wm.last_review_date,
           CAST(julianday(?) - julianday(wm.next_review_date) AS INTEGER) as overdue_days,
           COALESCE(err.total_errors, 0) as total_errors
    FROM word_mastery wm
    LEFT JOIN (
      SELECT item_type, item_id, SUM(error_count) as total_errors
      FROM errors
      GROUP BY item_type, item_id
    ) err ON err.item_type = wm.item_type AND err.item_id = wm.item_id
    WHERE wm.next_review_date <= ? AND COALESCE(wm.paused, 0) = 0
    LIMIT ?
  `, [date, date, candidateLimit]);

  const seeded = rows
    .slice()
    .map(row => ({ ...row, priority_score: computePriorityScore(row, avgReview) }))
    .sort((left, right) => {
      const priorityDelta =
        (right.just_unpaused - left.just_unpaused) ||
        (right.overdue_days - left.overdue_days) ||
        (right.priority_score - left.priority_score) ||
        (right.total_errors - left.total_errors) ||
        (right.wrong_streak - left.wrong_streak) ||
        (left.mastery_level - right.mastery_level) ||
        String(left.last_review_date || '').localeCompare(String(right.last_review_date || ''));

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      const leftSeed = hashString(`${date}:${left.item_type}:${left.item_id}`);
      const rightSeed = hashString(`${date}:${right.item_type}:${right.item_id}`);
      return leftSeed - rightSeed;
    });

  return interleaveDueItems(seeded, limit);
}

async function getDueCount(date) {
  return await queryScalar(
    'SELECT COUNT(*) FROM word_mastery WHERE next_review_date <= ? AND COALESCE(paused, 0) = 0',
    [date]
  ) || 0;
}

async function getMasteryInfo(itemType, itemId) {
  return queryOne(
    'SELECT * FROM word_mastery WHERE item_type = ? AND item_id = ?',
    [itemType, itemId]
  );
}

async function backfillMastery(date) {
  const missing = await queryAll(`
    SELECT DISTINCT ll.item_type, ll.item_id, MIN(ll.learn_date) as first_learned
    FROM learning_log ll
    WHERE ll.is_review = 0
      AND NOT EXISTS (
        SELECT 1 FROM word_mastery wm
        WHERE wm.item_type = ll.item_type AND wm.item_id = ll.item_id
      )
    GROUP BY ll.item_type, ll.item_id
  `);

  for (const item of missing) {
    await run(
      `INSERT OR IGNORE INTO word_mastery
       (item_type, item_id, mastery_level, review_count, correct_streak, next_review_date, last_review_date, created_at)
       VALUES (?, ?, 0, 0, 0, ?, NULL, ?)`,
      [item.item_type, item.item_id, date, item.first_learned]
    );
  }

  if (missing.length > 0) {
    console.log(`Backfilled ${missing.length} mastery records.`);
    saveDb();
  }
}

async function getMasteryStats() {
  const totalTracked = await queryScalar('SELECT COUNT(*) FROM word_mastery') || 0;
  const totalLearned = await queryScalar(
    "SELECT COUNT(DISTINCT item_type || ':' || item_id) FROM learning_log WHERE is_review = 0"
  ) || 0;

  const score0 = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE score = 0 AND paused = 0') || 0;
  const scoreWeak = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE score > 0 AND score < 4 AND paused = 0') || 0;
  const scoreMedium = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE score >= 4 AND score < 8 AND paused = 0') || 0;
  const scoreStrong = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE score >= 8 AND paused = 0') || 0;
  const pausedCount = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE paused = 1') || 0;
  const untestedCount = Math.max(0, totalLearned - totalTracked);

  return {
    totalTracked,
    totalLearned,
    scoreTiers: [
      { name: 'untested', label: '未計分', count: untestedCount },
      { name: 'score0',   label: '0 分（選擇題）', count: score0 },
      { name: 'weak',     label: '0.5 ~ 3.5 分（選擇題）', count: scoreWeak },
      { name: 'medium',   label: '4 ~ 7.5 分（選擇/提示填空）', count: scoreMedium },
      { name: 'strong',   label: '8 ~ 11.5 分（填空）', count: scoreStrong },
      { name: 'paused',   label: '滿分 12（暫停中）', count: pausedCount },
    ],
    pausedCount,
  };
}

// Average score of all items that have been quizzed at least once.
// Returns null if no items have been quizzed (first-time user → no gate).
async function getAverageScore() {
  const count = await queryScalar('SELECT COUNT(*) FROM word_mastery WHERE review_count > 0');
  if (!count) return null;
  const avg = await queryScalar('SELECT AVG(score) FROM word_mastery WHERE review_count > 0');
  return avg != null ? avg : null;
}

module.exports = {
  initMastery,
  updateMastery,
  getDueReviews,
  getDueCount,
  getMasteryInfo,
  backfillMastery,
  getMasteryStats,
  decayPausedItems,
  getAverageScore,
  getAverageReviewCount,
  getHighErrorRateSet,
  computePriorityScore,
  ERROR_RATE_MIN_ATTEMPTS,
  getIntervalDays,
  INTERVALS
};
