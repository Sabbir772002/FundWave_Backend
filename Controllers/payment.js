const axios = require('axios');
const SSLCommerzPayment = require('sslcommerz-lts');
require('dotenv').config();
const Fundpayment = require('../models/fundpayment');
const Loanpayment = require('../models/loanpayment');
const Campaign = require('../models/campaign');
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // true for live mode, false for sandbox

// POST request for initiating payment
const givepay = async (req, res) => {
  const { price, username, plan, id,tip } = req.body;
  console.log(price, username, plan, id,tip);

  const tran_id = Date.now().toString();

  const data = {
    total_amount: price,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${process.env.SERVER_API}/api/payment/success/${tran_id}`,
    fail_url: `${process.env.SERVER_API}/api/payment/fail/${tran_id}`,
    cancel_url: `${process.env.SERVER_API}/api/payment/cancel/${tran_id}`,
    ipn_url: `${process.env.SERVER_API}/api/payment/ipn`,
    shipping_method: "None",
    product_name: plan,
    product_category: plan,
    product_profile: "general",
    cus_name: username,
    cus_email: "nomail@gmail.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    ship_name: username,
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh"
  };

  try {
    console.log("Initiating payment...");

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(async (apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      console.log("Payment initialized successfully");

      // Insert a pending payment into the appropriate collection based on the plan type
      if (plan === "Campaign") {
        const payment = new Fundpayment({
          trans: tran_id,
          campaignid: id,
          give: username,
          Amount: price,
          status: "pending",
          tip:tip,
          createdAt: new Date()
        });
        await payment.save();
      } else  {
        const payment = new Loanpayment({
          trans: tran_id,
          loanid: id,
          give: username,
          Amount: price,
          status: "pending",
          createdAt: new Date()
        });
        await payment.save();
        console.log("payment: ");
        console.log(payment);
      }
      res.send({ url: GatewayPageURL });
    }).catch((error) => {
      console.error("Error initializing payment: ", error);
      res.status(500).send("Error during payment initialization");
    });
  } catch (error) {
    console.error("Error in givepay function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

// POST request for handling successful payment
const done = async (req, res) => {
  const { id } = req.params;

  try {
    // First, try to update Fundpayment
    let payment = await Fundpayment.findOneAndUpdate(
      { trans: id },
      { $set: { status: 'success' } },
      { new: true }
    );
    if(payment){
      const campaign=await Campaign.findById(payment.campaignid);
      const paymensts=await Fundpayment.find({campaignid:payment.campaignid,status:'success'});
      let totalAmount=0;
      paymensts.forEach((payment)=>{
        totalAmount+=payment.Amount-payment.tip;
      });
      if(totalAmount>=campaign.amount){
        await Campaign
        .findById
        (payment.campaignid)
        .updateOne({condition:'Completed'});
      }
      res.redirect(`http://localhost:5173/payment/success/${payment.campaignid}`);
    } else {
      // Otherwise, try to update Loanpayment
      payment = await Loanpayment.findOneAndUpdate(
        { trans: id },
        { $set: { status: 'success' } },
        { new: true }
      );

      if (payment) {
        res.redirect(`http://localhost:5173/payment/success/loan/${payment.loanid}`);
      } else {
        res.status(404).send("Payment not found");
      }
    }
  } catch (error) {
    console.error("Error in done function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

// POST request for handling failed payment
const fail = async (req, res) => {
  const { id } = req.params;

  try {
    // First, try to update Fundpayment
    let payment = await Fundpayment.findOneAndUpdate(
      { trans: id },
      { $set: { status: 'failed' } },
      { new: true }
    );

    if (payment) {
      res.redirect(`http://localhost:5173/payment/fail/${payment.campaignid}`);
    } else {
      // Otherwise, try to update Loanpayment
      payment = await Loanpayment.findOneAndUpdate(
        { trans: id },
        { $set: { status: 'failed' } },
        { new: true }
      );

      if (payment) {
        res.redirect(`http://localhost:5173/payment/fail/loan/${payment.loanid}`);
      } else {
        res.status(404).send("Payment not found");
      }
    }
  } catch (error) {
    console.error("Error in fail function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

// POST request for handling canceled payment
const cancel = async (req, res) => {
  const { id } = req.params;

  try {
    // First, try to update Fundpayment
    let payment = await Fundpayment.findOneAndUpdate(
      { trans: id },
      { $set: { status: 'canceled' } },
      { new: true }
    );

    if (payment) {
      res.redirect(`http://localhost:5173/payment/cancel/${payment.campaignid}`);
    } else {
      // Otherwise, try to update Loanpayment
      payment = await Loanpayment.findOneAndUpdate(
        { trans: id },
        { $set: { status: 'canceled' } },
        { new: true }
      );
      
      if (payment) {
        res.redirect(`http://localhost:5173/payment/cancel/loan/${payment.campaignid}`);
      } else {
        res.status(404).send("Payment not found");
      }
    }
  } catch (error) {
    console.error("Error in cancel function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

// POST request for handling IPN (Instant Payment Notification)
const ipn = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // First, try to update Fundpayment
    let payment = await Fundpayment.findOneAndUpdate(
      { trans: id },
      { $set: { status: status === "VALID" ? 'success' : 'failed' } },
      { new: true }
    );

    if (!payment) {
      // Otherwise, try to update Loanpayment
      await Loanpayment.findOneAndUpdate(
        { trans: id },
        { $set: { status: status === "VALID" ? 'success' : 'failed' } },
        { new: true }
      );
    }
    res.send({ message: "IPN received and processed" });
  } catch (error) {
    console.error("Error in ipn function: ", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  givepay,
  done,
  fail,
  cancel,
  ipn
};
