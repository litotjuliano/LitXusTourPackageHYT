const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { verifyApiToken } = require('../middleware/auth.jwt');

const authController = require('../controllers/admin/auth.controller');
const toursController = require('../controllers/admin/tours.controller');
const leadsController = require('../controllers/admin/leads.controller');

// Auth (unprotected)
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Everything below requires a valid JWT
router.use(verifyApiToken);

const tourUploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFlyer', maxCount: 1 },
]);

router.get('/tours', toursController.list);
router.post('/tours', tourUploadFields, toursController.create);
router.get('/tours/:id', toursController.getOne);
router.put('/tours/:id', tourUploadFields, toursController.update);
router.delete('/tours/:id', toursController.remove);

router.get('/leads', leadsController.list);
router.put('/leads/:id', leadsController.update);

module.exports = router;
