const { Tour } = require('../../models');
const asyncHandler = require('../../utils/asyncHandler');

// GET /api/v1/public/tours
exports.list = asyncHandler(async (req, res) => {
  const tours = await Tour.findAll({ order: [['created_at', 'DESC']] });
  res.json({ tours });
});

// GET /api/v1/public/tours/:id
exports.getDetail = asyncHandler(async (req, res) => {
  const tour = await Tour.findByPk(req.params.id);
  if (!tour) return res.status(404).json({ error: 'Tour not found' });
  res.json({ tour });
});
