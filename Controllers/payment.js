const axios = require('axios');

// SSLCommerz credentials
const STORE_ID = 'perso66deb7ebf3443'; 
const STORE_PASSWORD = 'perso66deb7ebf3443@ssl';

const givepay = async (req, res) => {
    // Sample data, ideally these should come from req.body
    let amount = 103;
    let transactionID = `SSLCZ_TEST_${Date.now()}`; // Unique transaction ID
    let name = "Test Customer";
    let email = "test@test.com";
    let phone = "01711111111";

    // Customer and shipment information
    const postData = {
        store_id: STORE_ID,
        store_passwd: STORE_PASSWORD,
        total_amount: amount,
        currency: 'BDT',
        tran_id: transactionID,
        success_url: "http://localhost/new_sslcz_gw/success.php",
        fail_url: "http://localhost/new_sslcz_gw/fail.php",
        cancel_url: "http://localhost/new_sslcz_gw/cancel.php",
        emi_option: "1",
        emi_max_inst_option: "9",
        emi_selected_inst: "9",
        cus_name: name,
        cus_email: email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: phone,
        cus_fax: phone,
        ship_name: "Store Test",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
        value_a: "ref001",
        value_b: "ref002",
        value_c: "ref003",
        value_d: "ref004",
        cart: JSON.stringify([
            { product: "DHK TO BRS AC A1", amount: "200.00" },
            { product: "DHK TO BRS AC A2", amount: "200.00" },
            { product: "DHK TO BRS AC A3", amount: "200.00" },
            { product: "DHK TO BRS AC A4", amount: "200.00" }
        ]),
        product_amount: "100",
        vat: "5",
        discount_amount: "5",
        convenience_fee: "3",
    };

    try {
        // Send request to SSLCOMMERZ API
        const response = await axios.post('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', postData);
        
        if (response.data.status === 'SUCCESS') {
            res.json({ url: response.data.GatewayPageURL });
        } else {
            res.status(500).json({ error: 'Failed to initiate payment', reason: response.data.failedreason });
        }
    } catch (error) {
        console.error('Error initiating payment:', error.message);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

module.exports = {
    givepay
};
