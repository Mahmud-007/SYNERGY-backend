const express = require('express');
const router = express.Router();

const searchController = require('../controllers/search');

// GET -> /search/people?key=lullaby
router.get('/people', searchController.getPeople);

module.exports = router;
