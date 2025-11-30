const EmployeeService = require('../services/EmployeeService');
const { AppError } = require('../middleware/errorHandler');

class EmployeeController {
    constructor() {
        this.employeeService = new EmployeeService();
    }

    async getAllEmployees(req, res, next) {
        try {
            const { branchId, role } = req.query;
            const userRole = req.user.role;

            const employees = await this.employeeService.getAllEmployees(
                { branchId, role },
                userRole
            );

            res.json({
                success: true,
                data: { employees }
            });
        } catch (error) {
            next(error);
        }
    }

    async getEmployee(req, res, next) {
        try {
            const { employeeId } = req.params;
            const requesterId = req.user.id;
            const userRole = req.user.role;
            const requesterBranchId = req.user.branchId; // Assuming branch info is in JWT

            const result = await this.employeeService.getEmployee(
                employeeId, 
                requesterId, 
                userRole, 
                requesterBranchId
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async createEmployee(req, res, next) {
        try {
            const employeeData = req.body.employee || req.body;
            const accountData = req.body.account;
            const userRole = req.user.role;

            let result;
            
            // Nếu có yêu cầu tạo tài khoản, công ty sẽ tự động tạo
            if (accountData && accountData.createAccount === true) {
                result = await this.employeeService.createEmployeeWithAccount(
                    employeeData,
                    userRole
                );
            } else {
                // Chỉ tạo nhân viên
                const { MaNV, HoTen, NgaySinh, GioiTinh, SoDT, Email, DiaChi, ChucVu } = employeeData;
                result = await this.employeeService.createEmployee({
                    MaNV,
                    HoTen,
                    NgaySinh,
                    GioiTinh,
                    SoDT,
                    Email,
                    DiaChi,
                    ChucVu
                }, userRole);
            }

            res.status(201).json({
                success: true,
                message: result.message,
                data: result.data || { employeeId: result.employeeId }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEmployee(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { HoTen, NgaySinh, GioiTinh, SoDT, Email, DiaChi, ChucVu } = req.body;
            const requesterId = req.user.id;
            const userRole = req.user.role;
            const requesterBranchId = req.user.branchId;

            const result = await this.employeeService.updateEmployee(
                employeeId,
                { HoTen, NgaySinh, GioiTinh, SoDT, Email, DiaChi, ChucVu },
                requesterId,
                userRole,
                requesterBranchId
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async assignEmployeeToBranch(req, res, next) {
        try {
            const { MaNV, MaCN, NgayBD, Luong } = req.body;
            const userRole = req.user.role;

            // Field validation handled by Joi schema

            // Salary validation handled by database CHECK constraint

            const result = await this.employeeService.assignEmployeeToBranch({
                MaNV,
                MaCN,
                NgayBD,
                Luong
            }, userRole);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async terminateEmployeeAssignment(req, res, next) {
        try {
            const { employeeId, branchId } = req.params;
            const { endDate } = req.body;
            const userRole = req.user.role;

            // Field validation handled by Joi schema

            const result = await this.employeeService.terminateEmployeeAssignment(
                employeeId,
                branchId,
                { endDate },
                userRole
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async updateEmployeeSalary(req, res, next) {
        try {
            const { employeeId, branchId } = req.params;
            const { newSalary } = req.body;
            const userRole = req.user.role;

            // Field validation handled by Joi schema

            // Salary validation handled by database CHECK constraint

            const result = await this.employeeService.updateEmployeeSalary(
                employeeId,
                branchId,
                newSalary,
                userRole
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async getBranchEmployees(req, res, next) {
        try {
            const { branchId } = req.params;
            const { activeOnly } = req.query;
            const userRole = req.user.role;

            const employees = await this.employeeService.getBranchEmployees(
                branchId,
                activeOnly !== 'false',
                userRole
            );

            res.json({
                success: true,
                data: { employees }
            });
        } catch (error) {
            next(error);
        }
    }

    async getEmployeeRoles(req, res, next) {
        try {
            const roles = await this.employeeService.getEmployeeRoles();

            res.json({
                success: true,
                data: { roles }
            });
        } catch (error) {
            next(error);
        }
    }

    async getDoctorSchedule(req, res, next) {
        try {
            const { employeeId } = req.params;
            const { date } = req.query;
            const requesterId = req.user.id;
            const userRole = req.user.role;

            if (!date) {
                throw new AppError('Ngày làm việc là bắt buộc', 400);
            }

            const result = await this.employeeService.getDoctorSchedule(
                employeeId,
                date,
                requesterId,
                userRole
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const employeeId = req.user.id;
            const { HoTen, NgaySinh, GioiTinh } = req.body;
            const userRole = req.user.role;

            // Employees can only update certain fields (not ChucVu)
            const result = await this.employeeService.updateEmployee(
                employeeId,
                { HoTen, NgaySinh, GioiTinh },
                employeeId,
                userRole,
                req.user.branchId
            );

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = EmployeeController;