const express = require('express');
const CustomerController = require('../controllers/CustomerController');
const AuthController = require('../controllers/AuthController');
const { validate, createPetSchema, updatePetSchema, changePasswordSchema } = require('../utils/validation');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();
const customerController = new CustomerController();
const authController = new AuthController();

// Customer profile routes
router.get('/profile', authorize('Khách hàng'), customerController.getProfile);
router.put('/profile', authorize('Khách hàng'), customerController.updateProfile);
router.get('/membership', authorize('Khách hàng'), customerController.getMembershipInfo);
router.get('/loyalty-history', authorize('Khách hàng'), customerController.getLoyaltyHistory);

// Password change
router.put('/change-password', validate(changePasswordSchema), authController.changePassword);

// Pet management routes
router.get('/pets', authorize('Khách hàng'), customerController.getPets);
router.post('/pets', authorize('Khách hàng'), validate(createPetSchema), customerController.createPet);
router.put('/pets/:petId', authorize('Khách hàng'), validate(updatePetSchema), customerController.updatePet);
router.delete('/pets/:petId', authorize('Khách hàng'), customerController.deletePet);

// Pet history routes
router.get('/pets/:petId/medical-history', authorize('Khách hàng'), customerController.getPetMedicalHistory);
router.get('/pets/:petId/vaccination-history', authorize('Khách hàng'), customerController.getPetVaccinationHistory);

// Customer search (for staff)
router.get('/search', 
    authorize('Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh'), 
    customerController.searchCustomers
);

module.exports = router;