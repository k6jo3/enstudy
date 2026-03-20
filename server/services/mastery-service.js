const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');

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

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
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

async function updateMastery(itemType, itemId, isCorrect, date) {
  const row = await queryOne(
    'SELECT * FROM word_mastery WHERE item_type = ? AND item_id = ?',
    [itemType, itemId]
  );
  if (!row) {
    await initMastery(itemType, itemId, date);
    return updateMastery(itemType, itemId, isCorrect, date);
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

  await run(
    `UPDATE word_mastery
     SET mastery_level = ?, review_count = review_count + 1, correct_streak = ?,
         next_review_date = ?, last_review_date = ?
     WHERE item_type = ? AND item_id = ?`,
    [newLevel, newStreak, nextReview, date, itemType, itemId]
  );
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
  const distribution = await queryAll(`
    SELECT mastery_level, COUNT(*) as count
    FROM word_mastery
    GROUP BY mastery_level
    ORDER BY mastery_level
  `);
  const totalMastered = await queryScalar(
    'SELECT COUNT(*) FROM word_mastery WHERE mastery_level >= 5'
  ) || 0;
  const totalTracked = await queryScalar(
    'SELECT COUNT(*) FROM word_mastery'
  ) || 0;
  return { distribution, totalMastered, totalTracked };
}

module.exports = {
  initMastery,
  updateMastery,
  getDueReviews,
  getDueCount,
  getMasteryInfo,
  backfillMastery,
  getMasteryStats,
  getIntervalDays,
  INTERVALS
};
