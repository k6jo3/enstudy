function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function parsePositiveInt(value, { defaultValue = null, min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

function parseNumber(value, { defaultValue = null, min = -Infinity, max = Infinity } = {}) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isOneOf(value, allowedValues) {
  return allowedValues.includes(value);
}

module.exports = {
  badRequest,
  isNonEmptyString,
  isOneOf,
  parseNumber,
  parsePositiveInt,
};
