const express = require('express');
const router = express.Router();
const {
  getDailyContent,
  getToday,
  getActiveSession,
  completeSession,
  getSessionStatus,
  getNextSessionDate,
} = require('../services/daily-session');
const { decayPausedItems, getAverageScore } = require('../services/mastery-service');
const { queryOne } = require('../db/helpers');

async function checkScoreGate() {
  const avg = await getAverageScore();
  if (avg === null || avg >= 6) {
    return null;
  }
  return Math.round(avg * 10) / 10;
}

router.get('/status', async (req, res) => {
  try {
    const status = await getSessionStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const active = await getActiveSession();
    if (!active) {
      return res.json({ success: true, message: 'No active session to complete' });
    }

    const session = await completeSession(active.session_date);
    await decayPausedItems();
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/next', async (req, res) => {
  try {
    const blockedAvg = await checkScoreGate();
    if (blockedAvg !== null) {
      return res.json({
        error: 'score_gate',
        averageScore: blockedAvg,
        message: `目前平均分數 ${blockedAvg} 低於 6，請先完成複習與測驗後再開始下一課。`,
      });
    }

    const active = await getActiveSession();
    if (active) {
      return res.json({ error: 'Please complete the current session first', session: active });
    }

    const nextDate = await getNextSessionDate();
    const content = await getDailyContent(nextDate);
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let date;

    if (req.query.date) {
      date = req.query.date;
    } else {
      const active = await getActiveSession();
      if (active) {
        date = active.session_date;
      } else {
        const today = getToday();
        const latest = await queryOne('SELECT * FROM sessions ORDER BY session_date DESC LIMIT 1');

        if (latest && latest.session_date >= today) {
          date = latest.session_date;
        } else {
          const blockedAvg = await checkScoreGate();
          if (blockedAvg !== null && latest) {
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
