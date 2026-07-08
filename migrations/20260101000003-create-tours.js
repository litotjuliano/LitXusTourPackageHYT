'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tours', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'regions', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      title_en: { type: Sequelize.STRING(255), allowNull: false },
      title_cn: { type: Sequelize.STRING(255), allowNull: false },
      duration_en: { type: Sequelize.STRING(100), allowNull: false },
      duration_cn: { type: Sequelize.STRING(100), allowNull: false },
      tour_code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      highlights_en: { type: Sequelize.JSON, allowNull: false },
      highlights_cn: { type: Sequelize.JSON, allowNull: false },
      base_price_adult: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      base_price_child: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      pdf_url: { type: Sequelize.STRING(500), allowNull: true },
      pdf_public_id: { type: Sequelize.STRING(255), allowNull: true },
      cover_image_url: { type: Sequelize.STRING(500), allowNull: true },
      cover_image_public_id: { type: Sequelize.STRING(255), allowNull: true },
      status: {
        type: Sequelize.ENUM('Draft', 'Active', 'Hidden'),
        allowNull: false,
        defaultValue: 'Draft',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex('tours', ['region_id']);
    await queryInterface.addIndex('tours', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tours');
  },
};
