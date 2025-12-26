const CompanyRepository = require('../repositories/CompanyRepository');

class CompanyService {
    constructor() {
        this.companyRepository = new CompanyRepository();
    }

    async getRevenueByBranch(year) {
        try {
            const revenueData = await this.companyRepository.getRevenueByBranch(year);
            return {
                success: true,
                data: revenueData,
                message: `Lấy doanh thu theo chi nhánh cho năm ${year} thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async getTotalRevenueByYear(year) {
        try {
            const totalRevenueData = await this.companyRepository.getTotalRevenueByYear(year);
            return {
                success: true,
                data: totalRevenueData,
                message: `Lấy tổng doanh thu cho năm ${year} thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async getRevenueByServicesW6M() {
        try {
            const revenueData = await this.companyRepository.getRevenueByServicesW6M();
            return {
                success: true,
                data: revenueData,
                message: `Lấy doanh thu theo dịch vụ trong 6 tháng gần nhất thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async getAllPetsStats() {
        try {
            const petsStats = await this.companyRepository.getAllPetsStats();
            return {
                success: true,
                data: petsStats,
                message: `Lấy thống kê tất cả thú cưng thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async getDogBreedsStats() {
        try {
            const dogBreedsStats = await this.companyRepository.getDogBreedsStats();
            return {
                success: true,
                data: dogBreedsStats,
                message: `Lấy thống kê giống chó thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async getCatBreedsStats() {
        try {
            const catBreedsStats = await this.companyRepository.getCatBreedsStats();
            return {
                success: true,
                data: catBreedsStats,
                message: `Lấy thống kê giống mèo thành công`
            };
        }
        catch (error) {
            throw error;
        }
    }

    async getMembershipStats() {
        try {
            const membershipStats = await this.companyRepository.getMembershipStats();
            return {
                success: true,
                data: membershipStats,
                message: `Lấy thống kê hội viên thành công`
            };
        } catch (error) {
            throw error;
        }
    };

    async getEmployeeStats() {
        try {
            const employeeStats = await this.companyRepository.getEmployeeStats();
            return {
                success: true,
                data: employeeStats,
                message: `Lấy thống kê nhân viên thành công`
            };
        }
        catch (error) {
            throw error;
        }
    }

    async addEmployee(employeeData) {
        try {
            const newEmployee = await this.companyRepository.addEmployee(employeeData);
            return {
                success: true,
                data: newEmployee,
                message: `Thêm nhân viên thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const updatedEmployee = await this.companyRepository.updateEmployee(id, employeeData);
            return {
                success: true,
                data: updatedEmployee,
                message: `Cập nhật nhân viên thành công`
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            const deletedEmployee = await this.companyRepository.deleteEmployee(id);
            return {
                success: true,
                data: deletedEmployee,
                message: `Xóa nhân viên thành công`
            };
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = CompanyService;