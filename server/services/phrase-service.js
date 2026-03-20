const { queryAll, queryOne, queryScalar } = require('../db/helpers');

async function getNewPhrases(date, limit = 10) {
  return queryAll(`
    SELECT p.* FROM phrases p
    WHERE p.id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'phrase' AND is_review = 0
    )
    ORDER BY p.difficulty ASC, RANDOM()
    LIMIT ?
  `, [limit]);
}

async function getPhraseById(id) {
  return queryOne('SELECT * FROM phrases WHERE id = ?', [id]);
}

async function getPhrasesByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  return queryAll(`SELECT * FROM phrases WHERE id IN (${placeholders})`, ids);
}

async function getUnlearnedCount() {
  const cnt = await queryScalar(`
    SELECT COUNT(*) FROM phrases
    WHERE id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'phrase' AND is_review = 0
    )
  `);
  return cnt || 0;
}

async function getTotalCount() {
  const cnt = await queryScalar('SELECT COUNT(*) FROM phrases');
  return cnt || 0;
}

async function getLearnedCount() {
  const cnt = await queryScalar(`
    SELECT COUNT(DISTINCT item_id) FROM learning_log
    WHERE item_type = 'phrase' AND is_review = 0
  `);
  return cnt || 0;
}

async function getRandomPhrases(count, excludeIds = []) {
  if (excludeIds.length > 0) {
    const placeholders = excludeIds.map(() => '?').join(',');
    return queryAll(`SELECT * FROM phrases WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT ?`, [...excludeIds, count]);
  }
  return queryAll('SELECT * FROM phrases ORDER BY RANDOM() LIMIT ?', [count]);
}

module.exports = {
  getNewPhrases,
  getPhraseById,
  getPhrasesByIds,
  getUnlearnedCount,
  getTotalCount,
  getLearnedCount,
  getRandomPhrases
};
