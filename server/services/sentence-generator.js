const { buildMeaningLabel, getPrimaryMeaning } = require('../utils/meaning');

const GENERATOR_VERSION = 4;

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

function normalizeSpacing(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function quoteExample(example) {
  const text = normalizeSpacing(example);
  if (!text) return '';
  return /[.?!]$/.test(text) ? text : `${text}.`;
}

function fallbackExample(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (itemType === 'phrase') {
    return `I can naturally say "${label}" when the moment feels right.`;
  }
  return `I want to use "${label}" in a sentence that sounds natural.`;
}

function fallbackExampleZh(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (itemType === 'phrase') {
    return `我想在適合的時候自然地說出「${label}」。`;
  }
  return `我想把「${label}」自然地用在句子裡。`;
}

function buildUsageHintEn(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (itemType === 'phrase') {
    return `You can use "${label}" when that kind of moment comes up in conversation.`;
  }

  const pos = (item.part_of_speech || item.pos || '').toLowerCase();
  if (pos.includes('v')) {
    return `It usually shows up when you are talking about an action or change.`;
  }
  if (pos.includes('adj')) {
    return `It usually helps describe a person, situation, or feeling more clearly.`;
  }
  if (pos.includes('n')) {
    return `It usually names the person, thing, or idea you are talking about.`;
  }

  return `It often appears in natural conversation once the situation is clear.`;
}

function buildUsageHintZh(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (item.context) {
    return item.context;
  }

  const meaning = getPrimaryMeaning(item.meaning);
  if (itemType === 'phrase') {
    return `當你想表達「${meaning}」時就可以直接用「${label}」。`;
  }

  const pos = (item.part_of_speech || item.pos || '').toLowerCase();
  if (pos.includes('v')) {
    return `它常用來描述「${meaning}」這個動作。`;
  }
  if (pos.includes('adj')) {
    return `它通常拿來形容人、情況或感受是「${meaning}」的。`;
  }
  if (pos.includes('n')) {
    return `它通常指「${meaning}」這個人、事或概念。`;
  }

  return `它常放在自然對話裡，用來表達「${meaning}」。`;
}

function buildFollowUpEn(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (itemType === 'phrase') {
    return `Next time that situation comes up, I will just say "${label}".`;
  }

  const pos = (item.part_of_speech || item.pos || '').toLowerCase();
  if (pos.includes('v')) {
    return `Got it. I will try "${label}" the next time I describe that action.`;
  }
  if (pos.includes('adj')) {
    return `Got it. I will use "${label}" the next time I describe that feeling.`;
  }
  if (pos.includes('n')) {
    return `Great. I will use "${label}" the next time I mention that idea.`;
  }

  return `Great. I will work "${label}" into conversation next time.`;
}

function buildFollowUpZh(item, itemType) {
  const label = itemType === 'word' ? item.word : item.phrase;
  if (itemType === 'phrase') {
    return `好，下次遇到一樣的情況，我就直接說「${label}」。`;
  }

  const pos = (item.part_of_speech || item.pos || '').toLowerCase();
  if (pos.includes('v')) {
    return `懂了，下次描述動作時我就試著用「${label}」。`;
  }
  if (pos.includes('adj')) {
    return `懂了，下次要形容感覺時我就用「${label}」。`;
  }
  if (pos.includes('n')) {
    return `好，下次提到這個概念時我就用「${label}」。`;
  }

  return `好，我下次聊天時會把「${label}」用進去。`;
}

const wordTemplates = [
  {
    family: 'example-led-word',
    lines: [
      { speaker: 'A', text: 'I want to use "{word}" more naturally.', zh: '我想把「{word}」用得更自然一點。' },
      { speaker: 'B', text: 'A simple way is to say, "{example}"', zh: '最簡單的方式就是像這樣說：「{example_zh}」' },
      { speaker: 'A', text: 'So that is how "{word}" fits into a real sentence.', zh: '所以這裡的「{word}」大致上是在表達「{meaning}」。' },
      { speaker: 'B', text: '{usage_hint}', zh: '{usage_hint_zh}' },
      { speaker: 'A', text: '{follow_up}', zh: '{follow_up_zh}' },
    ],
  },
  {
    family: 'scenario-led-word',
    lines: [
      { speaker: 'A', text: 'When would I actually say "{word}" in real life?', zh: '我在真實生活中會在什麼情況下用「{word}」？' },
      { speaker: 'B', text: 'Think of a moment like this: "{example}"', zh: '你可以想成這種情境：「{example_zh}」' },
      { speaker: 'A', text: 'Oh, so it fits naturally in that situation.', zh: '喔，所以當我想表達「{meaning}」時就可以用。' },
      { speaker: 'B', text: '{usage_hint}', zh: '{usage_hint_zh}' },
      { speaker: 'A', text: '{follow_up}', zh: '{follow_up_zh}' },
    ],
  },
];

const phraseTemplates = [
  {
    family: 'example-led-phrase',
    lines: [
      { speaker: 'A', text: 'I know the phrase "{phrase}", but I still do not know when to say it.', zh: '我知道「{phrase}」這個片語，但還是不太知道什麼時候說最自然。' },
      { speaker: 'B', text: 'Use it in a moment like this: "{example}"', zh: '你可以在這種情境裡用它：「{example_zh}」' },
      { speaker: 'A', text: 'So it works when the conversation feels like that.', zh: '所以當我想表達「{meaning}」的時候就能用。' },
      { speaker: 'B', text: '{usage_hint}', zh: '{usage_hint_zh}' },
      { speaker: 'A', text: '{follow_up}', zh: '{follow_up_zh}' },
    ],
  },
  {
    family: 'scenario-led-phrase',
    lines: [
      { speaker: 'A', text: 'Can you give me a real situation for "{phrase}"?', zh: '你可以給我一個「{phrase}」的真實情境嗎？' },
      { speaker: 'B', text: 'Sure. Imagine someone says, "{example}"', zh: '可以。你就想像有人這樣說：「{example_zh}」' },
      { speaker: 'A', text: 'That sounds much more natural than memorizing it alone.', zh: '這樣比單背片語自然多了。' },
      { speaker: 'B', text: '{usage_hint}', zh: '{usage_hint_zh}' },
      { speaker: 'A', text: '{follow_up}', zh: '{follow_up_zh}' },
    ],
  },
];

function buildTokens(item, itemType) {
  const meaning = buildMeaningLabel(item);
  const example = quoteExample(item.example || fallbackExample(item, itemType));
  const exampleZh = normalizeSpacing(item.exampleZh || item.example_zh || fallbackExampleZh(item, itemType));
  const usageHint = normalizeSpacing(buildUsageHintEn(item, itemType));
  const usageHintZh = normalizeSpacing(buildUsageHintZh(item, itemType));
  const followUp = buildFollowUpEn(item, itemType);
  const followUpZh = buildFollowUpZh(item, itemType);

  return {
    word: item.word || '',
    phrase: item.phrase || '',
    meaning,
    example,
    example_zh: exampleZh,
    usage_hint: usageHint,
    usage_hint_zh: usageHintZh,
    follow_up: followUp,
    follow_up_zh: followUpZh,
  };
}

function getTemplatesForItem(itemType) {
  return itemType === 'phrase' ? phraseTemplates : wordTemplates;
}

function createDialogue(item, itemType, date, index) {
  const label = itemType === 'word' ? item.word : item.phrase;
  const templates = getTemplatesForItem(itemType);
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
