const express = require('express');
const { givepay, done, fail, cancel, ipn } = require('../Controllers/payment');

const router = express.Router();

// Define routes with the correct parameter syntax
router.post('/givepay', givepay);
router.post('/success/:id', done);
router.post('/fail/:id', fail);
router.post('/cancel/:id', cancel);
router.post('/ipn', ipn);

module.exports = router;
