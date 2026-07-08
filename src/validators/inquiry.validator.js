const VALID_LEAD_SOURCES = ['Front-end Web', 'WhatsApp Direct click', 'WeChat click'];

/**
 * Validates the payload for a public inquiry/lead submission. Returns an
 * array of {field, message} errors; empty array means the payload is valid.
 */
function validateInquiryPayload(body) {
  const errors = [];

  if (!body.customer_name || !String(body.customer_name).trim()) {
    errors.push({ field: 'customer_name', message: 'customer_name is required.' });
  }
  if (!body.whatsapp_number || !String(body.whatsapp_number).trim()) {
    errors.push({ field: 'whatsapp_number', message: 'whatsapp_number is required.' });
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push({ field: 'email', message: 'email must be a valid email address.' });
  }
  if (body.lead_source && !VALID_LEAD_SOURCES.includes(body.lead_source)) {
    errors.push({ field: 'lead_source', message: `lead_source must be one of: ${VALID_LEAD_SOURCES.join(', ')}` });
  }

  return errors;
}

module.exports = { validateInquiryPayload, VALID_LEAD_SOURCES };
