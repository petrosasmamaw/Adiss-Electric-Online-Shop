function getFrontendUrl() {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL.replace(/\/$/, '');
  }

  const corsOrigin = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (corsOrigin.length > 0) {
    return corsOrigin[0];
  }

  return 'http://localhost:5173';
}

module.exports = { getFrontendUrl };
