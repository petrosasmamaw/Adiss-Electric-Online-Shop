const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./pool');
const seedItems = require('./seed');

async function seedAdmin(client) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('ADMIN_EMAIL and ADMIN_PASSWORD not set — skipping admin seed.');
    return;
  }

  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM admins');
  if (rows[0].count > 0) {
    console.log(`Admins table already has ${rows[0].count} row(s) — skipping admin seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await client.query(
    'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
    [email, passwordHash]
  );
  console.log(`Seeded admin: ${email}`);
}

async function initDatabase() {
  const client = await pool.connect();

  try {
    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    await client.query(schema);

    await seedAdmin(client);

    await client.query(
      `INSERT INTO app_controls (id, products_enabled, price_visible, contact_phones)
       VALUES (1, TRUE, TRUE, $1::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(['+251911189171', '+25178942424', '+251974732323'])]
    );

    await client.query(
      `UPDATE app_controls
       SET contact_phones = $1::jsonb
       WHERE id = 1
         AND (contact_phones IS NULL OR contact_phones = '[]'::jsonb)`,
      [JSON.stringify(['+251911189171', '+25178942424', '+251974732323'])]
    );

    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM items');
    if (rows[0].count === 0) {
      for (const item of seedItems) {
        const price = (item.lower_price + item.upper_price) / 2;
        await client.query(
          `INSERT INTO items (name, price, lower_price, upper_price, category, image_url, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [item.name, price, item.lower_price, item.upper_price, item.category, item.image_url || null, item.description]
        );
      }
      console.log(`Seeded ${seedItems.length} items.`);
    } else {
      console.log(`Items table already has ${rows[0].count} rows — skipping seed.`);
    }

    await client.query(
      `UPDATE items
       SET lower_price = COALESCE(lower_price, price),
           upper_price = COALESCE(upper_price, price)`
    );

    console.log('Database initialized successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase().catch((err) => {
  console.error('Database initialization failed:', err.message);
  process.exit(1);
});
