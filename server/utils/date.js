function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getToday() {
  return formatLocalDate();
}

function parseDateString(dateStr) {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateStr, days) {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

module.exports = {
  addDays,
  formatLocalDate,
  getToday,
  parseDateString,
};
