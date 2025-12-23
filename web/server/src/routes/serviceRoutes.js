const express = require("express");
const ServiceController = require("../controllers/ServiceController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();
const serviceController = new ServiceController();

// Get services available at a specific branch
router.get(
  "/branches/:branchId/services",
  authMiddleware,
  serviceController.getBranchServices
);

// Medical examination endpoints
router.post(
  "/examinations",
  authMiddleware,
  authorizeRoles(["Khách hàng", "Bác sĩ"]),
  serviceController.createMedicalExamination
);

// List examinations (doctors and managers can view; customers can view their pets via filters)
router.get(
  "/examinations",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
  ]),
  serviceController.listExaminations
);

// List examinations with medicines (for invoice creation)
router.get(
  "/examinations/with-medicines",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
  ]),
  serviceController.listExaminationsWithMedicines
);

// List vaccinations (doctors and managers can view; customers can view their pets via filters)
router.get(
  "/vaccinations",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
  ]),
  serviceController.listVaccinations
);

// Get vaccination details for a session
router.get(
  "/vaccinations/:vaccinationId/details",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
  ]),
  serviceController.getVaccinationDetails
);

router.put(
  "/examinations/:examinationId",
  authMiddleware,
  authorizeRoles(["Bác sĩ"]),
  serviceController.updateMedicalExamination
);

router.post(
  "/examinations/:examinationId/prescriptions",
  authMiddleware,
  authorizeRoles(["Bác sĩ"]),
  serviceController.addPrescription
);

router.get(
  "/examinations/:examinationId/prescriptions",
  authMiddleware,
  authorizeRoles(["Bác sĩ", "Bán hàng"]),
  serviceController.getPrescriptions
);

// Vaccination endpoints
router.post(
  "/vaccinations",
  authMiddleware,
  authorizeRoles(["Khách hàng"]),
  serviceController.createVaccination
);

router.put(
  "/vaccinations/:vaccinationId/details",
  authMiddleware,
  authorizeRoles(["Bác sĩ"]),
  serviceController.updateVaccinationDetails
);

// Vaccination package endpoints
router.post(
  "/vaccination-packages",
  authMiddleware,
  authorizeRoles(["Khách hàng"]),
  serviceController.createVaccinationPackage
);

router.get(
  "/vaccination-packages",
  authMiddleware,
  authorizeRoles(["Khách hàng"]),
  serviceController.getVaccinationPackages
);

// Service price management (admin only)
router.put(
  "/services/:serviceId/price",
  authMiddleware,
  authorizeRoles(["Quản lý chi nhánh", "Quản lý công ty"]),
  serviceController.updateServicePrice
);

router.get(
  "/services/:serviceId/price-history",
  authMiddleware,
  authorizeRoles(["Quản lý chi nhánh", "Quản lý công ty", "Bác sĩ"]),
  serviceController.getServicePriceHistory
);

// Staff scheduling endpoints
router.get(
  "/branches/:branchId/veterinarians",
  authMiddleware,
  serviceController.getAvailableVeterinarians
);

module.exports = router;
