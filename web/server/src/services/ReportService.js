const ReportRepository = require('../repositories/ReportRepository');
const { AppError } = require('../middleware/errorHandler');

class ReportService {
    constructor() {
        this.reportRepository = new ReportRepository();
    }

    // Thống kê số lượng khách hàng theo cấp độ
    async getCustomerCountByLevel() {
        try {
            const data = await this.reportRepository.getCustomerCountByLevel();
            
            return {
                success: true,
                data: data,
                message: 'Lấy thống kê khách hàng theo cấp độ thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê khách hàng: ' + error.message, 500);
        }
    }

    // Thống kê vaccine phổ biến
    async getPopularVaccines(limit = 10) {
        try {
            const data = await this.reportRepository.getPopularVaccines(limit);
            
            return {
                success: true,
                data: data,
                message: 'Lấy thống kê vaccine phổ biến thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê vaccine: ' + error.message, 500);
        }
    }

    // Báo cáo doanh thu khám bệnh theo tháng
    async getExaminationRevenue(startDate, endDate, branchId = null) {
        try {
            const data = await this.reportRepository.getExaminationRevenue(startDate, endDate, branchId);
            
            return {
                success: true,
                data: {
                    period: { startDate, endDate },
                    branchId,
                    revenue: data
                },
                message: 'Lấy báo cáo doanh thu khám bệnh thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy báo cáo doanh thu khám bệnh: ' + error.message, 500);
        }
    }

    // Báo cáo doanh thu tiêm phòng theo tháng
    async getVaccinationRevenue(startDate, endDate, branchId = null) {
        try {
            const data = await this.reportRepository.getVaccinationRevenue(startDate, endDate, branchId);
            
            return {
                success: true,
                data: {
                    period: { startDate, endDate },
                    branchId,
                    revenue: data
                },
                message: 'Lấy báo cáo doanh thu tiêm phòng thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy báo cáo doanh thu tiêm phòng: ' + error.message, 500);
        }
    }

    // Báo cáo doanh thu bán hàng theo tháng
    async getProductSalesRevenue(startDate, endDate, branchId = null) {
        try {
            const data = await this.reportRepository.getProductSalesRevenue(startDate, endDate, branchId);
            
            return {
                success: true,
                data: {
                    period: { startDate, endDate },
                    branchId,
                    revenue: data
                },
                message: 'Lấy báo cáo doanh thu bán hàng thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy báo cáo doanh thu bán hàng: ' + error.message, 500);
        }
    }

    // Báo cáo hiệu suất nhân viên chi tiết
    async getEmployeePerformanceDetailed(employeeId, startDate = null, endDate = null) {
        try {
            const data = await this.reportRepository.getEmployeePerformanceDetailed(employeeId, startDate, endDate);
            
            return {
                success: true,
                data: {
                    employeeId,
                    period: { startDate, endDate },
                    performance: data
                },
                message: 'Lấy báo cáo hiệu suất nhân viên chi tiết thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy báo cáo hiệu suất nhân viên chi tiết: ' + error.message, 500);
        }
    }

    // Thống kê doanh thu theo ngày
    async getRevenueByDay(startDate, endDate, branchId = null) {
        try {
            const data = await this.reportRepository.getRevenueByDay(startDate, endDate, branchId);
            
            return {
                success: true,
                data: {
                    period: { startDate, endDate },
                    branchId,
                    revenue: data
                },
                message: 'Lấy thống kê doanh thu theo ngày thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê doanh thu theo ngày: ' + error.message, 500);
        }
    }

    // Thống kê doanh thu theo tháng
    async getRevenueByMonth(year, branchId = null) {
        try {
            const data = await this.reportRepository.getRevenueByMonth(year, branchId);
            
            return {
                success: true,
                data: {
                    year,
                    branchId,
                    revenue: data
                },
                message: 'Lấy thống kê doanh thu theo tháng thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê doanh thu theo tháng: ' + error.message, 500);
        }
    }

    // Thống kê doanh thu theo quý
    async getRevenueByQuarter(year, branchId = null) {
        try {
            const data = await this.reportRepository.getRevenueByQuarter(year, branchId);
            
            return {
                success: true,
                data: {
                    year,
                    branchId,
                    revenue: data
                },
                message: 'Lấy thống kê doanh thu theo quý thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê doanh thu theo quý: ' + error.message, 500);
        }
    }

    // Thống kê doanh thu theo năm
    async getRevenueByYear(startYear, endYear, branchId = null) {
        try {
            const data = await this.reportRepository.getRevenueByYear(startYear, endYear, branchId);
            
            return {
                success: true,
                data: {
                    period: { startYear, endYear },
                    branchId,
                    revenue: data
                },
                message: 'Lấy thống kê doanh thu theo năm thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê doanh thu theo năm: ' + error.message, 500);
        }
    }
}

module.exports = ReportService;