const express = require('express');
const router = express.Router();
const { getDailyContent, getToday } = require('../services/daily-session');

router.get('/', async (req, res) => {
  try {
    const date = req.query.date || getToday();
    const content = await getDailyContent(date);
    res.json(content);
  } catch (err) {
    console.error('Error getting daily content:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
