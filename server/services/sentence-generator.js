// Example-based dialogue generator
// Uses each word/phrase's own example sentence instead of POS-based templates

/**
 * Clean meaning string: take first item before semicolons/slashes
 * "輕的；光" → "輕的"
 * "奶奶；外婆" → "奶奶"
 * "喝；飲料" → "喝"
 */
function cleanMeaning(meaning) {
  if (!meaning) return '';
  return meaning.split(/[；;／/]/).map(s => s.trim()).filter(Boolean)[0] || meaning;
}

// Word dialogue templates — use {word}, {meaning}, {example}
const wordTemplates = [
  {
    lines: [
      { speaker: 'A', text: "What does '{word}' mean?", zh: "'{word}' 是什麼意思？" },
      { speaker: 'B', text: "It means '{meaning}'. For example: '{example}'", zh: "意思是「{meaning}」。例如：'{example}'" },
      { speaker: 'A', text: "Oh, that makes sense! Thanks!", zh: "噢，原來如此！謝謝！" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you use '{word}' in a sentence?", zh: "你可以用 '{word}' 造個句子嗎？" },
      { speaker: 'B', text: "Sure! {example}", zh: "當然！{example_zh}" },
      { speaker: 'A', text: "Got it. That's easy to remember.", zh: "了解。這很好記。" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "How do you say '{meaning}' in English?", zh: "「{meaning}」用英文怎麼說？" },
      { speaker: 'B', text: "You can say '{word}'. Like: {example}", zh: "你可以說 '{word}'。像是：{example_zh}" },
      { speaker: 'A', text: "Let me try — '{word}'. Did I say it right?", zh: "我試試 — '{word}'。我說對了嗎？" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I learned a new word today — '{word}'!", zh: "我今天學了一個新單字 — '{word}'！" },
      { speaker: 'B', text: "Nice! How do you use it?", zh: "讚！怎麼用呢？" },
      { speaker: 'A', text: "Like this: {example}", zh: "像這樣：{example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I keep forgetting the word '{word}'.", zh: "我一直忘記 '{word}' 這個字。" },
      { speaker: 'B', text: "Remember this sentence: {example}", zh: "記住這個句子：{example_zh}" },
      { speaker: 'A', text: "That helps! I'll practice it.", zh: "有幫助！我會練習的。" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Is '{word}' a common word?", zh: "'{word}' 是常用的字嗎？" },
      { speaker: 'B', text: "Yes! People use it all the time. Like: {example}", zh: "是啊！大家常常用。像是：{example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I saw the word '{word}' in my textbook.", zh: "我在課本上看到 '{word}' 這個字。" },
      { speaker: 'B', text: "It means '{meaning}'. Here's an example: {example}", zh: "意思是「{meaning}」。舉個例子：{example_zh}" },
      { speaker: 'A', text: "Now I understand. Thanks for explaining!", zh: "現在我懂了。謝謝你解釋！" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you explain '{word}' to me?", zh: "你可以跟我解釋 '{word}' 嗎？" },
      { speaker: 'B', text: "It means '{meaning}'.", zh: "意思是「{meaning}」。" },
      { speaker: 'A', text: "Can you give me an example?", zh: "可以舉個例子嗎？" },
      { speaker: 'B', text: "Sure — {example}", zh: "當然 — {example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "My teacher asked me to use '{word}' in a sentence.", zh: "老師要我用 '{word}' 造句。" },
      { speaker: 'B', text: "How about: {example}", zh: "這樣如何：{example_zh}" },
      { speaker: 'A', text: "Perfect! I'll write that down.", zh: "太好了！我把它寫下來。" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "What's a good example for '{word}'?", zh: "'{word}' 有什麼好的例句嗎？" },
      { speaker: 'B', text: "{example}", zh: "{example_zh}" },
      { speaker: 'A', text: "Oh, that's a great example!", zh: "噢，這個例句很棒！" },
    ]
  },
];

// Phrase dialogue templates — use {phrase}, {meaning}, {example}
const phraseTemplates = [
  {
    lines: [
      { speaker: 'A', text: "What does '{phrase}' mean?", zh: "「{phrase}」是什麼意思？" },
      { speaker: 'B', text: "It means '{meaning}'. People use it a lot.", zh: "意思是「{meaning}」。大家很常用。" },
      { speaker: 'A', text: "Can you give me an example?", zh: "可以舉個例子嗎？" },
      { speaker: 'B', text: "Sure! {example}", zh: "當然！{example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "How do you use '{phrase}' in a sentence?", zh: "「{phrase}」怎麼用在句子裡？" },
      { speaker: 'B', text: "For example: {example}", zh: "例如：{example_zh}" },
      { speaker: 'A', text: "That's easy to understand. Thanks!", zh: "這很好懂。謝謝！" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I heard someone say '{phrase}' today.", zh: "我今天聽到有人說「{phrase}」。" },
      { speaker: 'B', text: "That means '{meaning}'.", zh: "那是「{meaning}」的意思。" },
      { speaker: 'A', text: "Oh! Now I get it.", zh: "噢！現在我懂了。" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "How do you say '{meaning}' in English?", zh: "「{meaning}」用英文怎麼說？" },
      { speaker: 'B', text: "You can say '{phrase}'. Like: {example}", zh: "你可以說「{phrase}」。像是：{example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I just learned the phrase '{phrase}'!", zh: "我剛學到「{phrase}」這個片語！" },
      { speaker: 'B', text: "Nice! Do you know how to use it?", zh: "讚！你知道怎麼用嗎？" },
      { speaker: 'A', text: "Like this: {example}", zh: "像這樣：{example_zh}" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "Can you use '{phrase}' in a sentence?", zh: "你可以用「{phrase}」造句嗎？" },
      { speaker: 'B', text: "Sure! {example}", zh: "當然！{example_zh}" },
      { speaker: 'A', text: "That's a great example!", zh: "這個例句很棒！" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "I keep mixing up '{phrase}' with other phrases.", zh: "我一直把「{phrase}」跟其他片語搞混。" },
      { speaker: 'B', text: "Just remember: {example}", zh: "記住這個就好：{example_zh}" },
      { speaker: 'A', text: "That makes it clearer. Thanks!", zh: "這樣清楚多了。謝謝！" },
    ]
  },
  {
    lines: [
      { speaker: 'A', text: "My friend used '{phrase}' in a conversation.", zh: "我朋友在對話中用了「{phrase}」。" },
      { speaker: 'B', text: "It means '{meaning}'. Here's another example: {example}", zh: "意思是「{meaning}」。再舉一個例子：{example_zh}" },
    ]
  },
];

function generateDialogues(words, phrases, count = 10) {
  const dialogues = [];

  const pickTemplate = (templates, id) => templates[id % templates.length];

  // Word-based dialogues
  const wordCount = Math.min(count - Math.min(phrases.length, 3), words.length);
  for (let i = 0; i < wordCount; i++) {
    const w = words[i];
    const tmpl = pickTemplate(wordTemplates, w.id || i);

    const wordText = w.word || '';
    const meaning = cleanMeaning(w.meaning);
    const example = w.example || `I know the word "${wordText}".`;
    const exampleZh = w.example_zh || meaning;

    const lines = tmpl.lines.map(line => ({
      speaker: line.speaker,
      text: line.text
        .replace(/\{word\}/g, wordText)
        .replace(/\{meaning\}/g, meaning)
        .replace(/\{example\}/g, example)
        .replace(/\{example_zh\}/g, exampleZh),
      zh: line.zh
        .replace(/\{word\}/g, wordText)
        .replace(/\{meaning\}/g, meaning)
        .replace(/\{example\}/g, example)
        .replace(/\{example_zh\}/g, exampleZh),
    }));

    dialogues.push({
      lines,
      highlightWords: [wordText],
      type: 'word',
      itemType: 'word',
      itemId: w.id
    });
  }

  // Phrase-based dialogues
  const phraseCount = count - dialogues.length;
  for (let i = 0; i < phraseCount && i < phrases.length; i++) {
    const p = phrases[i];
    const tmpl = pickTemplate(phraseTemplates, p.id || i);

    const phraseText = p.phrase || '';
    const meaning = cleanMeaning(p.meaning);
    const example = p.example || phraseText;
    const exampleZh = p.example_zh || meaning;

    const lines = tmpl.lines.map(line => ({
      speaker: line.speaker,
      text: line.text
        .replace(/\{phrase\}/g, phraseText)
        .replace(/\{meaning\}/g, meaning)
        .replace(/\{example\}/g, example)
        .replace(/\{example_zh\}/g, exampleZh),
      zh: line.zh
        .replace(/\{phrase\}/g, phraseText)
        .replace(/\{meaning\}/g, meaning)
        .replace(/\{example\}/g, example)
        .replace(/\{example_zh\}/g, exampleZh),
    }));

    dialogues.push({
      lines,
      highlightWords: [phraseText],
      type: 'phrase',
      itemType: 'phrase',
      itemId: p.id
    });
  }

  return dialogues.slice(0, count);
}

module.exports = { generateDialogues };
