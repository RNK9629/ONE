module.exports = (sequelize, Sequelize) => {
  const paymentTransaction = sequelize.define(
    'payment_transaction',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: 'transaction_id',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      payment_gateway_id: Sequelize.UUID,
      payment_gateway_status: {
        type: Sequelize.STRING,
      },
      amount_inc_tax: {
        type: Sequelize.DOUBLE,
      },
      transaction_status: {
        type: Sequelize.STRING,
      },
      transaction_reason: {
        type: Sequelize.STRING,
      },
      transaction_amount: {
        type: Sequelize.DOUBLE,
      },
      transaction_gst_amount: {
        type: Sequelize.DOUBLE,
      },
      payment_option_id: {
        type: Sequelize.INTEGER,
      },
      kl_app_id: {
        type: Sequelize.INTEGER,
      },
      created_by: {
        type: Sequelize.UUID,
      },
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  return paymentTransaction;
};
