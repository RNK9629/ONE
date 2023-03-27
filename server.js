const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

const app = express();
const dotenv = require('dotenv');

const corsOptions = {
  cors: true,
};
dotenv.config();

app.use(cors(corsOptions));
app.use(helmet());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  logger('dev', {
    skip: (req) => ['/api/v1/health-check', '/favicon.ico'].includes(req.url),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require('./app/models');

console.log('>>>>>>>>>process.env.ALTER_DB', process.env.ALTER_DB);
console.log('>>>>>>>>>>>process.env.SYNC_DB', process.env.SYNC_DB);
console.log('>>>>>>>>>>>>process.env.FORCE_UPDATE', process.env.FORCE_UPDATE);
db.sequelize
  .sync({
    alter: !!(process.env.ALTER_DB === 'true'),
    force: !!(process.env.FORCE_UPDATE === 'true'),
  })
  .then(() => {
    // initialize default records files from app/controllers/models/default-records/**
  });

// health check route
app.get('/api/v1/health-check', (req, res) => {
  res.json({ message: 'KL Wallet API Server.' });
});

require('./app/routes/kl_app.routes')(app);
require('./app/routes/api_key.routes')(app);
require('./app/routes/razorpay.routes')(app);
require('./app/routes/payment_options.routes')(app);
require('./app/routes/payment_transaction.routes')(app);
require('./app/routes/user_wallet_view.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}.`);
});
