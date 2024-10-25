const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Campaign = require('../models/campaign'); // Ensure this is your actual Campaign model
const router = express.Router();

// Ensure 'uploads' directory exists or create it
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer to store files in the uploads directory

// Middleware to validate input
const validateInput = (req, res, next) => {
    const { username, title, target, donationType } = req.body;
    if (!title || !target || !donationType || !username) {
        return res.status(400).json({ error: 'Please provide all required campaign details' });
    }
    next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadDir); // Save in uploads folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});
const upload = multer({ storage: storage });

// Create Campaign with Image Upload
router.post('/create', upload.single('image'), validateInput, async (req, res) => {
    try {
        let { username, title, target, category, deadlineDate, donationType, amount, bkashNumber, nagadNumber, rocketNumber, story } = req.body;
        console.log(req.body);

        // Check if file was uploaded
        let imageUrl = null;
        if (req.file) {
            console.log("file uploaded");
            console.log(req.file);
            console.log(req.file.filename);
            imageUrl = `/uploads/${req.file.filename}`;
        }
        
          amount=parseInt(amount);
        // Create new campaign
        const newCampaign = new Campaign({
            username,
            title,
            target,
            category,
            deadlineDate,
            donationType,
            amount,
            bkashNumber,
            nagadNumber,
            rocketNumber,
            story,
            imageUrl  
        });

        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get All Campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        campaigns.sort((a, b) => b.createdAt - a.createdAt);
        campaigns.forEach((campaign) => {
            if (campaign.deadlineDate!=null && campaign.deadlineDate<new Date()) {
                campaign.condition = "Completed";
                campaign.save();
            }
        });
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
router.put('/:id',async (req,res)=>{
    try{
        console.log("put request");
        console.log(req.body);
        const campaign=await Campaign.findById(req.params.id);
        if(!campaign) return res.status(404).json({message:'Campaign not found'});
        if(req.body.amount>0) campaign.amount=req.body.amount;
        if(req.body.deadlineDate)campaign.deadlineDate=req.body.deadlineDate;
        await campaign.save();
        res.status(200).json(campaign);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
});





router.put('/markAsCompleted/:id', async (req, res) => {    

    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        campaign.condition = "Completed";
        await campaign.save();
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.use('/uploads', express.static(uploadDir));
module.exports = router;