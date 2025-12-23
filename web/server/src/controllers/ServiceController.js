const ServiceService = require("../services/ServiceService");
const { AppError } = require("../middleware/errorHandler");

class ServiceController {
  constructor() {
    this.serviceService = new ServiceService();
  }

  getBranchServices = async (req, res, next) => {
    try {
      const { branchId } = req.params;

      const services = await this.serviceService.getBranchServices(branchId);

      res.json({
        success: true,
        data: {
          services,
          branchId,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  createMedicalExamination = async (req, res, next) => {
    try {
      const {
        MaCN,
        MaDV,
        MaTC,
        MaNV,
        NgayKham,
        TrieuChung,
        ChanDoan,
        NgayTaiKham,
      } = req.body;

      // Detailed validation with logging
      console.log("Request body:", req.body);
      console.log("User:", req.user);

      const missingFields = [];
      if (!MaCN) missingFields.push("MaCN");
      if (!MaDV) missingFields.push("MaDV");
      if (!MaTC) missingFields.push("MaTC");
      if (!NgayKham) missingFields.push("NgayKham");

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Thiều thông tin bắt buộc: ${missingFields.join(", ")}`,
        });
      }

      const customerId = req.user.MaKH;
      const doctorId = req.user.MaNV; // Use MaNV from user
      const userRole = req.user.role;

      const finalMaNV = MaNV || doctorId;

      const result = await this.serviceService.createMedicalExamination(
        {
          MaCN,
          MaDV,
          MaTC,
          MaNV: finalMaNV,
          NgayKham,
          TrieuChung,
          ChanDoan,
          NgayTaiKham,
        },
        customerId,
        userRole
      );

      res.status(201).json({
        success: true,
        message: "Tạo hồ sơ khám thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateMedicalExamination = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const { TrieuChung, ChanDoan, NgayTaiKham } = req.body;
      const doctorId = req.user.MaNV; // Use MaNV from user

      await this.serviceService.updateMedicalExamination(
        examinationId,
        { TrieuChung, ChanDoan, NgayTaiKham },
        doctorId
      );

      res.json({
        success: true,
        message: "Cập nhật hồ sơ khám thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  addPrescription = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const { prescriptions } = req.body;
      const doctorId = req.user.MaNV; // Use MaNV from user
      console.log(
        `[addPrescription] ExamID: ${examinationId}, doctorId: ${doctorId}, req.user.MaNV: ${req.user.MaNV}`,
        req.user
      );

      await this.serviceService.addPrescription(
        examinationId,
        prescriptions,
        doctorId
      );

      res.json({
        success: true,
        message: "Thêm đơn thuốc thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  getPrescriptions = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const result = await this.serviceService.getPrescriptions(examinationId);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createVaccination = async (req, res, next) => {
    try {
      const { MaCN, MaDV, MaTC, MaNV, NgayTiem, vaccines } = req.body;
      const customerId = req.user.MaKH;

      const result = await this.serviceService.createVaccination(
        {
          MaCN,
          MaDV,
          MaTC,
          MaNV,
          NgayTiem,
          vaccines,
        },
        customerId
      );

      res.status(201).json({
        success: true,
        message: "Đặt lịch tiêm phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateVaccinationDetails = async (req, res, next) => {
    try {
      const { vaccinationId } = req.params;
      const { details } = req.body;
      const doctorId = req.user.MaNV;

      await this.serviceService.updateVaccinationDetails(
        vaccinationId,
        details,
        doctorId
      );

      res.json({
        success: true,
        message: "Cập nhật thông tin tiêm phòng thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  createVaccinationPackage = async (req, res, next) => {
    try {
      const { NgayBatDau, NgayKetThuc, vaccines, MaTC, MaCN } = req.body;
      const customerId = req.user.MaKH;

      const result = await this.serviceService.createVaccinationPackage(
        {
          NgayBatDau,
          NgayKetThuc,
          vaccines,
          MaTC,
          MaCN,
        },
        customerId
      );

      res.status(201).json({
        success: true,
        message: "Tạo gói tiêm phòng thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getVaccinationPackages = async (req, res, next) => {
    try {
      const customerId = req.user.MaKH;

      const packages = await this.serviceService.getCustomerVaccinationPackages(
        customerId
      );

      res.json({
        success: true,
        data: {
          packages,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateServicePrice = async (req, res, next) => {
    try {
      const { serviceId } = req.params;
      const { price, effectiveDate } = req.body;
      const managerId = req.user.MaNV;

      await this.serviceService.updateServicePrice(
        serviceId,
        price,
        effectiveDate,
        managerId
      );

      res.json({
        success: true,
        message: "Cập nhật giá dịch vụ thành công",
      });
    } catch (error) {
      next(error);
    }
  };

  getServicePriceHistory = async (req, res, next) => {
    try {
      const { serviceId } = req.params;

      const history = await this.serviceService.getServicePriceHistory(
        serviceId
      );

      res.json({
        success: true,
        data: {
          history,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getAvailableVeterinarians = async (req, res, next) => {
    try {
      const { branchId } = req.params;
      const { date } = req.query;

      // Date validation handled by Joi schema

      const doctors = await this.serviceService.getAvailableVeterinarians(
        branchId,
        date
      );

      res.json({
        success: true,
        data: {
          doctors,
          date,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // List examinations with optional filters (branchId, doctorId, petId, date range)
  listExaminations = async (req, res, next) => {
    try {
      const { branchId, doctorId, petId, fromDate, toDate } = req.query;
      const requesterId = req.user.MaKH || req.user.MaNV || req.user.MaTK;
      const requesterRole = req.user.VaiTro || req.user.role;

      const filters = {
        MaCN: branchId ? parseInt(branchId) : null,
        MaNV: doctorId ? parseInt(doctorId) : null,
        MaTC: petId ? parseInt(petId) : null,
        FromDate: fromDate || null,
        ToDate: toDate || null,
      };

      const requesterBranch = req.user.MaCN || null;
      const records = await this.serviceService.getExaminations(
        filters,
        requesterId,
        requesterRole,
        requesterBranch
      );

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  // List examinations with medicines (for invoice creation)
  listExaminationsWithMedicines = async (req, res, next) => {
    try {
      const { branchId, doctorId, petId, fromDate, toDate } = req.query;
      const requesterId = req.user.MaKH || req.user.MaNV || req.user.MaTK;
      const requesterRole = req.user.VaiTro || req.user.role;

      const filters = {
        MaCN: branchId ? parseInt(branchId) : null,
        MaNV: doctorId ? parseInt(doctorId) : null,
        MaTC: petId ? parseInt(petId) : null,
        FromDate: fromDate || null,
        ToDate: toDate || null,
      };

      const requesterBranch = req.user.MaCN || null;
      const records = await this.serviceService.getExaminationsWithMedicines(
        filters,
        requesterId,
        requesterRole,
        requesterBranch
      );

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  // List vaccinations
  listVaccinations = async (req, res, next) => {
    try {
      const { branchId, doctorId, petId, fromDate, toDate } = req.query;
      const requesterId = req.user.MaKH || req.user.MaNV || req.user.MaTK;
      const requesterRole = req.user.VaiTro || req.user.role;

      const filters = {
        MaCN: branchId ? parseInt(branchId) : null,
        MaNV: doctorId ? parseInt(doctorId) : null,
        MaTC: petId ? parseInt(petId) : null,
        FromDate: fromDate || null,
        ToDate: toDate || null,
      };

      const requesterBranch = req.user.MaCN || null;
      const records = await this.serviceService.getVaccinations(
        filters,
        requesterId,
        requesterRole,
        requesterBranch
      );

      res.json({
        success: true,
        data: records,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get vaccination details (vaccine items) for a given vaccination session (MaTP)
  getVaccinationDetails = async (req, res, next) => {
    try {
      const { vaccinationId } = req.params;
      const requesterId = req.user.MaKH || req.user.MaNV || req.user.MaTK;
      const requesterRole = req.user.VaiTro || req.user.role;
      const requesterBranch = req.user.MaCN || null;

      const details = await this.serviceService.getVaccinationDetails(
        parseInt(vaccinationId),
        requesterId,
        requesterRole,
        requesterBranch
      );

      res.json({ success: true, data: details });
    } catch (error) {
      next(error);
    }
  };

  // Bác sĩ tiếp nhận khám bệnh hoặc tiêm phòng
  updateVaccination = async (req, res, next) => {
    try {
      const { vaccinationId } = req.params;
      const doctorId = req.user.MaNV;

      const result = await this.serviceService.updateVaccination(
        vaccinationId,
        req.body,
        doctorId
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateVaccinationDetail = async (req, res, next) => {
    try {
      const { vaccinationDetailId } = req.params;
      const { LieuLuong, TrangThai } = req.body;
      const doctorId = req.user.MaNV;

      const result = await this.serviceService.updateVaccinationDetail(
        vaccinationDetailId,
        { LieuLuong, TrangThai },
        doctorId
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ServiceController;
