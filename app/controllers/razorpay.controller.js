/* eslint-disable no-console */
const crypto = require('crypto');
const fetch = require('node-fetch');
const { isEmpty } = require('lodash');
const Razorpay = require('razorpay');
const map = require('./map');
const {
  updateTransaction,
  createTransaction,
  paymentIdData,
} = require('../helper/function-helper');
const db = require('../models');
const { RAZOR_PAY } = require('../helper/constant-helper');

const { klAppPaymentOptions } = db;

exports.createOrder = async (req, res) => {
  try {
    const { order, kl_app_id } = req.body;
    const { receipt, multipleReciept, notes } = order;
    order.currency = 'INR';
    const paymentId = await paymentIdData(RAZOR_PAY);
    const paymentData = await klAppPaymentOptions.findOne({
      where: { payment_option_id: paymentId, kl_app_id },
      attributes: [
        'key_id',
        'key_secret',
        'razorpay_public_token',
        'razorpay_access_token',
      ],
      raw: true,
    });
    const instance = new Razorpay({
      key_id: paymentData.key_id,
      key_secret: paymentData.key_secret,
    });
    const razorpay_url = 'https://api.razorpay.com/v1';
    if (!isEmpty(paymentData.razorpay_access_token)) {
      fetch(`${razorpay_url}/orders`, {
        method: 'post',
        body: JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${paymentData.razorpay_access_token}`,
        },
      })
        .then((paydata) => paydata.json())
        .then(async (response) => {
          const amount = response.amount / 100;
          const gst = amount - amount * (100 / (100 + 18));
          notes.payment_gateway_id = response.id;
          notes.amount_inc_tax = amount;
          notes.paymentOption = RAZOR_PAY;
          notes.payment_gateway_status = response.status;
          notes.transaction_amount = amount - gst;
          notes.transaction_gst_amount = gst;
          notes.kl_app_id = kl_app_id;
          response.razorpay_public_token = paymentData.razorpay_public_token;
          await createTransaction(notes);
          return map.post(req, res, response);
        })
        .catch((error) => {
          console.log('<<<<<<<<<<<<<<<<<<<<', error, '>>>>>>>>>>>>>>>>>>>>>>>');
          return map.error(req, res, error);
        });
    } else if (multipleReciept) {
      delete order.multipleReciept;
      instance.orders.create(order, (err, orders) => {
        if (err) return map.error(req, res, err);
        return map.post(req, res, orders);
      });
    } else {
      delete order.multipleReciept;
      // eslint-disable-next-line consistent-return
      instance.orders.all({ receipt }, (error, orderList) => {
        if (error) return map.error(req, res, error);
        if (!orderList.length) {
          instance.orders.create(order, (err, orders) => {
            if (err) return map.error(req, res, err);
            return map.post(req, res, orders);
          });
        } else {
          map.error(req, res, { message: `Order ${receipt} already exist` });
        }
      });
    }
  } catch (error) {
    console.log('>>>>>>>>>>>>>>>>>>', error, '<<<<<<<<<<<<<<<<<<<<');
    map.error(req, res, error);
  }
};

exports.paymentSuccess = async (req, res) => {
  const {
    body: {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id,
      kl_app_id,
    },
  } = req;
  const paymentId = await paymentIdData(RAZOR_PAY);
  const paymentData = await klAppPaymentOptions.findOne({
    where: { payment_option_id: paymentId, kl_app_id },
    attributes: ['client_secret'],
    raw: true,
  });
  const digest = crypto
    .createHmac('sha256', paymentData.client_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (digest !== razorpay_signature)
    return map.error(req, res, { message: 'Signature is not matched' });
  updateTransaction({ razorpay_order_id });
  return map.post(req, res, { razorpay_order_id });
};
