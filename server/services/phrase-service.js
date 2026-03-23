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

async function getLearnedRandomPhrases(count, excludeIds = [], difficulty = null) {
  const conditions = ['ll.item_type = \'phrase\'', 'll.is_review = 0'];
  const params = [];

  if (excludeIds.length > 0) {
    conditions.push(`p.id NOT IN (${excludeIds.map(() => '?').join(',')})`);
    params.push(...excludeIds);
  }
  if (difficulty !== null) {
    conditions.push('p.difficulty = ?');
    params.push(difficulty);
  }

  params.push(count);
  const results = await queryAll(`
    SELECT p.* FROM phrases p
    INNER JOIN learning_log ll ON ll.item_id = p.id AND ${conditions.join(' AND ')}
    ORDER BY RANDOM() LIMIT ?
  `, params);

  if (results.length < count && difficulty !== null) {
    return getLearnedRandomPhrases(count, excludeIds, null);
  }
  return results;
}

module.exports = {
  getNewPhrases,
  getPhraseById,
  getPhrasesByIds,
  getUnlearnedCount,
  getTotalCount,
  getLearnedCount,
  getRandomPhrases,
  getLearnedRandomPhrases
};
