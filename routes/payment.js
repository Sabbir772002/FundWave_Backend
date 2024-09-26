const express = require('express');
const {
  givepay,
  done,fail,cancel,ipn
} = require('../Controllers/payment');

const router = express.Router();
router.post('/givepay', givepay);
router.get('/success', done);
router.get('/fail', fail);
router.get('/cancel', cancel);
router.post('/ipn', ipn);
module.exports = router;
