const express = require('express');
const router = express.Router();
const errorTracker = require('../services/error-tracker');
const masteryService = require('../services/mastery-service');
const wordService = require('../services/word-service');
const phraseService = require('../services/phrase-service');
const { queryAll, queryScalar } = require('../db/helpers');
const { getToday } = require('../services/daily-session');

// Submit a quiz answer
router.post('/submit', async (req, res) => {
  try {
    const { itemType, itemId, isCorrect } = req.body;
    const date = getToday();

    if (!isCorrect) {
      await errorTracker.recordError(itemType, itemId, date);
    }

    // Update spaced repetition mastery
    await masteryService.updateMastery(itemType, itemId, isCorrect, date);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quiz options (distractors) for multiple choice
router.get('/options', async (req, res) => {
  try {
    const { itemType, itemId, count = 5, difficulty } = req.query;
    const n = Number(count);
    const excludeIds = [Number(itemId)];
    const diff = difficulty ? Number(difficulty) : null;
    let distractors;

    if (itemType === 'word') {
      // Prefer learned words as distractors, fallback to all
      distractors = await wordService.getLearnedRandomWords(n, excludeIds, diff);
      if (distractors.length < n) {
        distractors = await wordService.getRandomWords(n, excludeIds);
      }
    } else {
      distractors = await phraseService.getLearnedRandomPhrases(n, excludeIds, diff);
      if (distractors.length < n) {
        distractors = await phraseService.getRandomPhrases(n, excludeIds);
      }
    }

    res.json(distractors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all previously learned items for quiz (progressive count, max 60)
router.get('/items', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 60;
    const today = getToday();

    const totalDays = await queryScalar('SELECT COUNT(*) FROM sessions WHERE completed = 1') || 0;
    const quizCount = Math.min(10 + Math.floor(totalDays / 7) * 5, limit);

    // Priority 1: SRS-due items (from word_mastery)
    const dueItems = await queryAll(`
      SELECT
        wm.item_type, wm.mastery_level,
        CASE WHEN wm.item_type = 'word' THEN w.id ELSE p.id END as id,
        CASE WHEN wm.item_type = 'word' THEN w.word ELSE NULL END as word,
        CASE WHEN wm.item_type = 'word' THEN w.phonetic ELSE NULL END as phonetic,
        CASE WHEN wm.item_type = 'word' THEN w.meaning ELSE p.meaning END as meaning,
        CASE WHEN wm.item_type = 'word' THEN w.part_of_speech ELSE NULL END as part_of_speech,
        CASE WHEN wm.item_type = 'word' THEN w.example ELSE p.example END as example,
        CASE WHEN wm.item_type = 'phrase' THEN p.phrase ELSE NULL END as phrase,
        CASE WHEN wm.item_type = 'word' THEN w.difficulty ELSE p.difficulty END as difficulty,
        COALESCE(e.total_errors, 0) as error_count
      FROM word_mastery wm
      LEFT JOIN words w ON wm.item_type = 'word' AND wm.item_id = w.id
      LEFT JOIN phrases p ON wm.item_type = 'phrase' AND wm.item_id = p.id
      LEFT JOIN (
        SELECT item_type, item_id, SUM(error_count) as total_errors
        FROM errors GROUP BY item_type, item_id
      ) e ON wm.item_type = e.item_type AND wm.item_id = e.item_id
      WHERE wm.next_review_date <= ?
      ORDER BY wm.mastery_level ASC, RANDOM()
      LIMIT ?
    `, [today, quizCount]);

    let items = dueItems;
    const usedIds = new Set(items.map(i => `${i.item_type}:${i.id}`));

    // Priority 2: Fill remaining with random learned items
    const remaining = quizCount - items.length;
    if (remaining > 0) {
      const extraWords = await queryAll(`
        SELECT w.*, 'word' as item_type,
               COALESCE(wm.mastery_level, 0) as mastery_level,
               COALESCE(e.total_errors, 0) as error_count
        FROM words w
        INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
        LEFT JOIN word_mastery wm ON wm.item_type = 'word' AND wm.item_id = w.id
        LEFT JOIN (
          SELECT item_id, SUM(error_count) as total_errors
          FROM errors WHERE item_type = 'word' GROUP BY item_id
        ) e ON e.item_id = w.id
        ORDER BY RANDOM()
        LIMIT ?
      `, [remaining * 2]);

      const extraPhrases = await queryAll(`
        SELECT p.*, 'phrase' as item_type,
               COALESCE(wm.mastery_level, 0) as mastery_level,
               COALESCE(e.total_errors, 0) as error_count
        FROM phrases p
        INNER JOIN learning_log ll ON ll.item_id = p.id AND ll.item_type = 'phrase' AND ll.is_review = 0
        LEFT JOIN word_mastery wm ON wm.item_type = 'phrase' AND wm.item_id = p.id
        LEFT JOIN (
          SELECT item_id, SUM(error_count) as total_errors
          FROM errors WHERE item_type = 'phrase' GROUP BY item_id
        ) e ON e.item_id = p.id
        ORDER BY RANDOM()
        LIMIT ?
      `, [remaining * 2]);

      for (const item of [...extraWords, ...extraPhrases]) {
        if (!usedIds.has(`${item.item_type}:${item.id}`)) {
          items.push(item);
          usedIds.add(`${item.item_type}:${item.id}`);
        }
      }
    }

    items = items.sort(() => Math.random() - 0.5).slice(0, quizCount);

    res.json({
      items,
      quizCount,
      totalDays,
      totalLearned: await queryScalar(`
        SELECT COUNT(DISTINCT item_type || ':' || item_id) FROM learning_log WHERE is_review = 0
      `) || 0
    });
  } catch (err) {
    console.error('Quiz items error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
