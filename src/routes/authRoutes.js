// This file has NO logic in it - it only maps
// "URL + HTTP method" -> "which controller function handles it".

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser); // protected route example

module.exports = router;