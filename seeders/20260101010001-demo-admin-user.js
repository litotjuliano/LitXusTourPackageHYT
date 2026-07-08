'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@hytours.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'changeme123';
    const password_hash = bcrypt.hashSync(password, 10);

    await queryInterface.bulkInsert('admin_users', [
      {
        email,
        password_hash,
        display_name: 'HYT Admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('admin_users', {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@hytours.com',
    });
  },
};
