/**
 * Generate disambiguation context for words/phrases that share overlapping meanings.
 * Phase 1: generate contexts via Gemini → context_results.json
 * Phase 2: UPDATE words/phrases in the DB directly
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getDb, saveDb } = require('./server/db/connection');

const RESULTS_FILE = path.join(__dirname, 'context_results.json');
const BATCH_SIZE = 10;

const SKIP = new Set([
  'one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty',
  'thirty','forty','fifty','sixty','seventy','eighty','ninety','zero','hundred','thousand','million',
  'red','blue','green','yellow','black','white','pink','brown','orange','purple','grey','gray',
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday',
  'january','february','march','april','may','june','july','august','september','october','november','december',
]);
const BASIC = new Set([
  'come','go','give','take','put','get','set','run','make','turn','show','find','stop','help','bring',
  'say','tell','keep','hold','stand','fall','call','see','know','want','use','feel','think','try',
]);

function splitVariants(meaning) {
  if (!meaning) return [];
  return String(meaning).split(/[;；]/)
    .map(s => s.trim().replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').replace(/\s+/g, ''))
    .filter(x => x.length >= 2);
}

function areSameRoot(a, b) {
  const suffixes = ['tion','sion','ment','ance','ence','ness','ity','ize','ise','al','ing','ed','er','or','ful','ly','ive','ary'];
  const stems = w => {
    const lower = w.toLowerCase().replace(/[-\s]/g, '');
    const r = [lower];
    for (const s of suffixes) if (lower.endsWith(s)) r.push(lower.slice(0, -s.length));
    return r;
  };
  const aStems = stems(a);
  const bLower = b.toLowerCase().replace(/[-\s]/g, '');
  return aStems.some(stem => stem.length >= 4 && (bLower.startsWith(stem) || stem.startsWith(bLower.slice(0, Math.max(4, bLower.length - 3)))));
}

function runGemini(stdinData, instruction) {
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell', [
      '-NoProfile', '-NonInteractive', '-Command',
      `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; $input | gemini --skip-trust -p "${instruction.replace(/"/g, '`"')}" -o text`,
    ], { windowsHide: true, cwd: __dirname });
    let stdout = '', stderr = '';
    proc.stdout.setEncoding('utf8'); proc.stderr.setEncoding('utf8');
    proc.stdout.on('data', d => { stdout += d; });
    proc.stderr.on('data', d => { stderr += d; });
    proc.on('close', code => {
      if (code !== 0) reject(new Error(`exit ${code}: ${stderr.trim()}`));
      else resolve(stdout.trim());
    });
    proc.on('error', err => reject(err));
    proc.stdin.write(stdinData, 'utf8');
    proc.stdin.end();
  });
}

const INSTRUCTION = '以下是有意思衝突的英文字組（每項列出該字、意思、以及容易混淆的近義詞）。請為每個字提供一段簡短的繁體中文情境說明（6~20字），幫助學習者區分與近義詞的差異。規則：1.只寫最關鍵的區別，例如正式/非正式、使用場合、語氣強弱、特定對象 2.可以用「比 xxx 更...」或「專指...」格式，或直接說明用法特色 3.只輸出 JSON 陣列，格式：[{"word":"xxx","context":"yyy"}]，不加說明或 markdown。';

async function main() {
  const db = await getDb();

  const wRes = db.exec('SELECT id, word, meaning, context FROM words WHERE (context IS NULL OR context = "")');
  const pRes = db.exec('SELECT id, phrase, meaning, context FROM phrases WHERE (context IS NULL OR context = "")');
  const words = (wRes[0]?.values || [])
    .map(([id, w, m]) => ({ id, name: w, meaning: m, type: 'word' }))
    .filter(x => !SKIP.has(x.name?.toLowerCase()) && !BASIC.has(x.name?.toLowerCase()) && x.meaning);
  const phrases = (pRes[0]?.values || [])
    .map(([id, p, m]) => ({ id, name: p, meaning: m, type: 'phrase' }))
    .filter(x => x.meaning);
  const all = [...words, ...phrases];

  // Build conflict map
  const conflictMap = new Map();
  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    const aV = splitVariants(a.meaning);
    const aSet = new Set(aV);
    if (!aV.length) continue;
    for (let j = i + 1; j < all.length; j++) {
      const b = all[j];
      if (a.type === 'word' && b.type === 'word' && areSameRoot(a.name, b.name)) continue;
      const bV = splitVariants(b.meaning);
      if (!bV.length) continue;
      const overlap = bV.filter(v => aSet.has(v));
      const sameP = aV[0] === bV[0];
      const primaryConflict = aSet.has(bV[0]) || new Set(bV).has(aV[0]);
      if (sameP || overlap.length >= 2 || (overlap.length >= 1 && primaryConflict)) {
        if (!conflictMap.has(a.name)) conflictMap.set(a.name, new Set());
        if (!conflictMap.has(b.name)) conflictMap.set(b.name, new Set());
        conflictMap.get(a.name).add(b.name);
        conflictMap.get(b.name).add(a.name);
      }
    }
  }

  const nameToItem = new Map(all.map(x => [x.name, x]));
  const todo = [...conflictMap.keys()].filter(name => nameToItem.has(name));
  console.log(`Items needing context: ${todo.length}`);

  let existing = {};
  if (fs.existsSync(RESULTS_FILE)) {
    existing = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  }
  const remaining = todo.filter(name => !(name in existing));
  console.log(`Already done: ${todo.length - remaining.length}, remaining: ${remaining.length}`);

  const batches = [];
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) batches.push(remaining.slice(i, i + BATCH_SIZE));
  console.log(`Batches: ${batches.length}\n`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const lines = batch.map(name => {
      const item = nameToItem.get(name);
      const conflicts = [...(conflictMap.get(name) || [])].slice(0, 3).join('、');
      return `${name}（意思：${item.meaning}；易混淆：${conflicts}）`;
    }).join('\n');

    const preview = batch.slice(0, 4).join(', ');
    process.stdout.write(`[${i+1}/${batches.length}] ${preview}... `);

    try {
      const raw = await runGemini(lines, INSTRUCTION);
      const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const results = JSON.parse(jsonText);
      for (const r of results) {
        if (r.word && r.context) existing[r.word] = r.context;
      }
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
      console.log(`✓ (${results.length})`);
    } catch (e) {
      console.log(`✗ ${e.message.substring(0, 80)}`);
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
    }

    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nContext generation done! Total: ${Object.keys(existing).length}`);
  console.log('Applying to DB...\n');

  // Apply to DB
  let wordUpdates = 0, phraseUpdates = 0;
  for (const [name, context] of Object.entries(existing)) {
    const item = nameToItem.get(name);
    if (!item) continue;
    const safeCtx = context.replace(/'/g, "''");
    if (item.type === 'word') {
      db.run(`UPDATE words SET context = '${safeCtx}' WHERE word = '${name.replace(/'/g, "''")}' AND (context IS NULL OR context = '')`);
      wordUpdates++;
    } else {
      db.run(`UPDATE phrases SET context = '${safeCtx}' WHERE phrase = '${name.replace(/'/g, "''")}' AND (context IS NULL OR context = '')`);
      phraseUpdates++;
    }
  }

  await saveDb();
  console.log(`DB updated: ${wordUpdates} words, ${phraseUpdates} phrases.`);
  console.log('Done!');
}

main().catch(console.error);
