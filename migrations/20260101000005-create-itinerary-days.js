'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itinerary_days', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tours', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      day_number: { type: Sequelize.INTEGER, allowNull: false },
      day_title_en: { type: Sequelize.STRING(255), allowNull: false },
      day_title_cn: { type: Sequelize.STRING(255), allowNull: false },
      description_en: { type: Sequelize.TEXT, allowNull: false },
      description_cn: { type: Sequelize.TEXT, allowNull: false },
      meals: { type: Sequelize.JSON, allowNull: false },
      hotel_name: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex('itinerary_days', ['tour_id', 'day_number'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('itinerary_days');
  },
};
