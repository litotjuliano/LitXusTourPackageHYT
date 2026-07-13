const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { sequelize, Tour, Inquiry, AdminUser } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { validateTourPayload } = require('../../validators/tour.validator');
const { uploadImageStream, uploadPdfStream } = require('../../services/cloudinary.service');
const { buildPdfPublicId, buildCoverImagePublicId } = require('../../services/pdfNaming.service');
const { buildWhatsAppLink } = require('../../services/whatsapp.service');
const { issueLoginResponse } = require('./auth.controller');
const { COOKIE_NAME } = require('../../middleware/auth.jwt');

// ---- Auth ----

function getDevCredentials() {
  if (process.env.NODE_ENV === 'production') return null;
  return {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@hytours.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'changeme123',
  };
}

exports.showLogin = (req, res) => res.render('auth/login', { title: 'Login', devCredentials: getDevCredentials() });

exports.handleLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = email ? await AdminUser.findOne({ where: { email } }) : null;

  if (!admin || !bcrypt.compareSync(password || '', admin.password_hash)) {
    return res.status(401).render('auth/login', { title: 'Login', email, flash: { type: 'error', message: 'Invalid email or password.' }, devCredentials: getDevCredentials() });
  }

  await issueLoginResponse(res, admin);
  res.redirect('/admin/dashboard');
});

exports.logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.redirect('/admin/login');
};

// ---- Dashboard ----

exports.showDashboard = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalTours, newLeadsThisWeek] = await Promise.all([
    Tour.count(),
    Inquiry.count({ where: { created_at: { [Op.gte]: sevenDaysAgo } } }),
  ]);
  res.render('dashboard/index', { title: 'Dashboard', counts: { totalTours, newLeadsThisWeek } });
});

// ---- Tours ----

exports.showTourList = asyncHandler(async (req, res) => {
  const tours = await Tour.findAll({ order: [['display_order', 'ASC']] });
  res.render('tours/list', { title: 'Tours', tours });
});

exports.showTourForm = asyncHandler(async (req, res) => {
  let tour = null;
  if (req.params.id) {
    tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      req.setFlash('error', 'Tour not found.');
      return res.redirect('/admin/tours');
    }
  }
  res.render('tours/form', { title: tour ? 'Edit Tour' : 'New Tour', tour, errors: [], formValues: {} });
});

exports.submitTourCreate = asyncHandler(async (req, res) => {
  const errors = validateTourPayload(req.body);
  if (errors.length) {
    return res.status(422).render('tours/form', { title: 'New Tour', tour: null, errors, formValues: req.body });
  }

  const coverFile = req.files && req.files.coverImage ? req.files.coverImage[0] : null;
  const pdfFile = req.files && req.files.pdfFlyer ? req.files.pdfFlyer[0] : null;

  const tour = await sequelize.transaction(async (t) => {
    const maxOrder = (await Tour.max('display_order', { transaction: t })) || 0;
    const created = await Tour.create(
      {
        title: req.body.title,
        price: req.body.price,
        departure_dates: req.body.departure_dates || null,
        whatsapp_1: req.body.whatsapp_1 || null,
        whatsapp_2: req.body.whatsapp_2 || null,
        display_order: maxOrder + 1,
      },
      { transaction: t }
    );

    if (coverFile) {
      const imgResult = await uploadImageStream(coverFile.buffer, {
        folder: 'hyt/covers',
        public_id: buildCoverImagePublicId(created.id),
      });
      created.cover_image_url = imgResult.secure_url;
      created.cover_image_public_id = imgResult.public_id;
    }

    if (pdfFile) {
      const pdfResult = await uploadPdfStream(pdfFile.buffer, {
        folder: 'hyt/itineraries',
        public_id: buildPdfPublicId(created.id),
      });
      created.pdf_url = pdfResult.secure_url;
      created.pdf_public_id = pdfResult.public_id;
    }

    await created.save({ transaction: t });
    return created;
  });

  req.setFlash('success', 'Tour created.');
  res.redirect(`/admin/tours/${tour.id}/edit`);
});

exports.submitTourUpdate = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) {
    req.setFlash('error', 'Tour not found.');
    return res.redirect('/admin/tours');
  }

  const errors = validateTourPayload(req.body, { isUpdate: true });
  if (errors.length) {
    return res.status(422).render('tours/form', { title: 'Edit Tour', tour, errors, formValues: req.body });
  }

  const coverFile = req.files && req.files.coverImage ? req.files.coverImage[0] : null;
  const pdfFile = req.files && req.files.pdfFlyer ? req.files.pdfFlyer[0] : null;

  const updates = {
    title: req.body.title ?? tour.title,
    price: req.body.price ?? tour.price,
    departure_dates: req.body.departure_dates || null,
    whatsapp_1: req.body.whatsapp_1 || null,
    whatsapp_2: req.body.whatsapp_2 || null,
  };

  if (coverFile) {
    const imgResult = await uploadImageStream(coverFile.buffer, {
      folder: 'hyt/covers',
      public_id: buildCoverImagePublicId(tour.id),
    });
    updates.cover_image_url = imgResult.secure_url;
    updates.cover_image_public_id = imgResult.public_id;
  }

  if (pdfFile) {
    const pdfResult = await uploadPdfStream(pdfFile.buffer, {
      folder: 'hyt/itineraries',
      public_id: buildPdfPublicId(tour.id),
    });
    updates.pdf_url = pdfResult.secure_url;
    updates.pdf_public_id = pdfResult.public_id;
  }

  await tour.update(updates);

  req.setFlash('success', 'Tour updated.');
  res.redirect(`/admin/tours/${tour.id}/edit`);
});

exports.submitTourDelete = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (tour) await tour.destroy();
  req.setFlash('success', 'Tour deleted.');
  res.redirect('/admin/tours');
});

// ---- Leads ----

exports.showLeads = asyncHandler(async (req, res) => {
  const leads = await Inquiry.findAll({
    include: [{ model: Tour, attributes: ['id', 'title'] }],
    order: [['created_at', 'DESC']],
  });
  const decorated = leads.map((lead) => {
    const plain = lead.toJSON();
    const tourTitle = plain.Tour ? plain.Tour.title : 'our tours';
    return { ...plain, whatsapp_link: buildWhatsAppLink(plain.whatsapp_number, plain.customer_name, tourTitle) };
  });
  res.render('leads/list', { title: 'Leads', leads: decorated });
});

exports.submitLeadStatusUpdate = asyncHandler(async (req, res) => {
  const lead = await Inquiry.findByPk(req.params.id);
  if (lead) await lead.update({ status: req.body.status });
  res.redirect('/admin/leads');
});
