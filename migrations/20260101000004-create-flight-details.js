'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flight_details', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tours', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      airline_carrier: { type: Sequelize.STRING(10), allowNull: false },
      departure_flight_no: { type: Sequelize.STRING(20), allowNull: false },
      return_flight_no: { type: Sequelize.STRING(20), allowNull: false },
      routing_details: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex('flight_details', ['tour_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('flight_details');
  },
};
