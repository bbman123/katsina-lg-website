const express = require('express');
const { getPublicData, getPublicStats } = require('../controllers/publicController');

const router = express.Router();

router.get('/public-data', getPublicData);
router.get('/public-stats', getPublicStats);

module.exports = router;