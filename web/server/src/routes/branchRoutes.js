const express = require('express');
const BranchController = require('../controllers/BranchController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

const router = express.Router();
const branchController = new BranchController();

// Lấy danh sách chi nhánh
router.get('/', authMiddleware, branchController.getAllBranches);

// Lấy thông tin chi nhánh theo ID
router.get('/:branchId', authMiddleware, branchController.getBranchById);

// Lấy nhân viên theo chi nhánh
router.get('/:branchId/employees',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    branchController.getBranchEmployees
);

// Lấy dịch vụ theo chi nhánh
router.get('/:branchId/services', authMiddleware, branchController.getBranchServices);

// Cập nhật thông tin chi nhánh
router.put('/:branchId',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    branchController.updateBranch
);

module.exports = router;