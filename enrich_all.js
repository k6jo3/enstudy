/**
 * Enrich meanings for ALL words not yet in enrich_results.json.
 * Supports resume — safe to restart if interrupted.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getDb } = require('./server/db/connection');

const BATCH_SIZE = 25;
const RESULTS_FILE = path.join(__dirname, 'enrich_results.json');

const SKIP_WORDS = new Set([
  'one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve',
  'thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty',
  'thirty','forty','fifty','sixty','seventy','eighty','ninety',
  'zero','hundred','thousand','million','billion',
  'red','blue','green','yellow','black','white','pink','brown','orange','purple','grey','gray',
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday',
  'january','february','march','april','may','june','july','august',
  'september','october','november','december',
]);

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
    proc.stdin.write(stdinData, 'utf8'); proc.stdin.end();
  });
}

const INSTRUCTION = '以下是英文單字列表，每個附詞性與現有中文意思。請為每個單字提供完整的繁體中文意思，規則：1.涵蓋所有常用詞性的重要意思（例如 back 應包含名詞「背部；後面」也要包含副詞「向後」與動詞「支持；返回」）2.意思用「；」分隔，按常用度排序，不超過5個 3.嚴格禁止重複同義詞（如「跑；跑步」只寫「跑」，「左邊；左方」只寫「左邊」）4.形容詞不加「的」後綴（用「第一」不用「第一的」）5.動詞不加「…」或其他修飾 6.只輸出 JSON 陣列，格式：[{"word":"xxx","meaning":"yyy"}]，不加任何說明或 markdown。';

async function main() {
  const db = await getDb();
  const res = db.exec('SELECT id, word, meaning, part_of_speech FROM words ORDER BY id');
  const allWords = res[0].values.map(([id, word, meaning, pos]) => ({ id, word, meaning: meaning || '', pos: pos || 'n' }));
  console.log(`Total words in DB: ${allWords.length}`);

  // Load existing results
  let existing = {};
  if (fs.existsSync(RESULTS_FILE)) {
    existing = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  }
  console.log(`Already enriched: ${Object.keys(existing).length}`);

  const todo = allWords.filter(w =>
    !SKIP_WORDS.has(w.word.toLowerCase()) &&
    !(w.word in existing)
  );
  console.log(`Remaining to enrich: ${todo.length}`);

  const batches = [];
  for (let i = 0; i < todo.length; i += BATCH_SIZE) batches.push(todo.slice(i, i + BATCH_SIZE));
  console.log(`Batches: ${batches.length}\n`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const wordList = batch.map(w => `${w.word} (${w.pos}) 現有意思：${w.meaning}`).join('\n');
    const preview = batch.map(w => w.word).join(', ').substring(0, 60);
    process.stdout.write(`[${i+1}/${batches.length}] ${preview}... `);

    try {
      const raw = await runGemini(wordList, INSTRUCTION);
      const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      const results = JSON.parse(jsonText);
      for (const r of results) {
        if (r.word && r.meaning) {
          existing[r.word] = r.meaning.replace(/;/g, '；');
        }
      }
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
      console.log(`✓ (${results.length})`);
    } catch (e) {
      console.log(`✗ ${e.message.substring(0, 80)}`);
      fs.writeFileSync(RESULTS_FILE, JSON.stringify(existing, null, 2), 'utf8');
    }

    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 800));
  }

  console.log(`\nDone! Total: ${Object.keys(existing).length} words enriched.`);
  console.log(`Results saved to: ${RESULTS_FILE}`);
}

main().catch(console.error);
