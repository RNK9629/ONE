const { getKeyDetails } = require('../helper/function-helper');

const invalidToken = {
  success: false,
  message: 'Invalid token',
};

const unauthorizedUser = {
  success: false,
  message: 'Unauthorized user',
};

// eslint-disable-next-line consistent-return
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (token == null) return res.status(500).send(invalidToken);

    const keyDetails = await getKeyDetails(token);
    if (token !== keyDetails.api_key) {
      return res.status(500).send(unauthorizedUser);
    }
    req.body.kl_app_id = keyDetails.kl_app_id;
    return next();
  } catch (error) {
    res.status(500).send(unauthorizedUser);
  }
};

module.exports = {
  verifyToken,
};
