module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'AdminUser',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      display_name: { type: DataTypes.STRING(150), allowNull: false },
    },
    {
      tableName: 'admin_users',
      underscored: true,
      timestamps: true,
    }
  );
