const BranchRepository = require('../repositories/BranchRepository');

class BranchService {
    constructor() {
        this.branchRepository = new BranchRepository();
    }

    // Lấy danh sách chi nhánh
    async getAllBranches() {
        try {
            const branches = await this.branchRepository.findAll();
            return {
                success: true,
                data: branches,
                message: 'Lấy danh sách chi nhánh thành công'
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy thông tin chi nhánh theo ID
    async getBranchById(branchId) {
        try {
            const branch = await this.branchRepository.findById(branchId);
            if (!branch) {
                return {
                    success: false,
                    message: 'Không tìm thấy chi nhánh',
                    data: null
                };
            }

            return {
                success: true,
                data: branch,
                message: 'Lấy thông tin chi nhánh thành công'
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy nhân viên theo chi nhánh
    async getBranchEmployees(branchId) {
        try {
            const employees = await this.branchRepository.findEmployeesByBranch(branchId);
            return {
                success: true,
                data: employees,
                message: 'Lấy danh sách nhân viên chi nhánh thành công'
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy dịch vụ theo chi nhánh
    async getBranchServices(branchId) {
        try {
            const services = await this.branchRepository.findServicesByBranch(branchId);
            return {
                success: true,
                data: services,
                message: 'Lấy danh sách dịch vụ chi nhánh thành công'
            };
        } catch (error) {
            throw error;
        }
    }

    // Tạo chi nhánh mới (chỉ quản lý công ty)
    async createBranch(branchData) {
        try {
            const newBranch = await this.branchRepository.create(branchData);
            return {
                success: true,
                data: newBranch,
                message: 'Tạo chi nhánh mới thành công'
            };
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật thông tin chi nhánh
    async updateBranch(branchId, updateData) {
        try {
            const updatedBranch = await this.branchRepository.update(branchId, updateData);
            if (!updatedBranch) {
                return {
                    success: false,
                    message: 'Không tìm thấy chi nhánh để cập nhật',
                    data: null
                };
            }

            return {
                success: true,
                data: updatedBranch,
                message: 'Cập nhật thông tin chi nhánh thành công'
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BranchService;