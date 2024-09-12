const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;  // Ensure you have JWT_SECRET set in your environment variables

// Middleware to validate loan input (can be improved with libraries like express-validator)
const validateLoanInput = (req, res, next) => {
  const { borrowerName, loanAmount, interestRate, duration } = req.body;
  if (!borrowerName || !loanAmount || !interestRate || !duration) {
    return res.status(400).json({ error: 'Please provide all required loan details' });
  }
  next();
};

// Create Loan Route
router.post('/create', async (req, res) => {
  try {
    console.log("Loan request received");  
    console.log(req.body);
    const { borrowerName, loanAmount, interestRate, duration, username, password } = req.body;

    // Hash password for security (if applicable)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a JWT token (can include more details like user roles)
    const token = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '1h' });

    // Simulate saving loan to a database (replace with actual DB logic)
    const loanData = {
      borrowerName,
      loanAmount,
      interestRate,
      duration,
      username,
      password: hashedPassword,  // Store hashed password if needed
    };

    // Here you'd typically save loanData to your database

    res.status(201).json({ message: 'Loan created successfully', loanData, token });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the loan.' });
  }
});

module.exports = router;
