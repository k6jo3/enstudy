const { getDb } = require('./connection');

// Helper: run a query and return rows as objects
async function queryAll(sql, params = []) {
  const db = await getDb();
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: run a query and return first row as object
async function queryOne(sql, params = []) {
  const rows = await queryAll(sql, params);
  return rows[0] || null;
}

// Helper: run a statement (INSERT/UPDATE/DELETE)
async function run(sql, params = []) {
  const db = await getDb();
  db.run(sql, params);
}

// Helper: get scalar value
async function queryScalar(sql, params = []) {
  const db = await getDb();
  const result = db.exec(sql, params);
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0];
  }
  return null;
}

module.exports = { queryAll, queryOne, run, queryScalar };
