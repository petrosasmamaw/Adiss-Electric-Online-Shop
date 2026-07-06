function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return '';
  return origin.trim().replace(/\/$/, '');
}

function parseCorsOrigins(value) {
  if (!value) return [];

  return [
    ...new Set(
      String(value)
        .split(/[,;\n]+/)
        .map((part) => normalizeOrigin(part.replace(/^["']|["']$/g, '')))
        .filter(Boolean)
    ),
  ];
}

const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
];

function getAllowedOrigins() {
  const fromEnv = parseCorsOrigins(process.env.CORS_ORIGIN);

  if (process.env.NODE_ENV !== 'production') {
    return [...new Set([...fromEnv, ...DEV_ORIGINS])];
  }

  return fromEnv;
}

function isOriginAllowed(origin, allowedOrigins) {
  if (!origin) return true;
  return allowedOrigins.includes(normalizeOrigin(origin));
}

module.exports = {
  normalizeOrigin,
  parseCorsOrigins,
  getAllowedOrigins,
  isOriginAllowed,
};
