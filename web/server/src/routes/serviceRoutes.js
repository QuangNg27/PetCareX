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

// 1. Tạo lịch khám (Khách hàng & Tiếp tân) - Dùng hàm chuẩn
router.post(
  "/examinations",
  authMiddleware,
  authorizeRoles(["Khách hàng", "Tiếp tân"]),
  serviceController.createMedicalExamination
);

// 2. Tạo phiếu khám 
// Đường dẫn khác biệt để tránh trùng lặp method POST
router.post(
  "/examinations/doctor",
  authMiddleware,
  authorizeRoles(["Bác sĩ"]),
  serviceController.createMedicalExamination_R
);

// 3. Xem danh sách khám 
router.get(
  "/examinations",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
  ]),
  serviceController.listExaminations
);

router.get(
  "/examinations/with-medicines",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
  ]),
  serviceController.listExaminationsWithMedicines
);

// 5. Cập nhật và kê đơn (Logic chung)
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


// 1. Tạo lịch tiêm 
router.post(
  "/vaccinations",
  authMiddleware,
  authorizeRoles(["Khách hàng", "Tiếp tân"]),
  serviceController.createVaccination
);

// 2. Xem danh sách tiêm
router.get(
  "/vaccinations",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
  ]),
  serviceController.listVaccinations
);


router.get(
  "/vaccinations/:vaccinationId/details",
  authMiddleware,
  authorizeRoles([
    "Bác sĩ",
    "Quản lý chi nhánh",
    "Quản lý công ty",
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
  ]),
  serviceController.getVaccinationDetails
);

// 4. Cập nhật chi tiết tiêm (Bác sĩ)
router.put(
  "/vaccinations/:vaccinationId/details",
  authMiddleware,
  authorizeRoles(["Bác sĩ"]),
  serviceController.updateVaccinationDetails
);


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

router.get(
  "/branches/:branchId/veterinarians",
  authMiddleware,
  serviceController.getAvailableVeterinarians
);

module.exports = router;