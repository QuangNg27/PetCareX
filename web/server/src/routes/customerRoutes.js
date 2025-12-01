const express = require('express');
const CustomerController = require('../controllers/CustomerController');
const AuthController = require('../controllers/AuthController');
const { validate, createPetSchema, updatePetSchema, changePasswordSchema } = require('../utils/validation');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const customerController = new CustomerController();
const authController = new AuthController();

// Customer profile routes
router.get('/profile', authorizeRoles('Khách hàng'), customerController.getProfile);
router.put('/profile', authorizeRoles('Khách hàng'), customerController.updateProfile);
router.get('/spending', authorizeRoles('Khách hàng'), customerController.getMembershipSpending);
router.get('/loyalty-history', authorizeRoles('Khách hàng'), customerController.getLoyaltyHistory);

// Password change
router.put('/change-password', validate(changePasswordSchema), authController.changePassword);

// Pet management routes
router.get('/pets', authorizeRoles('Khách hàng'), customerController.getPets);
router.post('/pets', authorizeRoles('Khách hàng'), validate(createPetSchema), customerController.createPet);
router.put('/pets/:petId', authorizeRoles('Khách hàng'), validate(updatePetSchema), customerController.updatePet);
router.delete('/pets/:petId', authorizeRoles('Khách hàng'), customerController.deletePet);

// Pet history routes
router.get('/pets/:petId/medical-history', authorizeRoles('Khách hàng'), customerController.getPetMedicalHistory);
router.get('/pets/:petId/vaccination-history', authorizeRoles('Khách hàng'), customerController.getPetVaccinationHistory);
// Customer search (for staff)
router.get('/search', 
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh']), 
    customerController.searchCustomers
);

module.exports = router;