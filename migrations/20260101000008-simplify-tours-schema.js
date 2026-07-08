'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Product pivot: tours become simple flyer cards (title, PDF, date,
    // price, 2 WhatsApp contacts, image) with no region grouping and no
    // structured day-by-day/flight data — the uploaded PDF is now the
    // itinerary. Drop the tables/columns tied to the old structure and
    // recreate `tours` with the minimal schema.
    // inquiries_and_leads.tour_id still has a live FK into tours, so disable
    // FK checks for the duration of this restructure (tours is recreated
    // with the same name/id column right after, so the FK remains valid).
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.dropTable('flight_details');
    await queryInterface.dropTable('itinerary_days');
    await queryInterface.dropTable('tours');
    await queryInterface.dropTable('regions');

    await queryInterface.createTable('tours', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.TEXT, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      departure_dates: { type: Sequelize.TEXT, allowNull: true },
      whatsapp_1: { type: Sequelize.STRING(30), allowNull: true },
      whatsapp_2: { type: Sequelize.STRING(30), allowNull: true },
      pdf_url: { type: Sequelize.STRING(500), allowNull: true },
      pdf_public_id: { type: Sequelize.STRING(255), allowNull: true },
      cover_image_url: { type: Sequelize.STRING(500), allowNull: true },
      cover_image_public_id: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.dropTable('tours');

    await queryInterface.createTable('regions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name_en: { type: Sequelize.STRING(150), allowNull: false },
      name_cn: { type: Sequelize.STRING(150), allowNull: false },
      slug: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.createTable('tours', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      region_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'regions', key: 'id' } },
      title_en: { type: Sequelize.STRING(255), allowNull: false },
      title_cn: { type: Sequelize.STRING(255), allowNull: false },
      duration_en: { type: Sequelize.STRING(100), allowNull: false },
      duration_cn: { type: Sequelize.STRING(100), allowNull: false },
      tour_code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      highlights_en: { type: Sequelize.JSON, allowNull: false },
      highlights_cn: { type: Sequelize.JSON, allowNull: false },
      base_price_adult: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      base_price_child: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      departure_dates: { type: Sequelize.TEXT, allowNull: true },
      contact_whatsapp_numbers: { type: Sequelize.JSON, allowNull: false },
      pdf_url: { type: Sequelize.STRING(500), allowNull: true },
      pdf_public_id: { type: Sequelize.STRING(255), allowNull: true },
      cover_image_url: { type: Sequelize.STRING(500), allowNull: true },
      cover_image_public_id: { type: Sequelize.STRING(255), allowNull: true },
      status: { type: Sequelize.ENUM('Draft', 'Active', 'Hidden'), allowNull: false, defaultValue: 'Draft' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.createTable('flight_details', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tours', key: 'id' }, onDelete: 'CASCADE' },
      airline_carrier: { type: Sequelize.STRING(10), allowNull: false },
      departure_flight_no: { type: Sequelize.STRING(20), allowNull: false },
      return_flight_no: { type: Sequelize.STRING(20), allowNull: false },
      routing_details: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });

    await queryInterface.createTable('itinerary_days', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tours', key: 'id' }, onDelete: 'CASCADE' },
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
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },
};
