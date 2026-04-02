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

  // --- New tables for rounds, reading, playback, games ---

  db.run(`
    CREATE TABLE IF NOT EXISTS rounds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      round_number INTEGER NOT NULL UNIQUE,
      started_date TEXT NOT NULL,
      completed_date TEXT,
      word_pace INTEGER DEFAULT 0,
      phrase_pace INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      series TEXT NOT NULL,
      series_name TEXT,
      episode INTEGER DEFAULT 1,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      vocabulary TEXT,
      vocab_meanings TEXT,
      questions TEXT,
      difficulty INTEGER DEFAULT 2,
      sort_order INTEGER DEFAULT 0,
      content_zh TEXT,
      grammar_notes TEXT
    )
  `);

  // Migration: add new columns for existing DBs
  try { db.run('ALTER TABLE stories ADD COLUMN content_zh TEXT'); } catch(e) { /* column already exists */ }
  try { db.run('ALTER TABLE stories ADD COLUMN grammar_notes TEXT'); } catch(e) { /* column already exists */ }
  try { db.run('ALTER TABLE words ADD COLUMN example_zh TEXT'); } catch(e) { /* column already exists */ }
  try { db.run('ALTER TABLE phrases ADD COLUMN example_zh TEXT'); } catch(e) { /* column already exists */ }

  db.run(`
    CREATE TABLE IF NOT EXISTS reading_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL,
      read_date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      quiz_score INTEGER DEFAULT 0,
      UNIQUE(story_id, read_date)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS playback_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_type TEXT NOT NULL CHECK(item_type IN ('word','phrase')),
      item_id INTEGER NOT NULL,
      play_count INTEGER DEFAULT 0,
      last_played_date TEXT,
      UNIQUE(item_type, item_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS game_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_type TEXT NOT NULL CHECK(game_type IN ('match','spelling','timed','wordchain')),
      score INTEGER DEFAULT 0,
      played_date TEXT NOT NULL,
      duration_seconds INTEGER DEFAULT 0,
      details_json TEXT
    )
  `);

  // Migration: add round_number to learning_log
  try { db.run('ALTER TABLE learning_log ADD COLUMN round_number INTEGER DEFAULT 1'); } catch (e) { /* already exists */ }

  // Indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_learning_log_date ON learning_log(learn_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_learning_log_item ON learning_log(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_errors_item ON errors(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_mastery_next_review ON word_mastery(next_review_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_mastery_item ON word_mastery(item_type, item_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_daily_sentences_date ON daily_sentences(session_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_grammar_mastery_review ON grammar_mastery(next_review_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_rounds_number ON rounds(round_number)');
  db.run('CREATE INDEX IF NOT EXISTS idx_reading_log_date ON reading_log(read_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_stories_series ON stories(series, sort_order)');
  db.run('CREATE INDEX IF NOT EXISTS idx_playback_log_count ON playback_log(play_count)');
  db.run('CREATE INDEX IF NOT EXISTS idx_game_scores_type ON game_scores(game_type, score DESC)');

  saveDb();
}

module.exports = { initSchema };
