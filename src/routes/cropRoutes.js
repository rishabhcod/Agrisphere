const express = require('express');
const router = express.Router();

const cropController = require('../controllers/cropController');
const cropPlanController = require('../controllers/cropPlanController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Crop master list (reference data) ---
router.get('/crops', authMiddleware, cropController.getAll);
router.get('/crops/:id', authMiddleware, cropController.getById);
router.post('/crops', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), cropController.create);
router.put('/crops/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), cropController.update);
router.delete('/crops/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), cropController.remove);

// --- Crop plans (farmer's own season-wise records) ---
router.post('/crop-plans', authMiddleware, roleMiddleware('farmer'), cropPlanController.create);
router.get('/crop-plans/me', authMiddleware, roleMiddleware('farmer'), cropPlanController.getMine);
router.put('/crop-plans/:id', authMiddleware, roleMiddleware('farmer'), cropPlanController.update);
router.delete('/crop-plans/:id', authMiddleware, roleMiddleware('farmer'), cropPlanController.remove);
router.get('/crop-plans', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), cropPlanController.getAll);

module.exports = router;
