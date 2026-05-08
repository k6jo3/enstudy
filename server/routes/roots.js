const express = require('express');
const router = express.Router();
const rootsService = require('../services/roots-service');

// GET /api/roots - all roots with word lists
router.get('/', async (req, res) => {
  try {
    const roots = await rootsService.getAllRoots();
    res.json({ roots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roots/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await rootsService.getRootsStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roots/quiz?count=10
router.get('/quiz', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 10, 30);
    const questions = await rootsService.getQuizQuestions(count);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/roots/:root - all words sharing this root
router.get('/:root', async (req, res) => {
  try {
    const words = await rootsService.getWordsByRoot(req.params.root);
    res.json({ words });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
