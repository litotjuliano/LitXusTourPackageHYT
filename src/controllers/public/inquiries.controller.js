const { Inquiry } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { validateInquiryPayload } = require('../../validators/inquiry.validator');

// POST /api/v1/public/inquiry
exports.create = asyncHandler(async (req, res) => {
  const errors = validateInquiryPayload(req.body);
  if (errors.length) return res.status(422).json({ errors });

  const inquiry = await Inquiry.create({
    tour_id: req.body.tour_id || null,
    customer_name: req.body.customer_name,
    whatsapp_number: req.body.whatsapp_number,
    email: req.body.email || null,
    preferred_travel_date: req.body.preferred_travel_date || null,
    pax_count: req.body.pax_count || null,
    lead_source: req.body.lead_source || 'Front-end Web',
  });

  res.status(201).json({ inquiry });
});
