const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    freezeTableName: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'creation_date',
    updatedAt: 'modified_date',
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.klApp = require('./kl_app.model')(sequelize, Sequelize);
db.klKeys = require('./kl_keys.model')(sequelize, Sequelize);
db.paymentOptions = require('./payment_options.model')(sequelize, Sequelize);
db.klAppPaymentOptions = require('./kl_app_payment_options.model')(
  sequelize,
  Sequelize
);
db.paymentTransaction = require('./payment_transaction.model')(
  sequelize,
  Sequelize
);
db.userWalletView = require('./user_wallet_view.model')(sequelize, Sequelize);

// Relations
db.klApp.hasMany(db.klKeys, {
  foreignKey: 'kl_app_id',
  targetKey: 'kl_app_id',
  sourceKey: 'id',
  constraints: false,
  as: 'klApp',
});
db.klKeys.belongsTo(db.klApp, {
  foreignKey: 'kl_app_id',
  as: 'klApp',
});

db.paymentOptions.hasMany(db.klAppPaymentOptions, {
  foreignKey: 'payment_option_id',
  targetKey: 'payment_option_id',
  sourceKey: 'id',
  constraints: false,
  as: 'klAppPaymentOptions',
});
db.klAppPaymentOptions.belongsTo(db.paymentOptions, {
  foreignKey: 'payment_option_id',
});
db.klAppPaymentOptions.belongsTo(db.klApp, { foreignKey: 'kl_app_id' });

db.paymentOptions.hasMany(db.paymentTransaction, {
  foreignKey: 'payment_option_id',
  targetKey: 'payment_option_id',
  sourceKey: 'id',
  constraints: false,
  as: 'paymentTransaction',
});
db.paymentTransaction.belongsTo(db.paymentOptions, {
  foreignKey: 'payment_option_id',
});
db.paymentTransaction.belongsTo(db.klApp, { foreignKey: 'kl_app_id' });

module.exports = db;
