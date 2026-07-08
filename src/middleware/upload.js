const multer = require('multer');

// memoryStorage: no disk writes, since cPanel's writable paths can be wiped
// across redeploys — buffers are streamed straight to Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

module.exports = upload;
