const { get } = require('lodash');
const { Op } = require('sequelize');
const { WALLET, DEBITED, CREDITED } = require('../helper/constant-helper');
const {
  createTransaction,
  checkValidDates,
} = require('../helper/function-helper');
const db = require('../models');

const { paymentTransaction, userWalletView, paymentOptions } = db;

exports.walletPay = async (req, res) => {
  const { user_id, amount, kl_app_id } = req.body;
  try {
    const balanceCheck = await userWalletView.findOne({
      where: { user_id, kl_app_id },
      attributes: ['wallet_balance'],
      raw: true,
    });
    if (balanceCheck.wallet_balance >= amount) {
      const createData = {
        ...req.body,
        paymentOption: WALLET,
        transaction_status: DEBITED,
        transaction_amount: amount,
      };
      await createTransaction(createData);
      return res
        .status(200)
        .send({ success: true, message: 'Successfully Paid' });
    }
    return res.status(200).send({
      message: 'Low Balance. Please Recharge your wallet and try.',
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err || 'some error occured while paying',
    });
  }
};

exports.create = async (req, res) => {
  const { amount, payMode } = req.body;
  try {
    const gst = amount - amount * (100 / (100 + 18));
    const createData = {
      ...req.body,
      paymentOption: payMode,
      transaction_status: CREDITED,
      amount_inc_tax: amount,
      transaction_amount: amount - gst,
      transaction_gst_amount: gst,
    };
    await createTransaction(createData);
    return res
      .status(200)
      .send({ success: true, message: 'Successfully Paid' });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err || 'some error occured while paying',
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { user_id, kl_app_id, offset, limit, sort, type, date } = req.body;
    let whereClause = {};
    whereClause = { user_id, kl_app_id };
    if (type) {
      whereClause.transaction_status = type;
    }
    const validatedDates = await checkValidDates(date);
    if (validatedDates.length) {
      const startDate = get(validatedDates, '[0]', '');
      const endDate = get(validatedDates, '[1]', '');
      whereClause.creation_date = {
        [Op.between]: [startDate, endDate],
      };
    }
    const data = await paymentTransaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: paymentOptions,
          attributes: ['payment_channel'],
        },
      ],
      offset: offset && limit && (Number(offset) - 1) * Number(limit),
      limit: limit && Number(limit),
      order: [['creation_date', sort || 'desc']],
      raw: true,
    });
    return res.status(200).send({ success: true, data });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err || 'some error occured while retrieving',
    });
  }
};

exports.find = (req, res) => {
  const { id } = req.params;
  paymentTransaction
    .findOne({
      include: [{ all: true }],
      where: { id },
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Failed to retrieve the data',
      });
    });
};
