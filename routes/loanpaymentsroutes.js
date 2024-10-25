const express = require('express');
const {
    createpayment,
    getpaymentsById,
    getpaymentsByUserId,
} = require('../Controllers/loanpayment');

const router = express.Router();
router.post('/create', createpayment);
router.get('/:loanid', getpaymentsById);
router.get('/:userid', getpaymentsByUserId);

module.exports = router;
