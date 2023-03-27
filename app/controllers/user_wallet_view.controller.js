const db = require('../models');

const { userWalletView } = db;

exports.findOne = async (req, res) => {
  try {
    const { user_id, kl_app_id } = req.body;
    const data = await userWalletView.findOne({
      where: { user_id, kl_app_id },
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
