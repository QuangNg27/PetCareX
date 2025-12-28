const ServiceService = require("../services/ServiceService");
const { AppError } = require("../middleware/errorHandler");

class ServiceController {
  constructor() {
    this.serviceService = new ServiceService();
  }

  getAllServices = async (req, res, next) => {
    try {
      const services = await this.serviceService.getAllServices();

      res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  };

  getBranchServices = async (req, res, next) => {
    try {
      const { branchId } = req.params;
      const services = await this.serviceService.getBranchServices(branchId);

      res.json({
        success: true,
        data: { services, branchId },
      });
    } catch (error) {
      next(error);
    }
  };

  // Hàm tạo khám bệnh (Logic gọn của DEV)
  createMedicalExamination = async (req, res, next) => {
    try {
      const { MaCN, MaDV, MaTC, NgayKham } = req.body;

      const isStaff = !!req.user.MaNV;
      const requesterId = req.user.MaNV || req.user.MaKH;

      const result = await this.serviceService.createMedicalExamination(
        {
          MaCN,
          MaDV,
          MaTC,
          NgayKham,
        },
        requesterId,
        isStaff
      );

      res.status(201).json({
        success: true,
        message: "Đặt lịch khám thành công",
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
      const doctorId = req.user.MaNV;

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

  // Hàm thêm thuốc (Logic gọn của DEV)
  addPrescription = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const { prescriptions } = req.body;
      const doctorId = req.user.MaNV;

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

  // Hàm tạo tiêm chủng (Logic gọn của DEV)
  createVaccination = async (req, res, next) => {
    try {
      const { MaCN, MaDV, MaTC, MaNV, NgayTiem, vaccines } = req.body;

      const isStaff = !!req.user.MaNV;
      const requesterId = req.user.MaNV || req.user.MaKH;

      const result = await this.serviceService.createVaccination(
        {
          MaCN,
          MaDV,
          MaTC,
          MaNV,
          NgayTiem,
          vaccines,
        },
        requesterId,
        isStaff
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
        data: { packages },
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
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  };

  getAvailableVeterinarians = async (req, res, next) => {
    try {
      const { branchId } = req.params;
      const { date } = req.query;
      const doctors = await this.serviceService.getAvailableVeterinarians(
        branchId,
        date
      );

      res.json({
        success: true,
        data: { doctors, date },
      });
    } catch (error) {
      next(error);
    }
  };

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

  createMedicalExamination_R = async (req, res, next) => {
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
        prescriptions = [],
      } = req.body;

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
          message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
        });
      }

      const doctorId = req.user.MaNV;
      const userRole = req.user.role;
      const finalMaNV = MaNV || doctorId;

      const result = await this.serviceService.createDoctorExamination(
        {
          MaCN,
          MaDV,
          MaTC,
          MaNV: finalMaNV,
          NgayKham,
          TrieuChung,
          ChanDoan,
          NgayTaiKham,
          prescriptions,
        },
        doctorId,
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

  getPrescriptions = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const result = await this.serviceService.getPrescriptions(examinationId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  listExaminations = async (req, res, next) => {
    try {
      const {
        branchId,
        doctorId,
        petId,
        fromDate,
        toDate,
        page = 1,
        limit = 10,
      } = req.query;
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
      const pageNum = Math.max(1, parseInt(page) || 1);
      const pageSize = Math.max(1, Math.min(100, parseInt(limit) || 10));

      const records = await this.serviceService.getExaminations(
        filters,
        requesterId,
        requesterRole,
        requesterBranch
      );

      const total = records.length;
      const startIdx = (pageNum - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedData = records.slice(startIdx, endIdx);

      res.json({
        success: true,
        data: paginatedData,
        total,
        page: pageNum,
        limit: pageSize,
      });
    } catch (error) {
      next(error);
    }
  };

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
      res.json({ success: true, data: records });
    } catch (error) {
      next(error);
    }
  };

  listVaccinations = async (req, res, next) => {
    try {
      const {
        branchId,
        doctorId,
        petId,
        fromDate,
        toDate,
        page = 1,
        limit = 10,
      } = req.query;
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
      const pageNum = Math.max(1, parseInt(page) || 1);
      const pageSize = Math.max(1, Math.min(100, parseInt(limit) || 10));

      const records = await this.serviceService.getVaccinations(
        filters,
        requesterId,
        requesterRole,
        requesterBranch
      );

      const total = records.length;
      const startIdx = (pageNum - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedData = records.slice(startIdx, endIdx);

      res.json({
        success: true,
        data: paginatedData,
        total,
        page: pageNum,
        limit: pageSize,
      });
    } catch (error) {
      next(error);
    }
  };

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

  deletePrescription = async (req, res, next) => {
    try {
      const { examinationId, medicineId } = req.params;
      const doctorId = req.user.MaNV;

      const result = await this.serviceService.deletePrescription(
        parseInt(examinationId),
        parseInt(medicineId),
        doctorId
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateMedicalExaminationWithPrescriptions = async (req, res, next) => {
    try {
      const { examinationId } = req.params;
      const { examData, prescriptions } = req.body;
      const doctorId = req.user.MaNV;

      const result =
        await this.serviceService.updateMedicalExaminationWithPrescriptions(
          parseInt(examinationId),
          examData,
          prescriptions,
          doctorId
        );

      res.json({
        success: true,
        message: "Cập nhật hồ sơ khám thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ServiceController;
