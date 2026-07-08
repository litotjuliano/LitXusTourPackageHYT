const { Inquiry, Tour } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');
const { buildWhatsAppLink } = require('../../services/whatsapp.service');

function decorateWithWhatsAppLink(lead) {
  const plain = lead.toJSON ? lead.toJSON() : lead;
  const tourTitle = plain.Tour ? plain.Tour.title : 'our tours';
  return { ...plain, whatsapp_link: buildWhatsAppLink(plain.whatsapp_number, plain.customer_name, tourTitle) };
}

// GET /api/v1/admin/leads
exports.list = asyncHandler(async (req, res) => {
  const leads = await Inquiry.findAll({
    include: [{ model: Tour, attributes: ['id', 'title'] }],
    order: [['created_at', 'DESC']],
  });
  res.json({ leads: leads.map(decorateWithWhatsAppLink) });
});

// PUT /api/v1/admin/leads/:id
exports.update = asyncHandler(async (req, res) => {
  const lead = await Inquiry.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const { status, admin_notes } = req.body;
  await lead.update({
    status: status ?? lead.status,
    admin_notes: admin_notes ?? lead.admin_notes,
  });
  res.json({ lead });
});
