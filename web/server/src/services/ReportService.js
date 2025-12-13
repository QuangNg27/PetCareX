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
    async getPopularVaccines(branchId = null, limit = 10) {
        try {
            const data = await this.reportRepository.getPopularVaccines(branchId, limit);
            
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

    // Danh sách thú cưng được tiêm phòng
    async getVaccinatedPets(branchId, startDate, endDate) {
        try {
            const rawData = await this.reportRepository.getVaccinatedPets(branchId, startDate, endDate);
            
            // Group by pet and vaccination session (MaTP)
            const grouped = {};
            
            rawData.forEach(row => {
                const key = `${row.MaTC}_${row.MaTP}`;
                
                if (!grouped[key]) {
                    grouped[key] = {
                        MaTC: row.MaTC,
                        TenTC: row.TenTC,
                        Loai: row.Loai,
                        Giong: row.Giong,
                        NgaySinh: row.NgaySinh,
                        TenChuSoHuu: row.TenChuSoHuu,
                        NgayTiem: row.NgayTiem,
                        NhanVienThucHien: row.NhanVienThucHien,
                        vaccines: []
                    };
                }
                
                // Add vaccine to array if not already present
                if (!grouped[key].vaccines.find(v => v.MaSP === row.MaSP)) {
                    grouped[key].vaccines.push({
                        MaSP: row.MaSP,
                        TenVaccine: row.TenVaccine
                    });
                }
            });
            
            // Convert to array and add computed fields
            const pets = Object.values(grouped).map(pet => ({
                ...pet,
                SoLuongVaccine: pet.vaccines.length,
                DanhSachVaccine: pet.vaccines.map(v => v.TenVaccine).join(', ')
            }));
            
            return {
                success: true,
                data: {
                    pets
                },
                message: 'Lấy danh sách thú cưng tiêm phòng thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy danh sách thú cưng tiêm phòng: ' + error.message, 500);
        }
    }

    // Thống kê khách hàng
    async getCustomerStats(branchId, inactiveDays = 90) {
        try {
            const data = await this.reportRepository.getCustomerStatsByBranch(branchId, inactiveDays);
            
            return {
                success: true,
                data: data,
                message: 'Lấy thống kê khách hàng thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy thống kê khách hàng: ' + error.message, 500);
        }
    }

    // Hiệu suất nhân viên
    async getEmployeePerformance(branchId, employeeId = null) {
        try {
            const data = await this.reportRepository.getEmployeePerformanceSummary(branchId, employeeId);
            
            return {
                success: true,
                performance: data,
                message: 'Lấy dữ liệu hiệu suất nhân viên thành công'
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy hiệu suất nhân viên: ' + error.message, 500);
        }
    }
    // Lịch sử khám bệnh của thú cưng tại chi nhánh
    async getPetMedicalHistoryByBranch(petId, branchId, limit = 100) {
        try {
            const PetRepository = require('../repositories/PetRepository');
            const petRepo = new PetRepository();
            
            const history = await petRepo.getPetMedicalHistoryByBranch(petId, branchId, limit);
            const medicines = await petRepo.getPetMedicineBasedOnTreatment(history.map(h => h.MaKB));

            const historyWithMedicines = history.map(record => {
                const recordMedicines = medicines
                    .filter(med => med.MaKB === record.MaKB)
                    .map(med => {
                        const { MaKB, ...medicineWithoutMaKB } = med;
                        return medicineWithoutMaKB;
                    });
                    
                return {
                    ...record,
                    ThuocDaDung: recordMedicines
                };
            });
        
            return {
                success: true,
                data: historyWithMedicines
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy lịch sử khám bệnh: ' + error.message, 500);
        }
    }

    // Lịch sử tiêm phòng của thú cưng tại chi nhánh
    async getPetVaccinationHistoryByBranch(petId, branchId, limit = 100) {
        try {
            const PetRepository = require('../repositories/PetRepository');
            const petRepo = new PetRepository();
            
            const history = await petRepo.getPetVaccinationHistoryByBranch(petId, branchId, limit);
            const vaccines = await petRepo.getPetVaccineBasedOnVaccination(history.map(h => h.MaTP));

            const historyWithVaccines = history.map(record => {
                const recordVaccines = vaccines
                    .filter(vac => vac.MaTP === record.MaTP)
                    .map(vac => {
                        const { MaTP, ...vaccineWithoutMaTP } = vac;
                        return vaccineWithoutMaTP;
                    });
                    
                return {
                    ...record,
                    Vaccines: recordVaccines
                };
            });

            return {
                success: true,
                data: historyWithVaccines
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy lịch sử tiêm phòng: ' + error.message, 500);
        }
    }

    // Lịch sử khám bệnh của thú cưng tại chi nhánh
    async getPetMedicalHistoryByBranch(petId, branchId, limit = 100) {
        try {
            const PetRepository = require('../repositories/PetRepository');
            const petRepo = new PetRepository();
            
            const history = await petRepo.getPetMedicalHistoryByBranch(petId, branchId, limit);
            const medicines = await petRepo.getPetMedicineBasedOnTreatment(history.map(h => h.MaKB));

            const historyWithMedicines = history.map(record => {
                const recordMedicines = medicines
                    .filter(med => med.MaKB === record.MaKB)
                    .map(med => {
                        const { MaKB, ...medicineWithoutMaKB } = med;
                        return medicineWithoutMaKB;
                    });
                    
                return {
                    ...record,
                    ThuocDaDung: recordMedicines
                };
            });
        
            return {
                success: true,
                data: historyWithMedicines
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy lịch sử khám bệnh: ' + error.message, 500);
        }
    }

    // Lịch sử tiêm phòng của thú cưng tại chi nhánh
    async getPetVaccinationHistoryByBranch(petId, branchId, limit = 100) {
        try {
            const PetRepository = require('../repositories/PetRepository');
            const petRepo = new PetRepository();
            
            const history = await petRepo.getPetVaccinationHistoryByBranch(petId, branchId, limit);
            const vaccines = await petRepo.getPetVaccineBasedOnVaccination(history.map(h => h.MaTP));

            // Group by MaTP to avoid duplicates
            const grouped = {};
            
            history.forEach(record => {
                if (!grouped[record.MaTP]) {
                    grouped[record.MaTP] = {
                        MaTP: record.MaTP,
                        NgayTiem: record.NgayTiem,
                        TenBacSi: record.TenBacSi,
                        TenDV: record.TenDV,
                        TenCN: record.TenCN,
                        Vaccines: []
                    };
                }
            });

            // Add vaccines to each grouped record
            vaccines.forEach(vac => {
                if (grouped[vac.MaTP]) {
                    const { MaTP, ...vaccineWithoutMaTP } = vac;
                    grouped[vac.MaTP].Vaccines.push(vaccineWithoutMaTP);
                }
            });

            const historyWithVaccines = Object.values(grouped);

            return {
                success: true,
                data: historyWithVaccines
            };
        } catch (error) {
            throw new AppError('Lỗi khi lấy lịch sử tiêm phòng: ' + error.message, 500);
        }
    }
}

module.exports = ReportService;