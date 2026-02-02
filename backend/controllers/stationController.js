const asyncHandler = require('express-async-handler');
const Station = require('../models/Station');

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
const getAllStations = asyncHandler(async (req, res) => {
    // Return only names for dropdowns, or full objects? 
    // Usually names and lines are enough. Let's return full objects for now as it's flexible.
    // Sorting by name is good for dropdowns.
    const stations = await Station.find({}).sort({ name: 1 });
    res.json(stations);
});

module.exports = {
    getAllStations
};
