const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');

async function getTodayStory(date) {
  const existing = await queryOne(
    `SELECT rl.*, s.id as story_id, s.series, s.series_name, s.episode, s.title, s.content,
            s.vocabulary, s.vocab_meanings, s.questions, s.difficulty, s.content_zh, s.grammar_notes
     FROM reading_log rl JOIN stories s ON s.id = rl.story_id
     WHERE rl.read_date = ?`,
    [date]
  );
  if (existing) return formatStory(existing);

  const nextStory = await queryOne(`
    SELECT s.* FROM stories s
    WHERE s.id NOT IN (SELECT story_id FROM reading_log WHERE completed = 1)
    ORDER BY s.sort_order ASC
    LIMIT 1
  `);
  if (!nextStory) return null;

  await run('INSERT OR IGNORE INTO reading_log (story_id, read_date) VALUES (?, ?)', [nextStory.id, date]);
  saveDb();
  return formatStory(nextStory);
}

async function completeStory(storyId, date, quizScore) {
  await run('UPDATE reading_log SET completed = 1, quiz_score = ? WHERE story_id = ? AND read_date = ?',
    [quizScore || 0, storyId, date]);
  saveDb();
}

async function getReadingStats() {
  const totalStories = await queryScalar('SELECT COUNT(*) FROM stories') || 0;
  const readStories = await queryScalar('SELECT COUNT(DISTINCT story_id) FROM reading_log WHERE completed = 1') || 0;
  return { totalStories, readStories };
}

async function getReadingHistory() {
  return queryAll(`
    SELECT rl.*, s.title, s.series_name, s.episode
    FROM reading_log rl JOIN stories s ON s.id = rl.story_id
    WHERE rl.completed = 1
    ORDER BY rl.read_date DESC LIMIT 20
  `);
}

function formatStory(row) {
  return {
    ...row,
    vocabulary: typeof row.vocabulary === 'string' ? JSON.parse(row.vocabulary) : (row.vocabulary || []),
    vocab_meanings: typeof row.vocab_meanings === 'string' ? JSON.parse(row.vocab_meanings) : (row.vocab_meanings || {}),
    questions: typeof row.questions === 'string' ? JSON.parse(row.questions) : (row.questions || []),
    grammar_notes: typeof row.grammar_notes === 'string' ? JSON.parse(row.grammar_notes) : (row.grammar_notes || null),
  };
}

module.exports = { getTodayStory, completeStory, getReadingStats, getReadingHistory };
