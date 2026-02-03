const express = require('express');
const router = express.Router();
const { addStation, deleteStation, blockUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { addStationValidation, blockUserValidation } = require('../middleware/adminMiddleware');

// Check if user is authenticated and is an admin for all routes
router.use(protect);
router.use(admin);

// Station Routes
router.post('/stations', addStationValidation, addStation);
router.delete('/stations/:id', deleteStation);

// User Management Routes
router.put('/users/:id/block', blockUserValidation, blockUser);

module.exports = router;
