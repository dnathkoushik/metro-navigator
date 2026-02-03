const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');
const User = require('../models/User');

// @desc    Add a new station
// @route   POST /api/admin/stations
// @access  Private/Admin
const addStation = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Add station functionality' });
});

// @desc    Delete a station
// @route   DELETE /api/admin/stations/:id
// @access  Private/Admin
const deleteStation = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Delete station functionality' });
});

// @desc    Block a customer (user)
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Block user functionality' });
});

module.exports = {
    addStation,
    deleteStation,
    blockUser
};
