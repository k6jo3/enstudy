const express = require('express');
const router = express.Router();
const readingService = require('../services/reading-service');
const { getToday } = require('../services/daily-session');

// GET /api/reading - today's story
router.get('/', async (req, res) => {
  try {
    const today = getToday();
    const story = await readingService.getTodayStory(today);
    if (!story) {
      return res.json({ story: null, message: 'All stories completed!' });
    }
    res.json({ story });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reading/complete - mark story as read
router.post('/complete', async (req, res) => {
  try {
    const { storyId, quizScore } = req.body;
    const today = getToday();
    await readingService.completeStory(storyId, today, quizScore);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reading/stats - reading stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await readingService.getReadingStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reading/history - read history
router.get('/history', async (req, res) => {
  try {
    const history = await readingService.getReadingHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
