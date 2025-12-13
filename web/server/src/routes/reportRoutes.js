const express = require('express');
const ReportController = require('../controllers/ReportController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const reportController = new ReportController();

// Middleware xác thực cho tất cả routes
router.use(authMiddleware);

// Tất cả endpoints yêu cầu quyền quản lý
const managerRoles = ['Quản lý chi nhánh', 'Quản lý công ty'];

// Thống kê khách hàng theo cấp độ
router.get('/customer-count-by-level',
    authorizeRoles(managerRoles),
    reportController.getCustomerCountByLevel
);

// Thống kê vaccine phổ biến
router.get('/popular-vaccines',
    authorizeRoles(managerRoles),
    reportController.getPopularVaccines
);

// Báo cáo doanh thu khám bệnh theo tháng
router.get('/examination-revenue',
    authorizeRoles(managerRoles),
    reportController.getExaminationRevenue
);

// Báo cáo doanh thu tiêm phòng theo tháng
router.get('/vaccination-revenue',
    authorizeRoles(managerRoles),
    reportController.getVaccinationRevenue
);

// Báo cáo doanh thu bán hàng theo tháng
router.get('/product-sales-revenue',
    authorizeRoles(managerRoles),
    reportController.getProductSalesRevenue
);

// Báo cáo hiệu suất nhân viên chi tiết
router.get('/employee-performance/:employeeId',
    authorizeRoles(managerRoles),
    reportController.getEmployeePerformanceDetailed
);

// Báo cáo hiệu suất nhân viên (tổng hợp)
router.get('/employee-performance',
    authorizeRoles(managerRoles),
    reportController.getEmployeePerformance
);

// Danh sách thú cưng được tiêm phòng
router.get('/vaccinated-pets',
    authorizeRoles(managerRoles),
    reportController.getVaccinatedPets
);

// Thống kê khách hàng
router.get('/customer-stats',
    authorizeRoles(managerRoles),
    reportController.getCustomerStats
);

// Thống kê doanh thu theo ngày
router.get('/revenue/daily',
    authorizeRoles(managerRoles),
    reportController.getRevenueByDay
);

// Thống kê doanh thu theo tháng
router.get('/revenue/monthly',
    authorizeRoles(managerRoles),
    reportController.getRevenueByMonth
);

// Thống kê doanh thu theo quý
router.get('/revenue/quarterly',
    authorizeRoles(managerRoles),
    reportController.getRevenueByQuarter
);

// Thống kê doanh thu theo năm
router.get('/revenue/yearly',
    authorizeRoles(managerRoles),
    reportController.getRevenueByYear
);

// Lịch sử thú cưng theo chi nhánh
router.get('/pets/:petId/medical-history',
    authorizeRoles(managerRoles),
    reportController.getPetMedicalHistoryByBranch
);

router.get('/pets/:petId/vaccination-history',
    authorizeRoles(managerRoles),
    reportController.getPetVaccinationHistoryByBranch
);

module.exports = router;