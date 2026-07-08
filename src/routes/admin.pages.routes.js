const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { verifyPageToken } = require('../middleware/auth.jwt');
const pages = require('../controllers/admin/pages.controller');

// Auth (unprotected)
router.get('/login', pages.showLogin);
router.post('/login', pages.handleLogin);

// Everything below requires a valid session cookie
router.use(verifyPageToken);

router.get('/logout', pages.logout);
router.get('/dashboard', pages.showDashboard);

const tourUploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFlyer', maxCount: 1 },
]);

router.get('/tours', pages.showTourList);
router.get('/tours/new', pages.showTourForm);
router.post('/tours', tourUploadFields, pages.submitTourCreate);
router.get('/tours/:id/edit', pages.showTourForm);
router.post('/tours/:id/update', tourUploadFields, pages.submitTourUpdate);
router.post('/tours/:id/delete', pages.submitTourDelete);

router.get('/leads', pages.showLeads);
router.post('/leads/:id/status', pages.submitLeadStatusUpdate);

module.exports = router;
