const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'hyt_admin_token';

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return (req.cookies && req.cookies[COOKIE_NAME]) || null;
}

// For JSON API routes: on failure, respond 401 JSON.
function verifyApiToken(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// For EJS page routes: on failure, redirect to login instead of JSON 401.
function verifyPageToken(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.redirect('/admin/login');
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.currentAdmin = req.admin;
    return next();
  } catch (e) {
    res.clearCookie(COOKIE_NAME);
    return res.redirect('/admin/login');
  }
}

module.exports = { verifyApiToken, verifyPageToken, COOKIE_NAME };
