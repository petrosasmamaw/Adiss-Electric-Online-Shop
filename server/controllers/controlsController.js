const pool = require('../db/pool');
const { migrateDatabase } = require('../db/migrate');
const { DEFAULT_CONTACT_PHONES, sanitizePhones } = require('../utils/phone');

function parsePhones(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function getControlsRow() {
  const { rows } = await pool.query(
    'SELECT products_enabled, price_visible, contact_phones FROM app_controls WHERE id = 1'
  );
  return rows[0];
}

async function getControls(req, res) {
  try {
    await migrateDatabase();

    let row = await getControlsRow();
    let contact_phones = parsePhones(row?.contact_phones);

    if (contact_phones.length === 0) {
      await pool.query(
        `UPDATE app_controls SET contact_phones = $1::jsonb, updated_at = NOW() WHERE id = 1`,
        [JSON.stringify(DEFAULT_CONTACT_PHONES)]
      );
      row = await getControlsRow();
      contact_phones = parsePhones(row?.contact_phones);
    }

    return res.json({
      success: true,
      data: {
        products_enabled: row?.products_enabled ?? true,
        price_visible: row?.price_visible ?? true,
        contact_phones,
      },
    });
  } catch (err) {
    console.error('getControls error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch controls' });
  }
}

async function updateControls(req, res) {
  try {
    const { products_enabled, price_visible, contact_phones } = req.body;

    if (
      products_enabled === undefined &&
      price_visible === undefined &&
      contact_phones === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'At least one field is required',
      });
    }

    await migrateDatabase();

    const current = await getControlsRow();
    if (!current) {
      return res.status(500).json({ success: false, error: 'Controls row not found' });
    }

    if (products_enabled !== undefined && typeof products_enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'products_enabled must be boolean',
      });
    }
    if (price_visible !== undefined && typeof price_visible !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'price_visible must be boolean',
      });
    }

    let nextPhones = parsePhones(current.contact_phones);
    if (contact_phones !== undefined) {
      const cleaned = sanitizePhones(contact_phones);
      if (cleaned === null) {
        return res.status(400).json({
          success: false,
          error: 'contact_phones must be an array of phone numbers',
        });
      }
      nextPhones = cleaned;
    }

    const nextProducts =
      products_enabled !== undefined ? products_enabled : current.products_enabled;
    const nextPrice = price_visible !== undefined ? price_visible : current.price_visible;

    const { rows } = await pool.query(
      `UPDATE app_controls
       SET products_enabled = $1,
           price_visible = $2,
           contact_phones = $3::jsonb,
           updated_at = NOW()
       WHERE id = 1
       RETURNING products_enabled, price_visible, contact_phones`,
      [nextProducts, nextPrice, JSON.stringify(nextPhones)]
    );

    const updated = rows[0];

    return res.json({
      success: true,
      data: {
        products_enabled: updated.products_enabled,
        price_visible: updated.price_visible,
        contact_phones: parsePhones(updated.contact_phones),
      },
    });
  } catch (err) {
    console.error('updateControls error:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update controls' });
  }
}

module.exports = { getControls, updateControls };
