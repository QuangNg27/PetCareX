const ServiceService = require('../services/ServiceService');
const { AppError } = require('../middleware/errorHandler');

class ServiceController {
    constructor() {
        this.serviceService = new ServiceService();
    }

    async getBranchServices(req, res, next) {
        try {
            const { branchId } = req.params;
            const customerId = req.user.id;

            const services = await this.serviceService.getBranchServices(branchId, customerId);
            
            res.json({
                success: true,
                data: {
                    services,
                    branchId
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async createMedicalExamination(req, res, next) {
        try {
            const { MaCN, MaDV, MaTC, MaNV, NgayKham, TrieuChung, ChanDoan, NgayTaiKham } = req.body;
            const customerId = req.user.id;

            const result = await this.serviceService.createMedicalExamination({
                MaCN,
                MaDV,
                MaTC,
                MaNV,
                NgayKham,
                TrieuChung,
                ChanDoan,
                NgayTaiKham
            }, customerId);

            res.status(201).json({
                success: true,
                message: 'Đặt lịch khám thành công',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMedicalExamination(req, res, next) {
        try {
            const { examinationId } = req.params;
            const { TrieuChung, ChanDoan, NgayTaiKham } = req.body;
            const doctorId = req.user.id;

            await this.serviceService.updateMedicalExamination(
                examinationId,
                { TrieuChung, ChanDoan, NgayTaiKham },
                doctorId
            );

            res.json({
                success: true,
                message: 'Cập nhật hồ sơ khám thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async addPrescription(req, res, next) {
        try {
            const { examinationId } = req.params;
            const { prescriptions } = req.body;
            const doctorId = req.user.id;

            await this.serviceService.addPrescription(examinationId, prescriptions, doctorId);

            res.json({
                success: true,
                message: 'Thêm đơn thuốc thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async createVaccination(req, res, next) {
        try {
            const { MaCN, MaDV, MaTC, MaNV, NgayTiem } = req.body;
            const customerId = req.user.id;

            const result = await this.serviceService.createVaccination({
                MaCN,
                MaDV,
                MaTC,
                MaNV,
                NgayTiem
            }, customerId);

            res.status(201).json({
                success: true,
                message: 'Đặt lịch tiêm phòng thành công',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async addVaccinationDetails(req, res, next) {
        try {
            const { vaccinationId } = req.params;
            const { details } = req.body;
            const doctorId = req.user.id;

            await this.serviceService.addVaccinationDetails(vaccinationId, details, doctorId);

            res.json({
                success: true,
                message: 'Cập nhật thông tin tiêm phòng thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async createVaccinationPackage(req, res, next) {
        try {
            const { NgayBatDau, NgayKetThuc } = req.body;
            const customerId = req.user.id;

            const result = await this.serviceService.createVaccinationPackage({
                NgayBatDau,
                NgayKetThuc
            }, customerId);

            res.status(201).json({
                success: true,
                message: 'Tạo gói tiêm phòng thành công',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getVaccinationPackages(req, res, next) {
        try {
            const customerId = req.user.id;

            const packages = await this.serviceService.getCustomerVaccinationPackages(customerId);

            res.json({
                success: true,
                data: {
                    packages
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateServicePrice(req, res, next) {
        try {
            const { serviceId } = req.params;
            const { price, effectiveDate } = req.body;
            const managerId = req.user.id;

            await this.serviceService.updateServicePrice(serviceId, price, effectiveDate, managerId);

            res.json({
                success: true,
                message: 'Cập nhật giá dịch vụ thành công'
            });
        } catch (error) {
            next(error);
        }
    }

    async getServicePriceHistory(req, res, next) {
        try {
            const { serviceId } = req.params;

            const history = await this.serviceService.getServicePriceHistory(serviceId);

            res.json({
                success: true,
                data: {
                    history
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getAvailableVeterinarians(req, res, next) {
        try {
            const { branchId } = req.params;
            const { date } = req.query;

            // Date validation handled by Joi schema

            const doctors = await this.serviceService.getAvailableVeterinarians(branchId, date);

            res.json({
                success: true,
                data: {
                    doctors,
                    date
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getDoctorSchedule(req, res, next) {
        try {
            const { doctorId } = req.params;
            const { date } = req.query;

            // Date validation handled by Joi schema

            const schedule = await this.serviceService.getDoctorSchedule(doctorId, date);

            res.json({
                success: true,
                data: {
                    schedule,
                    doctorId,
                    date
                }
            });
        } catch (error) {
            next(error);
        }
    }
    // Bác sĩ tiếp nhận khám bệnh hoặc tiêm phòng
    async updateVaccination(req, res, next) {
        try {
            const { vaccinationId } = req.params;
            const doctorId = req.user.id;

            const result = await this.serviceService.updateVaccination(
                vaccinationId,
                req.body,
                doctorId
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateVaccinationDetail(req, res, next) {
        try {
            const { vaccinationDetailId } = req.params;
            const { LieuLuong, TrangThai } = req.body;
            const doctorId = req.user.id;

            const result = await this.serviceService.updateVaccinationDetail(
                vaccinationDetailId,
                { LieuLuong, TrangThai },
                doctorId
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ServiceController;