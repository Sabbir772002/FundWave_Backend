const express = require('express');
const Campaign = require('../models/campaign'); // Ensure this is the correct model
const { use } = require('./auth');
const router = express.Router();

// Middleware to validate input
const validateInput = (req, res, next) => {
    // console.log(req.body);
    // console.log("in validateInput");
    const { username,title, target,category, deadlineDate, donationType, Amount, bkashNumber, nagadNumber, rocketNumber, story } = req.body;
    if (!title || !target || !donationType || !username) {
        return res.status(400).json({ error: 'Please provide all required campaign details' });
    }
    next();
};

// Create Campaign
router.post('/create', validateInput, async (req, res) => {
    try {
        console.log(req.body);
        const newCampaign = new Campaign(req.body);
        const savedCampaign = await newCampaign.save();
        console.log(savedCampaign);
        res.status(201).json(savedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get Single Campaign by ID
router.get('/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
