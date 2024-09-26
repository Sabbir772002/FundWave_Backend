const axios = require('axios');
const SSLCommerzPayment = require('sslcommerz-lts');
require('dotenv').config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;// true for live mode, false for sandbox

const givepay = async (req, res) => {
  // Assuming planDetails should be an object
  const planDetails = {
    plan: "Loan",
    user_email: "customer@example.com", // Assuming a valid email here
    price: 100 // Price in integer form
  };
  // Convert price into an integer
  const price = parseInt(planDetails.price);
  
  // Create a transaction ID using Date.now for simplicity
  const tran_id = Date.now().toString();

  // Payment data to send to SSLCommerz
  const data = {
    total_amount: price,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${process.env.SERVER_API}/payment/success`,
    fail_url: `${process.env.SERVER_API}/payment/fail`,
    cancel_url: `${process.env.SERVER_API}/payment/cancel`,
    ipn_url: `${process.env.SERVER_API}/payment/ipn`,
    shipping_method: "Courier",
    product_name: planDetails.plan,
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: planDetails.user_email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh"
  };

  try {
    console.log("Initiating payment...");

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      // Get the payment gateway URL
      console.log(apiResponse);
      let GatewayPageURL = apiResponse.GatewayPageURL;
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
const done= async (req, res) => {
    // Redirect to payment success page in client
    res.redirect("http://localhost:5173/payment/success");
  };
  
  // POST request for handling failed payment
  const fail= async (req, res) => {
    // Redirect to payment failed page in client
    res.redirect("http://localhost:5173/payment/fail");
  };
  
  // POST request for handling canceled payment
  const cancel= async (req, res) => {
    // Redirect to payment cancel page in client
    res.redirect("http://localhost:5173/payment/cancel");
  };
  
  // POST request for handling IPN (Instant Payment Notification)
  const ipn= async (req, res) => {
    // Process IPN notification if needed
    res.send({ message: "IPN received" });
  };

module.exports = {
  givepay
};
