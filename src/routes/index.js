const express = require('express');
const router = express.Router();

router.use('/api/v1/public', require('./public.routes'));
router.use('/api/v1/admin', require('./admin.api.routes'));
router.use('/admin', require('./admin.pages.routes'));
router.use('/', require('./public.pages.routes'));

module.exports = router;
