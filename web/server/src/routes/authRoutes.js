const express = require('express');
const AuthController = require('../controllers/AuthController');
const { validate, registerSchema, loginSchema, changePasswordSchema } = require('../utils/validation');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Password management
router.post('/change-password', 
    authMiddleware,
    validate(changePasswordSchema), 
    authController.changePassword
);

router.get('/profile', authMiddleware, authController.getProfile);
module.exports = router;