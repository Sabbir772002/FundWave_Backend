const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post('/signup', async (req, res) => {
    console.log('Request body:', req.body); // Log the incoming request body

    try {
      const { name, username, email, password } = req.body;
      if (!name || !username || !email || !password) {
        return res.status(400).send('Missing required fields');
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new user
      const user = new User({ name, username, email, password: hashedPassword });
      await user.save();
      
      res.status(201).send('User created successfully');
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Find the user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(400).send('User not found');
    
    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');
    
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
