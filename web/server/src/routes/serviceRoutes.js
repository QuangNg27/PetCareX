const express = require('express');
const ServiceController = require('../controllers/ServiceController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { validate } = require('../utils/validation');
const serviceValidation = require('../utils/serviceValidation');

const router = express.Router();
const serviceController = new ServiceController();

// Get services available at a specific branch (with customer tier pricing)
router.get('/branches/:branchId/services', authMiddleware, serviceController.getBranchServices);

// Medical examination endpoints
router.post('/examinations',
    authMiddleware,
    authorizeRoles(['Khách hàng']),
    validate(serviceValidation.createExaminationSchema.body),
    serviceController.createMedicalExamination
);

router.put('/examinations/:examinationId',
    authMiddleware,
    authorizeRoles(['Bác sĩ']),
    validate(serviceValidation.updateExaminationSchema.body),
    serviceController.updateMedicalExamination
);

router.post('/examinations/:examinationId/prescriptions',
    authMiddleware,
    authorizeRoles(['Bác sĩ']),
    validate(serviceValidation.addPrescriptionSchema.body),
    serviceController.addPrescription
);

// Vaccination endpoints
router.post('/vaccinations',
    authMiddleware,
    authorizeRoles(['Khách hàng']),
    validate(serviceValidation.createVaccinationSchema.body),
    serviceController.createVaccination
);

router.post('/vaccinations/:vaccinationId/details',
    authMiddleware,
    authorizeRoles(['Bác sĩ']),
    validate(serviceValidation.addVaccinationDetailsSchema.body),
    serviceController.addVaccinationDetails
);

// Vaccination package endpoints
router.post('/vaccination-packages',
    authMiddleware,
    authorizeRoles(['Khách hàng']),
    validate(serviceValidation.createVaccinationPackageSchema.body),
    serviceController.createVaccinationPackage
);

router.get('/vaccination-packages',
    authMiddleware,
    authorizeRoles(['Khách hàng']),
    serviceController.getVaccinationPackages
);

// Service price management (admin only)
router.put('/services/:serviceId/price',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validate(serviceValidation.updateServicePriceSchema.body),
    serviceController.updateServicePrice
);

router.get('/services/:serviceId/price-history',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty', 'Bác sĩ']),
    serviceController.getServicePriceHistory
);

// Staff scheduling endpoints
router.get('/branches/:branchId/veterinarians', authMiddleware, serviceController.getAvailableVeterinarians);

router.get('/doctors/:doctorId/schedule',
    authMiddleware,
    authorizeRoles(['Bác sĩ', 'Tiếp tân', 'Quản lý chi nhánh']),
    serviceController.getDoctorSchedule
);

module.exports = router;