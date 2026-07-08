/**
 * Deterministic Cloudinary public_id (without extension) for a tour's
 * itinerary PDF. The tour must already have a durable id (i.e. the row is
 * already created) since the PDF's identity is derived from it.
 */
function buildPdfPublicId(tourId) {
  if (!tourId) {
    throw new Error('tour id is required before an itinerary PDF can be uploaded');
  }
  return `tour-${tourId}-itinerary`;
}

function buildCoverImagePublicId(tourId) {
  if (!tourId) {
    throw new Error('tour id is required before a cover image can be uploaded');
  }
  return `tour-${tourId}-cover`;
}

module.exports = { buildPdfPublicId, buildCoverImagePublicId };
