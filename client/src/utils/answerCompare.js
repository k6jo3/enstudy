export function normalizeForCompare(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
