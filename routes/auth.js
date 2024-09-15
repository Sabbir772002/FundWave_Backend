const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Sign Up route
router.post('/sign', async (req, res) => {
  try {
    const { name, email, username,password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let [localPart, domainPart] = email.split('@');
    let deptPrefix = domainPart.split('.')[0].slice(0, 5);
    let deptCode;
    if (deptPrefix.toLowerCase() === "bscse") {
        deptCode = "011";
    } else if (deptPrefix.toLowerCase() === "bseee") {
        deptCode = "012";
    } else {
        deptCode = "Unknown"; 
    }
  
    let numericPart = localPart.replace(/[^0-9]/g, '');
    let id = deptCode + numericPart;
      console.log(id);
    //       let numericPart = '';
    // // Iterate over each character in the localPart
    // for (let i = 0; i < localPart.length; i++) {
    //     let char = localPart[i];
    //     // Check if the character is a digit
    //     if (char >= '0' && char <= '9') {
    //         numericPart += char; // Append the digit to numericPart
    //     }
    // }
      const user = new User({ name, username, email,id, password: hashedPassword });

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
    console.log("User logged in successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: `Duplicate value for field: ${Object.keys(err.keyValue)[0]}` });
    }
    res.status(400).send(err.message);
  }
});

// Route to get user data by username
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Return user data without the password field
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:username', async (req,res) => {
  try {
      const { username } = req.params;
      console.log(username);
      // Find a user by username
      const existingUser = await User.findOne({  username });
      res.json({ exists: existingUser ? true : false });
  } catch (error) {
      console.error('Error finding user:', error);
      res.json({ error: 'Internal server error' });
  }
});


module.exports = router;
