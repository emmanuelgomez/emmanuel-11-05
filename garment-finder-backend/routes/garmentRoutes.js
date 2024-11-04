const express = require('express');
const garmentController = require('../controllers/garmentController');

const router = express.Router();

router.get('/search', garmentController.searchGarments);

module.exports = router;