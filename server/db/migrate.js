const pool = require('./pool');
const { DEFAULT_CONTACT_PHONES } = require('../utils/phone');

async function migrateDatabase() {
  await pool.query(`
    ALTER TABLE app_controls
    ADD COLUMN IF NOT EXISTS contact_phones JSONB NOT NULL DEFAULT '[]'::jsonb
  `);

  await pool.query(
    `INSERT INTO app_controls (id, products_enabled, price_visible, contact_phones)
     VALUES (1, TRUE, TRUE, $1::jsonb)
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(DEFAULT_CONTACT_PHONES)]
  );

  await pool.query(
    `UPDATE app_controls
     SET contact_phones = $1::jsonb
     WHERE id = 1
       AND (
         contact_phones IS NULL
         OR contact_phones = '[]'::jsonb
         OR jsonb_array_length(contact_phones) = 0
       )`,
    [JSON.stringify(DEFAULT_CONTACT_PHONES)]
  );
}

module.exports = { migrateDatabase };
