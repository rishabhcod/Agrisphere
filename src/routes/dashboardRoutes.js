const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/summary', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), dashboardController.getSummary);

module.exports = router;
