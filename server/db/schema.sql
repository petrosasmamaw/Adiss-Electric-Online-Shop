CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_admin_id ON password_reset_tokens(admin_id);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  lower_price NUMERIC(10,2),
  upper_price NUMERIC(10,2),
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE items ADD COLUMN IF NOT EXISTS lower_price NUMERIC(10,2);
ALTER TABLE items ADD COLUMN IF NOT EXISTS upper_price NUMERIC(10,2);
ALTER TABLE items ADD COLUMN IF NOT EXISTS image_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_address TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(10,2),
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_controls (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  products_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  price_visible BOOLEAN NOT NULL DEFAULT TRUE,
  contact_phones JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE app_controls ADD COLUMN IF NOT EXISTS contact_phones JSONB NOT NULL DEFAULT '[]'::jsonb;
