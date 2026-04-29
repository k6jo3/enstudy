function splitMeaningVariants(meaning) {
  if (!meaning) return [];
  return String(meaning)
    .split(/[;；/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getPrimaryMeaning(meaning) {
  return splitMeaningVariants(meaning)[0] || String(meaning || '').trim();
}

function stripMeaningNotes(value) {
  return String(value || '')
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .trim();
}

function normalizeMeaningForCompare(meaning) {
  return stripMeaningNotes(getPrimaryMeaning(meaning))
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，。、「」『』：:,.!?？]/g, '');
}

function areMeaningsSimilar(a, b) {
  const left = normalizeMeaningForCompare(a);
  const right = normalizeMeaningForCompare(b);
  if (!left || !right) return false;
  if (left === right) return true;
  return left.includes(right) || right.includes(left);
}

function summarizeExample(example, maxLength = 36) {
  const text = String(example || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3).trim()}...`;
}

function summarizeContext(context, maxLength = 18) {
  const text = String(context || '')
    .split(/[；;。.!?]/)[0]
    .trim();
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trim()}...`;
}

function getMeaningQualifier(item) {
  const contextHint = summarizeContext(item.context);
  if (contextHint) return contextHint;

  const pos = item.part_of_speech || item.pos;
  if (pos) return pos;

  const exampleHint = summarizeExample(item.example, 32);
  if (exampleHint) return `例：${exampleHint}`;

  return '';
}

function isPhraseLikeItem(item) {
  return item?.item_type === 'phrase' || Boolean(item?.phrase);
}

function buildMeaningLabel(item, peers = [], { includeUsageHint = false } = {}) {
  const fullMeaning = String(item.meaning || '').trim();
  const variants = splitMeaningVariants(fullMeaning);
  const primaryMeaning = variants[0] || String(fullMeaning || '').trim();
  const hasMultipleVariants = variants.length > 1;
  const hasSimilarPeer = peers.some((peer) => {
    if (!peer) return false;
    if (peer === item) return false;
    if (peer.item_type && item.item_type && peer.item_type !== item.item_type) return false;
    return areMeaningsSimilar(fullMeaning, peer.meaning);
  });

  const qualifier = getMeaningQualifier(item);
  const shouldQualify = qualifier && (includeUsageHint || hasMultipleVariants || hasSimilarPeer);
  const preferredMeaning = hasMultipleVariants
    ? variants.join(isPhraseLikeItem(item) ? ' / ' : '；')
    : primaryMeaning;

  if (shouldQualify) {
    return `${preferredMeaning}（${qualifier}）`;
  }

  if (hasMultipleVariants) {
    return variants.join(' / ');
  }

  return fullMeaning;
}

module.exports = {
  areMeaningsSimilar,
  buildMeaningLabel,
  getPrimaryMeaning,
  splitMeaningVariants,
};
