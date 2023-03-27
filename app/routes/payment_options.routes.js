module.exports = (app) => {
  const paymentOptions = require('../controllers/payment_options.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/', verifyToken, paymentOptions.findAll);

  app.use('/api/v1/payment-options', router);
};
