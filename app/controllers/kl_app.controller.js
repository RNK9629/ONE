const db = require('../models');

const { klApp } = db;

exports.findAll = (req, res) => {
  klApp
    .findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving',
      });
    });
};

exports.create = (req, res) => {
  klApp
    .create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the App',
      });
    });
};
