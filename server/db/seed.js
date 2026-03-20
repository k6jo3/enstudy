const { getDb, saveDb } = require('./connection');
const words = require('../data/words');
const phrases = require('../data/phrases');
const grammarQuestions = require('../data/grammar');

async function seedData() {
  const db = await getDb();

  const wordCount = db.exec('SELECT COUNT(*) as cnt FROM words')[0]?.values[0][0] || 0;
  if (wordCount === 0) {
    console.log('Seeding words...');
    const seen = new Set();
    const stmt = db.prepare('INSERT INTO words (word, phonetic, meaning, part_of_speech, difficulty, example) VALUES (?, ?, ?, ?, ?, ?)');
    let count = 0;
    for (const w of words) {
      const key = w.word.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      stmt.run([w.word, w.phonetic, w.meaning, w.pos, w.difficulty, w.example]);
      count++;
    }
    stmt.free();
    console.log(`Seeded ${count} words.`);
  }

  const phraseCount = db.exec('SELECT COUNT(*) as cnt FROM phrases')[0]?.values[0][0] || 0;
  if (phraseCount === 0) {
    console.log('Seeding phrases...');
    const seenPhrases = new Set();
    const stmtP = db.prepare('INSERT INTO phrases (phrase, meaning, example, difficulty) VALUES (?, ?, ?, ?)');
    let pCount = 0;
    for (const p of phrases) {
      const key = p.phrase.toLowerCase();
      if (seenPhrases.has(key)) continue;
      seenPhrases.add(key);
      stmtP.run([p.phrase, p.meaning, p.example, p.difficulty]);
      pCount++;
    }
    stmtP.free();
    console.log(`Seeded ${pCount} phrases.`);
  }

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

  saveDb();
}

module.exports = { seedData };
