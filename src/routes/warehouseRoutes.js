const express = require('express');
const router = express.Router();

const warehouseController = require('../controllers/warehouseController');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Warehouses ---
router.get('/warehouses', authMiddleware, warehouseController.getAll);
router.get('/warehouses/:id', authMiddleware, warehouseController.getById);
router.post('/warehouses', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), warehouseController.create);
router.put('/warehouses/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), warehouseController.update);
router.delete('/warehouses/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), warehouseController.remove);

// --- Inventory ---
router.get('/inventory', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), inventoryController.getAll);
router.get('/inventory/me', authMiddleware, roleMiddleware('farmer'), inventoryController.getMine);
router.post('/inventory', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), inventoryController.create);
router.put('/inventory/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), inventoryController.update);
router.delete('/inventory/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), inventoryController.remove);

module.exports = router;
