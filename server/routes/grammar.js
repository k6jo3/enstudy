const express = require('express');
const router = express.Router();
const grammarService = require('../services/grammar-service');
const { badRequest, isNonEmptyString, parsePositiveInt } = require('../utils/validation');

// GET /api/grammar/items?count=15&topic=verb_tense
router.get('/items', async (req, res) => {
  try {
    const count = parsePositiveInt(req.query.count, { defaultValue: 15, max: 100 });
    if (count === null) {
      return badRequest(res, 'Invalid count');
    }
    const topic = req.query.topic && isNonEmptyString(req.query.topic) ? req.query.topic.trim() : null;
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
    const parsedQuestionId = parsePositiveInt(questionId);
    const parsedSelectedIndex = parsePositiveInt(selectedIndex, { min: 0, max: 10 });
    if (parsedQuestionId === null) {
      return badRequest(res, 'Invalid questionId');
    }
    if (parsedSelectedIndex === null) {
      return badRequest(res, 'Invalid selectedIndex');
    }
    const result = await grammarService.submitAnswer(parsedQuestionId, parsedSelectedIndex);
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
