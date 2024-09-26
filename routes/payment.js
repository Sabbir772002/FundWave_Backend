const express = require('express');
const {
  getthik,
  givepay,
} = require('../Controllers/payment');

const router = express.Router();
router.post('/thik', getthik);
router.post('/givepay', givepay);
module.exports = router;
