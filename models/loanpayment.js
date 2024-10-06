const mongoose = require('mongoose');
const user=require('./user');
const loanid=require('./loan');
const LoanpaymentSchema = new mongoose.Schema({
    trans: { type: String, required: true },
    loanid: { type: String, required: true },
    give: { type: String, required: true },
    Amount: { type: Number, default: 0 },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Loanpayment = mongoose.model('Loanpayment', LoanpaymentSchema);

module.exports = Loanpayment;