const express = require('express');
const router = express.Router();
const { getDailyContent, getToday, getActiveSession, completeSession, getSessionStatus, getNextSessionDate } = require('../services/daily-session');
const { decayPausedItems } = require('../services/mastery-service');

// GET /api/daily/status - Check session status
router.get('/status', async (req, res) => {
  try {
    const status = await getSessionStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/daily/complete - Mark active session as complete
router.post('/complete', async (req, res) => {
  try {
    const active = await getActiveSession();
    if (!active) {
      return res.json({ success: true, message: 'No active session to complete' });
    }
    const session = await completeSession(active.session_date);
    // Decay all paused (score=10) items by 0.5; unpause if score drops below 6
    await decayPausedItems();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/daily/next - Start next lesson (continue after completion)
router.post('/next', async (req, res) => {
  try {
    // Check if there's an incomplete session — must finish current first
    const active = await getActiveSession();
    if (active) {
      return res.json({ error: 'Please complete current session first', session: active });
    }
    const nextDate = await getNextSessionDate();
    const content = await getDailyContent(nextDate);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/daily - Load active session content
router.get('/', async (req, res) => {
  try {
    let date;
    if (req.query.date) {
      date = req.query.date;
    } else {
      // Load incomplete session, or create today's
      const active = await getActiveSession();
      date = active ? active.session_date : getToday();
    }
    const content = await getDailyContent(date);
    res.json(content);
  } catch (err) {
    console.error('Error getting daily content:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
