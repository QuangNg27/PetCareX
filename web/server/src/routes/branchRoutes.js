const express = require('express');
const BranchController = require('../controllers/BranchController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();
const branchController = new BranchController();

// Lấy danh sách chi nhánh
router.get('/',
    auth,
    branchController.getAllBranches
);

// Lấy thông tin chi nhánh theo ID
router.get('/:branchId',
    auth,
    branchController.getBranchById
);

// Lấy nhân viên theo chi nhánh
router.get('/:branchId/employees',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    branchController.getBranchEmployees
);

// Lấy dịch vụ theo chi nhánh
router.get('/:branchId/services',
    auth,
    branchController.getBranchServices
);

// Tạo chi nhánh mới (chỉ quản lý công ty)
router.post('/',
    auth,
    authorizeRoles(['Quản lý công ty']),
    branchController.createBranch
);

// Cập nhật thông tin chi nhánh
router.put('/:branchId',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    branchController.updateBranch
);

module.exports = router;