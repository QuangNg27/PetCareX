const ReportService = require('../services/ReportService');

class ReportController {
    constructor() {
        this.reportService = new ReportService();
    }

    // Thống kê khách hàng theo cấp độ
    getCustomerCountByLevel = async (req, res, next) => {
        try {
            const result = await this.reportService.getCustomerCountByLevel();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê vaccine phổ biến
    getPopularVaccines = async (req, res, next) => {
        try {
            const { branchId, limit = 10 } = req.query;
            const result = await this.reportService.getPopularVaccines(branchId ? parseInt(branchId) : null, parseInt(limit));
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Báo cáo doanh thu khám bệnh
    getExaminationRevenue = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp startDate và endDate'
                });
            }
            
            const result = await this.reportService.getExaminationRevenue(startDate, endDate, branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Báo cáo doanh thu tiêm phòng
    getVaccinationRevenue = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp startDate và endDate'
                });
            }
            
            const result = await this.reportService.getVaccinationRevenue(startDate, endDate, branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Báo cáo doanh thu bán hàng
    getProductSalesRevenue = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp startDate và endDate'
                });
            }
            
            const result = await this.reportService.getProductSalesRevenue(startDate, endDate, branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Báo cáo hiệu suất nhân viên chi tiết
    getEmployeePerformanceDetailed = async (req, res, next) => {
        try {
            const { employeeId } = req.params;
            const { startDate, endDate } = req.query;
            
            const result = await this.reportService.getEmployeePerformanceDetailed(employeeId, startDate, endDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê doanh thu theo ngày
    getRevenueByDay = async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp startDate và endDate'
                });
            }
            
            const result = await this.reportService.getRevenueByDay(startDate, endDate, branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê doanh thu theo tháng
    getRevenueByMonth = async (req, res, next) => {
        try {
            const { year } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!year) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp năm'
                });
            }
            
            const result = await this.reportService.getRevenueByMonth(parseInt(year), branchId);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê doanh thu theo quý
    getRevenueByQuarter = async (req, res, next) => {
        try {
            const { year } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!year) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp năm'
                });
            }
            
            const result = await this.reportService.getRevenueByQuarter(parseInt(year), branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê doanh thu theo năm
    getRevenueByYear = async (req, res, next) => {
        try {
            const { startYear, endYear } = req.query;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!startYear || !endYear) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp startYear và endYear'
                });
            }
            
            const result = await this.reportService.getRevenueByYear(parseInt(startYear), parseInt(endYear), branchId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Hiệu suất nhân viên (tổng hợp)
    getEmployeePerformance = async (req, res, next) => {
        try {
            const { employeeId } = req.query;
            
            // Lấy branchId từ user đã authenticate
            const branchId = req.user.MaCN;
            
            if (!branchId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy thông tin chi nhánh của người dùng'
                });
            }
            
            const result = await this.reportService.getEmployeePerformance(branchId, employeeId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Danh sách thú cưng được tiêm phòng
    getVaccinatedPets = async (req, res, next) => {
        try {
            let { branchId, startDate, endDate } = req.query;
            
            // Quản lý chi nhánh chỉ được xem báo cáo của chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!branchId || !startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp branchId, startDate và endDate'
                });
            }
            
            const result = await this.reportService.getVaccinatedPets(branchId, startDate, endDate);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Thống kê khách hàng
    getCustomerStats = async (req, res, next) => {
        try {
            const { inactiveDays = 90 } = req.query;
            
            // Lấy branchId từ user đã authenticate
            const branchId = req.user.MaCN;
            
            if (!branchId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không tìm thấy thông tin chi nhánh của người dùng'
                });
            }
            
            const result = await this.reportService.getCustomerStats(branchId, parseInt(inactiveDays));
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lịch sử khám bệnh của thú cưng tại chi nhánh
    getPetMedicalHistoryByBranch = async (req, res, next) => {
        try {
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 100;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem lịch sử tại chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!branchId) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp mã chi nhánh'
                });
            }
            
            const result = await this.reportService.getPetMedicalHistoryByBranch(petId, branchId, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // Lịch sử tiêm phòng của thú cưng tại chi nhánh
    getPetVaccinationHistoryByBranch = async (req, res, next) => {
        try {
            const petId = parseInt(req.params.petId);
            const limit = parseInt(req.query.limit) || 100;
            let { branchId } = req.query;
            
            // Quản lý chi nhánh chỉ được xem lịch sử tại chi nhánh mình
            if (req.user.role === 'Quản lý chi nhánh') {
                branchId = req.user.MaCN;
            }
            
            if (!branchId) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp mã chi nhánh'
                });
            }
            
            const result = await this.reportService.getPetVaccinationHistoryByBranch(petId, branchId, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = ReportController;
