const pool = require('../db/pool');

async function getCategories(req, res) {
  try {
    const result = await pool.query(
      'SELECT DISTINCT category FROM items ORDER BY category ASC'
    );

    const categories = result.rows.map((row) => row.category);
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('getCategories error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
}

async function searchCategories(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const result = await pool.query(
      `SELECT DISTINCT category FROM items WHERE category ILIKE $1 ORDER BY category ASC`,
      [`%${q}%`]
    );

    const categories = result.rows.map((row) => row.category);
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('searchCategories error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to search categories' });
  }
}

module.exports = { getCategories, searchCategories };
