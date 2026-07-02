require('dotenv').config();
const pool = require('./pool');
const seedItems = require('./seed');

const oldSeedNames = [
  'LED Bulb 9W Warm White',
  'LED Bulb 12W Daylight',
  'Twin & Earth Cable 2.5mm (per metre)',
  'PVC Conduit Pipe 20mm (3m)',
  'Double Socket Outlet 13A',
  '1-Gang Light Switch',
];

async function syncCatalog() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM items WHERE name = ANY($1::text[])', [oldSeedNames]);

    let inserted = 0;
    for (const item of seedItems) {
      const existing = await client.query(
        'SELECT id FROM items WHERE name = $1 LIMIT 1',
        [item.name]
      );
      if (existing.rows.length > 0) continue;

      const low = Number(item.lower_price);
      const high = Number(item.upper_price);
      const price = (low + high) / 2;

      await client.query(
        `INSERT INTO items (name, price, lower_price, upper_price, category, image_url, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [item.name, price, low, high, item.category, item.image_url || null, item.description || null]
      );
      inserted += 1;
    }

    await client.query('COMMIT');
    const total = await client.query('SELECT COUNT(*)::int AS count FROM items');
    console.log(`Inserted new catalog items: ${inserted}`);
    console.log(`Total items in DB now: ${total.rows[0].count}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Catalog sync failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

syncCatalog();

