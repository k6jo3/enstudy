const { getDb, saveDb } = require('./connection');
const words = require('../data/words');
const phrases = require('../data/phrases');
const phrases2 = require('../data/phrases2');
const phrases3 = require('../data/phrases3');
const phrases4 = require('../data/phrases4');
const grammarQuestions = require('../data/grammar');
const stories = require('../data/stories');
const storyTranslations = require('../data/stories-translations');

const allPhrases = [...phrases, ...phrases2, ...phrases3, ...phrases4];

async function seedData() {
  const db = await getDb();

  // Incremental word seeding — INSERT OR IGNORE handles duplicates
  const wordCount = db.exec('SELECT COUNT(*) as cnt FROM words')[0]?.values[0][0] || 0;
  if (wordCount < words.length) {
    console.log(`Seeding words (${wordCount} existing, ${words.length} total)...`);
    const seen = new Set();
    // Build set of existing words to avoid prepare/run overhead
    if (wordCount > 0) {
      const existing = db.exec('SELECT word FROM words');
      if (existing[0]) {
        for (const row of existing[0].values) {
          seen.add(row[0].toLowerCase());
        }
      }
    }
    const stmt = db.prepare('INSERT OR IGNORE INTO words (word, phonetic, meaning, part_of_speech, difficulty, example) VALUES (?, ?, ?, ?, ?, ?)');
    let count = 0;
    for (const w of words) {
      const key = w.word.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      stmt.run([w.word, w.phonetic, w.meaning, w.pos, w.difficulty, w.example]);
      count++;
    }
    stmt.free();
    console.log(`Seeded ${count} new words (total now: ${wordCount + count}).`);
  }

  // Update words with example_zh translations
  const stmtWZh = db.prepare('UPDATE words SET example_zh = ? WHERE word = ? AND (example_zh IS NULL OR example_zh = \'\')');
  let wzCount = 0;
  for (const w of words) {
    if (w.exampleZh) {
      stmtWZh.run([w.exampleZh, w.word]);
      wzCount++;
    }
  }
  stmtWZh.free();
  if (wzCount > 0) console.log(`Updated ${wzCount} words with example_zh.`);

  // Incremental phrase seeding
  const phraseCount = db.exec('SELECT COUNT(*) as cnt FROM phrases')[0]?.values[0][0] || 0;
  if (phraseCount < allPhrases.length) {
    console.log(`Seeding phrases (${phraseCount} existing, ${allPhrases.length} total)...`);
    const seenPhrases = new Set();
    if (phraseCount > 0) {
      const existing = db.exec('SELECT phrase FROM phrases');
      if (existing[0]) {
        for (const row of existing[0].values) {
          seenPhrases.add(row[0].toLowerCase());
        }
      }
    }
    const stmtP = db.prepare('INSERT OR IGNORE INTO phrases (phrase, meaning, example, difficulty) VALUES (?, ?, ?, ?)');
    let pCount = 0;
    for (const p of allPhrases) {
      const key = p.phrase.toLowerCase();
      if (seenPhrases.has(key)) continue;
      seenPhrases.add(key);
      stmtP.run([p.phrase, p.meaning, p.example, p.difficulty]);
      pCount++;
    }
    stmtP.free();
    console.log(`Seeded ${pCount} new phrases (total now: ${phraseCount + pCount}).`);
  }

  // Update phrases with example_zh translations
  const stmtPZh = db.prepare('UPDATE phrases SET example_zh = ? WHERE phrase = ? AND (example_zh IS NULL OR example_zh = \'\')');
  let pzCount = 0;
  for (const p of allPhrases) {
    if (p.exampleZh) {
      stmtPZh.run([p.exampleZh, p.phrase]);
      pzCount++;
    }
  }
  stmtPZh.free();
  if (pzCount > 0) console.log(`Updated ${pzCount} phrases with example_zh.`);

  // Grammar questions
  const grammarCount = db.exec('SELECT COUNT(*) as cnt FROM grammar_questions')[0]?.values[0][0] || 0;
  if (grammarCount === 0) {
    console.log('Seeding grammar questions...');
    const stmtG = db.prepare(
      'INSERT INTO grammar_questions (topic, sentence, options, answer, explanation, grammar_point, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    let gCount = 0;
    for (const q of grammarQuestions) {
      stmtG.run([q.topic, q.sentence, JSON.stringify(q.options), q.answer, q.explanation, q.grammar_point, q.difficulty]);
      gCount++;
    }
    stmtG.free();
    console.log(`Seeded ${gCount} grammar questions.`);
  }

  // Stories
  const storyCount = db.exec('SELECT COUNT(*) as cnt FROM stories')[0]?.values[0][0] || 0;
  if (storyCount < stories.length) {
    console.log(`Seeding stories (${storyCount} existing, ${stories.length} total)...`);
    const stmtS = db.prepare(
      'INSERT OR IGNORE INTO stories (series, series_name, episode, title, content, vocabulary, vocab_meanings, questions, difficulty, sort_order, content_zh, grammar_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    let sCount = 0;
    for (const s of stories) {
      stmtS.run([
        s.series, s.seriesName, s.episode, s.title, s.content,
        JSON.stringify(s.vocabulary || []),
        JSON.stringify(s.vocabMeanings || {}),
        JSON.stringify(s.questions || []),
        s.difficulty || 2, s.sort_order || s.id || 0,
        s.contentZh || null,
        JSON.stringify(s.grammarNotes || null)
      ]);
      sCount++;
    }
    stmtS.free();
    console.log(`Seeded ${sCount} stories.`);
  }

  // Always update stories with latest translations and grammar notes from translations file
  const stmtUpdate = db.prepare('UPDATE stories SET content_zh = ?, grammar_notes = ? WHERE id = ?');
  let tCount = 0;
  for (const s of stories) {
    const trans = storyTranslations[s.id];
    if (trans && trans.contentZh) {
      stmtUpdate.run([trans.contentZh, JSON.stringify(trans.grammarNotes || null), s.id]);
      tCount++;
    }
  }
  stmtUpdate.free();
  if (tCount > 0) console.log(`Updated ${tCount} stories with translations.`);

  saveDb();
}

module.exports = { seedData };
