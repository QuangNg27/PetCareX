const express = require('express');
const AuthController = require('../controllers/AuthController');
const { validate, registerSchema, loginSchema, changePasswordSchema } = require('../utils/validation');
const auth = require('../middleware/auth');

const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Password management
router.post('/change-password', 
    auth,
    validate(changePasswordSchema), 
    authController.changePassword
);

// Token refresh (if needed)
router.post('/refresh-token', auth, authController.refreshToken);

// Profile verification
router.get('/verify', auth, authController.verifyToken);

module.exports = router;