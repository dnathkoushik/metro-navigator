const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    // const { email, password } = req.body;
    res.status(200).json({ message: 'Auth Endpoint' });
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Register Endpoint' });
});

module.exports = { authUser, registerUser };
