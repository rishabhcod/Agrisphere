const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, paymentController.create);
router.get('/me', authMiddleware, roleMiddleware('farmer', 'buyer'), paymentController.getMine);
router.put('/:id/status', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), paymentController.updateStatus);
router.get('/', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), paymentController.getAll);

module.exports = router;
