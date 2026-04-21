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
// Built once from the words table; phrases like "ramp up" can then look up
// "ramp" individually and reveal more letters when a component word is harder
// than the phrase itself.
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

// Generate a hint display string with per-token difficulty.
// For each token:
//   base = ceil(length / 3)
//   diffBonus = max(itemDifficulty, wordLookup) - 1, clamped 0..3
//   longBonus = length >= 14 ? 2 : length >= 10 ? 1 : 0
//   reveal = min( floor(length * 2/3),  base + diffBonus + longBonus )  // 67% cap
// Examples:
//   "adventure" (L1)                    -> 3 letters (33%)
//   "adventure" (L4)                    -> 6 letters (67%, cap)
//   "entrepreneurship" (L4, 16 chars)   -> 10 letters (62%, cap; was 56%)
//   "ramp up" (phrase L2, ramp is L3)   -> ramp: 2 letters, up: 1 letter
function generateHintDisplay(text, difficulty = 1, wordDiffMap = null) {
  const tokens = text.split(' ');
  return tokens.map(token => {
    if (!token) return '';
    const chars = token.split('');
    const len = chars.length;

    // Per-token effective difficulty: max of item difficulty and word lookup
    let effectiveDiff = difficulty || 1;
    if (wordDiffMap) {
      const clean = token.toLowerCase().replace(/[^a-z'-]/g, '');
      const wd = clean && wordDiffMap.get(clean);
      if (wd && wd > effectiveDiff) effectiveDiff = wd;
    }

    const diffBonus = Math.max(0, Math.min(3, effectiveDiff - 1));
    const longBonus = len >= 14 ? 2 : len >= 10 ? 1 : 0;
    const revealTarget = Math.ceil(len / 3) + diffBonus + longBonus;
    // Cap at 67% of length so the user still has something to recall
    const revealCap = Math.max(1, Math.floor(len * 2 / 3));
    const reveal = Math.max(1, Math.min(revealCap, revealTarget));

    const indices = chars.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const revealSet = new Set(indices.slice(0, reveal));
    return chars.map((c, i) => revealSet.has(i) ? c : '_').join(' ');
  }).join('   ');
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

  const { dynamicRatios, dominantTier } = getDynamicRatios(pools);

  // Sort each pool: high error_count items first, then random within same error level
  for (const name of Object.keys(pools)) {
    pools[name].sort((a, b) => (b.error_count || 0) - (a.error_count || 0));
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
    const fillOrder = [...new Set([
      dominantTier,
      'score0',
      'weak',
      'medium',
      'strong',
      'untested',
      'today',
    ].filter(Boolean))];
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

    // Load word-difficulty map once per request for per-token hint calculation
    const wordDiffMap = items.some(it => it.item_type === 'phrase')
      ? await getWordDiffMap()
      : null;

    // Set quizMode and generate choices / hints
    for (const item of items) {
      const score = item.score != null && item.score >= 0 ? item.score : 0;
      if (forListen) {
        item.quizMode = 'typing';
      } else if (item.just_unpaused) {
        item.quizMode = 'choice';
      } else {
        item.quizMode = getQuizMode(score, item.hint_count);
      }

      const display = item.word || item.phrase;
      const promptPeers = items.filter((peer) => peer !== item && peer.item_type === item.item_type);

      if (item.quizMode === 'choice' && !forListen) {
        const distractors = await fetchDistractors(item);
        const choices = buildChoices(item, distractors);
        if (choices) {
          item.choices = choices;
          item.promptMeaning = buildMeaningLabel(item, [item, ...distractors], { includeUsageHint: true });
        } else {
          // Not enough distractors → fall back to hint or typing
          item.quizMode = score >= 8 ? 'typing' : 'hint';
        }
      }

      if (item.quizMode === 'hint' && display) {
        // Only use per-token word lookup for phrases; words use their own difficulty
        const map = item.item_type === 'phrase' ? wordDiffMap : null;
        item.hintDisplay = generateHintDisplay(display, item.difficulty, map);
      }

      if (!item.promptMeaning) {
        item.promptMeaning = buildMeaningLabel(item, promptPeers, {
          includeUsageHint: item.quizMode !== 'choice' || !!item.context,
        });
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
