const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { addDays, getToday } = require('../utils/date');

// Reuse same interval schedule as word mastery
const INTERVALS = { 0: 1, 1: 3, 2: 7, 3: 14, 4: 30, 5: 90 };

async function getItems(count = 15, topic = null) {
  const today = getToday();
  const items = [];
  const usedIds = new Set();

  // 1. SRS due items (priority)
  const topicFilter = topic ? 'AND gq.topic = ?' : '';
  const topicParams = topic ? [today, topic] : [today];
  const dueItems = await queryAll(`
    SELECT gq.*, gm.mastery_level, gm.next_review_date
    FROM grammar_mastery gm
    JOIN grammar_questions gq ON gq.id = gm.question_id
    WHERE gm.next_review_date <= ? ${topicFilter}
    ORDER BY gm.mastery_level ASC, gm.next_review_date ASC
    LIMIT ?
  `, [...topicParams, count]);

  for (const item of dueItems) {
    items.push(formatItem(item));
    usedIds.add(item.id);
  }

  // 2. New questions (never attempted)
  if (items.length < count) {
    const remaining = count - items.length;
    const excludeList = usedIds.size > 0 ? Array.from(usedIds) : [0];
    const placeholders = excludeList.map(() => '?').join(',');
    const newParams = topic
      ? [topic, ...excludeList, remaining]
      : [...excludeList, remaining];
    const newItems = await queryAll(`
      SELECT gq.*, NULL as mastery_level
      FROM grammar_questions gq
      WHERE gq.id NOT IN (SELECT question_id FROM grammar_mastery)
        AND gq.id NOT IN (${placeholders})
        ${topic ? 'AND gq.topic = ?' : ''}
      ORDER BY gq.difficulty ASC, RANDOM()
      LIMIT ?
    `, topic
      ? [...excludeList, topic, remaining]
      : [...excludeList, remaining]
    );

    for (const item of newItems) {
      items.push(formatItem(item));
      usedIds.add(item.id);
    }
  }

  // 3. Random fill (if still not enough)
  if (items.length < count) {
    const remaining = count - items.length;
    const excludeList = usedIds.size > 0 ? Array.from(usedIds) : [0];
    const placeholders = excludeList.map(() => '?').join(',');
    const fillItems = await queryAll(`
      SELECT gq.*, gm.mastery_level
      FROM grammar_questions gq
      LEFT JOIN grammar_mastery gm ON gm.question_id = gq.id
      WHERE gq.id NOT IN (${placeholders})
        ${topic ? 'AND gq.topic = ?' : ''}
      ORDER BY RANDOM()
      LIMIT ?
    `, topic
      ? [...excludeList, topic, remaining]
      : [...excludeList, remaining]
    );

    for (const item of fillItems) {
      items.push(formatItem(item));
    }
  }

  const totalQuestions = await queryScalar('SELECT COUNT(*) FROM grammar_questions') || 0;
  const masteredCount = await queryScalar(
    'SELECT COUNT(*) FROM grammar_mastery WHERE mastery_level >= 5'
  ) || 0;

  return { items, totalQuestions, masteredCount };
}

function formatItem(row) {
  return {
    id: row.id,
    topic: row.topic,
    sentence: row.sentence,
    options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
    grammar_point: row.grammar_point,
    difficulty: row.difficulty,
    mastery_level: row.mastery_level != null ? row.mastery_level : null,
  };
}

async function submitAnswer(questionId, selectedIndex) {
  const question = await queryOne(
    'SELECT * FROM grammar_questions WHERE id = ?',
    [questionId]
  );
  if (!question) return { error: 'Question not found' };

  const isCorrect = question.answer === selectedIndex;
  const today = getToday();

  // Update or create mastery record
  const mastery = await queryOne(
    'SELECT * FROM grammar_mastery WHERE question_id = ?',
    [questionId]
  );

  if (!mastery) {
    const nextReview = addDays(today, isCorrect ? INTERVALS[1] : INTERVALS[0]);
    await run(
      `INSERT INTO grammar_mastery
       (question_id, mastery_level, review_count, correct_streak, next_review_date, last_review_date, created_at)
       VALUES (?, ?, 1, ?, ?, ?, ?)`,
      [questionId, isCorrect ? 1 : 0, isCorrect ? 1 : 0, nextReview, today, today]
    );
  } else {
    let newLevel, newStreak, nextReview;
    if (isCorrect) {
      newLevel = Math.min(mastery.mastery_level + 1, 5);
      newStreak = mastery.correct_streak + 1;
      nextReview = addDays(today, INTERVALS[Math.min(newLevel, 5)] || 1);
    } else {
      newLevel = 0;
      newStreak = 0;
      nextReview = addDays(today, 1);
    }
    await run(
      `UPDATE grammar_mastery
       SET mastery_level = ?, review_count = review_count + 1, correct_streak = ?,
           next_review_date = ?, last_review_date = ?
       WHERE question_id = ?`,
      [newLevel, newStreak, nextReview, today, questionId]
    );
  }

  saveDb();

  return {
    correct: isCorrect,
    answer: question.answer,
    explanation: question.explanation,
  };
}

async function getStats() {
  const byTopic = await queryAll(`
    SELECT gq.topic,
           COUNT(*) as total,
           SUM(CASE WHEN gm.mastery_level >= 3 THEN 1 ELSE 0 END) as good,
           SUM(CASE WHEN gm.mastery_level >= 5 THEN 1 ELSE 0 END) as mastered
    FROM grammar_questions gq
    LEFT JOIN grammar_mastery gm ON gm.question_id = gq.id
    GROUP BY gq.topic
    ORDER BY gq.topic
  `);

  const distribution = await queryAll(`
    SELECT mastery_level, COUNT(*) as count
    FROM grammar_mastery
    GROUP BY mastery_level
    ORDER BY mastery_level
  `);

  const totalQuestions = await queryScalar('SELECT COUNT(*) FROM grammar_questions') || 0;
  const attempted = await queryScalar('SELECT COUNT(*) FROM grammar_mastery') || 0;
  const mastered = await queryScalar(
    'SELECT COUNT(*) FROM grammar_mastery WHERE mastery_level >= 5'
  ) || 0;

  return { byTopic, distribution, totalQuestions, attempted, mastered };
}

module.exports = { getItems, submitAnswer, getStats };
