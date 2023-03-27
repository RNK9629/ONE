module.exports = (app) => {
  const userWallet = require('../controllers/user_wallet_view.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/', verifyToken, userWallet.findOne);

  app.use('/api/v1/user-wallet', router);
};
