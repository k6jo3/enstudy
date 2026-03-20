const { queryAll, queryOne, queryScalar, run } = require('../db/helpers');
const { saveDb } = require('../db/connection');

async function recordError(itemType, itemId, date) {
  const existing = await queryOne(
    'SELECT id, error_count FROM errors WHERE item_type = ? AND item_id = ? AND error_date = ?',
    [itemType, itemId, date]
  );

  if (existing) {
    await run('UPDATE errors SET error_count = error_count + 1 WHERE id = ?', [existing.id]);
  } else {
    await run(
      'INSERT INTO errors (item_type, item_id, error_date, error_count) VALUES (?, ?, ?, 1)',
      [itemType, itemId, date]
    );
  }
  saveDb();
}

async function getErrorItems() {
  return queryAll(`
    SELECT item_type, item_id, SUM(error_count) as total_errors
    FROM errors
    GROUP BY item_type, item_id
    ORDER BY total_errors DESC
  `);
}

async function getErrorSet() {
  const rows = await queryAll(`
    SELECT item_type, item_id, SUM(error_count) as total_errors
    FROM errors GROUP BY item_type, item_id
  `);
  const set = new Set();
  for (const r of rows) {
    set.add(`${r.item_type}:${r.item_id}`);
  }
  return set;
}

async function getTodayErrorCount(date) {
  const total = await queryScalar(
    'SELECT SUM(error_count) FROM errors WHERE error_date = ?',
    [date]
  );
  return total || 0;
}

module.exports = {
  recordError,
  getErrorItems,
  getErrorSet,
  getTodayErrorCount
};
