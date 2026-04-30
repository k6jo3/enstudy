const { getDb, saveDb } = require('./connection');
const fs = require('fs');
const path = require('path');
const words = require('../data/words');
const allPhrases = require('../data/phrases_all');
const grammarQuestions = require('../data/grammar');
const stories = require('../data/stories');
const storyTranslations = require('../data/stories-translations');
const gradedArticles = require('../data/graded-reading');

const CONTEXT_RESULTS_FILE = path.join(__dirname, '..', '..', 'context_results.json');

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

  // --- NEW: Remove words that no longer exist in data files (Cleanup Obsolete) ---
  const allWordKeys = new Set(words.map(w => w.word.toLowerCase()));
  const dbWords = db.exec('SELECT id, word FROM words');
  if (dbWords[0]) {
    let removedCount = 0;
    for (const row of dbWords[0].values) {
      if (!allWordKeys.has(row[1].toLowerCase())) {
        db.run('DELETE FROM words WHERE id = ?', [row[0]]);
        db.run('DELETE FROM learning_log WHERE item_type = ? AND item_id = ?', ['word', row[0]]);
        db.run('DELETE FROM word_mastery WHERE item_type = ? AND item_id = ?', ['word', row[0]]);
        db.run('DELETE FROM errors WHERE item_type = ? AND item_id = ?', ['word', row[0]]);
        db.run('DELETE FROM daily_sentences WHERE item_type = ? AND item_id = ?', ['word', row[0]]);
        removedCount++;
      }
    }
    if (removedCount > 0) console.log(`Removed ${removedCount} obsolete words from DB.`);
  }

  // Always sync word fields from data file so translation/example edits take effect
  const stmtWSync = db.prepare(`
    UPDATE words
    SET phonetic = ?, meaning = ?, part_of_speech = ?, difficulty = ?, example = ?, example_zh = ?, context = COALESCE(?, context)
    WHERE word = ?
  `);
  let wsCount = 0;
  for (const w of words) {
    stmtWSync.run([
      w.phonetic || null,
      w.meaning || null,
      w.pos || null,
      w.difficulty || 1,
      w.example || null,
      w.exampleZh || null,
      w.context || null,
      w.word,
    ]);
    wsCount++;
  }
  stmtWSync.free();
  if (wsCount > 0) console.log(`Synced ${wsCount} words from data file.`);

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

  // Remove phrases that no longer exist in data files
  const allPhraseKeys = new Set(allPhrases.map(p => p.phrase.toLowerCase()));
  const dbPhrases = db.exec('SELECT id, phrase FROM phrases');
  if (dbPhrases[0]) {
    let removedCount = 0;
    for (const row of dbPhrases[0].values) {
      if (!allPhraseKeys.has(row[1].toLowerCase())) {
        db.run('DELETE FROM phrases WHERE id = ?', [row[0]]);
        db.run('DELETE FROM learning_log WHERE item_type = ? AND item_id = ?', ['phrase', row[0]]);
        db.run('DELETE FROM word_mastery WHERE item_type = ? AND item_id = ?', ['phrase', row[0]]);
        db.run('DELETE FROM errors WHERE item_type = ? AND item_id = ?', ['phrase', row[0]]);
        db.run('DELETE FROM daily_sentences WHERE item_type = ? AND item_id = ?', ['phrase', row[0]]);
        removedCount++;
      }
    }
    if (removedCount > 0) console.log(`Removed ${removedCount} obsolete phrases from DB.`);
  }

  // Always sync phrase fields from data file so translation/example edits take effect
  const stmtPSync = db.prepare(`
    UPDATE phrases
    SET meaning = ?, example = ?, difficulty = ?, example_zh = ?, context = COALESCE(?, context)
    WHERE phrase = ?
  `);
  let psCount = 0;
  for (const p of allPhrases) {
    stmtPSync.run([
      p.meaning || null,
      p.example || null,
      p.difficulty || 1,
      p.exampleZh || null,
      p.context || null,
      p.phrase,
    ]);
    psCount++;
  }
  stmtPSync.free();
  if (psCount > 0) console.log(`Synced ${psCount} phrases from data file.`);

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

  // Graded reading articles
  const gradedCount = db.exec('SELECT COUNT(*) as cnt FROM graded_articles')[0]?.values[0][0] || 0;
  if (gradedCount < gradedArticles.length) {
    console.log(`Seeding graded articles (${gradedCount} existing, ${gradedArticles.length} total)...`);
    const stmtGA = db.prepare(
      'INSERT OR IGNORE INTO graded_articles (grade, article_order, title, topic, content, content_zh, vocabulary, phrases, grammar, questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    let gaCount = 0;
    for (const a of gradedArticles) {
      stmtGA.run([
        a.grade, a.order, a.title, a.topic, a.content,
        a.content_zh || null,
        JSON.stringify(a.vocabulary || []),
        JSON.stringify(a.phrases || []),
        JSON.stringify(a.grammar || []),
        JSON.stringify(a.questions || [])
      ]);
      gaCount++;
    }
    stmtGA.free();
    console.log(`Seeded ${gaCount} graded articles.`);
  }

  // Apply disambiguation contexts from context_results.json (generated by enrich_context.js)
  if (fs.existsSync(CONTEXT_RESULTS_FILE)) {
    const contextMap = JSON.parse(fs.readFileSync(CONTEXT_RESULTS_FILE, 'utf8'));
    const stmtWCtx = db.prepare('UPDATE words SET context = ? WHERE word = ? AND (context IS NULL OR context = \'\')');
    const stmtPCtx = db.prepare('UPDATE phrases SET context = ? WHERE phrase = ? AND (context IS NULL OR context = \'\')');
    const wordNames = new Set((db.exec('SELECT word FROM words')[0]?.values || []).map(r => r[0]));
    const phraseNames = new Set((db.exec('SELECT phrase FROM phrases')[0]?.values || []).map(r => r[0]));
    let ctxCount = 0;
    for (const [name, ctx] of Object.entries(contextMap)) {
      if (!ctx) continue;
      if (wordNames.has(name)) { stmtWCtx.run([ctx, name]); ctxCount++; }
      else if (phraseNames.has(name)) { stmtPCtx.run([ctx, name]); ctxCount++; }
    }
    stmtWCtx.free();
    stmtPCtx.free();
    if (ctxCount > 0) console.log(`Applied ${ctxCount} disambiguation contexts from context_results.json.`);
  }

  saveDb();
}

module.exports = { seedData };
