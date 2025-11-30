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
            const { limit = 10 } = req.query;
            const result = await this.reportService.getPopularVaccines(parseInt(limit));
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
                branchId = req.user.branchId;
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
}

module.exports = ReportController;