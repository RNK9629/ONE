module.exports = (app) => {
  const klApp = require('../controllers/kl_app.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/', verifyToken, klApp.create);

  router.get('/', verifyToken, klApp.findAll);

  app.use('/api/v1/kl-app', router);
};
