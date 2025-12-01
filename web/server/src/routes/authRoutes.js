const express = require('express');
const AuthController = require('../controllers/AuthController');

const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Password management
router.post('/change-password', 
    authMiddleware,
    authController.changePassword
);

router.get('/profile', authMiddleware, authController.getProfile);
module.exports = router;