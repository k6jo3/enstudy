const words = require('../data/words');
const phrases = require('../data/phrases_all');

function parseArgs(argv) {
  const opts = {
    json: false,
    limit: 50,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    if (arg === '--limit' && argv[i + 1]) {
      const value = Number(argv[i + 1]);
      if (Number.isFinite(value) && value > 0) opts.limit = value;
      i++;
    }
  }

  return opts;
}

function normalizeMeaning(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function normalizeSurface(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[\s-]+/g, '')
    .trim();
}

function meaningTokens(text) {
  return String(text || '')
    .replace(/[()]/g, '')
    .split(/[；;/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function makeWordItem(entry) {
  return {
    itemType: 'word',
    text: entry.word,
    meaning: entry.meaning || '',
    pos: entry.pos || '',
    difficulty: entry.difficulty || 1,
    hasContext: Boolean(entry.context),
    normalizedText: normalizeSurface(entry.word),
    normalizedMeaning: normalizeMeaning(entry.meaning),
    meaningTokens: meaningTokens(entry.meaning),
  };
}

function makePhraseItem(entry) {
  return {
    itemType: 'phrase',
    text: entry.phrase,
    meaning: entry.meaning || '',
    pos: '',
    difficulty: entry.difficulty || 1,
    hasContext: Boolean(entry.context),
    normalizedText: normalizeSurface(entry.phrase),
    normalizedMeaning: normalizeMeaning(entry.meaning),
    meaningTokens: meaningTokens(entry.meaning),
  };
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function sortItemViews(items) {
  return items
    .slice()
    .sort((a, b) => (a.itemType + a.text).localeCompare(b.itemType + b.text, undefined, { numeric: true }))
    .map((item) => ({
      type: item.itemType,
      text: item.text,
      pos: item.pos,
      difficulty: item.difficulty,
      meaning: item.meaning,
      hasContext: item.hasContext,
    }));
}

function summarizeGroup(kind, key, label, items) {
  const missing = items.filter((item) => !item.hasContext);
  return {
    kind,
    key,
    label,
    total: items.length,
    missingCount: missing.length,
    hasWord: items.some((item) => item.itemType === 'word'),
    hasPhrase: items.some((item) => item.itemType === 'phrase'),
    minDifficulty: Math.min(...items.map((item) => item.difficulty || 1)),
    items: sortItemViews(items),
  };
}

function buildMeaningGroups(wordItems, phraseItems) {
  const all = [...wordItems, ...phraseItems];
  const grouped = groupBy(all, (item) => item.normalizedMeaning);
  return [...grouped.entries()]
    .map(([key, items]) => summarizeGroup('exact_meaning', key, items[0]?.meaning || '', items))
    .filter((group) => group.total > 1 && group.missingCount > 0);
}

function buildSurfaceOverlapGroups(wordItems, phraseItems) {
  const wordMap = groupBy(wordItems, (item) => item.normalizedText);
  const phraseMap = groupBy(phraseItems, (item) => item.normalizedText);
  const keys = [...wordMap.keys()].filter((key) => phraseMap.has(key));

  return keys
    .map((key) => summarizeGroup('surface_overlap', key, key, [...wordMap.get(key), ...phraseMap.get(key)]))
    .filter((group) => group.missingCount > 0);
}

function sharedMeaningToken(a, b) {
  return a.meaningTokens.some((token) => token && b.meaningTokens.includes(token));
}

function buildNearMeaningWordGroups(wordItems) {
  const pairs = [];
  for (let i = 0; i < wordItems.length; i++) {
    const a = wordItems[i];
    if (a.hasContext) continue;
    for (let j = i + 1; j < wordItems.length; j++) {
      const b = wordItems[j];
      if (!sharedMeaningToken(a, b)) continue;
      if (a.normalizedMeaning === b.normalizedMeaning) continue;
      const tokens = [...new Set(a.meaningTokens.filter((token) => b.meaningTokens.includes(token)))];
      if (tokens.length === 0) continue;
      pairs.push(summarizeGroup('near_meaning_word_pair', `${a.text}::${b.text}`, tokens.join(' / '), [a, b]));
    }
  }
  return pairs.filter((group) => group.missingCount > 0);
}

function suffixRoot(text) {
  const lower = String(text || '').toLowerCase();
  const suffixes = [
    'ization',
    'isation',
    'ation',
    'ition',
    'tion',
    'ment',
    'ness',
    'ance',
    'ence',
    'ing',
    'ize',
    'ise',
    'ify',
    'ed',
    'er',
    'or',
  ];
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && lower.length > suffix.length + 2) {
      return lower.slice(0, -suffix.length);
    }
  }
  return lower;
}

function buildWordFamilyGroups(wordItems) {
  const grouped = groupBy(wordItems, (item) => suffixRoot(item.text));
  return [...grouped.entries()]
    .map(([key, items]) => summarizeGroup('word_family', key, key, items))
    .filter((group) => group.total > 1 && group.missingCount > 0);
}

function isProbablyRequiredNearMeaning(group) {
  if (group.items.length !== 2) return false;

  const [a, b] = group.items;
  const samePos = a.pos && b.pos && a.pos === b.pos;
  const bothSimpleWords = !a.text.includes(' ') && !b.text.includes(' ');
  const labels = group.label.split(' / ').filter(Boolean);
  const genericLabels = new Set(['動詞', '名詞', '形容詞', '副詞', '片語', '短語']);
  const hasGenericOnlyLabels = labels.every((label) => genericLabels.has(label));
  const hasPartOfSpeechNoise =
    a.meaning.includes('名詞/動詞') ||
    b.meaning.includes('名詞/動詞') ||
    a.meaning.includes('(名詞/動詞)') ||
    b.meaning.includes('(名詞/動詞)');

  return samePos && bothSimpleWords && labels.length > 0 && !hasGenericOnlyLabels && !hasPartOfSpeechNoise;
}

function isProbablyRequiredWordFamily(group) {
  if (group.items.length !== 2) return false;

  const [a, b] = group.items;
  const nounVerbPair =
    (a.pos === 'n' && b.pos === 'v') ||
    (a.pos === 'v' && b.pos === 'n') ||
    (a.pos === 'adj' && b.pos === 'n') ||
    (a.pos === 'n' && b.pos === 'adj');

  if (!nounVerbPair) return false;

  const aRoot = suffixRoot(a.text);
  const bRoot = suffixRoot(b.text);

  return aRoot === bRoot && aRoot.length >= 4;
}

function classifyGroups(report) {
  const required = [];
  const optional = [];
  const skip = [];

  for (const group of report.exactMeaningGroups) {
    required.push({ ...group, classification: 'required' });
  }

  for (const group of report.surfaceOverlapGroups) {
    required.push({ ...group, classification: 'required' });
  }

  for (const group of report.nearMeaningWordPairs) {
    if (isProbablyRequiredNearMeaning(group)) {
      required.push({ ...group, classification: 'required' });
    } else {
      optional.push({ ...group, classification: 'optional' });
    }
  }

  for (const group of report.wordFamilyGroups) {
    if (isProbablyRequiredWordFamily(group)) {
      required.push({ ...group, classification: 'required' });
    } else {
      skip.push({ ...group, classification: 'skip' });
    }
  }

  return { required, optional, skip };
}

function sortGroups(groups) {
  return groups.sort((a, b) => {
    if (b.missingCount !== a.missingCount) return b.missingCount - a.missingCount;
    if (b.total !== a.total) return b.total - a.total;
    if (a.minDifficulty !== b.minDifficulty) return a.minDifficulty - b.minDifficulty;
    return a.label.localeCompare(b.label, undefined, { numeric: true });
  });
}

function printSection(title, groups, limit) {
  console.log(`${title} (${Math.min(limit, groups.length)}):`);
  for (const group of groups.slice(0, limit)) {
    const items = group.items
      .map((item) => `${item.type}:${item.text}${item.hasContext ? '' : ' [no-context]'} => ${item.meaning}`)
      .join(' | ');
    console.log(`- ${group.label} :: ${items}`);
  }
  console.log('');
}

function printTextReport(report, limit) {
  console.log(`Word entries: ${report.summary.wordCount}`);
  console.log(`Phrase entries: ${report.summary.phraseCount}`);
  console.log(`Words missing context: ${report.summary.wordMissingContext}`);
  console.log(`Phrases missing context: ${report.summary.phraseMissingContext}`);
  console.log('');
  console.log(`Required groups remaining: ${report.summary.requiredGroups}`);
  console.log(`Optional groups remaining: ${report.summary.optionalGroups}`);
  console.log(`Skip groups remaining: ${report.summary.skipGroups}`);
  console.log('');
  console.log(`Required exact-meaning groups: ${report.summary.exactMeaningGroups}`);
  console.log(`Required surface-overlap groups: ${report.summary.surfaceOverlapGroups}`);
  console.log(`Optional near-meaning word pairs: ${report.summary.nearMeaningWordPairs}`);
  console.log(`Skip word-family groups: ${report.summary.wordFamilyGroups}`);
  console.log('');

  printSection('Top required groups', report.requiredGroups, limit);
  printSection('Top optional groups', report.optionalGroups, limit);
  printSection('Top skip groups', report.skipGroups, limit);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const wordItems = words.map(makeWordItem);
  const phraseItems = phrases.map(makePhraseItem);

  const rawReport = {
    exactMeaningGroups: sortGroups(buildMeaningGroups(wordItems, phraseItems)),
    surfaceOverlapGroups: sortGroups(buildSurfaceOverlapGroups(wordItems, phraseItems)),
    nearMeaningWordPairs: sortGroups(buildNearMeaningWordGroups(wordItems)),
    wordFamilyGroups: sortGroups(buildWordFamilyGroups(wordItems)),
  };

  const classified = classifyGroups(rawReport);

  const report = {
    summary: {
      wordCount: wordItems.length,
      phraseCount: phraseItems.length,
      wordMissingContext: wordItems.filter((item) => !item.hasContext).length,
      phraseMissingContext: phraseItems.filter((item) => !item.hasContext).length,
      requiredGroups: classified.required.length,
      optionalGroups: classified.optional.length,
      skipGroups: classified.skip.length,
      exactMeaningGroups: rawReport.exactMeaningGroups.length,
      surfaceOverlapGroups: rawReport.surfaceOverlapGroups.length,
      nearMeaningWordPairs: rawReport.nearMeaningWordPairs.length,
      wordFamilyGroups: rawReport.wordFamilyGroups.length,
    },
    requiredGroups: sortGroups(classified.required),
    optionalGroups: sortGroups(classified.optional),
    skipGroups: sortGroups(classified.skip),
  };

  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  printTextReport(report, opts.limit);
}

main();
