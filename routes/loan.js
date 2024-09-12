const express = require('express');
const Loan = require('../models/loan');

const router = express.Router();

// Middleware to validate loan input
const validateLoanInput = (req, res, next) => {
  const { username, targetAmount, interest, deadlineDate } = req.body;
  if (!username || !targetAmount || !interest || !deadlineDate) {
    return res.status(400).json({ error: 'Please provide all required loan details' });
  }
  next();
};


// Create Loan Route
router.post('/create', validateLoanInput, async (req, res) => {
  try {
    const {
       username, title, category, targetAmount, deadlineDate, donationType,
      minimumCheck, interest, bkashNumber, nagadNumber,
      rocketNumber, story
    } = req.body;
  //   console.log(req.body);
  // console.log(deadlineDate);
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

// Get List of Loans Route
router.get('/', async (req, res) => {
  try {
    console.log("eseshi bhai all in one");
    const loans = await Loan.find();
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
