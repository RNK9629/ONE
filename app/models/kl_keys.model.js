module.exports = (sequelize, Sequelize) => {
  const klKeys = sequelize.define(
    'kl_keys',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      api_key: Sequelize.STRING,
      kl_app_id: Sequelize.INTEGER,
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  return klKeys;
};
