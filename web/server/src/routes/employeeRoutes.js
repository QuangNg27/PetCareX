const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const employeeValidation = require('../utils/employeeValidation');

const router = express.Router();
const employeeController = new EmployeeController();

// Employee self-service endpoints
router.put('/profile',
    auth,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(employeeValidation.updateProfileSchema),
    employeeController.updateMyProfile.bind(employeeController)
);

// Management endpoints
router.get('/',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getAllEmployees.bind(employeeController)
);

router.get('/roles',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getEmployeeRoles.bind(employeeController)
);

router.post('/',
    auth,
    authorizeRoles(['Quản lý công ty']),
    validateRequest(employeeValidation.createEmployeeSchema),
    employeeController.createEmployee.bind(employeeController)
);

router.get('/:employeeId',
    auth,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getEmployee.bind(employeeController)
);

router.put('/:employeeId',
    auth,
    authorizeRoles(['Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(employeeValidation.updateEmployeeSchema),
    employeeController.updateEmployee.bind(employeeController)
);

router.get('/:employeeId/schedule',
    auth,
    authorizeRoles(['Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getDoctorSchedule.bind(employeeController)
);

// Branch assignment endpoints
router.post('/assignments',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(employeeValidation.assignEmployeeSchema),
    employeeController.assignEmployeeToBranch.bind(employeeController)
);

router.put('/:employeeId/branches/:branchId/terminate',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(employeeValidation.terminateAssignmentSchema),
    employeeController.terminateEmployeeAssignment.bind(employeeController)
);

router.put('/:employeeId/branches/:branchId/salary',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(employeeValidation.updateSalarySchema),
    employeeController.updateEmployeeSalary.bind(employeeController)
);

// Branch-specific endpoints
router.get('/branches/:branchId',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    employeeController.getBranchEmployees.bind(employeeController)
);

module.exports = router;