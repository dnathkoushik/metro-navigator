const asyncHandler = require('express-async-handler');
const City = require('../models/City');
const Station = require('../models/Station');

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
const getCities = asyncHandler(async (req, res) => {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json(cities);
});

// @desc    Get stations for a specific city
// @route   GET /api/cities/:slug/stations
// @access  Public
const getCityStations = asyncHandler(async (req, res) => {
    const city = await City.findOne({ slug: req.params.slug, isActive: true });

    if (!city) {
        res.status(404);
        throw new Error('City not found');
    }

    const stations = await Station.find({ city: city._id });
    res.json(stations);
});

// @desc    Get a single city by slug
// @route   GET /api/cities/:slug
// @access  Public
const getCityBySlug = asyncHandler(async (req, res) => {
    const city = await City.findOne({ slug: req.params.slug, isActive: true });

    if (!city) {
        res.status(404);
        throw new Error('City not found');
    }

    res.json(city);
});

module.exports = {
    getCities,
    getCityStations,
    getCityBySlug
};
