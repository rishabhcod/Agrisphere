const express = require('express');
const router = express.Router();

const farmerController = require('../controllers/farmerController');
const landParcelController = require('../controllers/landParcelController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Every route below requires a logged-in user (authMiddleware).
// Specific routes additionally restrict by role (roleMiddleware).

// --- Farmer's own profile ---
router.post('/profile', authMiddleware, farmerController.createProfile);
router.get('/me', authMiddleware, farmerController.getMyProfile);
router.put('/me', authMiddleware, farmerController.updateMyProfile);

// --- Farmer's own land parcels ---
router.post('/me/land-parcels', authMiddleware, landParcelController.addLandParcel);
router.get('/me/land-parcels', authMiddleware, landParcelController.getMyLandParcels);
router.put('/me/land-parcels/:parcelId', authMiddleware, landParcelController.updateLandParcel);
router.delete('/me/land-parcels/:parcelId', authMiddleware, landParcelController.deleteLandParcel);

// --- Cooperative Manager / Admin views of ALL farmers ---
router.get('/', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), farmerController.getAllFarmers);
router.get('/:id', authMiddleware, roleMiddleware('cooperative_manager', 'admin'), farmerController.getFarmerById);

module.exports = router;