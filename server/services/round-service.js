const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { getToday } = require('../utils/date');

async function getCurrentRound() {
  let round = await queryOne('SELECT * FROM rounds WHERE completed_date IS NULL ORDER BY round_number DESC LIMIT 1');
  if (!round) {
    const maxRound = await queryScalar('SELECT MAX(round_number) FROM rounds');
    if (!maxRound) {
      const today = getToday();
      await run('INSERT INTO rounds (round_number, started_date, word_pace, phrase_pace) VALUES (1, ?, 0, 0)', [today]);
      saveDb();
      round = await queryOne('SELECT * FROM rounds WHERE round_number = 1');
    }
  }
  return round;
}

async function getRoundProgress(roundNumber) {
  const totalWords = await queryScalar('SELECT COUNT(*) FROM words') || 0;
  const totalPhrases = await queryScalar('SELECT COUNT(*) FROM phrases') || 0;
  const learnedWords = await queryScalar(
    'SELECT COUNT(DISTINCT item_id) FROM learning_log WHERE item_type = ? AND is_review = 0 AND round_number = ?',
    ['word', roundNumber]
  ) || 0;
  const learnedPhrases = await queryScalar(
    'SELECT COUNT(DISTINCT item_id) FROM learning_log WHERE item_type = ? AND is_review = 0 AND round_number = ?',
    ['phrase', roundNumber]
  ) || 0;
  return { totalWords, totalPhrases, learnedWords, learnedPhrases, roundNumber };
}

async function isRoundComplete(roundNumber) {
  const progress = await getRoundProgress(roundNumber);
  return progress.learnedWords >= progress.totalWords && progress.learnedPhrases >= progress.totalPhrases;
}

async function completeRound(roundNumber) {
  const today = getToday();
  await run('UPDATE rounds SET completed_date = ? WHERE round_number = ?', [today, roundNumber]);
  saveDb();
}

async function startNextRound(wordPace, phrasePace) {
  const current = await getCurrentRound();
  const nextNumber = current ? current.round_number + 1 : 1;
  const today = getToday();
  await run(
    'INSERT INTO rounds (round_number, started_date, word_pace, phrase_pace) VALUES (?, ?, ?, ?)',
    [nextNumber, today, wordPace || 20, phrasePace || 10]
  );
  saveDb();
  return queryOne('SELECT * FROM rounds WHERE round_number = ?', [nextNumber]);
}

async function updateRoundPace(roundNumber, wordPace, phrasePace) {
  await run('UPDATE rounds SET word_pace = ?, phrase_pace = ? WHERE round_number = ?', [wordPace, phrasePace, roundNumber]);
  saveDb();
}

module.exports = { getCurrentRound, getRoundProgress, isRoundComplete, completeRound, startNextRound, updateRoundPace };
