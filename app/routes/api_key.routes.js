module.exports = (app) => {
  const apiKey = require('../controllers/api_key.controller');
  const { verifyToken } = require('./verifyToken');

  const router = require('express').Router();

  router.post('/', verifyToken, apiKey.create);

  router.get('/:id', verifyToken, apiKey.find);

  router.delete('/:id', verifyToken, apiKey.delete);

  app.use('/api/v1/api-key', router);
};
