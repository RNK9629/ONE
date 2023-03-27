module.exports = (sequelize, Sequelize) => {
  const paymentOptions = sequelize.define(
    'payment_options',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      payment_channel: Sequelize.STRING,
      type: Sequelize.STRING,
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  return paymentOptions;
};
