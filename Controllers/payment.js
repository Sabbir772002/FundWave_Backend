const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// SSLCommerz credentials
const STORE_ID = 'your_store_id'; // Replace with your actual Store ID
const STORE_PASSWORD = 'your_store_password'; // Replace with your actual Store Password

// Initiate a payment
app.post('/initiate-payment', async (req, res) => {
    const { amount, transactionID, name, email, phone } = req.body;

    try {
        // SSLCOMMERZ API request to initiate payment
        const response = await axios.post('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
            store_id: STORE_ID,
            store_passwd: STORE_PASSWORD,
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionID,
            success_url: 'http://yourdomain.com/success',
            fail_url: 'http://yourdomain.com/fail',
            cancel_url: 'http://yourdomain.com/cancel',
            cus_name: name,
            cus_email: email,
            cus_phone: phone,
            shipping_method: 'NO',
            product_name: 'Donation',
            product_category: 'Donation',
            product_profile: 'Donation',
        });

        // Return payment initiation data to frontend
        res.json(response.data);
    } catch (error) {
        console.error('Error initiating payment:', error.message);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
