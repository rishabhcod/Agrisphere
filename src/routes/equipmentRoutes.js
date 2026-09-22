const express = require('express');
const router = express.Router();

const equipmentController = require('../controllers/equipmentController');
const bookingController = require('../controllers/equipmentBookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Equipment listings ---
router.get('/equipment', authMiddleware, equipmentController.getAvailable);
router.get('/equipment/me', authMiddleware, roleMiddleware('equipment_owner'), equipmentController.getMine);
router.post('/equipment', authMiddleware, roleMiddleware('equipment_owner'), equipmentController.create);
router.put('/equipment/:id', authMiddleware, roleMiddleware('equipment_owner'), equipmentController.update);
router.delete('/equipment/:id', authMiddleware, roleMiddleware('equipment_owner'), equipmentController.remove);

// --- Bookings ---
router.post('/equipment/:equipmentId/bookings', authMiddleware, roleMiddleware('farmer'), bookingController.create);
router.get('/equipment/:equipmentId/bookings', authMiddleware, roleMiddleware('equipment_owner'), bookingController.getForEquipment);
router.get('/bookings/me', authMiddleware, roleMiddleware('farmer'), bookingController.getMine);
router.put('/bookings/:id/status', authMiddleware, roleMiddleware('farmer', 'equipment_owner'), bookingController.updateStatus);

module.exports = router;
