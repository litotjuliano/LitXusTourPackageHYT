const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { COOKIE_NAME } = require('../../middleware/auth.jwt');

async function issueLoginResponse(res, admin) {
  const token = jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.display_name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });
  return token;
}

// POST /api/v1/admin/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = email ? await AdminUser.findOne({ where: { email } }) : null;

  if (!admin || !bcrypt.compareSync(password || '', admin.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = await issueLoginResponse(res, admin);
  res.json({ token, admin: { id: admin.id, email: admin.email, display_name: admin.display_name } });
});

// POST /api/v1/admin/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

exports.issueLoginResponse = issueLoginResponse;
