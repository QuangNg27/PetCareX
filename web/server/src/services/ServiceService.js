const ServiceRepository = require('../repositories/ServiceRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const PetRepository = require('../repositories/PetRepository');
const { AppError } = require('../middleware/errorHandler');

class ServiceService {
    constructor() {
        this.serviceRepository = new ServiceRepository();
        this.customerRepository = new CustomerRepository();
        this.petRepository = new PetRepository();
    }

    async getBranchServices(branchId, customerId) {
        const services = await this.serviceRepository.getBranchServices(branchId);
        
        // Lấy thông tin hạng khách hàng để tính discount  
        const customer = await this.customerRepository.getCustomerProfile(customerId);
        if (!customer) {
            throw new AppError('Không tìm thấy khách hàng', 404);
        }

        // Apply tier discount from database
        const discountData = await this.customerRepository.getMembershipDiscount(customerId);
        const discountRate = discountData.length > 0 ? discountData[0].TiLeKM : 0;
        
        return services.map(service => ({
            ...service,
            GiaSauGiamGia: service.GiaHienTai * (1 - discountRate)
        }));
    }

    async createMedicalExamination(examinationData, requesterId) {
        const { MaCN, MaDV, MaTC, MaNV, NgayKham, TrieuChung, ChanDoan, NgayTaiKham } = examinationData;

        // Validate pet ownership
        const pet = await this.petRepository.getPetById(MaTC);
        if (!pet || pet.MaKH !== requesterId) {
            throw new AppError('Bạn không có quyền với thú cưng này', 403);
        }

        // Validate doctor assignment to branch on examination date
        const doctors = await this.serviceRepository.getAvailableVeterinarians(MaCN, NgayKham);
        const isValidDoctor = doctors.some(doc => doc.MaNV === MaNV);
        if (!isValidDoctor) {
            throw new AppError('Bác sĩ không làm việc tại chi nhánh này vào ngày đã chọn', 400);
        }

        // Create examination
        const result = await this.serviceRepository.createMedicalExamination({
            MaCN,
            MaDV,
            MaTC,
            MaNV,
            NgayKham,
            TrieuChung,
            ChanDoan,
            NgayTaiKham
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

    async createVaccination(vaccinationData, requesterId) {
        const { MaCN, MaDV, MaTC, MaNV, NgayTiem } = vaccinationData;

        // Validate pet ownership
        const pet = await this.petRepository.getPetById(MaTC);
        if (!pet || pet.MaKH !== requesterId) {
            throw new AppError('Bạn không có quyền với thú cưng này', 403);
        }

        // Validate doctor assignment
        const doctors = await this.serviceRepository.getAvailableVeterinarians(MaCN, NgayTiem);
        const isValidDoctor = doctors.some(doc => doc.MaNV === MaNV);
        if (!isValidDoctor) {
            throw new AppError('Bác sĩ không làm việc tại chi nhánh này vào ngày đã chọn', 400);
        }

        const result = await this.serviceRepository.createVaccination({
            MaCN,
            MaDV,
            MaTC,
            MaNV,
            NgayTiem
        });

        return result;
    }

    async addVaccinationDetails(vaccinationId, details, doctorId) {
        // Validate vaccination ownership
        const vaccination = await this.serviceRepository.getVaccination(vaccinationId);
        if (!vaccination || vaccination.MaNV !== doctorId) {
            throw new AppError('Bạn không có quyền cập nhật thông tin tiêm phòng này', 403);
        }

        const results = [];
        for (const detail of details) {
            const result = await this.serviceRepository.addVaccinationDetail(vaccinationId, detail);
            results.push(result);
        }

        return { success: true, count: results.length };
    }

    async createVaccinationPackage(packageData, customerId) {
        const { NgayBatDau, NgayKetThuc } = packageData;

        // Calculate discount based on package duration
        const startDate = new Date(NgayBatDau);
        const endDate = new Date(NgayKetThuc);
        const durationDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        let discountRate = 0;
        if (durationDays >= 365) {
            discountRate = 0.15; // 15% for 1+ year
        } else if (durationDays >= 180) {
            discountRate = 0.10; // 10% for 6+ months
        } else if (durationDays >= 90) {
            discountRate = 0.05; // 5% for 3+ months
        }

        const result = await this.serviceRepository.createVaccinationPackage({
            MaKH: customerId,
            NgayBatDau,
            NgayKetThuc,
            UuDai: discountRate
        });

        return result;
    }

    async getCustomerVaccinationPackages(customerId) {
        const packages = await this.serviceRepository.getVaccinationPackages(customerId);
        
        return packages.map(pkg => ({
            ...pkg,
            UuDaiFormatted: `${(pkg.UuDai * 100).toFixed(0)}%`
        }));
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

    async getDoctorSchedule(doctorId, date) {
        const schedule = await this.serviceRepository.getDoctorSchedule(doctorId, date);
        return schedule;
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