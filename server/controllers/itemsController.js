const pool = require('../db/pool');

async function getItems(req, res) {
  try {
    const { category } = req.query;

    let result;
    if (category) {
      result = await pool.query(
        `SELECT * FROM items WHERE LOWER(category) = LOWER($1) ORDER BY created_at DESC`,
        [category]
      );
    } else {
      result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    }

    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getItems error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
}

async function createItem(req, res) {
  try {
    const { name, price, category, image_url, description } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO items (name, price, category, image_url, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, price, category, image_url || null, description || null]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('createItem error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to create item' });
  }
}

async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { name, price, category, image_url, description } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required',
      });
    }

    const result = await pool.query(
      `UPDATE items
       SET name = $1, price = $2, category = $3, image_url = $4, description = $5
       WHERE id = $6
       RETURNING *`,
      [name, price, category, image_url || null, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateItem error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update item' });
  }
}

async function deleteItem(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('deleteItem error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to delete item' });
  }
}

module.exports = { getItems, createItem, updateItem, deleteItem };
