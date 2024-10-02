const mongoose = require('mongoose');
const user=require('./user');
const loanid=require('./loan');
const LoanpaymentSchema = new mongoose.Schema({
    loanid: { type: String, required: true },
    take: { type: String, required: true },
    give: { type: String, required: true },
    Amount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Loanpayment = mongoose.model('Loanpaymen', LoanpaymentSchema);

module.exports = Loanpayment;