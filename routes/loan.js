const express = require('express');
const Loan = require('../models/loan');
const router = express.Router();
const Review = require('../models/Reviews');

const jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;
const validateAuthToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token. Please log in again.' });
    }

    req.user = user; // Store user information for further use
    next();
  });
};

// Existing validation middleware for loan input
const validateLoanInput = (req, res, next) => {
  const { username, targetAmount, interest, deadlineDate } = req.body;
  if (!username || !targetAmount || !deadlineDate) {
    return res.status(400).json({ error: 'Please provide all required loan details' });
  }
  next();
};


// Create Loan Route
router.post('/create', validateAuthToken, validateLoanInput,async (req, res) => {
  try {
    const {
       username, title, category, targetAmount, deadlineDate, donationType,
      minimumCheck, interest, bkashNumber, nagadNumber,
      rocketNumber, story
    } = req.body;
    console.log(req.body);
  console.log(deadlineDate);
    const loan = new Loan({
       username, title, category, targetAmount,
      deadlineDate, donationType, minimumCheck,
      interest, bkashNumber, nagadNumber, rocketNumber, story,condition:"Running"
    });
    
    await loan.save();
    // console.log("baniyesi");
    // console.log(loan);
    res.status(201).json({ message: 'Loan created successfully', loan });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the loan.' });
  }
});

router.post('/review',async (req, res) => {
  try {
    const {username, id, message, rating} = req.body;
    console.log(req.body);

    const reviewData = new Review({
      username, loanid:id, message, rating, createdAt: new Date()
    });
    reviewData.save();
    console.log(reviewData);
    res.status(201).json({ message: 'Review created successfully'});
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the review.' });
  }
});

router.get('/review/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const reviews = await Review.find({loanid:req.params.id});
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while retrieving the reviews.' });
  }
}
);
router.put('/:id', async (req, res) => {

  try {
    const {targetAmount, deadlineDate,donationType} = req.body;
    const updatedLoan = await Loan.findByIdAndUpdate( req.params.id, {targetAmount,donationType,deadlineDate}, { new: true });
    
    if (!updatedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan updated successfully', updatedLoan });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the loan.' });
  }
}
);

router.put('/review/:id', async (req, res) => {
  try {
    const {message, rating} = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params,
      {
        message, rating
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully', updatedReview });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the review.' });
  }
}
);

// Get List of Loans Route
router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find();
    loans.sort((a, b) => b.createdAt - a.createdAt);
    loans.forEach((campaign) => {
        if (campaign.deadlineDate!=null && campaign.deadlineDate<new Date() && condition!="Completed") {
            campaign.condition = "Deadline Passed";
            campaign.save();
        }
    });
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while retrieving the loans.' });
  }
});

// Get Single Loan Route
router.get('/:id', async (req, res) => {

  try {
    console.log(req.params.id);
    console.log("eseshi");
    const loan = await Loan.findById(req.params.id);
    console.log(loan);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while retrieving the loan.' });
  }
});

// Update Loan Route
router.put('/:id', async (req, res) => {
  try {
    const {
       username, title, category, targetAmount, deadlineDate, donationType,
      minimumCheck, interest, bkashNumber, nagadNumber,
      rocketNumber, story
    } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        username, title, category, targetAmount, deadlineDate,
        donationType, minimumCheck, interest,
        bkashNumber, nagadNumber, rocketNumber, story
      },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan updated successfully', updatedLoan });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the loan.' });
  }
});

// Delete Loan Route
router.delete('/:id', async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.status(200).json({ message: 'Loan deleted successfully', deletedLoan });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while deleting the loan.' });
  }
});

module.exports = router;

