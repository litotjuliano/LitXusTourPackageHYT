const express = require('express');
const router = express.Router();

const pages = require('../controllers/public/pages.controller');

router.get('/', pages.showHome);
router.get('/tours/:id', pages.showTourDetail);
router.post('/tours/:id/inquiry', pages.submitInquiry);

module.exports = router;
