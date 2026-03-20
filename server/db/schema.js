const { getDb, saveDb } = require('./connection');

async function initSchema() {
  const db = await getDb();

  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL UNIQUE,
      phonetic TEXT,
      meaning TEXT NOT NULL,
      part_of_speech TEXT,
      difficulty INTEGER DEFAULT 1,
      example TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL UNIQUE,
      meaning TEXT NOT NULL,
      example TEXT,
      difficulty INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS learning_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type TEXT NOT NULL CHECK(item_type IN ('word','phrase')),
      item_id INTEGER NOT NULL,
      learn_date TEXT NOT NULL,
      is_review INTEGER DEFAULT 0,
      UNIQUE(item_type, item_id, learn_date)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS errors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type TEXT NOT NULL CHECK(item_type IN ('word','phrase')),
      item_id INTEGER NOT NULL,
      error_date TEXT NOT NULL,
      error_count INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_date TEXT NOT NULL UNIQUE,
      new_words INTEGER DEFAULT 0,
      new_phrases INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      errors_count INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS word_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type TEXT NOT NULL CHECK(item_type IN ('word','phrase')),
      item_id INTEGER NOT NULL,
      mastery_level INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      correct_streak INTEGER DEFAULT 0,
      next_review_date TEXT NOT NULL,
      last_review_date TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(item_type, item_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS daily_sentences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_date TEXT NOT NULL,
      item_type TEXT NOT NULL CHECK(item_type IN ('word','phrase')),
      item_id INTEGER NOT NULL,
      dialogue_json TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(session_date, item_type, item_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS grammar_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic TEXT NOT NULL,
      sentence TEXT NOT NULL,
      options TEXT NOT NULL,
      answer INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      grammar_point TEXT,
      difficulty INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS grammar_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL UNIQUE,
      mastery_level INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      correct_streak INTEGER DEFAULT 0,
      next_review_date TEXT NOT NULL,
      last_review_date TEXT,
      created_at TEXT NOT NULL
    )
  `);

  // Indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_learning_log_date ON learning_log(learn_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_learning_log_item ON learning_log(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_errors_item ON errors(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_mastery_next_review ON word_mastery(next_review_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_mastery_item ON word_mastery(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_daily_sentences_date ON daily_sentences(session_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_grammar_mastery_review ON grammar_mastery(next_review_date)');

  saveDb();
}

module.exports = { initSchema };
