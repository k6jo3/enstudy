const GENERATOR_VERSION = 2;

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

const wordTemplates = [
  {
    family: 'daily-life',
    lines: [
      { speaker: 'A', text: "I heard someone use '{word}' this morning.", zh: "我今天早上聽到有人用了「{word}」這個字。" },
      { speaker: 'B', text: "It usually means '{meaning}'.", zh: "它通常是指「{meaning}」。" },
      { speaker: 'A', text: "What kind of situation would that be?", zh: "那通常會出現在什麼情境？" },
      { speaker: 'B', text: "Something like this: {example}", zh: "像這樣：{example_zh}" },
    ],
  },
  {
    family: 'personal-use',
    lines: [
      { speaker: 'A', text: "I'm trying to use '{word}' naturally.", zh: "我想更自然地用「{word}」這個字。" },
      { speaker: 'B', text: "Try putting it into a real sentence.", zh: "你可以先把它放進真實句子裡。" },
      { speaker: 'A', text: "Do you have one in mind?", zh: "你有想到哪一句嗎？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
  {
    family: 'classroom',
    lines: [
      { speaker: 'A', text: "Our teacher wrote '{word}' on the board.", zh: "老師今天在黑板上寫了「{word}」。" },
      { speaker: 'B', text: "Then it's probably a useful word to keep.", zh: "那它多半是很值得記住的字。" },
      { speaker: 'A', text: "How would you explain it simply?", zh: "如果要簡單解釋，你會怎麼說？" },
      { speaker: 'B', text: "It means '{meaning}', and people say things like: {example}", zh: "它的意思是「{meaning}」，而且人們會這樣說：{example_zh}" },
    ],
  },
  {
    family: 'travel',
    lines: [
      { speaker: 'A', text: "Would '{word}' come up when traveling?", zh: "旅行的時候會用到「{word}」嗎？" },
      { speaker: 'B', text: "Yes, depending on the situation.", zh: "會，看你遇到什麼情況。" },
      { speaker: 'A', text: "Can you give me a realistic example?", zh: "可以給我一個比較真的情境嗎？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
  {
    family: 'workplace',
    lines: [
      { speaker: 'A', text: "I want to use '{word}' at work without sounding strange.", zh: "我想在工作上用「{word}」，但不要聽起來很怪。" },
      { speaker: 'B', text: "Then focus on the situation, not the translation.", zh: "那就要先想情境，不要只背翻譯。" },
      { speaker: 'A', text: "What situation fits it well?", zh: "它適合放在什麼情境？" },
      { speaker: 'B', text: "This one works: {example}", zh: "這句就很適合：{example_zh}" },
    ],
  },
  {
    family: 'memory-hook',
    lines: [
      { speaker: 'A', text: "I always forget '{word}' after a day or two.", zh: "我常常一兩天後就忘了「{word}」。" },
      { speaker: 'B', text: "Don't memorize the meaning by itself.", zh: "不要只單背它的意思。" },
      { speaker: 'A', text: "So what should I remember instead?", zh: "那我應該記什麼？" },
      { speaker: 'B', text: "Remember this scene: {example}", zh: "記住這個畫面就好：{example_zh}" },
    ],
  },
  {
    family: 'comparison',
    lines: [
      { speaker: 'A', text: "I know the meaning of '{word}', but I still wouldn't say it myself.", zh: "我知道「{word}」的意思，但自己還是不太會說。" },
      { speaker: 'B', text: "That happens when a word stays too abstract.", zh: "如果一個字太抽象，就很容易這樣。" },
      { speaker: 'A', text: "How can I make it feel more concrete?", zh: "那要怎麼讓它變具體？" },
      { speaker: 'B', text: "Connect it to a scene like this: {example}", zh: "把它連到這種場景：{example_zh}" },
    ],
  },
  {
    family: 'chat',
    lines: [
      { speaker: 'A', text: "Would '{word}' sound natural in a casual chat?", zh: "在聊天裡用「{word}」會自然嗎？" },
      { speaker: 'B', text: "Yes, if the context matches.", zh: "會，只要前後情境對。" },
      { speaker: 'A', text: "Show me the kind of line people actually say.", zh: "那給我一句真的像人會講的話。" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
];

const phraseTemplates = [
  {
    family: 'conversation',
    lines: [
      { speaker: 'A', text: "I understand the phrase '{phrase}', but I don't know when to say it.", zh: "我看得懂「{phrase}」，但不知道什麼時候會說。" },
      { speaker: 'B', text: "Think about the moment, not just the wording.", zh: "先想那個場景，不要只看字面。" },
      { speaker: 'A', text: "What kind of moment fits it?", zh: "那它適合什麼時候用？" },
      { speaker: 'B', text: "A line like this works well: {example}", zh: "像這一句就很適合：{example_zh}" },
    ],
  },
  {
    family: 'reaction',
    lines: [
      { speaker: 'A', text: "I heard '{phrase}' in a video yesterday.", zh: "我昨天在影片裡聽到「{phrase}」。" },
      { speaker: 'B', text: "People usually use it to express '{meaning}'.", zh: "人們通常用它來表達「{meaning}」。" },
      { speaker: 'A', text: "So it depends on the mood of the situation?", zh: "所以它跟當下語氣很有關係？" },
      { speaker: 'B', text: "Exactly. For example: {example}", zh: "沒錯。像這樣：{example_zh}" },
    ],
  },
  {
    family: 'workplace',
    lines: [
      { speaker: 'A', text: "Could I use '{phrase}' in the office?", zh: "我在工作上可以用「{phrase}」嗎？" },
      { speaker: 'B', text: "Yes, if it matches the situation.", zh: "可以，只要情境對。" },
      { speaker: 'A', text: "Can you make it sound practical?", zh: "那你可以給我一個實際一點的說法嗎？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
  {
    family: 'friend-chat',
    lines: [
      { speaker: 'A', text: "I want to remember '{phrase}' as something I would actually say.", zh: "我想把「{phrase}」記成自己真的會說的話。" },
      { speaker: 'B', text: "Then picture yourself talking to a friend.", zh: "那就想像你正在跟朋友聊天。" },
      { speaker: 'A', text: "What would that sound like?", zh: "那會聽起來像什麼？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
  {
    family: 'mistake-fix',
    lines: [
      { speaker: 'A', text: "I keep seeing '{phrase}', but it never sticks.", zh: "我一直看到「{phrase}」，但就是記不起來。" },
      { speaker: 'B', text: "That's because you're memorizing it without a scene.", zh: "那通常是因為你沒有把它放進場景裡。" },
      { speaker: 'A', text: "Then give me one scene to remember.", zh: "那你給我一個可以記住的場景。" },
      { speaker: 'B', text: "Use this one: {example}", zh: "就記這一句：{example_zh}" },
    ],
  },
  {
    family: 'travel',
    lines: [
      { speaker: 'A', text: "Would '{phrase}' be useful while traveling?", zh: "旅行時「{phrase}」會常用嗎？" },
      { speaker: 'B', text: "It can be, especially in the right moment.", zh: "會，尤其是在對的時機。" },
      { speaker: 'A', text: "What's a natural example?", zh: "有沒有自然一點的例子？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
  {
    family: 'meaning-to-scene',
    lines: [
      { speaker: 'A', text: "I know '{phrase}' means '{meaning}', but that still feels too vague.", zh: "我知道「{phrase}」是「{meaning}」，但還是有點空。" },
      { speaker: 'B', text: "That's normal until you hear it in context.", zh: "在情境裡聽過之前，這很正常。" },
      { speaker: 'A', text: "Then what context should I imagine?", zh: "那我應該想像什麼情境？" },
      { speaker: 'B', text: "Imagine this: {example}", zh: "想像這個畫面：{example_zh}" },
    ],
  },
  {
    family: 'review',
    lines: [
      { speaker: 'A', text: "I'm reviewing '{phrase}' again today.", zh: "我今天又在複習「{phrase}」。" },
      { speaker: 'B', text: "Good. Repetition works better with a memorable line.", zh: "很好，但重複要搭配有畫面的句子才有用。" },
      { speaker: 'A', text: "What's the line I should keep in my head?", zh: "那我該記哪一句？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
    ],
  },
];

function buildTokens(item, itemType) {
  const mainText = itemType === 'word' ? item.word : item.phrase;
  const meaning = cleanMeaning(item.meaning);
  const example = item.example || (itemType === 'word'
    ? `I finally know how to use "${mainText}" in a real sentence.`
    : `I can finally use "${mainText}" in conversation.`);

  return {
    word: item.word || '',
    phrase: item.phrase || '',
    meaning,
    example,
    example_zh: item.example_zh || meaning,
  };
}

function createDialogue(item, itemType, date, index, templates) {
  const label = itemType === 'word' ? item.word : item.phrase;
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
    dialogues.push(createDialogue(words[i], 'word', date, i, wordTemplates));
  }

  for (let i = 0; i < phraseQuota; i += 1) {
    dialogues.push(createDialogue(phrases[i], 'phrase', date, i, phraseTemplates));
  }

  return dialogues.slice(0, count);
}

module.exports = {
  GENERATOR_VERSION,
  generateDialogues,
};
