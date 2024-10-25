const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    username: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: String, enum: ['deadline', 'no-deadline'], required: true },
    deadlineDate: { type: Date, default: null },
    donationType: { type: String, enum: ['any', 'minimum', 'fixed'], required: true },
    amount: { type: Number, default: 0 }, // Changed to camelCase
    bkashNumber: { type: String, default: '' },
    nagadNumber: { type: String, default: '' },
    rocketNumber: { type: String, default: '' },
    story: { type: String, default: '' },
    category: { type: String, default: '' },
    imageUrl: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    condition: {type: String}
});

campaignSchema.pre('validate', function(next) {
    if (this.target === 'deadline' && !this.deadlineDate) {
        return next(new Error('deadlineDate is required when target is "deadline"'));
    }
    next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
