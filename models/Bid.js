const mongoose = require('mongoose');
const { done } = require('../Controllers/payment');
// Define the bid schema
const bidSchema = new mongoose.Schema({
    username: { type: String, required: true },
    loanid: { type: String, required: true },
    deadlineDate: { type: Date, default: null },
    interest: { type: Number, default: 0 }, 
    type: { type: String, enum: ['EMI', 'Wish', 'One Time'], required: true },
    createdAt: { type: Date, default: Date.now },
    final: { type: Boolean, default: false },
    bonus: { type: Number, default: 0 },
});

// Create the model from the schema
const BID = mongoose.model('BID', bidSchema);

module.exports = BID;
