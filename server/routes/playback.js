const express = require('express');
const router = express.Router();
const playbackService = require('../services/playback-service');

// GET /api/playback/items - get items for playback
router.get('/items', async (req, res) => {
  try {
    const count = Number(req.query.count) || 100;
    const items = await playbackService.getPlaybackItems(count);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playback/played - record a play
router.post('/played', async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    await playbackService.recordPlay(itemType, itemId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/playback/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await playbackService.getPlaybackStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
