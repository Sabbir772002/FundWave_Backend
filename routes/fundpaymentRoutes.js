const express = require('express');
const {
  createFundpayment,
  getFundpaymentsByCampaignId,
  getFundpaymentsByUserId,
} = require('../Controllers/fundpaymentController');

const router = express.Router();
router.post('/create', createFundpayment);
router.get('/:campaignid', getFundpaymentsByCampaignId);
router.get('/:userid', getFundpaymentsByUserId);

module.exports = router;
