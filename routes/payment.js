const express = require('express');
const {
  givepay,
} = require('../Controllers/payment');

const router = express.Router();
router.post('/givepay', givepay);
module.exports = router;
