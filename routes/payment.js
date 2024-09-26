const express = require('express');
const {
  getthik
} = require('../Controllers/payment');

const router = express.Router();
router.post('/thik', getthik);
module.exports = router;
