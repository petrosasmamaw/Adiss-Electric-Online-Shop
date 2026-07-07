const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./pool');
const { migrateDatabase } = require('./migrate');

function getAdminSeedList() {
  return [
    {
      email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
      password: process.env.ADMIN_PASSWORD,
    },
    {
      email: process.env.ADMIN_EMAIL_2?.trim().toLowerCase(),
      password: process.env.ADMIN_PASSWORD_2,
    },
  ].filter((admin) => admin.email && admin.password);
}

async function seedAdmins(client) {
  const admins = getAdminSeedList();

  if (admins.length === 0) {
    console.warn('No admin accounts configured — set ADMIN_EMAIL/PASSWORD and ADMIN_EMAIL_2/PASSWORD_2.');
    return;
  }

  for (const { email, password } of admins) {
    const { rows } = await client.query('SELECT id FROM admins WHERE email = $1', [email]);
    const passwordHash = await bcrypt.hash(password, 12);

    if (rows.length === 0) {
      await client.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [
        email,
        passwordHash,
      ]);
      console.log(`Seeded admin: ${email}`);
    } else {
      await client.query('UPDATE admins SET password_hash = $1 WHERE email = $2', [
        passwordHash,
        email,
      ]);
      console.log(`Updated admin: ${email}`);
    }
  }
}

async function initDatabase() {
  const client = await pool.connect();

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    console.log('Schema applied.');

    await migrateDatabase();
    console.log('Migrations applied.');

    await seedAdmins(client);

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

    const { rows: adminRows } = await client.query('SELECT email FROM admins ORDER BY id');
    console.log(`Admin accounts (${adminRows.length}):`, adminRows.map((row) => row.email).join(', '));
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
