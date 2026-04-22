const authoredDialogues = require('../data/authored-dialogues');
const staticDialogues = require('../data/static-dialogues');
const geminiService = require('./gemini-service');

const GENERATOR_VERSION = 18;

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFromPool(pool, seed) {
  return pool[hashString(seed) % pool.length];
}

function normalizeSpacing(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function normalizeLookupKey(text) {
  return normalizeSpacing(text).toLowerCase();
}

function quoteText(text) {
  const value = normalizeSpacing(text);
  if (!value) return '';
  return /[.?!]$/.test(value) ? value : `${value}.`;
}

function normalizeLines(lines) {
  return (lines || [])
    .map((entry, index) => ({
      speaker: entry.speaker || (index % 2 === 0 ? 'A' : 'B'),
      text: quoteText(entry.text),
      zh: normalizeSpacing(entry.zh),
    }))
    .filter((entry) => entry.text);
}

function getCollection(itemType, source) {
  return itemType === 'word' ? source.words : source.phrases;
}

function pickAuthoredDialogue(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const pool = getCollection(itemType, authoredDialogues)[normalizeLookupKey(label)] || [];
  if (!pool.length) return null;
  return normalizeLines(pickFromPool(pool, `${itemType}:${item.id}:authored-dialogue`));
}

function getStaticDialogue(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const record = getCollection(itemType, staticDialogues)[normalizeLookupKey(label)];
  if (!record) return null;
  return {
    family: record.family || 'compiled-static-dialogue',
    lines: normalizeLines(record.lines),
  };
}

function createFallbackDialogue(item, itemType) {
  const example = quoteText(item.example || item.example_zh || 'Example unavailable');
  const exampleZh = normalizeSpacing(item.exampleZh || item.example_zh || '目前還沒有可用例句。');
  return {
    family: 'fallback-static-dialogue',
    lines: normalizeLines([
      { speaker: 'A', text: example, zh: exampleZh },
      { speaker: 'B', text: 'Good to know.', zh: '知道了。' },
    ]),
  };
}

async function createDialogue(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const authoredLines = pickAuthoredDialogue(item, itemType);
  if (authoredLines) {
    return {
      templateVersion: GENERATOR_VERSION,
      templateFamily: 'authored-static-dialogue',
      lines: authoredLines,
      highlightWords: [label],
      type: itemType,
      itemType,
      itemId: item.id,
    };
  }

  // 優先使用 Gemini CLI 生成自然對話
  try {
    const aiResult = await geminiService.generateDialogue(item, itemType);
    return {
      templateVersion: GENERATOR_VERSION,
      templateFamily: 'gemini-generated',
      lines: aiResult.lines,
      highlightWords: [label],
      type: itemType,
      itemType,
      itemId: item.id,
    };
  } catch (err) {
    console.warn(`[sentence-generator] Gemini failed for "${label}", falling back to static:`, err.message);
  }

  // Gemini 失敗時才使用靜態模板
  const staticDialogue = getStaticDialogue(item, itemType);
  if (staticDialogue) {
    return {
      templateVersion: GENERATOR_VERSION,
      templateFamily: staticDialogue.family,
      lines: staticDialogue.lines,
      highlightWords: [label],
      type: itemType,
      itemType,
      itemId: item.id,
    };
  }

  const fallback = createFallbackDialogue(item, itemType);
  return {
    templateVersion: GENERATOR_VERSION,
    templateFamily: fallback.family,
    lines: fallback.lines,
    highlightWords: [label],
    type: itemType,
    itemType,
    itemId: item.id,
  };
}

async function generateDialogues(words, phrases) {
  const items = [
    ...words.map((item) => ({ item, itemType: 'word' })),
    ...phrases.map((item) => ({ item, itemType: 'phrase' })),
  ];
  const results = [];
  for (const { item, itemType } of items) {
    results.push(await createDialogue(item, itemType));
  }
  return results;
}

// 純靜態版本（authored → static → fallback），不呼叫 Gemini，立即回傳
function createStaticDialogue(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const authoredLines = pickAuthoredDialogue(item, itemType);
  if (authoredLines) {
    return {
      templateVersion: GENERATOR_VERSION,
      templateFamily: 'authored-static-dialogue',
      lines: authoredLines,
      highlightWords: [label],
      type: itemType,
      itemType,
      itemId: item.id,
    };
  }
  const staticDialogue = getStaticDialogue(item, itemType);
  if (staticDialogue) {
    return {
      templateVersion: GENERATOR_VERSION,
      templateFamily: staticDialogue.family,
      lines: staticDialogue.lines,
      highlightWords: [label],
      type: itemType,
      itemType,
      itemId: item.id,
    };
  }
  const fallback = createFallbackDialogue(item, itemType);
  return {
    templateVersion: GENERATOR_VERSION,
    templateFamily: fallback.family,
    lines: fallback.lines,
    highlightWords: [label],
    type: itemType,
    itemType,
    itemId: item.id,
  };
}

function generateStaticDialogues(words, phrases) {
  return [
    ...words.map((item) => createStaticDialogue(item, 'word')),
    ...phrases.map((item) => createStaticDialogue(item, 'phrase')),
  ];
}

module.exports = {
  GENERATOR_VERSION,
  generateDialogues,
  generateStaticDialogues,
};
