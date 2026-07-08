'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tours', 'departure_dates', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('tours', 'contact_whatsapp_numbers', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('tours', 'departure_dates');
    await queryInterface.removeColumn('tours', 'contact_whatsapp_numbers');
  },
};
