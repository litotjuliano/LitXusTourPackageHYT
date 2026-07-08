const multer = require('multer');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  // Passenger surfaces stdout/stderr to the cPanel Node App error log — log
  // every error so failures are visible there, not silently swallowed.
  console.error(err);

  const isApi = req.path.startsWith('/api/');
  const redirectBack = () => res.redirect(req.get('Referer') || '/admin/dashboard');

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'value';
    const message = `A record with this ${field} already exists.`;
    if (isApi) return res.status(409).json({ errors: [{ field, message }] });
    req.setFlash('error', message);
    return redirectBack();
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    if (isApi) return res.status(422).json({ errors });
    req.setFlash('error', errors.map((e) => e.message).join(' '));
    return redirectBack();
  }

  if (err instanceof multer.MulterError) {
    const message = `File upload error: ${err.message}`;
    if (isApi) return res.status(400).json({ errors: [{ field: err.field, message }] });
    req.setFlash('error', message);
    return redirectBack();
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again.' : err.message;

  if (isApi) return res.status(status).json({ error: message });
  req.setFlash('error', message);
  return redirectBack();
};
