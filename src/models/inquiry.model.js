module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Inquiry',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tour_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'tours', key: 'id' },
      },
      customer_name: { type: DataTypes.STRING(150), allowNull: false },
      whatsapp_number: { type: DataTypes.STRING(30), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: true, validate: { isEmail: true } },
      preferred_travel_date: { type: DataTypes.DATEONLY, allowNull: true },
      pax_count: { type: DataTypes.INTEGER, allowNull: true },
      lead_source: {
        type: DataTypes.ENUM('Front-end Web', 'WhatsApp Direct click', 'WeChat click'),
        allowNull: false,
        defaultValue: 'Front-end Web',
      },
      admin_notes: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM('New', 'Contacted', 'Deposited', 'Closed'),
        allowNull: false,
        defaultValue: 'New',
      },
    },
    {
      tableName: 'inquiries_and_leads',
      underscored: true,
      timestamps: true,
    }
  );
