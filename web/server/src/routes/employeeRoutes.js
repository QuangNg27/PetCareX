const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');
const { validate } = require('../utils/validation');
const employeeValidation = require('../utils/employeeValidation');

const router = express.Router();
const employeeController = new EmployeeController();

// Employee self-service endpoints
router.put('/profile',
    authMiddleware,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validate(employeeValidation.updateProfileSchema.body),
    employeeController.updateMyProfile
);

// Management endpoints
router.get('/',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getAllEmployees
);

router.get('/roles',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getEmployeeRoles
);

router.post('/',
    authMiddleware,
    authorizeRoles(['Quản lý công ty']),
    validate(employeeValidation.createEmployeeSchema.body),
    employeeController.createEmployee
);

router.get('/:employeeId',
    authMiddleware,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getEmployee
);

router.put('/:employeeId',
    authMiddleware,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validate(employeeValidation.updateEmployeeSchema.body),
    employeeController.updateEmployee
);

router.get('/:employeeId/schedule',
    authMiddleware,
    authorizeRoles(['Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getDoctorSchedule
);

// Branch assignment endpoints
router.post('/assignments',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validate(employeeValidation.assignEmployeeSchema.body),
    employeeController.assignEmployeeToBranch
);

router.put('/:employeeId/branches/:branchId/terminate',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validate(employeeValidation.terminateAssignmentSchema.body),
    employeeController.terminateEmployeeAssignment
);

router.put('/:employeeId/branches/:branchId/salary',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validate(employeeValidation.updateSalarySchema.body),
    employeeController.updateEmployeeSalary
);

// Branch-specific endpoints
router.get('/branches/:branchId',
    authMiddleware,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getBranchEmployees
);

module.exports = router;