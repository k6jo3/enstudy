const express = require('express');
const router = express.Router();
const gameService = require('../services/game-service');
const { badRequest, isNonEmptyString, parseNumber, parsePositiveInt } = require('../utils/validation');

// GET /api/games/items - get items for a game
router.get('/items', async (req, res) => {
  try {
    const { type, count } = req.query;
    const parsedCount = parsePositiveInt(count, { defaultValue: 20, max: 500 });
    if (parsedCount === null) {
      return badRequest(res, 'Invalid count');
    }
    if (type === 'wordchain') {
      const words = await gameService.getAllLearnedWords();
      return res.json(words);
    }
    const items = await gameService.getGameItems(type, parsedCount);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/games/score - save a game score
router.post('/score', async (req, res) => {
  try {
    const { gameType, score, duration, details } = req.body;
    const parsedScore = parseNumber(score, { min: 0, max: 1000000 });
    const parsedDuration = parseNumber(duration, { defaultValue: 0, min: 0, max: 86400 });
    if (!isNonEmptyString(gameType)) {
      return badRequest(res, 'Invalid gameType');
    }
    if (parsedScore === null) {
      return badRequest(res, 'Invalid score');
    }
    if (parsedDuration === null) {
      return badRequest(res, 'Invalid duration');
    }
    await gameService.saveScore(gameType.trim(), parsedScore, parsedDuration, details);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/games/leaderboard - get top scores
router.get('/leaderboard', async (req, res) => {
  try {
    const { type } = req.query;
    if (!isNonEmptyString(type)) {
      return badRequest(res, 'Invalid type');
    }
    const leaderboard = await gameService.getLeaderboard(type, 10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/games/stats - overall game stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await gameService.getGameStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/games/wordchain/validate - validate a word
router.get('/wordchain/validate', async (req, res) => {
  try {
    const { word } = req.query;
    if (!isNonEmptyString(word)) {
      return badRequest(res, 'Invalid word');
    }
    const valid = await gameService.validateWord(word);
    res.json({ valid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
