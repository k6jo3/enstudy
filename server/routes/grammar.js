const express = require('express');
const router = express.Router();
const grammarService = require('../services/grammar-service');

// GET /api/grammar/items?count=15&topic=verb_tense
router.get('/items', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 15;
    const topic = req.query.topic || null;
    const result = await grammarService.getItems(count, topic);
    res.json(result);
  } catch (err) {
    console.error('Grammar items error:', err);
    res.status(500).json({ error: 'Failed to load grammar items' });
  }
});

// POST /api/grammar/submit
router.post('/submit', async (req, res) => {
  try {
    const { questionId, selectedIndex } = req.body;
    const result = await grammarService.submitAnswer(questionId, selectedIndex);
    res.json(result);
  } catch (err) {
    console.error('Grammar submit error:', err);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// GET /api/grammar/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await grammarService.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Grammar stats error:', err);
    res.status(500).json({ error: 'Failed to load grammar stats' });
  }
});

module.exports = router;
