const express = require('express');
const router = express.Router();
const { getMinStationsPath, getMinTimePath } = require('../controllers/pathController');
// @route   POST /api/path/min-stations
// @desc    Get shortest path with minimum number of stations
router.post('/min-stations', getMinStationsPath);

// @route   POST /api/path/min-time
// @desc    Get shortest path with minimum time
router.post('/min-time', getMinTimePath);

module.exports = router;
