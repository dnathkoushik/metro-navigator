const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/authController');
const { registerValidation, loginValidation, protect } = require('../middleware/authMiddleware');

router.post('/login', loginValidation, authUser);
router.post('/register', registerValidation, registerUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
