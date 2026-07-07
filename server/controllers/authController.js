const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { sendBrevoEmail } = require('../services/brevoEmail');
const { createResetToken, hashResetToken, verifyResetToken } = require('../utils/authTokens');
const { getFrontendUrl } = require('../utils/frontendUrl');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_HOURS = 1;

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, email, password_hash FROM admins WHERE email = $1',
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      success: true,
      data: { token, expiresIn: '8h' },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_RE.test(normalizedEmail)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  const genericMessage =
    'If an account exists for this email, a password reset link has been sent.';

  try {
    const { rows } = await pool.query('SELECT id, email FROM admins WHERE email = $1', [
      normalizedEmail,
    ]);

    if (rows.length === 0) {
      return res.json({ success: true, message: genericMessage });
    }

    const admin = rows[0];
    const rawToken = createResetToken();
    const tokenHash = await hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 60 * 60 * 1000);

    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = NOW()
       WHERE admin_id = $1 AND used_at IS NULL`,
      [admin.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (admin_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [admin.id, tokenHash, expiresAt]
    );

    const resetUrl = `${getFrontendUrl()}/admin/reset-password?token=${rawToken}`;
    const htmlContent = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0F172A;max-width:560px;">
        <h2 style="color:#D90429;margin-bottom:8px;">Adiss Electric Shop</h2>
        <p>We received a request to reset your admin password.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#D90429;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link:</p>
        <p style="word-break:break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in ${RESET_TOKEN_HOURS} hour.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await sendBrevoEmail({
      to: admin.email,
      subject: 'Reset your Adiss Electric Shop admin password',
      htmlContent,
    });

    return res.json({ success: true, message: genericMessage });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Unable to send reset email right now. Please try again later.',
    });
  }
}

async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ success: false, error: 'Token and new password are required' });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 8 characters',
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT prt.id, prt.admin_id, prt.token_hash, prt.expires_at, prt.used_at
       FROM password_reset_tokens prt
       WHERE prt.used_at IS NULL AND prt.expires_at > NOW()
       ORDER BY prt.created_at DESC`
    );

    let matchedToken = null;
    for (const row of rows) {
      const isMatch = await verifyResetToken(token, row.token_hash);
      if (isMatch) {
        matchedToken = row;
        break;
      }
    }

    if (!matchedToken) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset link',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [
      passwordHash,
      matchedToken.admin_id,
    ]);

    await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [
      matchedToken.id,
    ]);

    return res.json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (err) {
    console.error('Reset password error:', err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = { login, forgotPassword, resetPassword };
