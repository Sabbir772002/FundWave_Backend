const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/sign', async (req, res) => {
  try {
      const { name, email, username, password } = req.body;

      if (!name || !username || !email || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, username, email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
      console.error("Error:", err.message);
        if (err.code === 11000) {
          // Extract the duplicate key field from the error message
          const field = Object.keys(err.keyValue)[0];
          return res.status(400).json({ error: `Duplicate value for field: ${field}`, field });
      }
      res.status(400).json({ error: err.message });
  }
});



// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, email,password } = req.body;
    
    // Find the user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) return res.status(400).send('User not found');
    
    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');
    
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    //console.log(token);
    res.json({ token });
    console.log("User logged in successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: `Duplicate value for field: ${Object.keys(err.keyValue)[0]}` });
  }
    res.status(400).send(err.message);
  }
});

module.exports = router;
