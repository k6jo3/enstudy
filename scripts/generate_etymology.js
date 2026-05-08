/**
 * generate_etymology.js
 * Calls Gemini CLI in batches to generate etymology data for all words.
 * Output: server/data/etymology.json
 *
 * Usage: node scripts/generate_etymology.js [--start N] [--end N] [--batch N]
 *   --start  First word index (default 0)
 *   --end    Last word index  (default 2000)
 *   --batch  Words per Gemini call (default 80)
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ETYMOLOGY_FILE = path.join(__dirname, '../server/data/etymology.json');
const words = require('../server/data/words');

const args = process.argv.slice(2);
function getArg(name, def) {
  const idx = args.indexOf(name);
  return idx !== -1 ? parseInt(args[idx + 1]) : def;
}
const START = getArg('--start', 0);
const END   = getArg('--end',   2000);
const BATCH = getArg('--batch', 80);

// Load existing data (resumable)
let results = {};
if (fs.existsSync(ETYMOLOGY_FILE)) {
  results = JSON.parse(fs.readFileSync(ETYMOLOGY_FILE, 'utf8'));
  console.log(`Loaded ${Object.keys(results).length} existing entries.`);
}

const alreadyDone = new Set(Object.keys(results).map(w => w.toLowerCase()));

const toProcess = words
  .slice(START, END)
  .map(w => w.word)
  .filter(w => w.length > 2 && !/^\d+$/.test(w) && !alreadyDone.has(w.toLowerCase()));

console.log(`Words to process: ${toProcess.length} (index ${START}-${END})`);
if (toProcess.length === 0) { console.log('All done!'); process.exit(0); }

const SYSTEM_PROMPT = `Return ONLY a valid raw JSON object. No explanation, no markdown fences, no other text.

Output format: {"word":[{"root":"root_text","meaning_zh":"Traditional Chinese 2-5 chars for root meaning","origin":"Latin"}],...}
- meaning_zh field: Traditional Chinese characters describing what the root means
- Return [] for words with no useful etymological roots: numbers, pronouns, articles, basic verbs (go/be/have/get/put)
- Max 2 roots per word
- Valid origins: Latin, Greek, Old English, French

Words to process: `;

let batchNum = 0;
const totalBatches = Math.ceil(toProcess.length / BATCH);

for (let i = 0; i < toProcess.length; i += BATCH) {
  batchNum++;
  const batch = toProcess.slice(i, i + BATCH);
  const prompt = SYSTEM_PROMPT + batch.join(', ');

  process.stdout.write(`Batch ${batchNum}/${totalBatches} [${batch[0]}..${batch[batch.length-1]}]... `);

  try {
    const result = spawnSync('cmd', ['/c', 'gemini.cmd', '-p', prompt], {
      encoding: 'utf8',
      timeout: 120000,
      maxBuffer: 10 * 1024 * 1024,
      cwd: require('os').tmpdir(), // avoid Gemini picking up project CLAUDE.md
    });

    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || 'gemini failed').slice(0, 200));

    const output = result.stdout.trim();

    // Find JSON object in output (strip any preamble/postamble)
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`No JSON in output: ${output.slice(0, 100)}`);

    // Sanitize common Gemini JSON issues before parsing
    let jsonStr = jsonMatch[0];
    // Fix trailing commas before } or ]
    jsonStr = jsonStr.replace(/,\s*([\}\]])/g, '$1');

    const parsed = JSON.parse(jsonStr);
    // Mark all words in batch (including basic words Gemini omits by returning [])
    for (const w of batch) {
      const key = w.toLowerCase();
      results[key] = parsed[w] || parsed[key] || [];
    }
    // Also include any extra words Gemini returned
    for (const [word, roots] of Object.entries(parsed)) {
      results[word.toLowerCase()] = roots;
    }
    const withRoots = batch.filter(w => (results[w.toLowerCase()] || []).length > 0).length;
    console.log(`OK (${withRoots}/${batch.length} with roots)`);

  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  }

  // Save checkpoint every 5 batches or on last batch
  if (batchNum % 5 === 0 || i + BATCH >= toProcess.length) {
    fs.writeFileSync(ETYMOLOGY_FILE, JSON.stringify(results, null, 2));
    console.log(`  -> Checkpoint saved (${Object.keys(results).length} total entries)`);
  }
}

fs.writeFileSync(ETYMOLOGY_FILE, JSON.stringify(results, null, 2));
console.log(`\nComplete! ${Object.keys(results).length} words in ${ETYMOLOGY_FILE}`);
