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

    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM items');
    if (rows[0].count === 0) {
      for (const item of seedItems) {
        await client.query(
          `INSERT INTO items (name, price, category, image_url, description)
           VALUES ($1, $2, $3, NULL, $4)`,
          [item.name, item.price, item.category, item.description]
        );
      }
      console.log(`Seeded ${seedItems.length} items.`);
    } else {
      console.log(`Items table already has ${rows[0].count} rows — skipping seed.`);
    }

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
