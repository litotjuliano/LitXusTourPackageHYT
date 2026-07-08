const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Tour = require('./tour.model')(sequelize, DataTypes);
const Inquiry = require('./inquiry.model')(sequelize, DataTypes);
const AdminUser = require('./adminUser.model')(sequelize, DataTypes);

Tour.hasMany(Inquiry, { foreignKey: 'tour_id', onDelete: 'SET NULL' });
Inquiry.belongsTo(Tour, { foreignKey: 'tour_id' });

module.exports = {
  sequelize,
  Tour,
  Inquiry,
  AdminUser,
};
