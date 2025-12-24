const express = require("express");
const CustomerController = require("../controllers/CustomerController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();
const customerController = new CustomerController();

// Apply authMiddleware to all customer routes
router.use(authMiddleware);

// --- 1. CUSTOMER PROFILE (Thông tin cá nhân) ---
router.get(
  "/profile",
  authorizeRoles("Khách hàng"),
  customerController.getProfile
);
router.put(
  "/profile",
  authorizeRoles("Khách hàng"),
  customerController.updateProfile
);
router.get(
  "/spending",
  authorizeRoles("Khách hàng"),
  customerController.getMembershipSpending
);
router.get(
  "/loyalty-history",
  authorizeRoles("Khách hàng"),
  customerController.getLoyaltyHistory
);
router.post(
  "/change-password",
  authorizeRoles("Khách hàng"),
  customerController.UpdatePassword
);

// --- 2. PET MANAGEMENT (Quản lý thú cưng - Chung) ---
// Xem danh sách thú cưng (Cả khách và nhân viên đều xem được)
router.get(
  "/pets",
  authorizeRoles(["Khách hàng", "Bán hàng", "Bác sĩ", "Tiếp tân"]),
  customerController.getPets
);

// Xem chi tiết thú cưng
router.get(
  "/pets/:petId",
  authorizeRoles(["Khách hàng", "Bán hàng", "Bác sĩ", "Tiếp tân"]),
  customerController.getPetById
);

// Khách hàng tự thêm/sửa/xóa thú cưng
router.post(
  "/pets",
  authorizeRoles("Khách hàng"),
  customerController.createPet
);
router.put(
  "/pets/:petId",
  authorizeRoles("Khách hàng"),
  customerController.updatePet
);
router.delete(
  "/pets/:petId",
  authorizeRoles("Khách hàng"),
  customerController.deletePet
);

// --- 3. PET HISTORY (Lịch sử khám/tiêm) ---
// Xử lý Conflict: Sử dụng cách tiếp cận của nhánh DEV (Tách biệt Customer và Staff)

// A. Dành cho KHÁCH HÀNG (Có kiểm tra quyền sở hữu thú cưng)
router.get(
  "/pets/:petId/medical-history",
  authorizeRoles("Khách hàng"),
  customerController.getPetMedicalHistory
);
router.get(
  "/pets/:petId/vaccination-history",
  authorizeRoles("Khách hàng"),
  customerController.getPetVaccinationHistory
);

// B. Dành cho NHÂN VIÊN (Staff - Xem của bất kỳ ai)
router.get(
  "/staff/pets/:petId/medical-history",
  authorizeRoles(["Tiếp tân", "Bác sĩ", "Quản lý chi nhánh", "Bán hàng"]), // Đã thêm "Bán hàng" từ dev_Duc vào để không mất quyền
  customerController.getAnyPetMedicalHistory
);
router.get(
  "/staff/pets/:petId/vaccination-history",
  authorizeRoles(["Tiếp tân", "Bác sĩ", "Quản lý chi nhánh", "Bán hàng"]),
  customerController.getAnyPetVaccinationHistory
);

// --- 4. STAFF EXCLUSIVE ROUTES (Chức năng dành riêng cho nhân viên - Từ nhánh dev) ---

// Tìm kiếm khách hàng
router.get(
  "/search",
  authorizeRoles(["Bác sĩ", "Bán hàng", "Tiếp tân", "Quản lý chi nhánh"]),
  customerController.searchCustomers
);

// Tạo khách hàng mới (Tiếp tân)
router.post(
  "/",
  authorizeRoles(["Tiếp tân", "Quản lý chi nhánh"]),
  customerController.createCustomer
);

// Nhân viên tạo thú cưng giùm khách
router.post(
  "/:customerId/pets",
  authorizeRoles(["Tiếp tân", "Bác sĩ", "Quản lý chi nhánh"]),
  customerController.createPetForCustomer
);

// Nhân viên xem danh sách thú cưng của một khách hàng cụ thể
router.get(
  "/:customerId/pets",
  authorizeRoles(["Tiếp tân", "Bác sĩ", "Quản lý chi nhánh", "Bán hàng"]),
  customerController.getCustomerPets
);

module.exports = router;