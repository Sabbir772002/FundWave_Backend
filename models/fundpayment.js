const mongoose = require('mongoose');
const user=require('./user');
const campaign=require('./campaign');
const FundpaymentSchema = new mongoose.Schema({
    campaignid: { type: String, required: true },
    give: { type: String, required: true },
    Amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Fundpayment = mongoose.model('Fundpayment', FundpaymentSchema);

module.exports = Fundpayment;