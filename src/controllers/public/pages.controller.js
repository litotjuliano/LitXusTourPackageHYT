const { Tour, Inquiry } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { buildWhatsAppLink } = require('../../services/whatsapp.service');
const { validateInquiryPayload } = require('../../validators/inquiry.validator');

function decorateWhatsAppLinks(tour) {
  const numbers = [tour.whatsapp_1, tour.whatsapp_2].filter(Boolean);
  tour.whatsapp_links = numbers.map((number) => ({
    number,
    displayUrl: `https://wa.me/${String(number).replace(/[^\d]/g, '')}`,
    link: buildWhatsAppLink(number, null, tour.title),
  }));
  return tour;
}

// GET /
exports.showHome = asyncHandler(async (req, res) => {
  const tours = await Tour.findAll({ order: [['display_order', 'ASC']] });
  res.render('public/home', { title: 'Home', tours: tours.map(decorateWhatsAppLinks) });
});

// GET /tours/:id
exports.showTourDetail = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) {
    req.setFlash('error', 'Tour not found.');
    return res.redirect('/');
  }
  res.render('public/tour-detail', { title: tour.title, tour: decorateWhatsAppLinks(tour) });
});

// POST /tours/:id/inquiry
exports.submitInquiry = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) {
    req.setFlash('error', 'Tour not found.');
    return res.redirect('/');
  }

  const errors = validateInquiryPayload(req.body);
  if (errors.length) {
    req.setFlash('error', errors.map((e) => e.message).join(' '));
    return res.redirect(`/tours/${tour.id}`);
  }

  await Inquiry.create({
    tour_id: tour.id,
    customer_name: req.body.customer_name,
    whatsapp_number: req.body.whatsapp_number,
    email: req.body.email || null,
    preferred_travel_date: req.body.preferred_travel_date || null,
    pax_count: req.body.pax_count || null,
    lead_source: 'Front-end Web',
  });

  req.setFlash('success', 'Thanks for your enquiry! Our consultant will get back to you shortly.');
  res.redirect(`/tours/${tour.id}`);
});
