const express = require('express');
const router = express.Router();
const { getMinStationsPath } = require('../controllers/pathController');

// @route   POST /api/path/min-stations
// @desc    Get shortest path with minimum number of stations
router.post('/min-stations', getMinStationsPath);

module.exports = router;
