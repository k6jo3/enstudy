const { spawn } = require('child_process');

/**
 * 透過 Gemini CLI 執行 prompt，回傳純文字結果
 * stdin 傳送資料內容，-p 傳送簡短任務指令，避免 shell 解析長字串問題
 * @param {string} stdinData - 傳入 stdin 的資料（單字/片語資訊）
 * @param {string} instruction - 傳入 -p 的任務指令（簡短）
 * @returns {Promise<string>}
 */
function runGeminiCli(stdinData, instruction) {
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell', [
      '-NoProfile', '-NonInteractive',
      '-Command',
      // 強制 UTF-8 輸出，避免中文亂碼
      `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; $env:PYTHONUTF8=1; $input | gemini -p "${instruction.replace(/"/g, '`"')}" -o text`,
    ], {
      windowsHide: true,
      cwd: require('os').tmpdir(),
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    proc.stdout.on('data', (data) => { stdout += data; });
    proc.stderr.on('data', (data) => { stderr += data; });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Gemini CLI 執行失敗 (exit ${code}): ${stderr.trim()}`));
      } else {
        resolve(stdout.trim());
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`無法啟動 Gemini CLI: ${err.message}`));
    });

    proc.stdin.write(stdinData, 'utf8');
    proc.stdin.end();
  });
}

/**
 * 為單字或片語生成對話（AI 備援，當沒有預設對話時使用）
 * @param {object} item - word/phrase 物件
 * @param {'word'|'phrase'} itemType
 * @returns {Promise<{lines: Array, highlightWords: string[]}>}
 */
async function generateDialogue(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const meaning = item.meaning || '';
  const example = item.example || '';
  const exampleZh = item.exampleZh || item.example_zh || '';

  const stdinData = `單字/片語：${label}\n中文意思：${meaning}\n範例句：${example}\n範例中譯：${exampleZh}`;
  const instruction = `你是英語教學助手。根據以上單字資料，生成A和B各說2句的自然英語對話，每句附繁體中文翻譯。只輸出JSON，不加說明：{"lines":[{"speaker":"A","text":"英文","zh":"中文"},{"speaker":"B","text":"英文","zh":"中文"},{"speaker":"A","text":"英文","zh":"中文"},{"speaker":"B","text":"英文","zh":"中文"}]}`;

  const text = await runGeminiCli(stdinData, instruction);

  // Strip markdown code fences if present
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  const parsed = JSON.parse(jsonText);

  return {
    lines: (parsed.lines || []).map((l, i) => ({
      speaker: l.speaker || (i % 2 === 0 ? 'A' : 'B'),
      text: l.text || '',
      zh: l.zh || '',
    })),
    highlightWords: [label],
  };
}

/**
 * 生成單字/片語的詳細中文解釋
 * @param {object} params
 * @returns {Promise<string>}
 */
async function explainWord({ word, meaning, partOfSpeech, example, exampleZh, isPhrase = false }) {
  const label = isPhrase ? '片語' : '單字';
  const stdinData = `${label}：${word}\n詞性：${partOfSpeech || '—'}\n基本中文意思：${meaning}\n教材例句：${example}\n例句中譯：${exampleZh || '—'}`;
  const instruction = `你是英語教學專家。根據以上${label}資料，用繁體中文說明：1.核心意義與語感 2.使用場合 3.常見搭配詞 4.補充例句（附中譯）。格式清晰，150-250字。`;

  return runGeminiCli(stdinData, instruction);
}

/**
 * 生成文法題目的詳細解釋
 * @param {object} params
 * @returns {Promise<string>}
 */
async function explainGrammar({ sentence, answer, explanation, topic }) {
  const topicMap = {
    word_form: '詞性判斷',
    verb_tense: '動詞時態',
    agreement: '主詞動詞一致',
    preposition: '介系詞',
    pronoun: '代名詞',
    article: '冠詞',
    conjunction: '連接詞',
    passive: '被動語態',
    comparative: '比較級',
    modal: '助動詞',
  };
  const topicLabel = topicMap[topic] || topic || '文法';

  const stdinData = `文法主題：${topicLabel}\n題目：${sentence}\n正確答案：${answer}\n題目說明：${explanation || '—'}`;
  const instruction = `你是多益英語考試專家。根據以上題目資料，用繁體中文解析：1.為何此答案正確（核心文法規則）2.常見錯誤陷阱 3.記憶技巧。格式清晰，150-250字。`;

  return runGeminiCli(stdinData, instruction);
}

module.exports = { generateDialogue, explainWord, explainGrammar };
