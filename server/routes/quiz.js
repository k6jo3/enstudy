const express = require('express');
const router = express.Router();
const errorTracker = require('../services/error-tracker');
const masteryService = require('../services/mastery-service');
const wordService = require('../services/word-service');
const phraseService = require('../services/phrase-service');
const { queryAll, queryScalar } = require('../db/helpers');
const { getToday } = require('../services/daily-session');
const { badRequest, isOneOf, parsePositiveInt } = require('../utils/validation');

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

// Generate a hint display string: reveal ~1/3 of letters, rest as '_'
// e.g. "adventure" → "a _ _ e _ _ _ r _"
// e.g. "give up" → "g _ _ _   _ p"
function generateHintDisplay(text) {
  const words = text.split(' ');
  return words.map(word => {
    const chars = word.split('');
    const revealCount = Math.max(1, Math.round(chars.length / 3));
    const indices = chars.map((_, i) => i);
    // Fisher-Yates to pick random positions
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const revealSet = new Set(indices.slice(0, revealCount));
    return chars.map((c, i) => revealSet.has(i) ? c : '_').join(' ');
  }).join('   ');
}

// Build choices for a choice-mode item
function buildChoices(item, distractors) {
  const correct = item.meaning;
  if (!correct) return null;
  const correctLower = correct.toLowerCase();
  const seen = new Set([correctLower]);
  const wrongs = [];
  for (const d of distractors) {
    if (!d.meaning) continue;
    const dLower = d.meaning.toLowerCase();
    if (seen.has(dLower)) continue;
    if (dLower.includes(correctLower) || correctLower.includes(dLower)) continue;
    seen.add(dLower);
    wrongs.push({ text: d.meaning, correct: false });
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
  if (item.item_type === 'word') {
    let d = await wordService.getLearnedRandomWords(5, excludeIds, diff);
    if (d.length < 5) d = await wordService.getRandomWords(5, excludeIds);
    return d;
  }
  let d = await phraseService.getLearnedRandomPhrases(5, excludeIds, diff);
  if (d.length < 5) d = await phraseService.getRandomPhrases(5, excludeIds);
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

// ---------- Core: select items by score tiers ----------
async function selectItemsByTier(quizCount, today) {
  // 1. Today's items (from learning_log, learn_date = today)
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

  // 2. Untested items (learned, no word_mastery record, excluding today)
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

  // 3. Scored items from word_mastery (not paused)
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

  // Bucket scored items by tier (aligned with quiz mode thresholds)
  const score0 = [];
  const weak = [];   // 0 < score < 4 (choice only)
  const medium = []; // 4 <= score < 8 (choice or hint)
  const strong = []; // 8 <= score < 12 (typing only)
  for (const item of scoredItems) {
    if (item.score === 0) { item.tier = 'score0'; score0.push(item); }
    else if (item.score < 4) { item.tier = 'weak'; weak.push(item); }
    else if (item.score < 8) { item.tier = 'medium'; medium.push(item); }
    else { item.tier = 'strong'; strong.push(item); }
  }

  // Allocate per tier
  const pools = {
    today: todayItems,
    untested: untestedItems,
    score0,
    weak,
    medium,
    strong,
  };

  // Dynamic ratio: boost the tier with the most items by 5~10%
  const poolSizes = {};
  let totalPoolSize = 0;
  let maxTier = null;
  let maxSize = 0;
  for (const tier of TIER_CONFIG) {
    const size = pools[tier.name].length;
    poolSizes[tier.name] = size;
    totalPoolSize += size;
    if (size > maxSize) { maxSize = size; maxTier = tier.name; }
  }

  // Calculate dynamic ratios
  let dynamicRatios;
  if (totalPoolSize > 0 && maxTier) {
    // Dominant ratio: how much of the total pool is in the largest tier (0~1)
    const dominance = maxSize / totalPoolSize;
    // Bonus scales linearly: 5% at low dominance → 10% when one tier is very dominant
    const bonus = 0.05 + 0.05 * Math.min(dominance * 2, 1);
    const baseRatio = TIER_CONFIG.find(t => t.name === maxTier).ratio;
    const scale = (1 - baseRatio - bonus) / (1 - baseRatio);
    dynamicRatios = TIER_CONFIG.map(t => ({
      name: t.name,
      ratio: t.name === maxTier ? t.ratio + bonus : t.ratio * scale,
    }));
  } else {
    dynamicRatios = TIER_CONFIG;
  }

  const usedKeys = new Set();
  const result = [];

  // First pass: fill each tier up to its dynamic quota
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

  // Second pass: if under quizCount, fill from lowest tiers first (favour weak items)
  if (result.length < quizCount) {
    const fillOrder = ['score0', 'weak', 'untested', 'today', 'medium', 'strong'];
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

// Submit a quiz answer
router.post('/submit', async (req, res) => {
  try {
    const { itemType, itemId, isCorrect, questionMode } = req.body;
    const parsedItemId = parsePositiveInt(itemId);

    if (!isOneOf(itemType, ['word', 'phrase'])) {
      return badRequest(res, 'Invalid itemType');
    }
    if (parsedItemId === null) {
      return badRequest(res, 'Invalid itemId');
    }
    if (typeof isCorrect !== 'boolean') {
      return badRequest(res, 'isCorrect must be boolean');
    }
    if (questionMode !== undefined && !isOneOf(questionMode, ['typing', 'choice', 'hint', 'listen'])) {
      return badRequest(res, 'Invalid questionMode');
    }

    const date = getToday();

    if (!isCorrect) {
      await errorTracker.recordError(itemType, parsedItemId, date);
    }

    await masteryService.updateMastery(itemType, parsedItemId, isCorrect, date, questionMode || 'typing');

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quiz items with score-tier distribution
router.get('/items', async (req, res) => {
  try {
    const limit = parsePositiveInt(req.query.limit, { defaultValue: 85, max: 200 });
    if (limit === null) {
      return badRequest(res, 'Invalid limit');
    }
    const forListen = req.query.type === 'listen';
    const today = getToday();

    const totalDays = await queryScalar('SELECT COUNT(*) FROM sessions WHERE completed = 1') || 0;
    const totalLearned = await queryScalar(`
      SELECT COUNT(DISTINCT ll.item_type || ':' || ll.item_id)
      FROM learning_log ll
      LEFT JOIN word_mastery wm ON wm.item_type = ll.item_type AND wm.item_id = ll.item_id
      WHERE ll.is_review = 0 AND (wm.paused IS NULL OR wm.paused = 0)
    `) || 0;
    // Base 15, +5 per week, +1 per 10 learned items, capped by limit
    const quizCount = Math.min(15 + Math.floor(totalDays / 7) * 5 + Math.floor(totalLearned / 10), limit);

    const items = await selectItemsByTier(quizCount, today);

    // Set quizMode and generate choices / hints
    for (const item of items) {
      const score = item.score != null && item.score >= 0 ? item.score : 0;
      if (forListen) {
        item.quizMode = 'typing';
      } else {
        item.quizMode = getQuizMode(score, item.hint_count);
      }

      const display = item.word || item.phrase;

      if (item.quizMode === 'choice' && !forListen) {
        const distractors = await fetchDistractors(item);
        const choices = buildChoices(item, distractors);
        if (choices) {
          item.choices = choices;
        } else {
          // Not enough distractors → fall back to hint or typing
          item.quizMode = score >= 8 ? 'typing' : 'hint';
        }
      }

      if (item.quizMode === 'hint' && display) {
        item.hintDisplay = generateHintDisplay(display);
      }
    }

    res.json({
      items,
      quizCount,
      totalDays,
      totalLearned
    });
  } catch (err) {
    console.error('Quiz items error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
