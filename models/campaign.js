const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    username: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: String, enum: ['deadline', 'no-deadline'], required: true },
    deadlineDate: { type: Date, default: null },
    donationType: { type: String, enum: ['any', 'minimum', 'fixed'], required: true },
    Amount: { type: Number, default: 0 },
    bkashNumber: { type: String, default: '' },
    nagadNumber: { type: String, default: '' },
    rocketNumber: { type: String, default: '' },
    story: { type: String, default: '' },
    category: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
