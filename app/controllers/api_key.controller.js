const hat = require('hat');
const db = require('../models');

const KlApp = db.klApp;
const UserKlApp = db.userKlApp;
const UserKeys = db.klKeys;
const KlKeys = db.klKeys;

exports.create = (req, res) => {
  const { app_id, title } = req.body;
  const api_key = hat();
  UserKlApp.findOne({
    where: {
      app_id,
    },
    include: [{ all: true, nested: true }],
  })
    .then((userKlApp) => {
      if (userKlApp) {
        const keyData = { api_key, title, kl_app_id: app_id };
        KlKeys.create(keyData, {})
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'Failed to create the api key',
            });
          });
      } else {
        res.status(500).send({
          message: `App doesn't exist`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Failed to Generate the API KEY',
      });
    });
};

exports.find = (req, res) => {
  const { id } = req.params;
  KlApp.findOne({
    attributes: [],
    include: [{ all: true, nested: true }],
    where: {
      id,
    },
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

exports.delete = (req, res) => {
  UserKeys.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send('Successfully deleted');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting ',
      });
    });
};
