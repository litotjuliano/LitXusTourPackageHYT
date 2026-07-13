'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tours', 'display_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Backfill existing rows sequentially (1, 2, 3, ...) ordered by
    // created_at ASC, id ASC. Uses a SELECT + per-row UPDATE loop rather
    // than a window-function UPDATE...JOIN, since this migration must also
    // run unmodified against whatever MySQL/MariaDB version the cPanel
    // production host provides — window functions aren't guaranteed there.
    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM tours ORDER BY created_at ASC, id ASC'
    );
    for (let i = 0; i < rows.length; i++) {
      await queryInterface.sequelize.query(
        'UPDATE tours SET display_order = ? WHERE id = ?',
        { replacements: [i + 1, rows[i].id] }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('tours', 'display_order');
  },
};
