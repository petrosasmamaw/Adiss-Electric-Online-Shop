const pool = require('../db/pool');

async function getControls(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT products_enabled, price_visible FROM app_controls WHERE id = 1'
    );

    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO app_controls (id, products_enabled, price_visible)
         VALUES (1, TRUE, TRUE)
         ON CONFLICT (id) DO NOTHING`
      );
      return res.json({
        success: true,
        data: { products_enabled: true, price_visible: true },
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('getControls error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch controls' });
  }
}

async function updateControls(req, res) {
  try {
    const { products_enabled, price_visible } = req.body;
    if (typeof products_enabled !== 'boolean' || typeof price_visible !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'products_enabled and price_visible must be boolean',
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO app_controls (id, products_enabled, price_visible, updated_at)
       VALUES (1, $1, $2, NOW())
       ON CONFLICT (id) DO UPDATE
       SET products_enabled = EXCLUDED.products_enabled,
           price_visible = EXCLUDED.price_visible,
           updated_at = NOW()
       RETURNING products_enabled, price_visible`,
      [products_enabled, price_visible]
    );

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('updateControls error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update controls' });
  }
}

module.exports = { getControls, updateControls };

