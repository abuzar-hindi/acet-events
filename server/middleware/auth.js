// middleware/auth.js — Organizer authentication middleware
const crypto = require('crypto');

// Generate a signed session token for organizer
function generateOrganizerToken(password) {
  const timestamp = Date.now();
  const payload = `organizer:${timestamp}`;
  const hmac = crypto.createHmac('sha256', password).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

// Verify a signed session token
function verifyOrganizerToken(token, password) {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [prefix, timestampStr, hmac] = decoded.split(':');
    if (prefix !== 'organizer') return false;

    const timestamp = parseInt(timestampStr, 10);
    // Expire token after 24 hours
    if (isNaN(timestamp) || Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedHmac = crypto.createHmac('sha256', password).update(`organizer:${timestamp}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

/**
 * Middleware: Requires organizer authorization.
 * Accepts:
 * - Header 'x-organizer-token'
 * - Header 'authorization: Bearer <token>'
 * - Header 'x-organizer-password'
 * - Request body 'password'
 */
const requireOrganizerAuth = (req, res, next) => {
  const correctPassword = process.env.ADD_MEMBER_PASSWORD || 'acet_ca_26';

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const organizerToken = req.headers['x-organizer-token'] || bearerToken;
  const directPassword = req.headers['x-organizer-password'] || req.body?.password;

  // 1. Check token validity
  if (organizerToken && verifyOrganizerToken(organizerToken, correctPassword)) {
    req.isOrganizer = true;
    return next();
  }

  // 2. Direct password verification
  if (directPassword && directPassword === correctPassword) {
    req.isOrganizer = true;
    return next();
  }

  return res.status(401).json({
    message: 'Unauthorized: Organizer authentication required to perform this action.',
  });
};

module.exports = {
  generateOrganizerToken,
  verifyOrganizerToken,
  requireOrganizerAuth,
};
