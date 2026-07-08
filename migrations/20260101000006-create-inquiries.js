'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inquiries_and_leads', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'tours', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      customer_name: { type: Sequelize.STRING(150), allowNull: false },
      whatsapp_number: { type: Sequelize.STRING(30), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: true },
      preferred_travel_date: { type: Sequelize.DATEONLY, allowNull: true },
      pax_count: { type: Sequelize.INTEGER, allowNull: true },
      lead_source: {
        type: Sequelize.ENUM('Front-end Web', 'WhatsApp Direct click', 'WeChat click'),
        allowNull: false,
        defaultValue: 'Front-end Web',
      },
      admin_notes: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('New', 'Contacted', 'Deposited', 'Closed'),
        allowNull: false,
        defaultValue: 'New',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.addIndex('inquiries_and_leads', ['tour_id']);
    await queryInterface.addIndex('inquiries_and_leads', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inquiries_and_leads');
  },
};
