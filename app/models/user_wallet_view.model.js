module.exports = (sequelize, Sequelize) => {
  const userWalletView = sequelize.define(
    'User_Wallet_View',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: Sequelize.STRING,
      app_name: Sequelize.STRING,
      kl_app_id: Sequelize.INTEGER,
      credited_total: Sequelize.DOUBLE,
      debited_total: Sequelize.DOUBLE,
      wallet_balance: Sequelize.DOUBLE,
    },
    {
      underscored: true,
      timestamps: true,
    }
  );
  userWalletView.sync = () => Promise.resolve();

  return userWalletView;
};
