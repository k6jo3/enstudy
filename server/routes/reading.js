const express = require('express');
const router = express.Router();
const readingService = require('../services/reading-service');
const { getToday } = require('../services/daily-session');
const { badRequest, parseNumber, parsePositiveInt } = require('../utils/validation');

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
    const parsedStoryId = parsePositiveInt(storyId);
    const parsedQuizScore = parseNumber(quizScore, { min: 0, max: 100 });
    if (parsedStoryId === null) return badRequest(res, 'Invalid storyId');
    if (parsedQuizScore === null) return badRequest(res, 'Invalid quizScore');
    await readingService.completeStory(parsedStoryId, parsedQuizScore);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reading/list - all stories with completion status
router.get('/list', async (req, res) => {
  try {
    const stories = await readingService.getStoryList();
    res.json({ stories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reading/story/:id - single story by id
router.get('/story/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const story = await readingService.getStoryById(id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ story });
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
