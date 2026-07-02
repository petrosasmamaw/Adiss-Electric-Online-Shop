const pool = require('../db/pool');

async function getOrders(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getOrders error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
}

async function createOrder(req, res) {
  try {
    const { item_id, customer_name, customer_phone, customer_address, quantity } = req.body;

    if (!item_id || !customer_name || !customer_phone || !customer_address) {
      return res.status(400).json({
        success: false,
        error: 'item_id, customer_name, customer_phone, and customer_address are required',
      });
    }

    const qty = quantity || 1;

    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const item = itemResult.rows[0];
    const total_price = parseFloat(item.price) * qty;

    const result = await pool.query(
      `INSERT INTO orders (item_id, item_name, customer_phone, customer_name, customer_address, quantity, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [item_id, item.name, customer_phone, customer_name, customer_address, qty, total_price]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('createOrder error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('deleteOrder error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
}

const VALID_STATUSES = ['pending', 'in_delivery', 'delivered', 'canceled'];

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateOrderStatus error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
}

module.exports = { getOrders, createOrder, deleteOrder, updateOrderStatus };
