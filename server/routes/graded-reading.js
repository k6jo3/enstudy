const express = require('express');
const router = express.Router();
const service = require('../services/graded-reading-service');
const { badRequest, parsePositiveInt, parseNumber } = require('../utils/validation');

// GET /api/graded-reading/progress
router.get('/progress', async (req, res) => {
  try {
    const progress = await service.getProgress();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/graded-reading/grade/:grade
router.get('/grade/:grade', async (req, res) => {
  try {
    const grade = parsePositiveInt(req.params.grade, { min: 1, max: 9 });
    if (grade === null) return badRequest(res, 'Invalid grade (1-9)');
    const articles = await service.getArticlesByGrade(grade);
    // Also get progress for each article
    const progress = {};
    for (const a of articles) {
      const p = await service.getArticleProgress(a.id);
      if (p) progress[a.id] = { completed: !!p.completed, quiz_score: p.quiz_score, exercises_done: JSON.parse(p.exercises_done || '{}') };
    }
    res.json({ articles, progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/graded-reading/article/:id
router.get('/article/:id', async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    if (id === null) return badRequest(res, 'Invalid article id');
    const article = await service.getArticle(id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    const progress = await service.getArticleProgress(id);
    res.json({ article, progress: progress ? { completed: !!progress.completed, quiz_score: progress.quiz_score, exercises_done: JSON.parse(progress.exercises_done || '{}') } : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/graded-reading/complete
router.post('/complete', async (req, res) => {
  try {
    const { articleId, quizScore, exercisesDone } = req.body;
    const parsedId = parsePositiveInt(articleId);
    if (parsedId === null) return badRequest(res, 'Invalid articleId');
    const parsedScore = parseNumber(quizScore, { min: 0, max: 100 });
    await service.completeArticle(parsedId, parsedScore || 0, exercisesDone);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/graded-reading/exercises
router.post('/exercises', async (req, res) => {
  try {
    const { articleId, exercisesDone } = req.body;
    const parsedId = parsePositiveInt(articleId);
    if (parsedId === null) return badRequest(res, 'Invalid articleId');
    await service.updateExercises(parsedId, exercisesDone);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
