const BID = require('../models/Bid'); // Adjust the path as necessary

// Create a new bid
exports.createBid = async (req, res) => {
    try {
        console.log(req.body);
        const { username, loanId, bidType, interest, maxTime } = req.body;
        console.log('Creating a new bid');

        // Create a new bid
        const newBid = new BID({
            username,
            loanid:loanId,
            deadlineDate:maxTime,
            interest,
            type: bidType,
            createdAt: new Date(),
        });

       await newBid.save();
       console.log(newBid);
       console.log("done");

        res.status(201).json({
            success: true,
            message: 'Bid created successfully',
            data: newBid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating bid',
            error: error.message,
        });
    }
};

// Get all bids
exports.getAllBids = async (req, res) => {
    try {
        const bids = await BID.find();
        res.status(200).json({
            success: true,
            data: bids,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bids',
            error: error.message,
        });
    }
};

// Get a specific bid by ID
exports.getBidById = async (req, res) => {
    try {
        const { id } = req.params;
        const bid = await BID.findById(id);

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
        }

        res.status(200).json({
            success: true,
            data: bid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bid',
            error: error.message,
        });
    }
};

// Update a specific bid by ID
exports.updateBid = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedBid = await BID.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedBid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bid updated successfully',
            data: updatedBid,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating bid',
            error: error.message,
        });
    }
};

// Delete a specific bid by ID
exports.deleteBid = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBid = await BID.findByIdAndDelete(id);

        if (!deletedBid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bid deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting bid',
            error: error.message,
        });
    }
};
