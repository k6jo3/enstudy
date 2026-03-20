const { queryAll, queryOne, queryScalar } = require('../db/helpers');

async function getNewWords(date, limit = 20) {
  return queryAll(`
    SELECT w.* FROM words w
    WHERE w.id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'word' AND is_review = 0
    )
    ORDER BY w.difficulty ASC, RANDOM()
    LIMIT ?
  `, [limit]);
}

async function getWordById(id) {
  return queryOne('SELECT * FROM words WHERE id = ?', [id]);
}

async function getWordsByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  return queryAll(`SELECT * FROM words WHERE id IN (${placeholders})`, ids);
}

async function getUnlearnedCount() {
  const cnt = await queryScalar(`
    SELECT COUNT(*) FROM words
    WHERE id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'word' AND is_review = 0
    )
  `);
  return cnt || 0;
}

async function getTotalCount() {
  const cnt = await queryScalar('SELECT COUNT(*) FROM words');
  return cnt || 0;
}

async function getLearnedCount() {
  const cnt = await queryScalar(`
    SELECT COUNT(DISTINCT item_id) FROM learning_log
    WHERE item_type = 'word' AND is_review = 0
  `);
  return cnt || 0;
}

async function getRandomWords(count, excludeIds = []) {
  if (excludeIds.length > 0) {
    const placeholders = excludeIds.map(() => '?').join(',');
    return queryAll(`SELECT * FROM words WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT ?`, [...excludeIds, count]);
  }
  return queryAll('SELECT * FROM words ORDER BY RANDOM() LIMIT ?', [count]);
}

module.exports = {
  getNewWords,
  getWordById,
  getWordsByIds,
  getUnlearnedCount,
  getTotalCount,
  getLearnedCount,
  getRandomWords
};
