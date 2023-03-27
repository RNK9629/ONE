module.exports = (sequelize, Sequelize) => {
  const klAppPaymentOptions = sequelize.define(
    'kl_app_payment_options',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      key_id: {
        type: Sequelize.STRING,
      },
      key_secret: {
        type: Sequelize.STRING,
      },
      razorpay_public_token: {
        type: Sequelize.STRING,
      },
      razorpay_access_token: {
        type: Sequelize.STRING(1000),
      },
      client_secret: {
        type: Sequelize.STRING,
      },
      payment_option_id: {
        type: Sequelize.INTEGER,
      },
      kl_app_id: {
        type: Sequelize.INTEGER,
      },
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  return klAppPaymentOptions;
};
