const express = require('express');
const CustomerController = require('../controllers/CustomerController');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const customerController = new CustomerController();

// Apply authMiddleware to all customer routes
router.use(authMiddleware);

// Customer profile routes
router.get('/profile', authorizeRoles('Khách hàng'), customerController.getProfile);
router.put('/profile', authorizeRoles('Khách hàng'), customerController.updateProfile);
router.get('/spending', authorizeRoles('Khách hàng'), customerController.getMembershipSpending);
router.get('/loyalty-history', authorizeRoles('Khách hàng'), customerController.getLoyaltyHistory);
router.post('/change-password', authorizeRoles('Khách hàng'), customerController.UpdatePassword);

// Pet management routes
router.get('/pets', authorizeRoles('Khách hàng'), customerController.getPets);
router.post('/pets', authorizeRoles('Khách hàng'), customerController.createPet);
router.put('/pets/:petId', authorizeRoles('Khách hàng'), customerController.updatePet);
router.delete('/pets/:petId', authorizeRoles('Khách hàng'), customerController.deletePet);

// Pet history routes (customer only - with ownership check)
router.get('/pets/:petId/medical-history', authorizeRoles('Khách hàng'), customerController.getPetMedicalHistory);
router.get('/pets/:petId/vaccination-history', authorizeRoles('Khách hàng'), customerController.getPetVaccinationHistory);

// Staff-only pet history routes (no ownership check)
router.get('/staff/pets/:petId/medical-history', 
    authorizeRoles(['Tiếp tân', 'Bác sĩ', 'Quản lý chi nhánh']), 
    customerController.getAnyPetMedicalHistory
);
router.get('/staff/pets/:petId/vaccination-history', 
    authorizeRoles(['Tiếp tân', 'Bác sĩ', 'Quản lý chi nhánh']), 
    customerController.getAnyPetVaccinationHistory
);

// Customer search (for staff)
router.get('/search', 
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh']), 
    customerController.searchCustomers
);

// Create customer (for staff - receptionist)
router.post('/', 
    authorizeRoles(['Tiếp tân', 'Quản lý chi nhánh']), 
    customerController.createCustomer
);

// Pet management for customers (for staff)
router.post('/:customerId/pets', 
    authorizeRoles(['Tiếp tân', 'Bác sĩ', 'Quản lý chi nhánh']), 
    customerController.createPetForCustomer
);

router.get('/:customerId/pets', 
    authorizeRoles(['Tiếp tân', 'Bác sĩ', 'Quản lý chi nhánh']), 
    customerController.getCustomerPets
);

module.exports = router;