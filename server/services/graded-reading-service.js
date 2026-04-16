const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');

async function getArticlesByGrade(grade) {
  return queryAll(
    `SELECT id, grade, article_order, title, topic, content, content_zh,
            vocabulary, phrases, grammar, questions
     FROM graded_articles WHERE grade = ? ORDER BY article_order`,
    [grade]
  ).then(rows => rows.map(formatArticle));
}

async function getArticle(id) {
  const row = await queryOne('SELECT * FROM graded_articles WHERE id = ?', [id]);
  return row ? formatArticle(row) : null;
}

async function getProgress() {
  const total = await queryScalar('SELECT COUNT(*) FROM graded_articles') || 0;
  const completed = await queryScalar('SELECT COUNT(*) FROM graded_reading_log WHERE completed = 1') || 0;
  const byGrade = await queryAll(`
    SELECT ga.grade,
           COUNT(ga.id) as total,
           COUNT(grl.id) as done
    FROM graded_articles ga
    LEFT JOIN graded_reading_log grl ON grl.article_id = ga.id AND grl.completed = 1
    GROUP BY ga.grade ORDER BY ga.grade
  `);
  return { total, completed, byGrade };
}

async function getArticleProgress(articleId) {
  return queryOne('SELECT * FROM graded_reading_log WHERE article_id = ?', [articleId]);
}

async function completeArticle(articleId, quizScore, exercisesDone) {
  const existing = await queryOne('SELECT * FROM graded_reading_log WHERE article_id = ?', [articleId]);
  if (existing) {
    await run(
      `UPDATE graded_reading_log SET completed = 1, quiz_score = ?, exercises_done = ?, completed_date = ?
       WHERE article_id = ?`,
      [quizScore || 0, JSON.stringify(exercisesDone || {}), new Date().toISOString().slice(0, 10), articleId]
    );
  } else {
    await run(
      `INSERT INTO graded_reading_log (article_id, completed_date, completed, quiz_score, exercises_done)
       VALUES (?, ?, 1, ?, ?)`,
      [articleId, new Date().toISOString().slice(0, 10), quizScore || 0, JSON.stringify(exercisesDone || {})]
    );
  }
  saveDb();
}

async function updateExercises(articleId, exercisesDone) {
  const existing = await queryOne('SELECT * FROM graded_reading_log WHERE article_id = ?', [articleId]);
  if (existing) {
    const current = JSON.parse(existing.exercises_done || '{}');
    const merged = { ...current, ...exercisesDone };
    await run('UPDATE graded_reading_log SET exercises_done = ? WHERE article_id = ?',
      [JSON.stringify(merged), articleId]);
  } else {
    await run(
      `INSERT INTO graded_reading_log (article_id, completed_date, completed, quiz_score, exercises_done)
       VALUES (?, ?, 0, 0, ?)`,
      [articleId, new Date().toISOString().slice(0, 10), JSON.stringify(exercisesDone || {})]
    );
  }
  saveDb();
}

function formatArticle(row) {
  return {
    ...row,
    vocabulary: typeof row.vocabulary === 'string' ? JSON.parse(row.vocabulary) : (row.vocabulary || []),
    phrases: typeof row.phrases === 'string' ? JSON.parse(row.phrases) : (row.phrases || []),
    grammar: typeof row.grammar === 'string' ? JSON.parse(row.grammar) : (row.grammar || []),
    questions: typeof row.questions === 'string' ? JSON.parse(row.questions) : (row.questions || []),
  };
}

module.exports = { getArticlesByGrade, getArticle, getProgress, getArticleProgress, completeArticle, updateExercises };
