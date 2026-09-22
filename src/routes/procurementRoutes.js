const express = require('express');
const router = express.Router();

const supplierController = require('../controllers/supplierController');
const inputItemController = require('../controllers/inputItemController');
const procurementOrderController = require('../controllers/procurementOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Supplier profile ---
router.post('/suppliers/profile', authMiddleware, roleMiddleware('supplier'), supplierController.createProfile);
router.get('/suppliers/me', authMiddleware, roleMiddleware('supplier'), supplierController.getMyProfile);
router.put('/suppliers/me', authMiddleware, roleMiddleware('supplier'), supplierController.updateMyProfile);
router.get('/suppliers', authMiddleware, supplierController.getAll);

// --- Supplier's own input item catalog ---
router.post('/suppliers/me/input-items', authMiddleware, roleMiddleware('supplier'), inputItemController.create);
router.get('/suppliers/me/input-items', authMiddleware, roleMiddleware('supplier'), inputItemController.getMine);
router.put('/suppliers/me/input-items/:itemId', authMiddleware, roleMiddleware('supplier'), inputItemController.update);
router.delete('/suppliers/me/input-items/:itemId', authMiddleware, roleMiddleware('supplier'), inputItemController.remove);

// --- Full catalog browse (any logged-in user, e.g. a farmer shopping) ---
router.get('/input-items', authMiddleware, inputItemController.getAll);

// --- Procurement orders ---
router.post('/procurement-orders', authMiddleware, roleMiddleware('farmer'), procurementOrderController.create);
router.get('/procurement-orders/me', authMiddleware, roleMiddleware('farmer'), procurementOrderController.getMine);
router.get('/procurement-orders/incoming', authMiddleware, roleMiddleware('supplier'), procurementOrderController.getIncoming);
router.get('/procurement-orders/:id', authMiddleware, procurementOrderController.getById);
router.put('/procurement-orders/:id/status', authMiddleware, roleMiddleware('supplier', 'cooperative_manager', 'admin'), procurementOrderController.updateStatus);
router.get('/procurement-orders', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), procurementOrderController.getAll);

module.exports = router;
