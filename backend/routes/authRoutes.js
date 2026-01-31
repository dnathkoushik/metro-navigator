const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/authMiddleware');

router.post('/login', loginValidation, authUser);
router.post('/register', registerValidation, registerUser);

module.exports = router;
