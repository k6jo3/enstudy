const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { getToday } = require('../utils/date');
const { cleanPrompt } = require('../utils/masking');

async function getGameItems(gameType, count = 20) {
  let items = [];
  if (gameType === 'rdrill') {
    const learned = await queryAll(`
      SELECT w.*, 'word' as item_type FROM words w
      INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
      WHERE w.word LIKE '%r%'
      ORDER BY RANDOM() LIMIT ?
    `, [count * 2]);
    if (learned.length >= count) {
      items = learned;
    } else {
      const learnedIds = new Set(learned.map(w => w.id));
      const fallback = await queryAll(`
        SELECT *, 'word' as item_type FROM words
        WHERE word LIKE '%r%' ORDER BY RANDOM() LIMIT ?
      `, [count * 3]);
      items = [...learned, ...fallback.filter(w => !learnedIds.has(w.id))].slice(0, count * 2);
    }
  } else {
    items = await queryAll(`
      SELECT w.*, 'word' as item_type FROM words w
      INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
      ORDER BY RANDOM() LIMIT ?
    `, [count]);
  }

  // Clean meanings and contexts to prevent leaks
  for (const item of items) {
    const display = item.word || item.phrase;
    if (display) {
      item.meaning = cleanPrompt(item.meaning, display);
      item.context = cleanPrompt(item.context, display);
    }
  }

  return items;
}

async function getAllLearnedWords() {
  return queryAll(`
    SELECT DISTINCT w.* FROM words w
    INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
  `);
}

async function saveScore(gameType, score, durationSeconds, details) {
  const today = getToday();
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
