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
  } else {
    const base = -1.5;
    // Wrong streak penalty: 2+ consecutive wrong → extra -0.1 cumulative
    // 1st wrong: -1.5, 2nd: -1.5, 3rd: -1.6, 4th: -1.7, ...
    const extraPenalty = newWrongStreak > 2 ? (newWrongStreak - 2) * 0.1 : 0;
    scoreDelta = base - extraPenalty;
  }
  const newScore = Math.max(0, Math.min(12, (row.score || 0) + scoreDelta));
  const newPaused = newScore >= 12 ? 1 : (row.paused || 0);
  const hintInc = questionMode === 'hint' ? 1 : 0;

  await run(
    `UPDATE word_mastery
     SET mastery_level = ?, review_count = review_count + 1, correct_streak = ?,
         wrong_streak = ?, next_review_date = ?, last_review_date = ?,
         score = ?, paused = ?, hint_count = COALESCE(hint_count, 0) + ?,
         just_unpaused = 0
     WHERE item_type = ? AND item_id = ?`,
    [newLevel, newStreak, newWrongStreak, nextReview, date, newScore, newPaused, hintInc, itemType, itemId]
  );

  // Every 2 consecutive correct answers, reduce 1 error count
  if (isCorrect && newStreak > 0 && newStreak % 2 === 0) {
    await reduceError(itemType, itemId);
  }

  saveDb();
}

// Called when daily learning is completed.
// All paused items lose 0.7 points. If score drops below 6, unpause and mark just_unpaused.
async function decayPausedItems() {
  await run(`UPDATE word_mastery SET score = score - 0.7 WHERE paused = 1`);
  await run(`UPDATE word_mastery SET paused = 0, just_unpaused = 1 WHERE paused = 1 AND score < 6`);
  saveDb();
}

async function getDueReviews(date, limit = 40) {
  const candidateLimit = Math.max(limit * 3, limit);
  const rows = await queryAll(`
    SELECT wm.item_type, wm.item_id, wm.mastery_level, wm.review_count,
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
    WHERE wm.next_review_date <= ?
    ORDER BY wm.just_unpaused DESC,
             overdue_days DESC,
             err.total_errors DESC,
             COALESCE(wm.wrong_streak, 0) DESC,
             wm.mastery_level ASC,
             COALESCE(wm.last_review_date, '') ASC
    LIMIT ?
  `, [date, date, candidateLimit]);

  const seeded = rows
    .slice()
    .sort((left, right) => {
      const priorityDelta =
        (right.just_unpaused - left.just_unpaused) ||
        (right.overdue_days - left.overdue_days) ||
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
    'SELECT COUNT(*) FROM word_mastery WHERE next_review_date <= ?',
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
  getIntervalDays,
  INTERVALS
};
