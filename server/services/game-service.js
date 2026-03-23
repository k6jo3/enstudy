const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');

async function getGameItems(gameType, count = 20) {
  const words = await queryAll(`
    SELECT w.*, 'word' as item_type FROM words w
    INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
    ORDER BY RANDOM() LIMIT ?
  `, [count]);
  return words;
}

async function getAllLearnedWords() {
  return queryAll(`
    SELECT DISTINCT w.* FROM words w
    INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
  `);
}

async function saveScore(gameType, score, durationSeconds, details) {
  const today = new Date().toISOString().split('T')[0];
  await run(
    'INSERT INTO game_scores (game_type, score, played_date, duration_seconds, details_json) VALUES (?, ?, ?, ?, ?)',
    [gameType, score, today, durationSeconds || 0, JSON.stringify(details || {})]
  );
  saveDb();
}

async function getLeaderboard(gameType, limit = 10) {
  return queryAll(
    'SELECT * FROM game_scores WHERE game_type = ? ORDER BY score DESC LIMIT ?',
    [gameType, limit]
  );
}

async function getGameStats() {
  return queryAll(`
    SELECT game_type,
           COUNT(*) as times_played,
           MAX(score) as best_score,
           CAST(AVG(score) AS INTEGER) as avg_score
    FROM game_scores
    GROUP BY game_type
  `);
}

async function validateWord(word) {
  const result = await queryOne('SELECT id FROM words WHERE LOWER(word) = LOWER(?)', [word]);
  return !!result;
}

module.exports = { getGameItems, getAllLearnedWords, saveScore, getLeaderboard, getGameStats, validateWord };
