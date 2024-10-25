require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loan'); // Renamed variable to 'loanRoutes' for clarity
const campaignRoutes = require('./routes/campaign');
const cors = require('cors');
const fundpaymentRoutes = require('./routes/fundpaymentRoutes');
const loanpaymentsroutes = require('./routes/loanpaymentsroutes');
const bidRoutes = require('./routes/Bid');
const payment = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundwave'; // Use environment variable for MongoDB URI

// Middleware
app.use(express.json());
app.use(cors());


// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1); // Exit process with failure if unable to connect to DB
});
// Routes
console.log("eseshi");
app.use('/auth', authRoutes);
app.use('/api/loans', loanRoutes); 
app.use('/api/campaign', campaignRoutes);
app.use('/api/fundpayments', fundpaymentRoutes);
app.use('/api/loanpayments', loanpaymentsroutes);
app.use('/api/bids', bidRoutes);
app.use('/api/payment', payment);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);});
  