const express = require('express');
const ServiceController = require('../controllers/ServiceController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const serviceValidation = require('../utils/serviceValidation');

const router = express.Router();
const serviceController = new ServiceController();

// Get services available at a specific branch (with customer tier pricing)
router.get('/branches/:branchId/services', 
    auth, 
    serviceController.getBranchServices.bind(serviceController)
);

// Medical examination endpoints
router.post('/examinations',
    auth,
    authorizeRoles(['Khách hàng']),
    validateRequest(serviceValidation.createExaminationSchema),
    serviceController.createMedicalExamination.bind(serviceController)
);

router.put('/examinations/:examinationId',
    auth,
    authorizeRoles(['Bác sĩ']),
    validateRequest(serviceValidation.updateExaminationSchema),
    serviceController.updateMedicalExamination.bind(serviceController)
);

router.post('/examinations/:examinationId/prescriptions',
    auth,
    authorizeRoles(['Bác sĩ']),
    validateRequest(serviceValidation.addPrescriptionSchema),
    serviceController.addPrescription.bind(serviceController)
);

// Vaccination endpoints
router.post('/vaccinations',
    auth,
    authorizeRoles(['Khách hàng']),
    validateRequest(serviceValidation.createVaccinationSchema),
    serviceController.createVaccination.bind(serviceController)
);

router.post('/vaccinations/:vaccinationId/details',
    auth,
    authorizeRoles(['Bác sĩ']),
    validateRequest(serviceValidation.addVaccinationDetailsSchema),
    serviceController.addVaccinationDetails.bind(serviceController)
);

// Vaccination package endpoints
router.post('/vaccination-packages',
    auth,
    authorizeRoles(['Khách hàng']),
    validateRequest(serviceValidation.createVaccinationPackageSchema),
    serviceController.createVaccinationPackage.bind(serviceController)
);

router.get('/vaccination-packages',
    auth,
    authorizeRoles(['Khách hàng']),
    serviceController.getVaccinationPackages.bind(serviceController)
);

// Service price management (admin only)
router.put('/services/:serviceId/price',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(serviceValidation.updateServicePriceSchema),
    serviceController.updateServicePrice.bind(serviceController)
);

router.get('/services/:serviceId/price-history',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty', 'Bác sĩ']),
    serviceController.getServicePriceHistory.bind(serviceController)
);

// Staff scheduling endpoints
router.get('/branches/:branchId/veterinarians',
    auth,
    serviceController.getAvailableVeterinarians.bind(serviceController)
);

router.get('/doctors/:doctorId/schedule',
    auth,
    authorizeRoles(['Bác sĩ', 'Tiếp tân', 'Quản lý chi nhánh']),
    serviceController.getDoctorSchedule.bind(serviceController)
);

module.exports = router;