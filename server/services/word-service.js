const { queryAll, queryOne, queryScalar } = require('../db/helpers');
const wordsData = require('../data/words');

function buildExampleEntries(word, row = {}) {
  const examples = Array.isArray(word?.examples) ? word.examples : null;
  if (examples && examples.length > 0) {
    return examples
      .map((entry) => ({
        text: entry.text || entry.example || '',
        zh: entry.zh || entry.exampleZh || '',
        label: entry.label || '',
        labelZh: entry.labelZh || '',
      }))
      .filter((entry) => entry.text);
  }

  const text = row.example || word?.example || '';
  const zh = row.example_zh || row.exampleZh || word?.exampleZh || '';
  return text ? [{ text, zh, label: '', labelZh: '' }] : [];
}

const wordMetaMap = new Map(
  wordsData.map((word) => [String(word.word || '').toLowerCase(), word])
);

function enrichWordRow(row) {
  if (!row || !row.word) return row;
  const meta = wordMetaMap.get(String(row.word).toLowerCase());
  if (!meta) {
    return {
      ...row,
      exampleZh: row.example_zh || row.exampleZh || null,
      examples: row.example ? [{ text: row.example, zh: row.example_zh || row.exampleZh || '', label: '', labelZh: '' }] : [],
    };
  }

  return {
    ...row,
    exampleZh: row.example_zh || row.exampleZh || meta.exampleZh || null,
    context: row.context || meta.context || null,
    examples: buildExampleEntries(meta, row),
  };
}

function enrichWordRows(rows) {
  return rows.map(enrichWordRow);
}

async function getNewWords(date, limit = 20, roundNumber = 1) {
  const rows = await queryAll(`
    SELECT w.* FROM words w
    WHERE w.id NOT IN (
      SELECT item_id FROM learning_log
      WHERE item_type = 'word' AND is_review = 0 AND round_number = ?
    )
    ORDER BY w.difficulty ASC, RANDOM()
    LIMIT ?
  `, [roundNumber, limit]);
  return enrichWordRows(rows);
}

async function getWordById(id) {
  const row = await queryOne('SELECT * FROM words WHERE id = ?', [id]);
  return enrichWordRow(row);
}

async function getWordsByIds(ids) {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const rows = await queryAll(`SELECT * FROM words WHERE id IN (${placeholders})`, ids);
  return enrichWordRows(rows);
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
    const rows = await queryAll(`SELECT * FROM words WHERE id NOT IN (${placeholders}) ORDER BY RANDOM() LIMIT ?`, [...excludeIds, count]);
    return enrichWordRows(rows);
  }
  const rows = await queryAll('SELECT * FROM words ORDER BY RANDOM() LIMIT ?', [count]);
  return enrichWordRows(rows);
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
  return enrichWordRows(results);
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
