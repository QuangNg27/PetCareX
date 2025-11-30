const BranchService = require('../services/BranchService');

class BranchController {
    constructor() {
        this.branchService = new BranchService();
    }

    // Lấy danh sách chi nhánh
    getAllBranches = async (req, res, next) => {
        try {
            const result = await this.branchService.getAllBranches();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy thông tin chi nhánh theo ID
    getBranchById = async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const result = await this.branchService.getBranchById(branchId);
            
            const statusCode = result.success ? 200 : 404;
            res.status(statusCode).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy nhân viên theo chi nhánh
    getBranchEmployees = async (req, res, next) => {
        try {
            const { branchId } = req.params;
            
            // Kiểm tra quyền: Quản lý chi nhánh chỉ được xem nhân viên chi nhánh của mình
            if (req.user.role === 'Quản lý chi nhánh' && req.user.branchId !== branchId) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn chỉ có thể xem nhân viên của chi nhánh được phân công'
                });
            }
            
            const result = await this.branchService.getBranchEmployees(branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lấy dịch vụ theo chi nhánh
    getBranchServices = async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const result = await this.branchService.getBranchServices(branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Tạo chi nhánh mới (chỉ quản lý công ty)
    createBranch = async (req, res, next) => {
        try {
            const branchData = req.body;
            const result = await this.branchService.createBranch(branchData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Cập nhật thông tin chi nhánh
    updateBranch = async (req, res, next) => {
        try {
            const { branchId } = req.params;
            const updateData = req.body;
            
            // Kiểm tra quyền: Quản lý chi nhánh chỉ được cập nhật chi nhánh của mình
            if (req.user.role === 'Quản lý chi nhánh' && req.user.branchId !== branchId) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn chỉ có thể cập nhật thông tin chi nhánh được phân công'
                });
            }
            
            const result = await this.branchService.updateBranch(branchId, updateData);
            
            const statusCode = result.success ? 200 : 404;
            res.status(statusCode).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = BranchController;