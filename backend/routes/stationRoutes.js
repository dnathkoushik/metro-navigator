const express = require('express');
const router = express.Router();
const { getAllStations } = require('../controllers/stationController');
// const { protect } = require('../middleware/authMiddleware'); // Stations list might be public? Usually yes.

// @route   GET /api/stations
// @desc    Get all stations
// @access  Public
router.get('/', getAllStations);

module.exports = router;
