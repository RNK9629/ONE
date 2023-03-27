const { map, groupBy } = require('lodash');
const { Op } = require('sequelize');
const { WALLET } = require('../helper/constant-helper');
const { paymentIdData } = require('../helper/function-helper');
const { userWalletView } = require('../models');
const db = require('../models');

const { paymentOptions, klAppPaymentOptions } = db;

exports.findAll = async (req, res) => {
  try {
    const { wallet, user_id, kl_app_id } = req.body;
    const klWallet = wallet && {
      payment_option_id: { [Op.not]: await paymentIdData(WALLET) },
    };
    const paymentOptionData = await klAppPaymentOptions.findAll({
      where: { kl_app_id, ...klWallet },
      attributes: ['payment_option_id'],
      raw: true,
    });
    const ids = map(paymentOptionData, (item) => {
      return item.payment_option_id;
    });
    const userBalance =
      !wallet &&
      (await userWalletView.findAll({
        where: { user_id },
        attributes: ['wallet_balance'],
        raw: true,
      }));
    paymentOptions
      .findAll({ where: { id: ids } })
      .then((data) => {
        const groupData = groupBy(data, 'type');
        res.status(200).send({
          success: true,
          data: groupData,
          userBalance: userBalance.wallet_balance,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving',
        });
      });
  } catch (error) {
    res.status(500).send({
      message: error || 'Some error occurred while retrieving',
    });
  }
};
