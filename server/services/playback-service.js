const { queryAll, queryOne, run, queryScalar } = require('../db/helpers');
const { saveDb } = require('../db/connection');
const { getToday } = require('../utils/date');

async function getPlaybackItems(count = 100) {
  // Priority 1: Unplayed learned words
  const unplayedWords = await queryAll(`
    SELECT DISTINCT w.*, 'word' as item_type, 0 as play_count
    FROM words w
    INNER JOIN learning_log ll ON ll.item_id = w.id AND ll.item_type = 'word' AND ll.is_review = 0
    WHERE NOT EXISTS (SELECT 1 FROM playback_log pl WHERE pl.item_type = 'word' AND pl.item_id = w.id)
    ORDER BY RANDOM()
    LIMIT ?
  `, [count]);

  // Priority 2: Unplayed learned phrases
  const unplayedPhrases = await queryAll(`
    SELECT DISTINCT p.*, 'phrase' as item_type, 0 as play_count
    FROM phrases p
    INNER JOIN learning_log ll ON ll.item_id = p.id AND ll.item_type = 'phrase' AND ll.is_review = 0
    WHERE NOT EXISTS (SELECT 1 FROM playback_log pl WHERE pl.item_type = 'phrase' AND pl.item_id = p.id)
    ORDER BY RANDOM()
    LIMIT ?
  `, [count]);

  let items = [...unplayedWords, ...unplayedPhrases].sort(() => Math.random() - 0.5);

  if (items.length < count) {
    const remaining = count - items.length;
    const usedIds = new Set(items.map(i => `${i.item_type}:${i.id}`));

    // Priority 3: Least-played learned items
    const leastPlayed = await queryAll(`
      SELECT
        pl.item_type, pl.item_id as id, pl.play_count,
        CASE WHEN pl.item_type = 'word' THEN w.word ELSE NULL END as word,
        CASE WHEN pl.item_type = 'word' THEN w.phonetic ELSE NULL END as phonetic,
        CASE WHEN pl.item_type = 'word' THEN w.meaning ELSE p.meaning END as meaning,
        CASE WHEN pl.item_type = 'word' THEN w.part_of_speech ELSE NULL END as part_of_speech,
        CASE WHEN pl.item_type = 'word' THEN w.example ELSE p.example END as example,
        CASE WHEN pl.item_type = 'phrase' THEN p.phrase ELSE NULL END as phrase,
        CASE WHEN pl.item_type = 'word' THEN w.difficulty ELSE p.difficulty END as difficulty
      FROM playback_log pl
      LEFT JOIN words w ON pl.item_type = 'word' AND pl.item_id = w.id
      LEFT JOIN phrases p ON pl.item_type = 'phrase' AND pl.item_id = p.id
      ORDER BY pl.play_count ASC, RANDOM()
      LIMIT ?
    `, [remaining * 2]);

    for (const item of leastPlayed) {
      if (items.length >= count) break;
      if (!usedIds.has(`${item.item_type}:${item.id}`)) {
        items.push(item);
        usedIds.add(`${item.item_type}:${item.id}`);
      }
    }
  }

  return items.slice(0, count);
}

async function recordPlay(itemType, itemId) {
  const today = getToday();
  const existing = await queryOne(
    'SELECT * FROM playback_log WHERE item_type = ? AND item_id = ?',
    [itemType, itemId]
  );
  if (existing) {
    await run(
      'UPDATE playback_log SET play_count = play_count + 1, last_played_date = ? WHERE item_type = ? AND item_id = ?',
      [today, itemType, itemId]
    );
  } else {
    await run(
      'INSERT INTO playback_log (item_type, item_id, play_count, last_played_date) VALUES (?, ?, 1, ?)',
      [itemType, itemId, today]
    );
  }
  saveDb();
}

async function getPlaybackStats() {
  const totalPlayed = await queryScalar('SELECT COUNT(*) FROM playback_log WHERE play_count > 0') || 0;
  const totalPlays = await queryScalar('SELECT SUM(play_count) FROM playback_log') || 0;
  return { totalPlayed, totalPlays };
}

module.exports = { getPlaybackItems, recordPlay, getPlaybackStats };
