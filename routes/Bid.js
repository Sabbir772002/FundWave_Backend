const express = require('express');
const router = express.Router();
const bidController = require('../Controllers/bid.js');
// Routes for bids
router.post('/', bidController.createBid);
router.get('/', bidController.getAllbids);
router.get('bid/:id', bidController.getBidById);
router.get('/:id', bidController.getBidsByLoanId);
router.get('/final/:id', bidController.getBidFinal);
router.get('/user/:id', bidController.getallbidofuser);
router.put('/:id', bidController.updateBid);
router.delete('/:id', bidController.deleteBid);
module.exports = router;
