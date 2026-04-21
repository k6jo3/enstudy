const words = require('./words');
const phrases = require('./phrases_all');

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

function normalizeSpacing(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function normalizeLookupKey(text) {
  return normalizeSpacing(text).toLowerCase();
}

function quoteText(text) {
  const value = normalizeSpacing(text);
  if (!value) return '';
  return /[.?!]$/.test(value) ? value : `${value}.`;
}

function line(speaker, text, zh) {
  return {
    speaker,
    text: quoteText(text),
    zh: normalizeSpacing(zh),
  };
}

function extractQuotedSegments(text) {
  const matches = [];
  const patterns = [/\"([^\"]+)\"/g, /「([^」]+)」/g];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(String(text || '')))) {
      matches.push(match[1].trim());
    }
    if (matches.length >= 2) break;
  }
  return matches.filter(Boolean);
}

function buildExampleEntries(item, itemType) {
  if (itemType === 'word' && Array.isArray(item.examples) && item.examples.length > 0) {
    return item.examples
      .map((entry) => ({
        text: quoteText(entry.text || entry.example || ''),
        zh: normalizeSpacing(entry.zh || entry.exampleZh || ''),
      }))
      .filter((entry) => entry.text);
  }

  const text = quoteText(item.example || '');
  const zh = normalizeSpacing(item.exampleZh || item.example_zh || '');
  return text ? [{ text, zh }] : [];
}

function pickStableEntry(item, itemType) {
  const entries = buildExampleEntries(item, itemType);
  if (!entries.length) return null;
  const label = itemType === 'word' ? item.word : item.phrase;
  return pickFromPool(entries, `${itemType}:${normalizeLookupKey(label)}`);
}

function buildQuotedDialogue(entry) {
  const enSegments = extractQuotedSegments(entry.text);
  if (enSegments.length < 2) return null;

  const zhSegments = extractQuotedSegments(entry.zh);
  return {
    family: 'quoted-example-dialogue',
    lines: enSegments.slice(0, 4).map((segment, index) => ({
      speaker: index % 2 === 0 ? 'A' : 'B',
      text: quoteText(segment),
      zh: zhSegments[index] || entry.zh || '',
    })),
  };
}

function choosePoolLine(pool, seed, speaker = 'B') {
  const picked = pickFromPool(pool, seed);
  return line(speaker, picked[0], picked[1]);
}

function buildQuestionResponse(example, item) {
  const normalized = normalizeLookupKey(example);
  const label = normalizeLookupKey(item.word || item.phrase || '');

  if (/\bin stock\b|\bpre-order\b|\bpreorder\b|\biphone\b/.test(normalized) || label === 'in stock') {
    return line('B', 'We have a few left right now.', '我們現在還有幾個現貨。');
  }
  if (/\btea or coffee\b/.test(normalized)) {
    return line('B', 'Coffee for me, please.', '我喝咖啡就好。');
  }
  if (/\brestroom\b|\bbathroom\b|\btoilet\b/.test(normalized)) {
    return line('B', "It's just around the corner.", '就在前面轉角。');
  }
  if (/\broute\b|\bairport\b/.test(normalized)) {
    return line('B', 'Take the expressway. It is usually faster.', '走快速道路吧，通常比較快。');
  }
  if (/\bhow are you\b|\bhow have you been\b|\bwhat\'s up\b|\bwhat is up\b/.test(normalized)) {
    return line('B', 'Pretty good. I have just been busy.', '還不錯，只是最近比較忙。');
  }
  if (/\bnice to meet you\b/.test(normalized)) {
    return line('B', 'Nice to meet you too.', '我也很高興認識你。');
  }
  if (/^(do|does|did)\b/.test(normalized)) {
    return choosePoolLine([
      ['Yeah, I do.', '有，我有。'],
      ['Not really.', '沒有耶。'],
      ['Sometimes, depending on the day.', '有時候，看情況。'],
    ], normalized);
  }
  if (/^(is|are|was|were|can|could|will|would|should|have|has)\b/.test(normalized)) {
    return choosePoolLine([
      ['Yeah, it should be okay.', '嗯，應該沒問題。'],
      ['I think so.', '我想是。'],
      ['Probably, yes.', '應該是。'],
    ], normalized);
  }
  if (/^(what|which)\b/.test(normalized)) {
    return choosePoolLine([
      ['Probably the usual one.', '大概就是平常那個。'],
      ['The first one sounds better to me.', '我覺得第一個比較好。'],
      ['Whichever is quicker.', '哪個比較快就哪個。'],
    ], normalized);
  }
  if (/^how\b/.test(normalized)) {
    return choosePoolLine([
      ['Pretty smoothly, actually.', '其實還算順利。'],
      ['Better than I expected.', '比我預期得還好。'],
      ['Not too badly.', '沒有太糟。'],
    ], normalized);
  }

  return choosePoolLine([
    ['Let me check.', '我看一下。'],
    ['Give me a second.', '等我一下。'],
    ['Sure, here you go.', '可以，給你。'],
  ], normalized);
}

function buildImperativeLead(example, item) {
  const normalized = normalizeLookupKey(example);
  const label = normalizeLookupKey(item.word || item.phrase || '');

  if (/\bapply caulk\b|\bbathtub\b|\bleaks?\b/.test(normalized) || label === 'caulk') {
    return line('A', 'How are we going to stop the leak?', '我們要怎麼把漏水處理好？');
  }
  if (/\bremember to\b/.test(normalized)) {
    return line('A', 'Anything I should not forget?', '有沒有什麼我不能忘記的？');
  }
  if (/\btake your bag\b/.test(normalized) || label === 'take') {
    return line('A', 'We are heading out now.', '我們現在要出門了。');
  }
  if (/\bwatch out\b/.test(normalized)) {
    return line('A', 'Why? What is coming?', '怎麼了？有什麼過來了？');
  }
  if (/\bwash your hands\b/.test(normalized)) {
    return line('A', 'Okay, before dinner?', '好，吃飯前先洗嗎？');
  }

  return choosePoolLine([
    ['What should I do first?', '我先做什麼？'],
    ['Okay, what do you need me to do?', '好，你要我做什麼？'],
    ['Got it. What now?', '知道了，接下來呢？'],
  ], normalized, 'A');
}

function buildStatementReaction(example, item) {
  const normalized = normalizeLookupKey(example);
  const label = normalizeLookupKey(item.word || item.phrase || '');

  if (/\bperformed well\b|\bmutual fund\b/.test(normalized) || label === 'fund') {
    return line('B', 'That is a strong year for a fund like that.', '以那種基金來說，這樣算表現很好。');
  }
  if (/\bsteep slope\b|\bskiers\b/.test(normalized) || label === 'slope') {
    return line('B', 'That sounds intense even for training.', '連訓練都這麼猛，聽起來很刺激。');
  }
  if (/\bimplied that\b/.test(normalized) || label === 'imply') {
    return line('B', 'Right, he did not even need to say it directly.', '對，他連明講都不用。');
  }
  if (/\broast me\b/.test(normalized) || label === 'roast') {
    return line('B', 'At least they never run out of jokes.', '至少他們總是不缺笑點。');
  }
  if (/\bfuton\b/.test(normalized) || label === 'futon') {
    return line('B', 'That is actually pretty decent for a hostel.', '以青年旅舍來說，這其實很不錯。');
  }
  if (/\bbruise on her shin\b|\bkicked the ball\b/.test(normalized) || label === 'shin') {
    return line('B', 'Ouch. That sounds painful.', '哎，聽起來就很痛。');
  }
  if (/\bcaulk\b|\bbathtub\b|\bleaks?\b/.test(normalized) || label === 'caulk') {
    return line('B', 'Yeah, that should keep the water from getting out.', '對，這樣應該就能把水擋住。');
  }
  if (/\bfilled with joy\b|\bchristmas\b/.test(normalized) || label === 'joy') {
    return line('B', 'I bet the whole house felt lively that morning.', '那天早上家裡一定超熱鬧。');
  }
  if (/\bnoble profession\b/.test(normalized) || label === 'noble') {
    return line('B', 'It takes a lot of patience to do it well.', '那真的很需要耐心才能做好。');
  }
  if (/\bvital\b|\bgood health\b/.test(normalized) || label === 'vital') {
    return line('B', 'Yeah, you really feel it when you skip it for too long.', '對，太久不做，身體真的會有感。');
  }
  if (/\bfalse\b/.test(normalized) || label === 'false') {
    return line('B', 'Then we should stop repeating it.', '那我們就別再傳那句話了。');
  }
  if (/\bone hour\b/.test(normalized) || label === 'hour') {
    return line('B', 'That was still a solid study session.', '那樣其實也算是很扎實的一段讀書時間。');
  }
  if (/\bin the red\b/.test(normalized) || label === 'in the red') {
    return line('B', 'No wonder everyone has been so stressed.', '難怪大家最近都這麼緊繃。');
  }
  if (/\bsold out\b/.test(normalized) || label === 'sold out') {
    return line('B', 'We really should have bought them earlier.', '我們真的應該早點買。');
  }
  if (/\bto be fair\b/.test(normalized) || label === 'to be fair') {
    return line('B', 'That is true. She did mention it earlier.', '這倒是真的，她之前確實有提過。');
  }
  if (/\bplay safe\b|\bextra set of keys\b/.test(normalized) || label === 'play safe') {
    return line('B', 'Yeah, better that than getting locked out.', '對啊，總比被鎖在外面好。');
  }
  if (/\bno,? i do not want it\b/.test(normalized) || label === 'no') {
    return line('B', 'Okay, I will get something else.', '好，那我換別的。');
  }

  return choosePoolLine([
    ['That makes sense.', '這樣很合理。'],
    ['Good to know.', '知道了。'],
    ['Yeah, I can see that.', '嗯，我懂。'],
    ['That sounds about right.', '聽起來是這樣。'],
    ['No wonder.', '難怪。'],
  ], `${label}:${normalized}`);
}

function buildDialogueRecord(item, itemType) {
  const entry = pickStableEntry(item, itemType);
  if (!entry) return null;

  const quotedDialogue = buildQuotedDialogue(entry);
  if (quotedDialogue) return quotedDialogue;

  if (entry.text.includes('?')) {
    return {
      family: 'compiled-static-dialogue',
      lines: [
        line('A', entry.text, entry.zh),
        buildQuestionResponse(entry.text, item),
      ],
    };
  }

  if (/^(remember|wash|take|be|keep|look|turn|open|close|hold|wait|come|go|stop|sit|stand|check|call|watch|listen|try|use|bring|put|give|get|let|follow|stay|apply)\b/i.test(entry.text)) {
    return {
      family: 'compiled-static-dialogue',
      lines: [
        buildImperativeLead(entry.text, item),
        line('B', entry.text, entry.zh),
      ],
    };
  }

  return {
    family: 'compiled-static-dialogue',
    lines: [
      line('A', entry.text, entry.zh),
      buildStatementReaction(entry.text, item),
    ],
  };
}

function buildCatalog(items, itemType) {
  const result = {};
  for (const item of items) {
    const label = itemType === 'word' ? item.word : item.phrase;
    result[normalizeLookupKey(label)] = buildDialogueRecord(item, itemType);
  }
  return result;
}

module.exports = {
  words: buildCatalog(words, 'word'),
  phrases: buildCatalog(phrases, 'phrase'),
};
