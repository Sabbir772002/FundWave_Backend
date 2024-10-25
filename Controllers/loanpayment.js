const Loanpayment=require('../models/loanpayment');
const Loan=require('../models/loan');

// Create a new Fundpayment
const createpayment = async (req, res) => {
  try {
    const { laonid, give, Amount } = req.body;
    const Loanpayment = new Loanpayment({
      campaignid,
      give,
      Amount,
    });
    const savedPayment = await Loanpayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getpaymentsById = async (req, res) => {
  try {
    const { loanid } = req.params;
    console.log(loanid);
    console.log("loanid");
    const payments = await Loanpayment.find({ loanid, status: 'success' })
    .populate('give')
    .populate('status')
    .populate('loanid');
    const loan = await Loan.findById(loanid);
    let totalAmount = 0;

    // totalAmount = loan.Amount+(loan.Amount*loan.interest/100)+(loan.bonus);
    // payments.forEach((payment) => {
    //   if(payment.give!=loan.username)totalAmount += payment.Amount;
    //   else totalAmount -= payment.Amount;
    // });
    
    payments.forEach((payment) => {
      if(payment.give!=loan.username)totalAmount += payment.Amount;
      else totalAmount -= payment.Amount;
    });
    //condition should be updated, because totalAmount also include interest,bonus
    if(totalAmount<=0 && payments.length>0){  
      await Loan.findByIdAndUpdate(loanid, { condition: 'Completed' },
      { new: true }
      );
    }
    console.log("loan updated");
    console.log(totalAmount);

      res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Fundpayments by user ID
const getpaymentsByUserId = async (req, res) => {
  try {
    const { loanid } = req.params;
    const payments = await Loanpayment.find({ give: loanid,status:'success' }).populate('give').populate('status').populate('loanid');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createpayment,
  getpaymentsById,
  getpaymentsByUserId,
};
