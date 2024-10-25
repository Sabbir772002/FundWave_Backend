const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user'); // Ensure this is your actual User model
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let otpStore = {}; // Temporary store for OTPs (use a cache in production, e.g., Redis)

// Setup Nodemailer Transporter for sending OTP via email
// Create a transporter
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
  port: 587,                // Port number (587 or 465 usually)
  secure: false,            // True for 465, false for other ports
  auth: {
    user: process.env.email, // Your SMTP username (email)
    pass: process.env.password  // Your SMTP password
  }
});


// Generate and send OTP to the user's email
router.post('/otp', async (req, res) => {
    try {
        const { username } = req.body;
        console.log(req.body);
        console.log(username);
        const user = await User.findOne({ username:username });
        console.log(user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a 4-digit OTP
        const otp = crypto.randomInt(1000, 9999).toString();

        // Store OTP temporarily (could be improved using cache like Redis)
        otpStore[user.username] = otp;
        console.log(otp);

        // Send OTP to user's email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to send OTP' });
            }
            return res.status(200).json({ message: 'OTP sent successfully', username: user.username });
        });
    } catch (err) {
        console.error('Error sending OTP:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify OTP and issue JWT token for password reset
router.post('/verify-otp', (req, res) => {
    const { username, otp } = req.body;
    if (otpStore[username] && otpStore[username] === otp) {
        // OTP verified, issue a JWT token for resetting password
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '10m' }); // Token expires in 10 minutes
        delete otpStore[username]; // Remove OTP after successful verification
        return res.status(200).json({ message: 'OTP verified', token });
    } else {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Reset password using token
router.post('/resetpass', async (req, res) => {
    try {
        const { token, new_password } = req.body;

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password="";
        console.log(user.password);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Token expired, request a new OTP' });
        }
        console.error('Error resetting password:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Ensure 'uploads' directory exists or create it
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadDir); // Save in uploads folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage: storage });

// Endpoint to upload a file
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
      res.json({ message: 'File uploaded successfully', filePath: `/uploads/${req.file.filename}` });
  } else {
      res.status(400).json({ message: 'File upload failed' });
  }
});


// Middleware to validate input
const validateInput = (req, res, next) => {
    const { username } = req.body; 
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    next();
};

router.put('/img/:username', upload.single('image'), async (req, res) => {
  try {
    const { username } = req.params;
  
    // Check if file was uploaded
    if (req.file) {
      img = `/uploads/${req.file.filename}`; // Adjust this as needed
    }
    // Update user in database (assuming you have a User model)
    const updatedUser = await User.findOneAndUpdate({ username }, {img:img}, { new: true, runValidators: true });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    // Return updated user data
    const { password, ...userData } = updatedUser.toObject();
    res.json(userData);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT endpoint to update user information including image upload
router.put('/user/:username', validateInput, async (req, res) => {
    try {
        const { username } = req.params;
        const { bkash, nagad, rocket } = req.body;
        // Find the user by username and update the fields
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { bkash, nagad, rocket },
            { new: true, runValidators: true }
        );
        console.log(updatedUser);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        // Return updated user data without the password field
        const { password, ...userData } = updatedUser.toObject();
        res.json(userData);
    } catch (err) {
        console.error('Error updating user data:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// // Serve static files (for image access)


// Sign Up route
router.post('/sign', async (req, res) => {
  try {
    const { name, email, username,password } = req.body;
    console.log(req.body);

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
    const isMatch = await bcrypt.compare(password, user.password); // Await the promise
    console.log("isMatch: ", isMatch);

    if (isMatch!=true) return res.status(400).send('Invalid password');
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
// // PUT endpoint to update user information
// router.put('/user/:username', async (req, res) => {
//   try {
//     const { username } = req.params;

//     // Validate incoming data (you can enhance this with a library like Joi or express-validator)
//     const {bkash, nagad, rocket } = req.body;

//     // Find the user by username and update the fields
//     const updatedUser = await User.findOneAndUpdate(
//       { username },
//       { bkash, nagad, rocket }, 
//       { new: true, runValidators: true } // Return the updated document and run validators
//     );

//     if (!updatedUser) return res.status(404).json({ error: 'User not found' });

//     // Return updated user data without the password field
//     const { password, ...userData } = updatedUser.toObject();
//     res.json(userData);
//   } catch (err) {
//     console.error('Error updating user data:', err.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

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
router.use('/uploads', express.static(uploadDir));

module.exports = router;
