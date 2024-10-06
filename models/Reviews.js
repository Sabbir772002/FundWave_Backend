const mongoose = require('mongoose');

const ReviewModel = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now },
    loanid: { type: String, required: true },
});

const Review = mongoose.model('Review', ReviewModel);

module.exports = Review;
