const Fundpayment=require('../models/fundpayment');

// Create a new Fundpayment
const createFundpayment = async (req, res) => {
  try {
    const { campaignid, give, Amount } = req.body;
    const newFundpayment = new Fundpayment({
      campaignid,
      give,
      Amount,
    });
    const savedPayment = await newFundpayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFundpaymentsByCampaignId = async (req, res) => {
  try {
    const { campaignid } = req.params;
    console.log(campaignid);
    const payments = await Fundpayment.find({ campaignid, status: 'success' })
    .populate('give')
    .populate('status')
    .populate('campaignid');
    
      res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Fundpayments by user ID
const getFundpaymentsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const payments = await Fundpayment.find({ give: userid,status:'success' }).populate('give').populate('status').populate('campaignid');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFundpayment,
  getFundpaymentsByCampaignId,
  getFundpaymentsByUserId,
};
