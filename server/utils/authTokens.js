const crypto = require('crypto');
const bcrypt = require('bcryptjs');

function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  return rawToken;
}

async function hashResetToken(rawToken) {
  return bcrypt.hash(rawToken, 12);
}

async function verifyResetToken(rawToken, tokenHash) {
  return bcrypt.compare(rawToken, tokenHash);
}

module.exports = {
  createResetToken,
  hashResetToken,
  verifyResetToken,
};
