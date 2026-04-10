const express = require('express');
const router = express.Router();
const roundService = require('../services/round-service');
const { badRequest, parsePositiveInt } = require('../utils/validation');

// GET /api/rounds/current - current round + progress
router.get('/current', async (req, res) => {
  try {
    const round = await roundService.getCurrentRound();
    if (!round) {
      return res.json({ round: null, progress: null });
    }
    const progress = await roundService.getRoundProgress(round.round_number);
    const isComplete = await roundService.isRoundComplete(round.round_number);
    res.json({ round, progress, isComplete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rounds/start - start next round
router.post('/start', async (req, res) => {
  try {
    const { wordPace, phrasePace } = req.body;
    const parsedWordPace = parsePositiveInt(wordPace, { defaultValue: 20, max: 500 });
    const parsedPhrasePace = parsePositiveInt(phrasePace, { defaultValue: 10, max: 500 });
    if (parsedWordPace === null || parsedPhrasePace === null) {
      return badRequest(res, 'Invalid pace settings');
    }
    const current = await roundService.getCurrentRound();
    if (current) {
      await roundService.completeRound(current.round_number);
    }
    const newRound = await roundService.startNextRound(parsedWordPace, parsedPhrasePace);
    res.json({ success: true, round: newRound });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/rounds/pace - update pace for current round
router.put('/pace', async (req, res) => {
  try {
    const { wordPace, phrasePace } = req.body;
    const parsedWordPace = parsePositiveInt(wordPace, { max: 500 });
    const parsedPhrasePace = parsePositiveInt(phrasePace, { max: 500 });
    if (parsedWordPace === null || parsedPhrasePace === null) {
      return badRequest(res, 'Invalid pace settings');
    }
    const round = await roundService.getCurrentRound();
    if (!round) return res.status(400).json({ error: 'No active round' });
    await roundService.updateRoundPace(round.round_number, parsedWordPace, parsedPhrasePace);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
