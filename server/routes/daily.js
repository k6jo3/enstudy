const express = require('express');
const router = express.Router();
const { getDailyContent, getToday, getActiveSession, completeSession, getSessionStatus, getNextSessionDate } = require('../services/daily-session');
const { decayPausedItems, getAverageScore } = require('../services/mastery-service');
const { queryOne } = require('../db/helpers');

// Helper: check if average score gate blocks progression
async function checkScoreGate() {
  const avg = await getAverageScore();
  if (avg === null) return null; // no quiz history → no gate
  if (avg >= 6) return null; // passed
  return Math.round(avg * 10) / 10; // blocked, return rounded avg
}

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
    // Decay all paused (score=12) items by 0.5; unpause if score drops below 6
    await decayPausedItems();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/daily/next - Start next lesson (continue after completion)
router.post('/next', async (req, res) => {
  try {
    // Score gate: average must be >= 6
    const blockedAvg = await checkScoreGate();
    if (blockedAvg !== null) {
      return res.json({
        error: 'score_gate',
        averageScore: blockedAvg,
        message: `平均分數 ${blockedAvg} 分，需達到 6 分才能進入下一課`
      });
    }

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
      const active = await getActiveSession();
      if (active) {
        // Active incomplete session — load it, no gate
        date = active.session_date;
      } else {
        // No active session — all completed (or first time).
        const today = getToday();
        const latest = await queryOne(
          'SELECT * FROM sessions ORDER BY session_date DESC LIMIT 1'
        );

        if (latest && latest.session_date >= today) {
          // Already have a session for today or later (e.g. user did "next lesson"
          // and quiz auto-completed it). Show that session, don't create a new one.
          date = latest.session_date;
        } else {
          // New day — would create today's session. Check score gate first.
          const blockedAvg = await checkScoreGate();
          if (blockedAvg !== null && latest) {
            // Blocked: show last completed session so user can still review it
            const content = await getDailyContent(latest.session_date);
            return res.json({ ...content, scoreGated: true, averageScore: blockedAvg });
          }
          date = today;
        }
      }
    }
    const content = await getDailyContent(date);
    res.json(content);
  } catch (err) {
    console.error('Error getting daily content:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
