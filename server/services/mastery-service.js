const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { addDays } = require('../utils/date');

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

  let newLevel, newStreak, nextReview;
  if (isCorrect) {
    newLevel = Math.min(row.mastery_level + 1, 5);
    newStreak = row.correct_streak + 1;
    nextReview = addDays(date, getIntervalDays(newLevel));
  } else {
    newLevel = 0;
    newStreak = 0;
    nextReview = addDays(date, 1);
  }

  // Calculate score delta based on question mode and correctness
  let scoreDelta;
  if (isCorrect) {
    scoreDelta = (questionMode === 'choice' || questionMode === 'hint') ? 0.5 : 1;
  } else {
    scoreDelta = -1.5;
  }
  const newScore = Math.max(0, Math.min(12, (row.score || 0) + scoreDelta));
  const newPaused = newScore >= 12 ? 1 : (row.paused || 0);

  await run(
    `UPDATE word_mastery
     SET mastery_level = ?, review_count = review_count + 1, correct_streak = ?,
         next_review_date = ?, last_review_date = ?,
         score = ?, paused = ?
     WHERE item_type = ? AND item_id = ?`,
    [newLevel, newStreak, nextReview, date, newScore, newPaused, itemType, itemId]
  );
  saveDb();
}

// Called when daily learning is completed.
// All paused items lose 0.5 points. If score drops below 6, unpause.
async function decayPausedItems() {
  await run(`UPDATE word_mastery SET score = score - 0.5 WHERE paused = 1`);
  await run(`UPDATE word_mastery SET paused = 0 WHERE paused = 1 AND score < 6`);
  saveDb();
}

async function getDueReviews(date, limit = 40) {
  return queryAll(`
    SELECT wm.item_type, wm.item_id, wm.mastery_level, wm.review_count,
           wm.correct_streak, wm.next_review_date
    FROM word_mastery wm
    WHERE wm.next_review_date <= ?
    ORDER BY wm.mastery_level ASC, wm.next_review_date ASC
    LIMIT ?
  `, [date, limit]);
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
