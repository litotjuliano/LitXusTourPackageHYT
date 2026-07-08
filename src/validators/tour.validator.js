/**
 * Validates the payload for creating/updating a Tour. Returns an array of
 * {field, message} errors; empty array means the payload is valid.
 */
function validateTourPayload(body, { isUpdate = false } = {}) {
  const errors = [];

  if (!isUpdate || body.title !== undefined) {
    if (!body.title || !String(body.title).trim()) {
      errors.push({ field: 'title', message: 'title is required.' });
    }
  }

  if (!isUpdate || body.price !== undefined) {
    if (body.price === undefined || body.price === null || String(body.price).trim() === '') {
      errors.push({ field: 'price', message: 'price is required.' });
    } else if (Number.isNaN(Number(body.price))) {
      errors.push({ field: 'price', message: 'price must be a number.' });
    }
  }

  return errors;
}

module.exports = { validateTourPayload };
