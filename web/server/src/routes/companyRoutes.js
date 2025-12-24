const express = require('express');
const CompanyController = require('../controllers/companyController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const companyController = new CompanyController();

const authed_roles = ['Quản lý công ty'];

// Lấy doanh thu theo chi nhánh trong năm
router.get('/revenue/branch/:year', 
    authMiddleware, 
    authorizeRoles(...authed_roles),
    companyController.getRevenueByBranch
);
// Lấy tổng doanh thu trong năm
router.get('/revenue/total/:year', 
    authMiddleware, 
    authorizeRoles(...authed_roles),
    companyController.getTotalRevenueByYear
);

// Lấy doanh thu theo dịch vụ trong 6 tháng gần nhất
router.get('/revenue/services', 
    authMiddleware, 
    authorizeRoles(...authed_roles),
    companyController.getRevenueByServicesW6M
);

// Thống kê giống chó
router.get('/pets/dog-breeds', 
    authMiddleware, 
    authorizeRoles(...authed_roles),
    companyController.getDogBreedsStats
);
// Thống kê giống mèo
router.get('/pets/cat-breeds',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.getCatBreedsStats
);
// Thống kê tất cả thú cưng
router.get('/pets',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.getAllPetsStats
);

// Thống kê hội viên
router.get('/membership', 
    authMiddleware, 
    authorizeRoles(...authed_roles),
    companyController.getMembershipStats
)

// Thống kê nhân viên
router.get('/employees',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.getEmployeeStats
);
// Thêm nhân viên
router.post('/employees',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.addEmployee
);
// Cập nhật nhân viên
router.put('/employee/:id',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.updateEmployee
);
// Xóa nhân viên
router.delete('/employee/:id',
    authMiddleware,
    authorizeRoles(...authed_roles),
    companyController.deleteEmployee
);

module.exports = router;