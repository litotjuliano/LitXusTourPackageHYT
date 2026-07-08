const express = require('express');
const router = express.Router();

const toursController = require('../controllers/public/tours.controller');
const inquiriesController = require('../controllers/public/inquiries.controller');

router.get('/tours', toursController.list);
router.get('/tours/:id', toursController.getDetail);
router.post('/inquiry', inquiriesController.create);

module.exports = router;
