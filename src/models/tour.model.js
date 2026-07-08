module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Tour',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      // Single free-text, mixed-language field (e.g. "8天7晚 山东青岛 Shandong
      // Qingdao (君顶酒庄之美酒之旅)") — admin types the whole display line as
      // one string rather than filling parallel en/cn fields.
      title: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      // Free-text, mixed-language departure schedule as the admin wants it
      // displayed (e.g. "2026年9月2, 23日｜12月2日 (02, 23 SEP｜02 DEC 2026)").
      departure_dates: { type: DataTypes.TEXT, allowNull: true },
      whatsapp_1: { type: DataTypes.STRING(30), allowNull: true },
      whatsapp_2: { type: DataTypes.STRING(30), allowNull: true },
      pdf_url: { type: DataTypes.STRING(500), allowNull: true },
      pdf_public_id: { type: DataTypes.STRING(255), allowNull: true },
      cover_image_url: { type: DataTypes.STRING(500), allowNull: true },
      cover_image_public_id: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'tours',
      underscored: true,
      timestamps: true,
    }
  );
