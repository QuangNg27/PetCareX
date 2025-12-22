const ServiceRepository = require('../repositories/ServiceRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const PetRepository = require('../repositories/PetRepository');
const ProductRepository = require('../repositories/ProductRepository');
const { AppError } = require('../middleware/errorHandler');

class ServiceService {
    constructor() {
        this.serviceRepository = new ServiceRepository();
        this.customerRepository = new CustomerRepository();
        this.petRepository = new PetRepository();
        this.productRepository = new ProductRepository();
    }

    async getBranchServices(branchId) {
        const services = await this.serviceRepository.getBranchServices(branchId);
        
        return services;
    }

    async createMedicalExamination(examinationData, requesterId, isStaff = false) {
        const { MaCN, MaDV, MaTC, NgayKham } = examinationData;

        // Validate pet ownership (skip if staff is creating)
        if (!isStaff) {
            const pet = await this.petRepository.getPetById(MaTC);
            if (!pet || pet.MaKH !== requesterId) {
                throw new AppError('Bạn không có quyền với thú cưng này', 403);
            }
        }

        // Create examination
        const result = await this.serviceRepository.createMedicalExamination({
            MaCN,
            MaDV,
            MaTC,
            NgayKham,
        });

        return result;
    }

    async updateMedicalExamination(examinationId, updateData, doctorId) {
        // Check if doctor owns this examination
        const examination = await this.serviceRepository.getMedicalExamination(examinationId);
        if (!examination || examination.MaNV !== doctorId) {
            throw new AppError('Bạn không có quyền cập nhật hồ sơ khám này', 403);
        }

        const result = await this.serviceRepository.updateMedicalExamination(examinationId, updateData);
        if (!result) {
            throw new AppError('Cập nhật thất bại', 500);
        }

        return { success: true };
    }

    async addPrescription(examinationId, prescriptions, doctorId) {
        // Validate examination ownership
        const examination = await this.serviceRepository.getMedicalExamination(examinationId);
        if (!examination || examination.MaNV !== doctorId) {
            throw new AppError('Bạn không có quyền thêm đơn thuốc cho hồ sơ này', 403);
        }

        const results = [];
        for (const prescription of prescriptions) {
            const result = await this.serviceRepository.addPrescription(examinationId, prescription);
            results.push(result);
        }

        return { success: true, count: results.length };
    }

    async createVaccination(vaccinationData, requesterId, isStaff = false) {
        const { MaCN, MaDV, MaTC, NgayTiem, vaccines } = vaccinationData;

        // Validate pet ownership (skip if staff is creating)
        if (!isStaff) {
            const pet = await this.petRepository.getPetById(MaTC);
            if (!pet || pet.MaKH !== requesterId) {
                throw new AppError('Bạn không có quyền với thú cưng này', 403);
            }
        }

        const result = await this.serviceRepository.createVaccination({
            MaCN,
            MaDV,
            MaTC,
            NgayTiem
        });

        // If vaccines are provided, insert them into Chi_tiet_tiem_phong
        if (vaccines && vaccines.length > 0 && result.MaTP) {
            for (const vaccine of vaccines) {
                if (vaccine.MaSP) {
                    await this.serviceRepository.addVaccinationDetail(result.MaTP, {
                        MaSP: vaccine.MaSP,
                        MaGoi: null
                    });
                }
            }
        }

        return result;
    }

    async updateVaccinationDetails(vaccinationId, details, doctorId) {
        // Validate vaccination ownership
        const vaccination = await this.serviceRepository.getVaccination(vaccinationId);
        if (!vaccination || vaccination.MaNV !== doctorId) {
            throw new AppError('Bạn không có quyền cập nhật thông tin tiêm phòng này', 403);
        }

        const result = await this.serviceRepository.updateVaccination(vaccinationId, details, doctorId);
        if (!result) {
            throw new AppError('Cập nhật thông tin tiêm phòng thất bại', 500);
        }
    }

    async createVaccinationPackage(packageData, customerId) {
        const { NgayBatDau, NgayKetThuc, vaccines, MaTC, MaCN } = packageData;

        // Calculate discount based on package duration
        const startDate = new Date(NgayBatDau);
        const endDate = new Date(NgayKetThuc);
        const durationDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        let discountRate = 0;
        if (durationDays >= 365 + 180) {
            discountRate = 0.15; // 15% for 1.5+ year
        } else if (durationDays >= 365) {
            discountRate = 0.10; // 10% for 1+ year
        } else if (durationDays >= 180) {
            discountRate = 0.05; // 5% for 6+ months
        }

        // Create vaccination package
        const result = await this.serviceRepository.createVaccinationPackage({
            MaKH: customerId,
            NgayBatDau,
            NgayKetThuc,
            UuDai: discountRate
        });

        const packageId = result.MaGoi;

        // Get vaccination service ID (MaDV) for the branch
        const serviceResult = await this.serviceRepository.execute(`
            SELECT MaDV 
            FROM Dich_vu 
            WHERE TenDV = 'Tiêm phòng'
        `);
        
        const maDV = serviceResult.recordset[0]?.MaDV || null;

        // Add vaccine details if provided
        if (vaccines && vaccines.length > 0) {
            for (const vaccine of vaccines) {
                const { MaSP, NgayTiem } = vaccine;
                
                // Create vaccination record (Tiem_phong)
                const vaccinationResult = await this.serviceRepository.createVaccination({
                    MaCN,
                    MaDV: maDV,
                    MaTC,
                    NgayTiem: NgayTiem || null
                });

                const maTP = vaccinationResult.MaTP;

                // Add vaccination detail (Chi_tiet_tiem_phong)
                await this.serviceRepository.addVaccinationDetail(maTP, {
                    MaSP,
                    MaGoi: packageId
                });
            }
        }

        return result;
    }

    async getCustomerVaccinationPackages(customerId) {
        const packages = await this.serviceRepository.getVaccinationPackages(customerId);
        
        // Load vaccine details for each package
        const packagesWithDetails = await Promise.all(
            packages.map(async (pkg) => {
                const vaccines = await this.serviceRepository.getVaccinationPackageDetails(pkg.MaGoi);
                return {
                    ...pkg,
                    CacVacxin: vaccines.map(v => ({
                        id: v.MaSP,
                        TenVaccine: v.TenVaccine,
                        LieuLuong: v.LieuLuong,
                        TrangThai: v.TrangThai,
                        NgayTiem: v.NgayTiem
                    }))
                };
            })
        );
        
        return packagesWithDetails;
    }

    async updateServicePrice(serviceId, price, effectiveDate, userRole) {
        // Only company managers can update service prices
        if (userRole !== 'Quản lý công ty') {
            throw new AppError('Bạn không có quyền cập nhật giá dịch vụ', 403);
        }
        
        const result = await this.serviceRepository.updateServicePrice(serviceId, price, effectiveDate);
        return { success: result };
    }

    async getServicePriceHistory(serviceId) {
        const history = await this.serviceRepository.getServicePriceHistory(serviceId);
        return history;
    }

    async getAvailableVeterinarians(branchId, date) {
        const doctors = await this.serviceRepository.getAvailableVeterinarians(branchId, date);
        return doctors;
    }

    // Bác sĩ tiếp nhận khám bệnh hoặc tiêm phòng
    async updateVaccination(vaccinationId, updateData, doctorId) {
        // Validate doctor assignment
        const vaccination = await this.serviceRepository.getVaccination(vaccinationId);
        if (!vaccination) {
            throw new AppError('Không tìm thấy thông tin tiêm phòng', 404);
        }

        // Check if doctor can take this vaccination (branch assignment)
        const doctors = await this.serviceRepository.getAvailableVeterinarians(vaccination.MaCN, vaccination.NgayTiem);
        const isValidDoctor = doctors.some(doc => doc.MaNV === doctorId);
        if (!isValidDoctor) {
            throw new AppError('Bạn không có quyền tiếp nhận tiêm phòng tại chi nhánh này', 403);
        }

        const result = await this.serviceRepository.updateVaccination(vaccinationId, {
            MaNV: doctorId
        });

        if (!result) {
            throw new AppError('Tiếp nhận tiêm phòng thất bại', 500);
        }

        return {
            success: true,
            message: 'Tiếp nhận tiêm phòng thành công'
        };
    }

    async updateVaccinationDetail(vaccinationDetailId, updateData, doctorId) {
        // Validate doctor ownership through vaccination
        const detail = await this.serviceRepository.getVaccinationDetail(vaccinationDetailId);
        if (!detail) {
            throw new AppError('Không tìm thấy chi tiết tiêm phòng', 404);
        }

        const vaccination = await this.serviceRepository.getVaccination(detail.MaTP);
        if (!vaccination || vaccination.MaNV !== doctorId) {
            throw new AppError('Bạn không có quyền cập nhật chi tiết tiêm phòng này', 403);
        }

        const result = await this.serviceRepository.updateVaccinationDetail(vaccinationDetailId, updateData);

        if (!result) {
            throw new AppError('Cập nhật chi tiết tiêm phòng thất bại', 500);
        }

        return {
            success: true,
            message: 'Cập nhật chi tiết tiêm phòng thành công'
        };
    }
}

module.exports = ServiceService;