const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  title: { type: String },
  category: { type: String },
  targetAmount: { type: Number },
  deadlineDate: { type: Date },
  donationType: { type: String },
  minimumCheck: { type: Boolean },
  interest: { type: Number },
  bkashNumber: { type: String },
  nagadNumber: { type: String },
  rocketNumber: { type: String },
  story: { type: String },
  condition: { type: String },
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
