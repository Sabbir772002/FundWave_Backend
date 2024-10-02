const express = require('express');
const {
  givepay,
  done,fail,cancel,ipn
} = require('../Controllers/payment');

const router = express.Router();
router.post('/givepay', givepay);
router.post('/success', done);
router.post('/fail', fail);
router.post('/cancel', cancel);
router.post('/ipn', ipn);
module.exports = router;
