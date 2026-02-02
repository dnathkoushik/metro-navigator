const express = require('express');
const router = express.Router();
const { findPath } = require('../controllers/pathController');

router.post('/find', findPath);

module.exports = router;
