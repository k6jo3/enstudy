const { queryAll } = require('../db/helpers');

async function getReviewItems(today, count = null) {
  if (!count) {
    count = Math.floor(Math.random() * 6) + 5; // 5-10
  }

  return queryAll(`
    SELECT ll.item_type, ll.item_id,
           COALESCE(e.total_errors, 0) as error_count
    FROM learning_log ll
    LEFT JOIN (
      SELECT item_type, item_id, SUM(error_count) as total_errors
      FROM errors GROUP BY item_type, item_id
    ) e ON ll.item_type = e.item_type AND ll.item_id = e.item_id
    WHERE ll.learn_date < ? AND ll.is_review = 0
    GROUP BY ll.item_type, ll.item_id
    ORDER BY COALESCE(e.total_errors, 0) DESC, RANDOM()
    LIMIT ?
  `, [today, count]);
}

module.exports = { getReviewItems };
