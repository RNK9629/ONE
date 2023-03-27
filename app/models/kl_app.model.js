module.exports = (sequelize, Sequelize) => {
  const klApp = sequelize.define(
    'kl_app',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      app_name: Sequelize.STRING,
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  return klApp;
};
