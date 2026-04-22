
function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeApostrophes(value) {
  return String(value || '').replace(/[’‘`´]/g, '\'');
}

function buildLoosePattern(variant) {
  const normalized = normalizeApostrophes(variant).trim();
  if (!normalized) return null;

  const fragment = normalized
    .split(/\s+/)
    .map((token) => token
      .split('')
      .map((char) => (char === '\'' ? '[\'’‘`´]?' : escapeRegExp(char)))
      .join(''))
    .join('\\s+');

  if (!fragment) return null;
  // If variant is long enough, allow it to match as a prefix (e.g., "run" masks "running")
  const suffixBoundary = normalized.length >= 3 ? '(?=[^A-Za-z0-9]|$|[A-Za-z]{1,3})' : '(?=[^A-Za-z0-9]|$)';
  return new RegExp(`(^|[^A-Za-z0-9])(${fragment})${suffixBoundary}`, 'gi');
}

/**
 * Masks the answer (and its common variants) in the given text.
 */
function maskAnswerInText(text, answer) {
  const source = String(text || '').trim();
  const normalizedAnswer = normalizeApostrophes(answer).replace(/\s+/g, ' ').trim();
  if (!source || !normalizedAnswer) return source;

  const variants = new Set([normalizedAnswer]);
  const parts = normalizedAnswer.match(/[A-Za-z]+(?:['’‘`´][A-Za-z]+)?/g) || [];
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'for', 'with',
    'is', 'are', 'am', 'be', 'been', 'being', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'me', 'him', 'us', 'them'
  ]);

  const addVariants = (base) => {
    if (base.length < 3) return;
    variants.add(base + 's');
    variants.add(base + 'es');
    variants.add(base + 'ed');
    variants.add(base + 'ing');
    variants.add(base + 'ly');
  };

  addVariants(normalizedAnswer);

  if (parts.length > 1) {
    for (const part of parts) {
      const lower = normalizeApostrophes(part).toLowerCase();
      const stopKey = lower.replace(/'/g, '');
      if (stopKey.length >= 3 && !stopWords.has(lower) && !stopWords.has(stopKey)) {
        variants.add(part);
        addVariants(part);
      }
    }
  }

  const ordered = [...variants].sort((a, b) => b.length - a.length);
  let masked = source;
  for (const variant of ordered) {
    const pattern = buildLoosePattern(variant);
    if (!pattern) continue;
    masked = masked.replace(pattern, (_, prefix) => `${prefix}____`);
  }
  return masked;
}

/**
 * Removes parentheses containing any Latin characters.
 * Handles both full-width （） and half-width () brackets.
 */
function stripLatinParenthetical(text) {
  return String(text || '')
    .replace(/[（\(][^）\)]*[A-Za-z][^）\)]*[）\)]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Cleans a prompt by stripping English in brackets and masking the target answer.
 */
function cleanPrompt(text, answer) {
  if (!text) return '';
  return maskAnswerInText(stripLatinParenthetical(text), answer);
}

module.exports = {
  maskAnswerInText,
  stripLatinParenthetical,
  cleanPrompt
};
