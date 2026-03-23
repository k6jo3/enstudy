const express = require('express');
const router = express.Router();
const gameService = require('../services/game-service');

// GET /api/games/items - get items for a game
router.get('/items', async (req, res) => {
  try {
    const { type, count } = req.query;
    if (type === 'wordchain') {
      const words = await gameService.getAllLearnedWords();
      return res.json(words);
    }
    const items = await gameService.getGameItems(type, Number(count) || 20);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/games/score - save a game score
router.post('/score', async (req, res) => {
  try {
    const { gameType, score, duration, details } = req.body;
    await gameService.saveScore(gameType, score, duration, details);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/games/leaderboard - get top scores
router.get('/leaderboard', async (req, res) => {
  try {
    const { type } = req.query;
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
    const valid = await gameService.validateWord(word);
    res.json({ valid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
