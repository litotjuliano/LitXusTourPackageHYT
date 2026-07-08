/**
 * Builds a wa.me click-to-chat link with a pre-filled, correctly
 * percent-encoded message. Always use encodeURIComponent (not encodeURI) so
 * that '&', '=', '?' and non-ASCII (e.g. Chinese) text in the name/title
 * can't corrupt the query string.
 */
function buildWhatsAppLink(phone, customerName, tourTitle) {
  const digitsOnly = String(phone || '').replace(/[^\d]/g, '');
  const safeName = customerName || 'there';
  const safeTitle = tourTitle || 'our tours';
  const message =
    `Hi ${safeName}, thanks for inquiring about the ${safeTitle}! ` +
    `Our consultant will get back to you shortly with more details.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encodedMessage}`;
}

module.exports = { buildWhatsAppLink };
