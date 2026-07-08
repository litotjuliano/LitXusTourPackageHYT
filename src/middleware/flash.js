const COOKIE_NAME = 'hyt_flash';

// Lightweight cookie-based flash (no express-session in use, since auth is
// JWT-only). Sets res.locals.flash for the current render and clears it;
// req.setFlash(...) queues a message for the *next* request after a redirect.
function flashMiddleware(req, res, next) {
  let flash = null;
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    try {
      flash = JSON.parse(req.cookies[COOKIE_NAME]);
    } catch (e) {
      flash = null;
    }
    res.clearCookie(COOKIE_NAME);
  }
  res.locals.flash = flash;

  req.setFlash = (type, message) => {
    res.cookie(COOKIE_NAME, JSON.stringify({ type, message }), {
      httpOnly: true,
      maxAge: 5000,
    });
  };

  next();
}

module.exports = flashMiddleware;
