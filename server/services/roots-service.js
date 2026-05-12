const { queryAll, queryOne, run } = require('../db/helpers');
const { saveDb } = require('../db/connection');

function parseRoots(roots_json) {
  if (!roots_json) return [];
  try { return JSON.parse(roots_json); } catch { return []; }
}

async function getAllRoots() {
  const words = await queryAll(
    'SELECT id, word, meaning FROM words WHERE roots_json IS NOT NULL AND roots_json != "[]"'
  );
  // Also grab roots_json separately to avoid large column in list
  const withRoots = await queryAll(
    'SELECT id, roots_json FROM words WHERE roots_json IS NOT NULL AND roots_json != "[]"'
  );
  const rootsJsonMap = {};
  for (const r of withRoots) rootsJsonMap[r.id] = parseRoots(r.roots_json);

  const rootMap = new Map();
  for (const w of words) {
    const roots = rootsJsonMap[w.id] || [];
    for (const r of roots) {
      if (!r.root) continue;
      if (!rootMap.has(r.root)) {
        rootMap.set(r.root, { root: r.root, meaning_zh: r.meaning_zh, origin: r.origin, words: [] });
      }
      rootMap.get(r.root).words.push({ id: w.id, word: w.word, meaning: w.meaning });
    }
  }

  return Array.from(rootMap.values()).sort((a, b) => a.root.localeCompare(b.root));
}

async function getWordsByRoot(root) {
  const rows = await queryAll(
    'SELECT id, word, meaning, phonetic, part_of_speech, roots_json FROM words WHERE roots_json LIKE ?',
    [`%"root":"${root}"%`]
  );
  return rows.map(w => ({ ...w, roots: parseRoots(w.roots_json) }));
}

async function getRootsStats() {
  const withRoots = await queryAll(
    'SELECT COUNT(*) as cnt FROM words WHERE roots_json IS NOT NULL AND roots_json != "[]"'
  );
  const total = await queryAll('SELECT COUNT(*) as cnt FROM words');
  const rootRows = await queryAll(
    'SELECT roots_json FROM words WHERE roots_json IS NOT NULL AND roots_json != "[]"'
  );
  const rootSet = new Set();
  for (const r of rootRows) {
    for (const root of parseRoots(r.roots_json)) rootSet.add(root.root);
  }
  return {
    totalRoots: rootSet.size,
    wordsWithRoots: withRoots[0]?.cnt || 0,
    totalWords: total[0]?.cnt || 0,
  };
}

function shuffleArr(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickDistractors(allRoots, targetRoot, field, count) {
  const pool = allRoots.filter(r => r.root !== targetRoot.root && r[field] !== targetRoot[field]);
  return shuffleArr(pool).slice(0, count).map(r => r[field]);
}

function pickWordDistractors(allRoots, targetRoot, count) {
  const pool = allRoots.filter(r => r.root !== targetRoot.root && r.words.length > 0);
  const result = [];
  for (const r of shuffleArr(pool)) {
    if (result.length >= count) break;
    const w = r.words[Math.floor(Math.random() * r.words.length)];
    if (!result.includes(w.word)) result.push(w.word);
  }
  return result;
}

async function getQuizQuestions(count = 10) {
  const allRoots = await getAllRoots();
  if (allRoots.length < 4) return [];

  const pool = shuffleArr(allRoots.filter(r => r.words.length > 0));
  const questions = [];

  for (let i = 0; i < pool.length && questions.length < count; i++) {
    const target = pool[i];
    const qType = i % 3;

    if (qType === 0) {
      // Root → meaning
      const distractors = pickDistractors(allRoots, target, 'meaning_zh', 3);
      if (distractors.length < 3) continue;
      questions.push({
        type: 'root_meaning',
        question: `「${target.root}-」這個詞根的意思是？`,
        root: target.root,
        origin: target.origin,
        correct: target.meaning_zh,
        options: shuffleArr([target.meaning_zh, ...distractors]),
      });
    } else if (qType === 1) {
      // Word → which root meaning
      const word = target.words[Math.floor(Math.random() * target.words.length)];
      const distractors = pickDistractors(allRoots, target, 'meaning_zh', 3);
      if (distractors.length < 3) continue;
      questions.push({
        type: 'word_root',
        question: `「${word.word}」中包含「${target.root}-」，這個詞根的意思是？`,
        word: word.word,
        root: target.root,
        origin: target.origin,
        correct: target.meaning_zh,
        options: shuffleArr([target.meaning_zh, ...distractors]),
      });
    } else {
      // Root meaning → find word
      const correctWord = target.words[Math.floor(Math.random() * target.words.length)];
      const distractorWords = pickWordDistractors(allRoots, target, 3);
      if (distractorWords.length < 3) continue;
      questions.push({
        type: 'find_word',
        question: `哪個單字含有「${target.meaning_zh} (${target.root}-)」這個詞根？`,
        root: target.root,
        correct: correctWord.word,
        options: shuffleArr([correctWord.word, ...distractorWords]),
      });
    }
  }

  return questions;
}

async function seedEtymology(etymologyData) {
  let count = 0;
  for (const [word, roots] of Object.entries(etymologyData)) {
    const rootsJson = roots && roots.length > 0 ? JSON.stringify(roots) : null;
    await run('UPDATE words SET roots_json = ? WHERE LOWER(word) = LOWER(?)', [rootsJson, word]);
    count++;
  }
  saveDb();
  console.log(`Etymology seeded for ${count} words.`);
}

module.exports = { getAllRoots, getWordsByRoot, getRootsStats, getQuizQuestions, seedEtymology };
