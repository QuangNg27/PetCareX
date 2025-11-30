const EmployeeRepository = require('../repositories/EmployeeRepository');
const { AppError } = require('../middleware/errorHandler');

class EmployeeService {
    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    async getAllEmployees(filters = {}, userRole) {
        // Only managers can view all employees
        if (!['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn không có quyền xem danh sách nhân viên', 403);
        }

        const { branchId, role } = filters;
        const employees = await this.employeeRepository.getAllEmployees(branchId, role);
        
        return employees;
    }

    async getEmployee(employeeId, requesterId, userRole, requesterBranchId = null) {
        // Employees can view their own info, managers can view all
        if (userRole === 'Khách hàng') {
            throw new AppError('Bạn không có quyền xem thông tin nhân viên', 403);
        }

        // Check permissions
        if (employeeId !== requesterId && !['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn chỉ có thể xem thông tin của chính mình', 403);
        }

        const employee = await this.employeeRepository.getEmployee(employeeId);
        if (!employee) {
            throw new AppError('Không tìm thấy nhân viên', 404);
        }

        // Get work history
        const workHistory = await this.employeeRepository.getEmployeeWorkHistory(employeeId);

        // Branch manager can only view employees in their branch
        if (userRole === 'Quản lý chi nhánh' && employeeId !== requesterId) {
            const hasWorkInBranch = workHistory.some(work => 
                work.MaCN === requesterBranchId && 
                work.NgayBD <= new Date() && 
                (!work.NgayKT || work.NgayKT >= new Date())
            );
            
            if (!hasWorkInBranch) {
                throw new AppError('Bạn chỉ có thể xem thông tin nhân viên thuộc chi nhánh của mình', 403);
            }
        }

        return {
            employee,
            workHistory
        };
    }

    async createEmployee(employeeData, userRole) {
        // Only company managers can create employees
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền tạo nhân viên mới', 403);
        }

        const { MaNV, HoTen, NgaySinh, GioiTinh, SoDT, Email, DiaChi, ChucVu } = employeeData;

        // Age validation handled by database trigger trg_Check_Tuoi_NgayVaoLam_NhanVien

        const result = await this.employeeRepository.createEmployee({
            MaNV,
            HoTen,
            NgaySinh,
            GioiTinh,
            SoDT,
            Email,
            DiaChi,
            ChucVu
        });

        return {
            success: true,
            message: 'Tạo nhân viên thành công',
            employeeId: result.MaNV
        };
    }

    async updateEmployee(employeeId, updateData, requesterId, userRole, requesterBranchId = null) {
        // Employees can update their own info, managers can update all
        if (userRole === 'Khách hàng') {
            throw new AppError('Bạn không có quyền cập nhật thông tin nhân viên', 403);
        }

        // Permission check for managers
        if (employeeId !== requesterId && !['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn chỉ có thể cập nhật thông tin của chính mình', 403);
        }

        // Branch manager can only update employees in their branch
        if (userRole === 'Quản lý chi nhánh' && employeeId !== requesterId) {
            const workHistory = await this.employeeRepository.getEmployeeWorkHistory(employeeId);
            const hasWorkInBranch = workHistory.some(work => 
                work.MaCN === requesterBranchId && 
                work.NgayBD <= new Date() && 
                (!work.NgayKT || work.NgayKT >= new Date())
            );
            
            if (!hasWorkInBranch) {
                throw new AppError('Bạn chỉ có thể cập nhật nhân viên thuộc chi nhánh của mình', 403);
            }
        }

        // Only managers can change role
        if (updateData.ChucVu && !['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn không có quyền thay đổi chức vụ', 403);
        }

        const result = await this.employeeRepository.updateEmployee(employeeId, updateData);
        
        if (!result) {
            throw new AppError('Cập nhật thông tin nhân viên thất bại', 500);
        }

        return {
            success: true,
            message: 'Cập nhật thông tin nhân viên thành công'
        };
    }

    async assignEmployeeToBranch(assignmentData, userRole) {
        // Only company managers can assign employees to branches
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền phân công nhân viên', 403);
        }

        const { MaNV, MaCN } = assignmentData;

        try {
            // Database will handle validation via stored procedure and triggers
            const result = await this.employeeRepository.assignToBranch(MaNV, MaCN);

            return {
                success: true,
                data: result,
                message: 'Phân công nhân viên thành công'
            };
        } catch (error) {
            // Handle specific database errors
            if (error.number === 60000) {
                throw new AppError('Nhân viên không tồn tại', 404);
            } else if (error.number === 60001) {
                throw new AppError('Chi nhánh không tồn tại', 404);
            } else if (error.number === 60005) {
                throw new AppError('Khoảng thời gian phân công bị chồng lắp', 400);
            }
            throw error;
        }
    }

    async terminateEmployeeAssignment(employeeId, branchId, terminationData, userRole) {
        // Only company managers can terminate assignments
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền kết thúc phân công', 403);
        }

        const { endDate } = terminationData;

        // Database will handle validation
        const result = await this.employeeRepository.terminateEmployeeAssignment(
            employeeId, 
            branchId, 
            endDate
        );

        if (!result) {
            throw new AppError('Kết thúc phân công thất bại', 500);
        }

        return {
            success: true,
            message: 'Kết thúc phân công thành công'
        };
    }

    async updateEmployeeSalary(employeeId, branchId, newSalary, userRole) {
        // Only managers can update salaries
        if (!['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn không có quyền cập nhật lương', 403);
        }

        // Effective date validation can be handled by business logic if needed

        const result = await this.employeeRepository.updateSalary(
            employeeId,
            branchId,
            newSalary
        );

        if (!result) {
            throw new AppError('Cập nhật lương thất bại', 500);
        }

        return {
            success: true,
            message: 'Cập nhật lương thành công'
        };
    }

    async getBranchEmployees(branchId, activeOnly = true, userRole) {
        // Only managers can view branch employees
        if (!['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn không có quyền xem danh sách nhân viên chi nhánh', 403);
        }

        const employees = await this.employeeRepository.getBranchEmployees(branchId, activeOnly);
        
        return employees;
    }

    async getEmployeeRoles() {
        const roles = await this.employeeRepository.getEmployeeRoles();
        return roles;
    }

    async getDoctorSchedule(employeeId, date, requesterId, userRole) {
        // Employees can view their own schedule, managers and receptionists can view all
        if (!['Quản lý chi nhánh', 'Quản lý công ty', 'Tiếp tân'].includes(userRole) && employeeId !== requesterId) {
            throw new AppError('Bạn chỉ có thể xem lịch làm việc của chính mình', 403);
        }

        if (userRole === 'Khách hàng') {
            throw new AppError('Bạn không có quyền xem lịch làm việc', 403);
        }

        const schedule = await this.employeeRepository.getEmployeeSchedule(employeeId, date);
        
        return {
            employeeId,
            date,
            schedule
        };
    }

    // Tạo nhân viên kèm tài khoản do công ty cung cấp (sử dụng stored procedure)
    async createEmployeeWithAccount(employeeData, userRole) {
        // Only company managers can create employees with accounts
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền tạo nhân viên mới', 403);
        }

        try {
            // Tạo nhân viên trước
            const employee = await this.createEmployee(employeeData, userRole);
            
            if (employee.success) {
                const bcrypt = require('bcryptjs');
                
                // Tạo tên đăng nhập tự động từ tên và ID nhân viên
                const username = this.generateUsername(employeeData.HoTen, employee.employeeId);
                // Tạo mật khẩu mặc định (có thể thay đổi sau)
                const defaultPassword = 'PetCareX@123';
                const hashedPassword = await bcrypt.hash(defaultPassword, 12);
                
                // Sử dụng stored procedure Create_TaiKhoan trực tiếp
                await this.employeeRepository.execute(`
                    EXEC Create_TaiKhoan 
                        @TenDangNhap = @TenDangNhap,
                        @MatKhau = @MatKhau,
                        @MaKH = NULL,
                        @MaNV = @MaNV,
                        @VaiTro = @VaiTro
                `, {
                    TenDangNhap: username,
                    MatKhau: hashedPassword,
                    MaNV: employee.employeeId,
                    VaiTro: employeeData.ChucVu
                });

                return {
                    success: true,
                    message: 'Tạo nhân viên và tài khoản thành công',
                    data: {
                        employeeId: employee.employeeId,
                        username: username,
                        defaultPassword: defaultPassword,
                        note: 'Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên'
                    }
                };
            }

            return employee;
        } catch (error) {
            // Xử lý các lỗi từ stored procedure Create_TaiKhoan
            if (error.number === 60002) {
                throw new AppError('Khách hàng này đã có tài khoản', 409);
            } else if (error.number === 60003) {
                throw new AppError('Nhân viên này đã có tài khoản', 409);
            }
            throw error;
        }
    }

    // Helper function để tạo username tự động
    generateUsername(hoTen, employeeId) {
        // Lấy tên cuối và chuyển về không dấu, viết thường
        const name = hoTen.split(' ').pop().toLowerCase();
        const normalizedName = this.removeVietnameseAccents(name);
        return `${normalizedName}${employeeId}`;
    }

    // Helper function để bỏ dấu tiếng Việt
    removeVietnameseAccents(str) {
        return str.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd')
                  .replace(/Đ/g, 'D');
    }
}

module.exports = EmployeeService;