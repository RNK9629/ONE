module.exports = (app) => {
  const rzp = require('../controllers/razorpay.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/create-order', verifyToken, rzp.createOrder);

  router.post('/payment-success', verifyToken, rzp.paymentSuccess);

  app.use('/api/v1/rzp', router);
};
