const GENERATOR_VERSION = 3;

/**
 * Strips semicolons and extra info from meanings for dialogue flow.
 */
function cleanMeaning(meaning) {
  if (!meaning) return '';
  return meaning.split(/[;；/]/).map((part) => part.trim()).filter(Boolean)[0] || meaning;
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFromPool(pool, seed) {
  return pool[hashString(seed) % pool.length];
}

function replaceTokens(text, tokens) {
  return text.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? '');
}

function buildDialogue(template, tokens) {
  return template.lines.map((line) => ({
    speaker: line.speaker,
    text: replaceTokens(line.text, tokens),
    zh: replaceTokens(line.zh, tokens),
  }));
}

/**
 * 根據詞性與是否有 Context 返回最適合的範本池
 */
function getTemplatesForItem(item, itemType) {
  if (itemType === 'phrase') return phraseTemplates;

  const pos = (item.pos || '').toLowerCase();
  const hasContext = !!item.context;

  if (hasContext) return contextAwareTemplates;
  if (pos.includes('v')) return verbTemplates;
  if (pos.includes('adj')) return adjTemplates;
  if (pos.includes('n')) return nounTemplates;

  return generalWordTemplates;
}

// --- Specific Templates ---

const contextAwareTemplates = [
  {
    family: 'usage-nuance',
    lines: [
      { speaker: 'A', text: "Should I use '{word}' or just a simpler word?", zh: "我應該用「{word}」還是用簡單一點的字就好？" },
      { speaker: 'B', text: "Well, {word} is specific. {context}", zh: "嗯，「{word}」比較精確。{context}" },
      { speaker: 'A', text: "I see. Can you show me how it fits in a sentence?", zh: "懂了。可以示範一下怎麼放進句子嗎？" },
      { speaker: 'B', text: "Sure: {example}", zh: "沒問題：{example_zh}" },
    ],
  },
  {
    family: 'formal-check',
    lines: [
      { speaker: 'A', text: "Is '{word}' too formal for a quick email?", zh: "在簡短郵件裡用「{word}」會太正式嗎？" },
      { speaker: 'B', text: "It depends. {context}", zh: "看情況。{context}" },
      { speaker: 'A', text: "That makes sense. Give me an example of it being used properly.", zh: "有道理。給我一個正確使用的例子。" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  }
];

const verbTemplates = [
  {
    family: 'action-oriented',
    lines: [
      { speaker: 'A', text: "How do I correctly '{word}' in this project?", zh: "我要如何在專案中正確地「{word}」？" },
      { speaker: 'B', text: "Just focus on the main steps. For instance: {example}", zh: "只要專注在主要步驟就好。例如：{example_zh}" },
      { speaker: 'A', text: "So it's basically like doing '{meaning}'?", zh: "所以基本上就像是在做「{meaning}」？" },
      { speaker: 'B', text: "Exactly, but with a bit more focus on the result.", zh: "沒錯，但更強調結果一點。" },
    ],
  }
];

const adjTemplates = [
  {
    family: 'descriptive',
    lines: [
      { speaker: 'A', text: "The situation feels very '{word}'.", zh: "現在的情況感覺非常「{word}」。" },
      { speaker: 'B', text: "Is that a good thing or a bad thing?", zh: "那是好事還是壞事？" },
      { speaker: 'A', text: "Well, it means it's '{meaning}'. Like this: {example}", zh: "嗯，就是說它是「{meaning}」。像這樣：{example_zh}" },
      { speaker: 'B', text: "Got it. That's a very vivid description.", zh: "懂了。這形容得很生動。" },
    ],
  }
];

const nounTemplates = [
  {
    family: 'object-concept',
    lines: [
      { speaker: 'A', text: "We need to address the '{word}' issue today.", zh: "我們今天需要處理這個「{word}」的問題。" },
      { speaker: 'B', text: "Remind me again, what does '{word}' imply here?", zh: "再提醒我一下，這裡「{word}」指的是什麼？" },
      { speaker: 'A', text: "It refers to '{meaning}'. For example: {example}", zh: "它指的是「{meaning}」。例如：{example_zh}" },
      { speaker: 'B', text: "Okay, let's look into it immediately.", zh: "好，我們馬上來研究一下。" },
    ],
  }
];

const generalWordTemplates = [
  {
    family: 'daily-chat',
    lines: [
      { speaker: 'A', text: "I just learned the word '{word}'.", zh: "我剛學到「{word}」這個字。" },
      { speaker: 'B', text: "That's a useful one! It means '{meaning}'.", zh: "那很有用！意思是「{meaning}」。" },
      { speaker: 'A', text: "How would you use it naturally?", zh: "你會怎麼自然地用它？" },
      { speaker: 'B', text: "I'd say: {example}", zh: "我會說：{example_zh}" },
    ],
  }
];

const phraseTemplates = [
  {
    family: 'idiomatic',
    lines: [
      { speaker: 'A', text: "What's the best time to say '{phrase}'?", zh: "什麼時候最適合講「{phrase}」？" },
      { speaker: 'B', text: "When you want to convey '{meaning}'.", zh: "當你想表達「{meaning}」的時候。" },
      { speaker: 'A', text: "Can you give me a real-life scenario?", zh: "可以給我一個生活化的場景嗎？" },
      { speaker: 'B', text: "Sure, imagine this: {example}", zh: "沒問題，想像這個畫面：{example_zh}" },
    ],
  },
  {
    family: 'office-talk',
    lines: [
      { speaker: 'A', text: "Is '{phrase}' common in the office?", zh: "辦公室常講「{phrase}」嗎？" },
      { speaker: 'B', text: "Very common! Especially when '{meaning}' is involved.", zh: "非常普遍！特別是涉及「{meaning}」的時候。" },
      { speaker: 'A', text: "Show me how you'd say it to a colleague.", zh: "示範一下你會怎麼對同事說。" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  }
];

function buildTokens(item, itemType) {
  const mainText = itemType === 'word' ? item.word : item.phrase;
  const meaning = cleanMeaning(item.meaning);
  const example = item.example || (itemType === 'word'
    ? `I finally know how to use "${mainText}" in a sentence.`
    : `I can finally use "${mainText}" in conversation.`);

  return {
    word: item.word || '',
    phrase: item.phrase || '',
    meaning,
    example,
    example_zh: item.exampleZh || item.example_zh || meaning,
    context: item.context || ''
  };
}

function createDialogue(item, itemType, date, index) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const templates = getTemplatesForItem(item, itemType);
  const template = pickFromPool(templates, `${date}:${itemType}:${item.id}:${index}:${label}`);
  const tokens = buildTokens(item, itemType);

  return {
    templateVersion: GENERATOR_VERSION,
    templateFamily: template.family,
    lines: buildDialogue(template, tokens),
    highlightWords: [label],
    type: itemType,
    itemType,
    itemId: item.id,
  };
}

function generateDialogues(words, phrases, count = 10, date = 'default') {
  const dialogues = [];
  const phraseQuota = Math.min(phrases.length, Math.max(2, Math.min(4, Math.floor(count / 3))));
  const wordQuota = Math.min(words.length, Math.max(0, count - phraseQuota));

  for (let i = 0; i < wordQuota; i += 1) {
    dialogues.push(createDialogue(words[i], 'word', date, i));
  }

  for (let i = 0; i < phraseQuota; i += 1) {
    dialogues.push(createDialogue(phrases[i], 'phrase', date, i));
  }

  return dialogues.slice(0, count);
}

module.exports = {
  GENERATOR_VERSION,
  generateDialogues,
};
