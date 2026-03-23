const { queryAll, queryOne, queryScalar } = require('../db/helpers');

async function getNewWords(date, limit = 20, roundNumber = 1) {
  return queryAll(`
    SELECT w.* FROM words w
    WHERE w.id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'word' AND is_review = 0 AND round_number = ?
    )
    ORDER BY w.difficulty ASC, RANDOM()
    LIMIT ?
  `, [roundNumber, limit]);
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

async function getLearnedRandomWords(count, excludeIds = [], difficulty = null) {
  const conditions = ['ll.item_type = \'word\'', 'll.is_review = 0'];
  const params = [];

  if (excludeIds.length > 0) {
    conditions.push(`w.id NOT IN (${excludeIds.map(() => '?').join(',')})`);
    params.push(...excludeIds);
  }
  if (difficulty !== null) {
    conditions.push('w.difficulty = ?');
    params.push(difficulty);
  }

  params.push(count);
  const results = await queryAll(`
    SELECT w.* FROM words w
    INNER JOIN learning_log ll ON ll.item_id = w.id AND ${conditions.join(' AND ')}
    ORDER BY RANDOM() LIMIT ?
  `, params);

  // Fallback without difficulty filter
  if (results.length < count && difficulty !== null) {
    return getLearnedRandomWords(count, excludeIds, null);
  }
  return results;
}

module.exports = {
  getNewWords,
  getWordById,
  getWordsByIds,
  getUnlearnedCount,
  getTotalCount,
  getLearnedCount,
  getRandomWords,
  getLearnedRandomWords
};
