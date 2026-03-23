const express = require('express');
const router = express.Router();
const { queryAll } = require('../db/helpers');
const wordService = require('../services/word-service');
const phraseService = require('../services/phrase-service');
const errorTracker = require('../services/error-tracker');
const masteryService = require('../services/mastery-service');

router.get('/', async (req, res) => {
  try {
    const stats = {
      totalWords: await wordService.getTotalCount(),
      learnedWords: await wordService.getLearnedCount(),
      totalPhrases: await phraseService.getTotalCount(),
      learnedPhrases: await phraseService.getLearnedCount(),
      errorItems: await errorTracker.getErrorItems(),
      recentSessions: await queryAll('SELECT * FROM sessions ORDER BY session_date DESC LIMIT 10'),
      masteryStats: await masteryService.getMasteryStats()
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/learned - All learned words/phrases with mastery info
router.get('/learned', async (req, res) => {
  try {
    const words = await queryAll(`
      SELECT w.*, 'word' as item_type,
             COALESCE(wm.mastery_level, 0) as mastery_level,
             wm.next_review_date,
             ll.learn_date
      FROM words w
      INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
      LEFT JOIN word_mastery wm ON wm.item_type = 'word' AND wm.item_id = w.id
      ORDER BY ll.learn_date DESC, w.word ASC
    `);

    const phrases = await queryAll(`
      SELECT p.*, 'phrase' as item_type,
             COALESCE(wm.mastery_level, 0) as mastery_level,
             wm.next_review_date,
             ll.learn_date
      FROM phrases p
      INNER JOIN learning_log ll ON ll.item_id = p.id AND ll.item_type = 'phrase' AND ll.is_review = 0
      LEFT JOIN word_mastery wm ON wm.item_type = 'phrase' AND wm.item_id = p.id
      ORDER BY ll.learn_date DESC, p.phrase ASC
    `);

    res.json({ words, phrases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/errors', async (req, res) => {
  try {
    const errors = await errorTracker.getErrorItems();
    const detailed = [];
    for (const e of errors) {
      let item;
      if (e.item_type === 'word') {
        item = await wordService.getWordById(e.item_id);
      } else {
        item = await phraseService.getPhraseById(e.item_id);
      }
      if (item) detailed.push({ ...e, detail: item });
    }
    res.json(detailed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
