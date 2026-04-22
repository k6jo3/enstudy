const express = require('express');
const router = express.Router();
const errorTracker = require('../services/error-tracker');
const masteryService = require('../services/mastery-service');
const wordService = require('../services/word-service');
const phraseService = require('../services/phrase-service');
const { queryAll, queryScalar } = require('../db/helpers');
const { getToday } = require('../services/daily-session');
const { areMeaningsSimilar, buildMeaningLabel } = require('../utils/meaning');
const { badRequest, isOneOf, parsePositiveInt } = require('../utils/validation');
const { cleanPrompt, maskAnswerInText, stripLatinParenthetical } = require('../utils/masking');

// ---------- Tier distribution config ----------
// Proportions for each score tier (must sum to 1.0)
const TIER_CONFIG = [
  { name: 'today',    ratio: 0.20 },  // today's daily session items
  { name: 'untested', ratio: 0.10 },  // learned but never quizzed
  { name: 'score0',   ratio: 0.30 },  // tested, score = 0
  { name: 'weak',     ratio: 0.20 },  // 0 < score < 4
  { name: 'medium',   ratio: 0.15 },  // 4 <= score < 8
  { name: 'strong',   ratio: 0.05 },  // 8 <= score < 12 (score=12 paused, excluded)
];

// ---------- Helpers ----------

// Determine quiz mode based on score and hint history
// 0~4: choice | 4~8: hint (if <3 done) or choice/hint | 8~12: typing (no hint)
function getQuizMode(score, hintCount) {
  if (score >= 8) return 'typing';
  if (score >= 4) {
    // Must complete at least 3 hint (fill-in-the-blank) answers before choice is allowed
    if ((hintCount || 0) < 3) return 'hint';
    return Math.random() > 0.5 ? 'choice' : 'hint';
  }
  return 'choice';
}

// Lazy word-difficulty map for per-token hint calculation.
let _wordDiffMap = null;
async function getWordDiffMap() {
  if (_wordDiffMap) return _wordDiffMap;
  const rows = await queryAll('SELECT word, difficulty FROM words');
  const m = new Map();
  for (const r of rows) {
    if (r.word) m.set(r.word.toLowerCase(), r.difficulty || 1);
  }
  _wordDiffMap = m;
  return m;
}

// Generate a hint display string.
function generateHintDisplay(text, {
  itemType = 'word',
  difficulty = 1,
  wordDiffMap = null,
  errorCount = 0,
  score = 0,
} = {}) {
  const tokens = text.split(' ');
  const tokenLetters = tokens.map((token) => ({
    chars: token.split(''),
    letterIndices: token
      .split('')
      .map((char, index) => (/[A-Za-z]/.test(char) ? index : -1))
      .filter((index) => index >= 0),
  }));

  const allLetterSlots = [];
  tokenLetters.forEach((entry, tokenIndex) => {
    entry.letterIndices.forEach((charIndex) => {
      allLetterSlots.push({ tokenIndex, charIndex });
    });
  });

  const totalLetters = allLetterSlots.length;
  if (totalLetters === 0) {
    return tokenLetters.map((entry) => entry.chars.join(' ')).join('   ');
  }

  let effectiveDiff = Math.max(1, Math.min(5, Number(difficulty) || 1));
  if (itemType === 'phrase' && wordDiffMap) {
    for (const token of tokens) {
      const clean = token.toLowerCase().replace(/[^a-z'-]/g, '');
      const wd = clean && wordDiffMap.get(clean);
      if (wd && wd > effectiveDiff) effectiveDiff = wd;
    }
  }

  const baseReveal = Math.max(1, Math.round(totalLetters / 3) + (itemType === 'phrase' ? 1 : 0));
  const diffBonus = effectiveDiff > 3 ? (effectiveDiff - 3) : 0;
  const errorBonus = Number(errorCount) >= 2 && Number(score) < 12 ? 1 : 0;
  const revealTarget = baseReveal + diffBonus + errorBonus;
  const revealCap = Math.floor(totalLetters * 2 / 3);
  const reveal = Math.max(0, Math.min(revealCap, revealTarget));

  for (let i = allLetterSlots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allLetterSlots[i], allLetterSlots[j]] = [allLetterSlots[j], allLetterSlots[i]];
  }
  const revealSet = new Set(
    allLetterSlots
      .slice(0, reveal)
      .map(({ tokenIndex, charIndex }) => `${tokenIndex}:${charIndex}`)
  );

  return tokenLetters.map((entry, tokenIndex) => (
    entry.chars.map((char, charIndex) => {
      if (!/[A-Za-z]/.test(char)) return char;
      return revealSet.has(`${tokenIndex}:${charIndex}`) ? char : '_';
    }).join(' ')
  )).join('   ');
}

// Build choices for a choice-mode item
function buildChoices(item, distractors) {
  const peers = [item, ...distractors];
  const correct = buildMeaningLabel(item, peers, { includeUsageHint: true });
  if (!correct) return null;
  const seen = new Set([correct.toLowerCase()]);
  const wrongs = [];
  for (const d of distractors) {
    if (!d.meaning) continue;
    const choiceText = buildMeaningLabel(d, peers, { includeUsageHint: true });
    const similarMeaning = areMeaningsSimilar(item.meaning, d.meaning);
    const normalizedText = choiceText.toLowerCase();
    if (seen.has(normalizedText)) continue;
    if (similarMeaning && normalizedText === correct.toLowerCase()) continue;
    seen.add(normalizedText);
    wrongs.push({ text: choiceText, correct: false });
    if (wrongs.length === 3) break;
  }
  if (wrongs.length < 2) return null;
  const all = [{ text: correct, correct: true }, ...wrongs];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

async function fetchDistractors(item) {
  const excludeIds = [Number(item.id)];
  const diff = item.difficulty != null ? Number(item.difficulty) : null;
  const desiredCount = 12;
  if (item.item_type === 'word') {
    let d = await wordService.getLearnedRandomWords(desiredCount, excludeIds, diff);
    if (d.length < desiredCount) d = await wordService.getRandomWords(desiredCount, excludeIds);
    return d;
  }
  let d = await phraseService.getLearnedRandomPhrases(desiredCount, excludeIds, diff);
  if (d.length < desiredCount) d = await phraseService.getRandomPhrases(desiredCount, excludeIds);
  return d;
}

// Fisher-Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getDominantTier(pools) {
  const scoredTierNames = ['score0', 'weak', 'medium', 'strong'];
  let dominantTier = null;
  let dominantSize = 0;
  let totalSize = 0;

  for (const tierName of scoredTierNames) {
    const size = pools[tierName].length;
    totalSize += size;
    if (size > dominantSize) {
      dominantSize = size;
      dominantTier = tierName;
    }
  }

  return { dominantTier, dominantSize, totalSize };
}

function getDynamicRatios(pools) {
  const { dominantTier, dominantSize, totalSize } = getDominantTier(pools);
  if (!dominantTier || totalSize === 0) {
    return { dynamicRatios: TIER_CONFIG, dominantTier: null };
  }

  const dominance = dominantSize / totalSize;
  const baseRatio = TIER_CONFIG.find((tier) => tier.name === dominantTier)?.ratio || 0;
  const bonus = Math.min(0.3, 0.12 + dominance * 0.2);
  const scale = (1 - baseRatio - bonus) / Math.max(0.0001, 1 - baseRatio);

  return {
    dominantTier,
    dynamicRatios: TIER_CONFIG.map((tier) => ({
      name: tier.name,
      ratio: tier.name === dominantTier ? tier.ratio + bonus : tier.ratio * scale,
    })),
  };
}

// ---------- Core: select items by score tiers ----------
async function selectItemsByTier(quizCount, today) {
  const todayItems = await queryAll(`
    SELECT
      ll.item_type, ll.item_id as id,
      CASE WHEN ll.item_type = 'word' THEN w.word ELSE NULL END as word,
      CASE WHEN ll.item_type = 'word' THEN w.phonetic ELSE NULL END as phonetic,
      CASE WHEN ll.item_type = 'word' THEN w.meaning ELSE p.meaning END as meaning,
      CASE WHEN ll.item_type = 'word' THEN w.part_of_speech ELSE NULL END as part_of_speech,
      CASE WHEN ll.item_type = 'word' THEN w.example ELSE p.example END as example,
      CASE WHEN ll.item_type = 'phrase' THEN p.phrase ELSE NULL END as phrase,
      CASE WHEN ll.item_type = 'word' THEN w.difficulty ELSE p.difficulty END as difficulty,
      CASE WHEN ll.item_type = 'word' THEN w.context ELSE p.context END as context,
      COALESCE(wm.score, -1) as score,
      COALESCE(wm.hint_count, 0) as hint_count,
      COALESCE(e.total_errors, 0) as error_count,
      'today' as tier
    FROM learning_log ll
    LEFT JOIN words w ON ll.item_type = 'word' AND ll.item_id = w.id
    LEFT JOIN phrases p ON ll.item_type = 'phrase' AND ll.item_id = p.id
    LEFT JOIN word_mastery wm ON wm.item_type = ll.item_type AND wm.item_id = ll.item_id
    LEFT JOIN (
      SELECT item_type, item_id, SUM(error_count) as total_errors
      FROM errors GROUP BY item_type, item_id
    ) e ON ll.item_type = e.item_type AND ll.item_id = e.item_id
    WHERE ll.learn_date = ? AND (wm.paused IS NULL OR wm.paused = 0)
    ORDER BY RANDOM()
  `, [today]);

  const untestedItems = await queryAll(`
    SELECT
      ll.item_type, ll.item_id as id,
      CASE WHEN ll.item_type = 'word' THEN w.word ELSE NULL END as word,
      CASE WHEN ll.item_type = 'word' THEN w.phonetic ELSE NULL END as phonetic,
      CASE WHEN ll.item_type = 'word' THEN w.meaning ELSE p.meaning END as meaning,
      CASE WHEN ll.item_type = 'word' THEN w.part_of_speech ELSE NULL END as part_of_speech,
      CASE WHEN ll.item_type = 'word' THEN w.example ELSE p.example END as example,
      CASE WHEN ll.item_type = 'phrase' THEN p.phrase ELSE NULL END as phrase,
      CASE WHEN ll.item_type = 'word' THEN w.difficulty ELSE p.difficulty END as difficulty,
      CASE WHEN ll.item_type = 'word' THEN w.context ELSE p.context END as context,
      -1 as score,
      COALESCE(e.total_errors, 0) as error_count,
      'untested' as tier
    FROM learning_log ll
    LEFT JOIN words w ON ll.item_type = 'word' AND ll.item_id = w.id
    LEFT JOIN phrases p ON ll.item_type = 'phrase' AND ll.item_id = p.id
    LEFT JOIN (
      SELECT item_type, item_id, SUM(error_count) as total_errors
      FROM errors GROUP BY item_type, item_id
    ) e ON ll.item_type = e.item_type AND ll.item_id = e.item_id
    WHERE ll.is_review = 0
      AND ll.learn_date != ?
      AND NOT EXISTS (
        SELECT 1 FROM word_mastery wm
        WHERE wm.item_type = ll.item_type AND wm.item_id = ll.item_id
      )
    GROUP BY ll.item_type, ll.item_id
    ORDER BY RANDOM()
  `, [today]);

  const scoredItems = await queryAll(`
    SELECT
      wm.item_type, wm.item_id as id,
      CASE WHEN wm.item_type = 'word' THEN w.word ELSE NULL END as word,
      CASE WHEN wm.item_type = 'word' THEN w.phonetic ELSE NULL END as phonetic,
      CASE WHEN wm.item_type = 'word' THEN w.meaning ELSE p.meaning END as meaning,
      CASE WHEN wm.item_type = 'word' THEN w.part_of_speech ELSE NULL END as part_of_speech,
      CASE WHEN wm.item_type = 'word' THEN w.example ELSE p.example END as example,
      CASE WHEN wm.item_type = 'phrase' THEN p.phrase ELSE NULL END as phrase,
      CASE WHEN wm.item_type = 'word' THEN w.difficulty ELSE p.difficulty END as difficulty,
      CASE WHEN wm.item_type = 'word' THEN w.context ELSE p.context END as context,
      wm.score,
      COALESCE(wm.hint_count, 0) as hint_count,
      COALESCE(wm.just_unpaused, 0) as just_unpaused,
      COALESCE(e.total_errors, 0) as error_count
    FROM word_mastery wm
    LEFT JOIN words w ON wm.item_type = 'word' AND wm.item_id = w.id
    LEFT JOIN phrases p ON wm.item_type = 'phrase' AND wm.item_id = p.id
    LEFT JOIN (
      SELECT item_type, item_id, SUM(error_count) as total_errors
      FROM errors GROUP BY item_type, item_id
    ) e ON wm.item_type = e.item_type AND wm.item_id = e.item_id
    WHERE wm.paused = 0
    ORDER BY RANDOM()
  `);

  const score0 = [];
  const weak = [];
  const medium = [];
  const strong = [];
  for (const item of scoredItems) {
    if (item.score === 0) { item.tier = 'score0'; score0.push(item); }
    else if (item.score < 4) { item.tier = 'weak'; weak.push(item); }
    else if (item.score < 8) { item.tier = 'medium'; medium.push(item); }
    else { item.tier = 'strong'; strong.push(item); }
  }

  const pools = { today: todayItems, untested: untestedItems, score0, weak, medium, strong };
  const { dynamicRatios, dominantTier } = getDynamicRatios(pools);

  for (const name of Object.keys(pools)) {
    pools[name].sort((a, b) => (b.error_count || 0) - (a.error_count || 0));
  }

  const usedKeys = new Set();
  const result = [];

  for (const tier of dynamicRatios) {
    const quota = Math.max(1, Math.round(quizCount * tier.ratio));
    const pool = pools[tier.name];
    let added = 0;
    for (const item of pool) {
      if (added >= quota) break;
      const key = `${item.item_type}:${item.id}`;
      if (usedKeys.has(key)) continue;
      usedKeys.add(key);
      result.push(item);
      added++;
    }
  }

  if (result.length < quizCount) {
    const fillOrder = [...new Set([dominantTier, 'score0', 'weak', 'medium', 'strong', 'untested', 'today'].filter(Boolean))];
    for (const tierName of fillOrder) {
      if (result.length >= quizCount) break;
      const pool = pools[tierName];
      for (const item of pool) {
        if (result.length >= quizCount) break;
        const key = `${item.item_type}:${item.id}`;
        if (usedKeys.has(key)) continue;
        usedKeys.add(key);
        result.push(item);
      }
    }
  }

  return shuffle(result.slice(0, quizCount));
}

// ---------- Routes ----------

router.post('/submit', async (req, res) => {
  try {
    const { itemType, itemId, isCorrect, questionMode } = req.body;
    const parsedItemId = parsePositiveInt(itemId);
    if (!isOneOf(itemType, ['word', 'phrase'])) return badRequest(res, 'Invalid itemType');
    if (parsedItemId === null) return badRequest(res, 'Invalid itemId');
    if (typeof isCorrect !== 'boolean') return badRequest(res, 'isCorrect must be boolean');
    if (questionMode !== undefined && !isOneOf(questionMode, ['typing', 'choice', 'hint', 'listen'])) return badRequest(res, 'Invalid questionMode');

    const date = getToday();
    if (!isCorrect) await errorTracker.recordError(itemType, parsedItemId, date);
    await masteryService.updateMastery(itemType, parsedItemId, isCorrect, date, questionMode || 'typing');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/items', async (req, res) => {
  try {
    const limit = parsePositiveInt(req.query.limit, { defaultValue: 85, max: 200 });
    if (limit === null) return badRequest(res, 'Invalid limit');
    const forListen = req.query.type === 'listen';
    const today = getToday();

    const totalDays = await queryScalar('SELECT COUNT(*) FROM sessions WHERE completed = 1') || 0;
    const totalLearned = await queryScalar(`
      SELECT COUNT(DISTINCT ll.item_type || ':' || ll.item_id)
      FROM learning_log ll
      LEFT JOIN word_mastery wm ON wm.item_type = ll.item_type AND wm.item_id = ll.item_id
      WHERE ll.is_review = 0 AND (wm.paused IS NULL OR wm.paused = 0)
    `) || 0;
    const quizCount = Math.min(15 + Math.floor(totalDays / 7) * 5 + Math.floor(totalLearned / 10), limit);

    const items = await selectItemsByTier(quizCount, today);
    const wordDiffMap = items.some(it => it.item_type === 'phrase') ? await getWordDiffMap() : null;

    for (const item of items) {
      const score = item.score != null && item.score >= 0 ? item.score : 0;
      if (forListen) item.quizMode = 'typing';
      else if (item.just_unpaused) item.quizMode = 'choice';
      else item.quizMode = getQuizMode(score, item.hint_count);

      const display = item.word || item.phrase;
      const promptPeers = items.filter((peer) => peer !== item && peer.item_type === item.item_type);
      item.quizContext = cleanPrompt(item.context, display);

      if (item.quizMode === 'choice' && !forListen) {
        const distractors = await fetchDistractors(item);
        const choices = buildChoices(item, distractors);
        if (choices) {
          // Clean each choice text individually to prevent leakage
          item.choices = choices.map(c => ({
            ...c,
            text: cleanPrompt(c.text, display)
          }));
          item.promptMeaning = buildMeaningLabel(item, [item, ...distractors], { includeUsageHint: true });
        } else {
          item.quizMode = score >= 8 ? 'typing' : 'hint';
        }
      }

      if (item.quizMode === 'hint' && display) {
        item.hintDisplay = generateHintDisplay(display, {
          itemType: item.item_type,
          difficulty: item.difficulty,
          wordDiffMap: item.item_type === 'phrase' ? wordDiffMap : null,
          errorCount: item.error_count,
          score,
        });
      }

      if (!item.promptMeaning) {
        item.promptMeaning = buildMeaningLabel(item, promptPeers, {
          includeUsageHint: item.quizMode !== 'choice' || !!item.context,
        });
      }
      item.promptMeaning = cleanPrompt(item.promptMeaning, display);
    }

    res.json({ items, quizCount, totalDays, totalLearned });
  } catch (err) {
    console.error('Quiz items error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
