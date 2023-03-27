const moment = require('moment');
const db = require('../models');
const { CREDITED } = require('./constant-helper');

const { paymentTransaction, paymentOptions, klKeys } = db;

const paymentIdData = async (paymentName) => {
  try {
    const klpaymentData = await paymentOptions.findOne({
      where: { payment_channel: paymentName },
      attributes: ['id'],
      raw: true,
    });
    return klpaymentData.id;
  } catch (err) {
    throw new Error(err);
  }
};

const createTransaction = async (data) => {
  try {
    const paymentId = await paymentIdData(data.paymentOption);
    const createData = {
      ...data,
      payment_option_id: paymentId,
    };
    paymentTransaction.create(createData);
  } catch (err) {
    throw new Error(err);
  }
};

const updateTransaction = async (data) => {
  try {
    paymentTransaction.update(
      { transaction_status: CREDITED, payment_gateway_status: 'success' },
      {
        where: {
          payment_gateway_id: data.razorpay_order_id,
        },
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

const checkValidDates = (date) => {
  let dateValue;
  try {
    dateValue = JSON.parse(date);
  } catch (e) {
    dateValue = [];
  }
  if (moment(dateValue[0]).isValid() && moment(dateValue[1]).isValid()) {
    return dateValue;
  }
  return [];
};

const getKeyDetails = async (key) => {
  try {
    const keyDetails = await klKeys.findOne({
      where: { api_key: key },
      attributes: ['api_key', 'kl_app_id'],
      raw: true,
    });
    return keyDetails;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  paymentIdData,
  checkValidDates,
  getKeyDetails,
};
