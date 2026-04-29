/**
 * Apply enriched meanings from enrich_results.json to all words*.js data files.
 */
const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, 'enrich_results.json');
const DATA_DIR = path.join(__dirname, 'server', 'data');

const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
console.log(`Loaded ${Object.keys(results).length} enriched words.\n`);

const files = fs.readdirSync(DATA_DIR)
  .filter(f => /^words\d*\.js$/.test(f))
  .sort();

let totalUpdated = 0;
let totalFiles = 0;

for (const filename of files) {
  const filePath = path.join(DATA_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = 0;

  for (const [word, meaning] of Object.entries(results)) {
    if (!content.includes(`"word": "${word}"`)) continue;

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the object containing "word": "WORD" and replace the "meaning" within it.
    // [^}]* is safe because these flat objects contain no nested {} in their field values.
    const pattern = new RegExp(
      `({[^}]*"word":\\s*"${escapedWord}"[^}]*"meaning":\\s*")([^"]*)(")`
    );
    const newContent = content.replace(pattern, (_, pre, _old, quote) =>
      `${pre}${meaning.replace(/\$/g, '$$$$')}${quote}`
    );

    if (newContent !== content) {
      content = newContent;
      updated++;
    }
  }

  if (updated > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`${filename}: ${updated} updates`);
    totalUpdated += updated;
    totalFiles++;
  }
}

console.log(`\nDone! Updated ${totalUpdated} meanings across ${totalFiles} files.`);
