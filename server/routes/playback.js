const express = require('express');
const router = express.Router();
const playbackService = require('../services/playback-service');
const { badRequest, isOneOf, parsePositiveInt } = require('../utils/validation');

// GET /api/playback/items - get items for playback
router.get('/items', async (req, res) => {
  try {
    const count = parsePositiveInt(req.query.count, { defaultValue: 100, max: 500 });
    if (count === null) {
      return badRequest(res, 'Invalid count');
    }
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
    const parsedItemId = parsePositiveInt(itemId);
    if (!isOneOf(itemType, ['word', 'phrase'])) {
      return badRequest(res, 'Invalid itemType');
    }
    if (parsedItemId === null) {
      return badRequest(res, 'Invalid itemId');
    }
    await playbackService.recordPlay(itemType, parsedItemId);
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
