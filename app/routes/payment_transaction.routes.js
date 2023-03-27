module.exports = (app) => {
  const paymentTransaction = require('../controllers/payment_transaction.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/pay', verifyToken, paymentTransaction.walletPay);

  router.post('/', verifyToken, paymentTransaction.create);

  router.post('/details', verifyToken, paymentTransaction.findAll);

  router.get('/:id', verifyToken, paymentTransaction.find);

  app.use('/api/v1/payment-transaction', router);
};
