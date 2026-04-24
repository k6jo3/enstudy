const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const wordService = require('./word-service');
const phraseService = require('./phrase-service');
const masteryService = require('./mastery-service');
const errorTracker = require('./error-tracker');
const { generateDialogues, generateStaticDialogues, GENERATOR_VERSION } = require('./sentence-generator');
const roundService = require('./round-service');
const { addDays } = require('../utils/date');

function getToday() {
  // Use LOCAL date, not UTC — toISOString() returns UTC which can be off by 1 day
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Progressive learning pace — round-aware
// sessionDate: the date of the session (may be ahead of today via "next lesson")
async function getDailyPace(sessionDate) {
  const round = await roundService.getCurrentRound();
  const roundNumber = round ? round.round_number : 1;
  const dueDate = sessionDate || getToday();
  const dueCount = await masteryService.getDueCount(dueDate);

  let words, phrases;

  if (roundNumber >= 2 && round.word_pace > 0) {
    words = round.word_pace;
    phrases = round.phrase_pace || 5;
  } else {
    const totalDays = await queryScalar('SELECT COUNT(*) FROM sessions WHERE completed = 1') || 0;
    if (totalDays < 7) {
      words = 5;
      phrases = 3;
    } else if (totalDays < 21) {
      words = 10;
      phrases = 5;
    } else {
      words = 15;
      phrases = 5;
    }
  }

  const review = Math.min(dueCount, 40);
  return { words, phrases, review, roundNumber };
}

async function getOrCreateSession(date) {
  let session = await queryOne('SELECT * FROM sessions WHERE session_date = ?', [date]);
  if (!session) {
    await run('INSERT INTO sessions (session_date) VALUES (?)', [date]);
    session = await queryOne('SELECT * FROM sessions WHERE session_date = ?', [date]);
  }
  return session;
}

async function getActiveSession() {
  return queryOne(
    'SELECT * FROM sessions WHERE completed = 0 ORDER BY session_date ASC LIMIT 1'
  );
}

async function completeSession(sessionDate) {
  await run('UPDATE sessions SET completed = 1 WHERE session_date = ?', [sessionDate]);
  saveDb();
  return queryOne('SELECT * FROM sessions WHERE session_date = ?', [sessionDate]);
}

// Get the next available date after the latest session
async function getNextSessionDate() {
  const latest = await queryOne('SELECT session_date FROM sessions ORDER BY session_date DESC LIMIT 1');
  if (!latest) return getToday();
  return addDays(latest.session_date, 1);
}

async function getSessionStatus() {
  const today = getToday();
  const activeSession = await getActiveSession();
  return {
    activeDate: activeSession ? activeSession.session_date : today,
    isComplete: !activeSession,
    todayDate: today,
    activeSession
  };
}

async function getDailyContent(date) {
  const session = await getOrCreateSession(date);
  const pace = await getDailyPace(date);

  const existingLog = await queryAll('SELECT * FROM learning_log WHERE learn_date = ?', [date]);

  let newWords, newPhrases, reviewItems;

  if (existingLog.length > 0) {
    // Resuming an existing day — reload from learning_log
    const wordIds = existingLog.filter(l => l.item_type === 'word' && !l.is_review).map(l => l.item_id);
    const phraseIds = existingLog.filter(l => l.item_type === 'phrase' && !l.is_review).map(l => l.item_id);
    const reviewWordIds = existingLog.filter(l => l.item_type === 'word' && l.is_review).map(l => l.item_id);
    const reviewPhraseIds = existingLog.filter(l => l.item_type === 'phrase' && l.is_review).map(l => l.item_id);

    newWords = await wordService.getWordsByIds(wordIds);
    newPhrases = await phraseService.getPhrasesByIds(phraseIds);

    const reviewWordItems = (await wordService.getWordsByIds(reviewWordIds)).map(w => ({
      ...w, item_type: 'word'
    }));
    const reviewPhraseItems = (await phraseService.getPhrasesByIds(reviewPhraseIds)).map(p => ({
      ...p, item_type: 'phrase'
    }));
    reviewItems = [...reviewWordItems, ...reviewPhraseItems];

    // Attach mastery info to review items
    for (const item of reviewItems) {
      const mastery = await masteryService.getMasteryInfo(item.item_type, item.id);
      if (mastery) {
        item.mastery_level = mastery.mastery_level;
        item.review_count = mastery.review_count;
      }
    }

    // Backfill: if no reviews were logged (bug: getDailyPace used wrong date),
    // check for due items now and add them
    if (reviewItems.length === 0 && pace.review > 0) {
      reviewItems = await getReviewContent(date, pace.review, pace.roundNumber);
      for (const r of reviewItems) {
        await run(
          'INSERT OR IGNORE INTO learning_log (item_type, item_id, learn_date, is_review, round_number) VALUES (?, ?, ?, ?, ?)',
          [r.item_type, r.id, date, 1, pace.roundNumber]
        );
      }
      if (reviewItems.length > 0) saveDb();
    }
  } else {
    // First visit today — generate new content
    newWords = await wordService.getNewWords(date, pace.words, pace.roundNumber);
    newPhrases = await phraseService.getNewPhrases(date, pace.phrases, pace.roundNumber);
    reviewItems = await getReviewContent(date, pace.review, pace.roundNumber);

    for (const w of newWords) {
      await run(
        'INSERT OR IGNORE INTO learning_log (item_type, item_id, learn_date, is_review, round_number) VALUES (?, ?, ?, ?, ?)',
        ['word', w.id, date, 0, pace.roundNumber]
      );
      await masteryService.initMastery('word', w.id, date);
    }
    for (const p of newPhrases) {
      await run(
        'INSERT OR IGNORE INTO learning_log (item_type, item_id, learn_date, is_review, round_number) VALUES (?, ?, ?, ?, ?)',
        ['phrase', p.id, date, 0, pace.roundNumber]
      );
      await masteryService.initMastery('phrase', p.id, date);
    }
    for (const r of reviewItems) {
      await run(
        'INSERT OR IGNORE INTO learning_log (item_type, item_id, learn_date, is_review, round_number) VALUES (?, ?, ?, ?, ?)',
        [r.item_type, r.id, date, 1, pace.roundNumber]
      );
    }

    await run(
      'UPDATE sessions SET new_words = ?, new_phrases = ?, review_count = ? WHERE session_date = ?',
      [newWords.length, newPhrases.length, reviewItems.length, date]
    );

    saveDb();
  }

  const highErrSet = await masteryService.getHighErrorRateSet(0.10);

  const markErrors = (items, type) => items.map(item => ({
    ...item,
    hasError: highErrSet.has(`${type}:${item.id}`)
  }));

  newWords = markErrors(newWords, 'word');
  newPhrases = markErrors(newPhrases, 'phrase');

  // Load or generate dialogues (persisted per day)
  const sentences = await getOrCreateDialogues(date, newWords, newPhrases);

  return {
    session,
    pace,
    newWords,
    newPhrases,
    reviewItems: reviewItems.map(r => ({
      ...r,
      hasError: highErrSet.has(`${r.item_type}:${r.id}`),
      mastery_level: r.mastery_level ?? 0,
      review_count: r.review_count ?? 0
    })),
    sentences,
    stats: {
      totalWords: await wordService.getTotalCount(),
      learnedWords: await wordService.getLearnedCount(),
      totalPhrases: await phraseService.getTotalCount(),
      learnedPhrases: await phraseService.getLearnedCount(),
      todayErrors: await errorTracker.getTodayErrorCount(date)
    }
  };
}

// Mastery-based review selection
async function getReviewContent(date, reviewCount, roundNumber = 1) {
  const dueItems = await masteryService.getDueReviews(date, reviewCount, roundNumber);
  const result = [];

  for (const item of dueItems) {
    if (item.item_type === 'word') {
      const word = await wordService.getWordById(item.item_id);
      if (word) result.push({
        ...word,
        item_type: 'word',
        mastery_level: item.mastery_level,
        review_count: item.review_count
      });
    } else {
      const phrase = await phraseService.getPhraseById(item.item_id);
      if (phrase) result.push({
        ...phrase,
        item_type: 'phrase',
        mastery_level: item.mastery_level,
        review_count: item.review_count
      });
    }
  }

  return result;
}

// Persist dialogues so they stay the same when revisiting the same day
// 追蹤正在背景生成中的日期，避免重複啟動
const generatingDates = new Set();

async function getOrCreateDialogues(date, words, phrases) {
  // Check if dialogues already exist for this date
  const existing = await queryAll(
    'SELECT * FROM daily_sentences WHERE session_date = ? ORDER BY sort_order',
    [date]
  );

  if (existing.length > 0) {
    const parsed = existing.map(row => JSON.parse(row.dialogue_json));
    const version = parsed[0]?.templateVersion || 0;
    const hasZh = parsed[0]?.lines?.[0]?.zh;
    if (hasZh && version >= GENERATOR_VERSION) {
      return parsed;
    }
    // Clear old format and regenerate below
    await run('DELETE FROM daily_sentences WHERE session_date = ?', [date]);
  }

  // 先用靜態對話立即回傳（不讓使用者等待）
  const staticDialogues = generateStaticDialogues(words, phrases);

  // 立即存靜態版本到 DB
  for (let i = 0; i < staticDialogues.length; i++) {
    const d = staticDialogues[i];
    await run(
      'INSERT OR IGNORE INTO daily_sentences (session_date, item_type, item_id, dialogue_json, sort_order) VALUES (?, ?, ?, ?, ?)',
      [date, d.itemType || 'word', d.itemId || 0, JSON.stringify(d), i]
    );
  }
  saveDb();

  // 背景非同步用 Gemini 重新生成並覆蓋
  if (!generatingDates.has(date)) {
    generatingDates.add(date);
    setImmediate(async () => {
      try {
        console.log(`[daily-session] 背景啟動 Gemini 對話生成 (${date})...`);
        const aiDialogues = await generateDialogues(words, phrases);
        // 清除靜態版本，存入 AI 版本
        await run('DELETE FROM daily_sentences WHERE session_date = ?', [date]);
        for (let i = 0; i < aiDialogues.length; i++) {
          const d = aiDialogues[i];
          await run(
            'INSERT OR IGNORE INTO daily_sentences (session_date, item_type, item_id, dialogue_json, sort_order) VALUES (?, ?, ?, ?, ?)',
            [date, d.itemType || 'word', d.itemId || 0, JSON.stringify(d), i]
          );
        }
        saveDb();
        console.log(`[daily-session] Gemini 對話生成完成 (${date})`);
      } catch (err) {
        console.error(`[daily-session] Gemini 背景生成失敗:`, err.message);
      } finally {
        generatingDates.delete(date);
      }
    });
  }

  return staticDialogues;
}

// One-time cleanup: remove old-format dialogues so they regenerate with new example-based templates
async function cleanOldDialogues() {
  const all = await queryAll('SELECT id, session_date, dialogue_json FROM daily_sentences');
  const datesToClear = new Set();
  for (const row of all) {
    try {
      const d = JSON.parse(row.dialogue_json);
      const version = d?.templateVersion || 0;
      if (version < GENERATOR_VERSION) {
        datesToClear.add(row.session_date);
      }
    } catch (e) {
      datesToClear.add(row.session_date);
    }
  }
  if (datesToClear.size > 0) {
    for (const date of datesToClear) {
      await run('DELETE FROM daily_sentences WHERE session_date = ?', [date]);
    }
    saveDb();
    console.log(`[daily-session] Cleared old-format dialogues for ${datesToClear.size} date(s)`);
  }
}

module.exports = { getDailyContent, getToday, getOrCreateSession, getActiveSession, completeSession, getSessionStatus, getNextSessionDate, cleanOldDialogues };
