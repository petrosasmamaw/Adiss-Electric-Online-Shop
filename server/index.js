require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const categoriesRoutes = require('./routes/categories');
const ordersRoutes = require('./routes/orders');
const controlsRoutes = require('./routes/controls');
const { migrateDatabase } = require('./db/migrate');

const app = express();
const PORT = process.env.PORT || 5000;

function normalizeOrigin(origin) {
  return origin.replace(/\/$/, '');
}

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => normalizeOrigin(o.trim()))
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true;
  return allowedOrigins.includes(normalizeOrigin(origin));
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || isOriginAllowed(origin)) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin, '| allowed:', allowedOrigins);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

function attachCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    corsOrigins: allowedOrigins,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/controls', controlsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  attachCorsHeaders(req, res);

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

async function startServer() {
  try {
    await migrateDatabase();
    console.log('Database migration check complete.');
  } catch (err) {
    console.error('Database migration failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Addis Electric API running on http://localhost:${PORT}`);
    console.log('CORS allowed origins:', allowedOrigins.length ? allowedOrigins : '(none configured)');
  });
}

startServer();
