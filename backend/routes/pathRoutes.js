const express = require('express');
const router = express.Router();
const { getMinStationsPath, getMinTimePath, getMinDistancePath } = require('../controllers/pathController');
const { protect } = require('../middleware/authMiddleware');
const { validatePathQuery } = require('../middleware/pathMiddleware');
// @route   POST /api/path/min-stations
// @desc    Get shortest path with minimum number of stations
router.post('/min-stations', protect, validatePathQuery, getMinStationsPath);

// @route   POST /api/path/min-time
// @desc    Get shortest path with minimum time
router.post('/min-time', protect, validatePathQuery, getMinTimePath);

// @route   POST /api/path/min-distance
// @desc    Get shortest path with minimum distance
router.post('/min-distance', protect, validatePathQuery, getMinDistancePath);

module.exports = router;
