const express = require('express');
const router = express.Router();
const { getCities, getCityStations, getCityBySlug } = require('../controllers/cityController');

// GET /api/cities - list all active cities
router.get('/', getCities);

// GET /api/cities/:slug - get city info
router.get('/:slug', getCityBySlug);

// GET /api/cities/:slug/stations - get all stations for a city
router.get('/:slug/stations', getCityStations);

module.exports = router;


