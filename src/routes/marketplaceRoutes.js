const express = require('express');
const router = express.Router();

const buyerController = require('../controllers/buyerController');
const listingController = require('../controllers/marketplaceListingController');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// --- Buyer profile ---
router.post('/buyers/profile', authMiddleware, roleMiddleware('buyer'), buyerController.createProfile);
router.get('/buyers/me', authMiddleware, roleMiddleware('buyer'), buyerController.getMyProfile);
router.put('/buyers/me', authMiddleware, roleMiddleware('buyer'), buyerController.updateMyProfile);

// --- Marketplace listings ---
router.get('/marketplace-listings', authMiddleware, listingController.getActive);
router.post('/marketplace-listings', authMiddleware, roleMiddleware('farmer'), listingController.create);
router.get('/marketplace-listings/me', authMiddleware, roleMiddleware('farmer'), listingController.getMine);
router.put('/marketplace-listings/:id', authMiddleware, roleMiddleware('farmer'), listingController.update);
router.delete('/marketplace-listings/:id', authMiddleware, roleMiddleware('farmer'), listingController.remove);

// --- Orders (buyer purchasing from a listing) ---
router.post('/orders', authMiddleware, roleMiddleware('buyer'), orderController.create);
router.get('/orders/me', authMiddleware, roleMiddleware('buyer'), orderController.getMine);
router.get('/orders/incoming', authMiddleware, roleMiddleware('farmer'), orderController.getIncoming);
router.put('/orders/:id/status', authMiddleware, roleMiddleware('farmer', 'cooperative_manager', 'admin'), orderController.updateStatus);

module.exports = router;
