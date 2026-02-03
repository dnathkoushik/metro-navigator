const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');
const User = require('../models/User');

// @desc    Add a new station
// @route   POST /api/admin/stations
// @access  Private/Admin
const addStation = asyncHandler(async (req, res) => {
    const { name, lines, isInterchange, x, y } = req.body;

    const stationExists = await Station.findOne({ name });

    if (stationExists) {
        res.status(400);
        throw new Error('Station already exists');
    }

    const station = await Station.create({
        name,
        lines,
        isInterchange: isInterchange || false,
        x,
        y
    });

    if (station) {
        res.status(201).json({
            _id: station._id,
            name: station.name,
            lines: station.lines,
            isInterchange: station.isInterchange
        });
    } else {
        res.status(400);
        throw new Error('Invalid station data');
    }
});

// @desc    Delete a station
// @route   DELETE /api/admin/stations/:id
// @access  Private/Admin
const deleteStation = asyncHandler(async (req, res) => {
    const station = await Station.findById(req.params.id);

    if (station) {
        await station.deleteOne();
        res.status(200).json({ message: 'Station removed' });
    } else {
        res.status(404);
        throw new Error('Station not found');
    }
});

// @desc    Block a customer (user)
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isBlocked: updatedUser.isBlocked,
            message: updatedUser.isBlocked ? 'User blocked' : 'User unblocked'
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    addStation,
    deleteStation,
    blockUser
};
