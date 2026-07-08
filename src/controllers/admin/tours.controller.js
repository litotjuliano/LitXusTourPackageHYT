const { sequelize, Tour } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { validateTourPayload } = require('../../validators/tour.validator');
const { uploadImageStream, uploadPdfStream } = require('../../services/cloudinary.service');
const { buildPdfPublicId, buildCoverImagePublicId } = require('../../services/pdfNaming.service');

// GET /api/v1/admin/tours
exports.list = asyncHandler(async (req, res) => {
  const tours = await Tour.findAll({ order: [['created_at', 'DESC']] });
  res.json({ tours });
});

// GET /api/v1/admin/tours/:id
exports.getOne = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: 'Tour not found' });
  res.json({ tour });
});

// POST /api/v1/admin/tours
// Create flow: validate -> create row (inside a transaction) -> only then
// upload files, since the Cloudinary public_id is derived from the
// now-finalized tour id. A Cloudinary failure rolls back the transaction so
// no half-created tour is left behind.
exports.create = asyncHandler(async (req, res) => {
  const errors = validateTourPayload(req.body);
  if (errors.length) return res.status(422).json({ errors });

  const coverFile = req.files && req.files.coverImage ? req.files.coverImage[0] : null;
  const pdfFile = req.files && req.files.pdfFlyer ? req.files.pdfFlyer[0] : null;

  const tour = await sequelize.transaction(async (t) => {
    const created = await Tour.create(
      {
        title: req.body.title,
        price: req.body.price,
        departure_dates: req.body.departure_dates || null,
        whatsapp_1: req.body.whatsapp_1 || null,
        whatsapp_2: req.body.whatsapp_2 || null,
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

  res.status(201).json({ tour });
});

// PUT /api/v1/admin/tours/:id
exports.update = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: 'Tour not found' });

  const errors = validateTourPayload(req.body, { isUpdate: true });
  if (errors.length) return res.status(422).json({ errors });

  const coverFile = req.files && req.files.coverImage ? req.files.coverImage[0] : null;
  const pdfFile = req.files && req.files.pdfFlyer ? req.files.pdfFlyer[0] : null;

  const updates = {
    title: req.body.title ?? tour.title,
    price: req.body.price ?? tour.price,
    departure_dates: req.body.departure_dates ?? tour.departure_dates,
    whatsapp_1: req.body.whatsapp_1 ?? tour.whatsapp_1,
    whatsapp_2: req.body.whatsapp_2 ?? tour.whatsapp_2,
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
  res.json({ tour });
});

// DELETE /api/v1/admin/tours/:id
exports.remove = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: 'Tour not found' });
  await tour.destroy();
  res.json({ success: true });
});
