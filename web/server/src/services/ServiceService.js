const ServiceRepository = require("../repositories/ServiceRepository");
const CustomerRepository = require("../repositories/CustomerRepository");
const PetRepository = require("../repositories/PetRepository");
const ProductRepository = require("../repositories/ProductRepository");
const { AppError } = require("../middleware/errorHandler");

class ServiceService {
  constructor() {
    this.serviceRepository = new ServiceRepository();
    this.customerRepository = new CustomerRepository();
    this.petRepository = new PetRepository();
    this.productRepository = new ProductRepository();
  }

  async getAllServices() {
    const services = await this.serviceRepository.getAllServices();
    return services;
  }

  async getBranchServices(branchId) {
    const services = await this.serviceRepository.getBranchServices(branchId);
    return services;
  }

  // =========================================================================
  // 1. HÀM TẠO LỊCH KHÁM (CƠ BẢN) - Dành cho Khách hàng & Tiếp tân
  // Logic lấy từ nhánh DEV: Gọn nhẹ, chỉ đặt lịch hẹn
  // =========================================================================
  async createMedicalExamination(
    examinationData,
    requesterId,
    isStaff = false
  ) {
    const { MaCN, MaDV, MaTC, NgayKham } = examinationData;

    // Validate pet ownership (nếu không phải nhân viên thì phải check chủ sở hữu)
    if (!isStaff) {
      const pet = await this.petRepository.getPetById(MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền với thú cưng này", 403);
      }
    }

    // Tạo phiếu khám cơ bản
    const result = await this.serviceRepository.createMedicalExamination({
      MaCN,
      MaDV,
      MaTC,
      NgayKham,
    });

    return result;
  }

  // =========================================================================
  // 2. HÀM TẠO PHIẾU KHÁM (CHI TIẾT) - Dành riêng cho Bác sĩ
  // Logic lấy từ nhánh DEV_DUC: Cho phép nhập Triệu chứng, Chẩn đoán ngay lập tức
  // =========================================================================
  async createDoctorExamination(examinationData) {
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
    } = examinationData;

    // Bác sĩ được quyền tạo khám cho bất kỳ thú cưng nào (chỉ cần check tồn tại)
    const pet = await this.petRepository.getPetById(MaTC);
    if (!pet) {
      throw new AppError("Không tìm thấy thú cưng", 404);
    }

    // Tạo phiếu khám đầy đủ thông tin
    const result = await this.serviceRepository.createMedicalExamination({
      MaCN,
      MaDV,
      MaTC,
      MaNV, // Lưu luôn bác sĩ tạo
      NgayKham,
      TrieuChung,
      ChanDoan,
      NgayTaiKham,
    });

    const examinationId = result.MaKB;

    // Thêm thuốc nếu có
    if (prescriptions && prescriptions.length > 0) {
      const validPrescriptions = prescriptions.filter((p) => p.MaSP);
      if (validPrescriptions.length > 0) {
        for (const prescription of validPrescriptions) {
          await this.serviceRepository.addPrescription(
            examinationId,
            prescription
          );
        }
      }
    }

    return result;
  }

  // =========================================================================
  // CÁC HÀM KHÁC (Giữ nguyên theo logic nhánh DEV)
  // =========================================================================

  async updateMedicalExamination(examinationId, updateData, doctorId) {
    const examination = await this.serviceRepository.getMedicalExamination(
      examinationId
    );

    if (!examination) {
      throw new AppError("Không tìm thấy hồ sơ khám", 404);
    }

    // Nếu hồ sơ đã có bác sĩ phụ trách, chỉ bác sĩ đó mới được sửa
    if (examination.MaNV && examination.MaNV !== doctorId) {
      throw new AppError("Bạn không có quyền cập nhật hồ sơ khám này", 403);
    }

    const result = await this.serviceRepository.updateMedicalExamination(
      examinationId,
      updateData
    );
    if (!result) {
      throw new AppError("Cập nhật thất bại", 500);
    }

    return { success: true };
  }

  async addPrescription(examinationId, prescriptions, doctorId) {
    const examination = await this.serviceRepository.getMedicalExamination(
      examinationId
    );
    if (!examination) {
      throw new AppError("Không tìm thấy hồ sơ khám", 404);
    }

    if (examination.MaNV && examination.MaNV !== doctorId) {
      throw new AppError(
        "Bạn không có quyền thêm đơn thuốc cho hồ sơ này",
        403
      );
    }

    const results = [];
    for (const prescription of prescriptions) {
      const result = await this.serviceRepository.addPrescription(
        examinationId,
        prescription
      );
      results.push(result);
    }

    return { success: true, count: results.length };
  }

  // Hàm này lấy từ dev_Duc (cần thiết để xem đơn thuốc)
  async getPrescriptions(examinationId) {
    return await this.serviceRepository.getPrescriptions(examinationId);
  }

  async createVaccination(vaccinationData, requesterId, isStaff = false) {
    const { MaCN, MaDV, MaTC, NgayTiem, vaccines } = vaccinationData;

    // Validate ownership
    if (!isStaff) {
      const pet = await this.petRepository.getPetById(MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền với thú cưng này", 403);
      }
    }

    const result = await this.serviceRepository.createVaccination({
      MaCN,
      MaDV,
      MaTC,
      NgayTiem,
    });

    // Thêm chi tiết vaccine (nếu có)
    if (vaccines && vaccines.length > 0 && result.MaTP) {
      for (const vaccine of vaccines) {
        if (vaccine.MaSP) {
          await this.serviceRepository.addVaccinationDetail(result.MaTP, {
            MaSP: vaccine.MaSP,
            MaGoi: null,
          });
        }
      }
    }

    return result;
  }

  async updateVaccinationDetails(vaccinationId, details, doctorId) {
    const vaccination = await this.serviceRepository.getVaccination(
      vaccinationId
    );
    if (!vaccination) {
      throw new AppError("Hồ sơ tiêm phòng không tồn tại", 404);
    }

    if (vaccination.MaNV !== null && vaccination.MaNV !== doctorId) {
      throw new AppError(
        "Bạn không có quyền cập nhật thông tin tiêm phòng này",
        403
      );
    }

    const result = await this.serviceRepository.updateVaccination(
      vaccinationId,
      details,
      doctorId
    );
    if (!result) {
      throw new AppError("Cập nhật thông tin tiêm phòng thất bại", 500);
    }
  }

  async createVaccinationPackage(packageData, customerId) {
    const { NgayBatDau, NgayKetThuc, vaccines, MaTC, MaCN } = packageData;

    const startDate = new Date(NgayBatDau);
    const endDate = new Date(NgayKetThuc);
    const durationDays = Math.floor(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    let discountRate = 0;
    if (durationDays >= 365 + 180) {
      discountRate = 0.15;
    } else if (durationDays >= 365) {
      discountRate = 0.1;
    } else if (durationDays >= 180) {
      discountRate = 0.05;
    }

    const result = await this.serviceRepository.createVaccinationPackage({
      MaKH: customerId,
      NgayBatDau,
      NgayKetThuc,
      UuDai: discountRate,
    });

    const packageId = result.MaGoi;

    // Lấy MaDV tiêm phòng
    const serviceResult = await this.serviceRepository.execute(`
            SELECT MaDV 
            FROM Dich_vu 
            WHERE TenDV = 'Tiêm phòng'
        `);

    const maDV = serviceResult.recordset[0]?.MaDV || null;

    if (vaccines && vaccines.length > 0) {
      for (const vaccine of vaccines) {
        const { MaSP, NgayTiem } = vaccine;

        const vaccinationResult =
          await this.serviceRepository.createVaccination({
            MaCN,
            MaDV: maDV,
            MaTC,
            NgayTiem: NgayTiem || null,
          });

        const maTP = vaccinationResult.MaTP;

        await this.serviceRepository.addVaccinationDetail(maTP, {
          MaSP,
          MaGoi: packageId,
        });
      }
    }

    return result;
  }

  async getCustomerVaccinationPackages(customerId) {
    const packages = await this.serviceRepository.getVaccinationPackages(
      customerId
    );

    const packagesWithDetails = await Promise.all(
      packages.map(async (pkg) => {
        const vaccines =
          await this.serviceRepository.getVaccinationPackageDetails(pkg.MaGoi);
        return {
          ...pkg,
          CacVacxin: vaccines.map((v) => ({
            id: v.MaSP,
            TenVaccine: v.TenVaccine,
            LieuLuong: v.LieuLuong,
            TrangThai: v.TrangThai,
            NgayTiem: v.NgayTiem,
          })),
        };
      })
    );

    return packagesWithDetails;
  }

  async updateServicePrice(serviceId, price, effectiveDate, userRole) {
    if (userRole !== "Quản lý công ty") {
      throw new AppError("Bạn không có quyền cập nhật giá dịch vụ", 403);
    }

    const result = await this.serviceRepository.updateServicePrice(
      serviceId,
      price,
      effectiveDate
    );
    return { success: result };
  }

  async getServicePriceHistory(serviceId) {
    const history = await this.serviceRepository.getServicePriceHistory(
      serviceId
    );
    return history;
  }

  async getAvailableVeterinarians(branchId, date) {
    const doctors = await this.serviceRepository.getAvailableVeterinarians(
      branchId,
      date
    );
    return doctors;
  }

  async getExaminations(
    filters = {},
    requesterId = null,
    requesterRole = null,
    requesterBranch = null
  ) {
    if (requesterRole === "Khách hàng" && filters.MaTC) {
      const pet = await this.petRepository.getPetById(filters.MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền xem hồ sơ khám này", 403);
      }
    }

    if (requesterRole === "Bác sĩ") {
      if (
        filters.MaCN &&
        requesterBranch &&
        parseInt(filters.MaCN) !== parseInt(requesterBranch)
      ) {
        throw new AppError(
          "Bạn không có quyền xem hồ sơ tại chi nhánh này",
          403
        );
      }
      filters.MaCN = requesterBranch;
      if (requesterId) {
        filters.MaNV = requesterId;
      }
    }

    const result = await this.serviceRepository.getExaminations(filters);
    return result;
  }

  async getExaminationsWithMedicines(
    filters = {},
    requesterId = null,
    requesterRole = null,
    requesterBranch = null
  ) {
    if (requesterRole === "Khách hàng" && filters.MaTC) {
      const pet = await this.petRepository.getPetById(filters.MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền xem hồ sơ khám này", 403);
      }
    }

    if (requesterRole === "Bác sĩ") {
      if (
        filters.MaCN &&
        requesterBranch &&
        parseInt(filters.MaCN) !== parseInt(requesterBranch)
      ) {
        throw new AppError(
          "Bạn không có quyền xem hồ sơ tại chi nhánh này",
          403
        );
      }
      filters.MaCN = requesterBranch;
      if (requesterId) {
        filters.MaNV = requesterId;
      }
    }

    const result = await this.serviceRepository.getExaminationsWithMedicines(
      filters
    );
    return result;
  }

  async getVaccinations(
    filters = {},
    requesterId = null,
    requesterRole = null,
    requesterBranch = null
  ) {
    if (requesterRole === "Khách hàng" && filters.MaTC) {
      const pet = await this.petRepository.getPetById(filters.MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền xem hồ sơ tiêm phòng này", 403);
      }
    }

    if (requesterRole === "Bác sĩ") {
      if (
        filters.MaCN &&
        requesterBranch &&
        parseInt(filters.MaCN) !== parseInt(requesterBranch)
      ) {
        throw new AppError(
          "Bạn không có quyền xem hồ sơ tiêm phòng tại chi nhánh này",
          403
        );
      }
      filters.MaCN = requesterBranch;
    }

    const result = await this.serviceRepository.getVaccinations(filters);
    return result;
  }

  async getVaccinationDetails(
    vaccinationId,
    requesterId = null,
    requesterRole = null,
    requesterBranch = null
  ) {
    const vaccination = await this.serviceRepository.getVaccination(
      vaccinationId
    );
    if (!vaccination) {
      throw new AppError("Không tìm thấy thông tin tiêm phòng", 404);
    }

    if (requesterRole === "Khách hàng") {
      const pet = await this.petRepository.getPetById(vaccination.MaTC);
      if (!pet || pet.MaKH !== requesterId) {
        throw new AppError("Bạn không có quyền xem chi tiết này", 403);
      }
    }

    if (requesterRole === "Bác sĩ") {
      if (
        vaccination.MaCN &&
        requesterBranch &&
        parseInt(vaccination.MaCN) !== parseInt(requesterBranch)
      ) {
        throw new AppError(
          "Bạn không có quyền xem chi tiết tiêm phòng tại chi nhánh này",
          403
        );
      }
    }

    const details = await this.serviceRepository.getVaccinationDetails(
      vaccinationId
    );

    return details;
  }

  async updateVaccination(vaccinationId, updateData, doctorId) {
    const vaccination = await this.serviceRepository.getVaccination(
      vaccinationId
    );
    if (!vaccination) {
      throw new AppError("Không tìm thấy thông tin tiêm phòng", 404);
    }

    const doctors = await this.serviceRepository.getAvailableVeterinarians(
      vaccination.MaCN,
      vaccination.NgayTiem
    );
    const isValidDoctor = doctors.some((doc) => doc.MaNV === doctorId);
    if (!isValidDoctor) {
      throw new AppError(
        "Bạn không có quyền tiếp nhận tiêm phòng tại chi nhánh này",
        403
      );
    }

    const result = await this.serviceRepository.updateVaccination(
      vaccinationId,
      {
        MaNV: doctorId,
      }
    );

    if (!result) {
      throw new AppError("Tiếp nhận tiêm phòng thất bại", 500);
    }

    return {
      success: true,
      message: "Tiếp nhận tiêm phòng thành công",
    };
  }

  async updateVaccinationDetail(vaccinationDetailId, updateData, doctorId) {
    const detail = await this.serviceRepository.getVaccinationDetail(
      vaccinationDetailId
    );
    if (!detail) {
      throw new AppError("Không tìm thấy chi tiết tiêm phòng", 404);
    }

    const vaccination = await this.serviceRepository.getVaccination(
      detail.MaTP
    );
    if (!vaccination || vaccination.MaNV !== doctorId) {
      throw new AppError(
        "Bạn không có quyền cập nhật chi tiết tiêm phòng này",
        403
      );
    }

    const result = await this.serviceRepository.updateVaccinationDetail(
      vaccinationDetailId,
      updateData
    );

    if (!result) {
      throw new AppError("Cập nhật chi tiết tiêm phòng thất bại", 500);
    }

    return {
      success: true,
      message: "Cập nhật chi tiết tiêm phòng thành công",
    };
  }

  async deletePrescription(examinationId, medicineId, doctorId) {
    const examination = await this.serviceRepository.getMedicalExamination(
      examinationId
    );

    if (!examination) {
      throw new AppError("Không tìm thấy hồ sơ khám", 404);
    }

    if (examination.MaNV && examination.MaNV !== doctorId) {
      throw new AppError("Bạn không có quyền xóa đơn thuốc này", 403);
    }

    const result = await this.serviceRepository.deletePrescription(
      examinationId,
      medicineId
    );

    if (!result) {
      throw new AppError("Xóa thuốc thất bại", 500);
    }

    return { success: true, message: "Xóa thuốc thành công" };
  }

  async updateMedicalExaminationWithPrescriptions(
    examinationId,
    updateData,
    prescriptions,
    doctorId
  ) {
    const examination = await this.serviceRepository.getMedicalExamination(
      examinationId
    );

    if (!examination) {
      throw new AppError("Không tìm thấy hồ sơ khám", 404);
    }

    if (examination.MaNV && examination.MaNV !== doctorId) {
      throw new AppError("Bạn không có quyền cập nhật hồ sơ này", 403);
    }

    const { TrieuChung, ChanDoan, NgayTaiKham } = updateData;

    // Cập nhật hồ sơ - KHÔNG thay đổi MaNV, chỉ cập nhật TrieuChung, ChanDoan, NgayTaiKham
    // Nếu MaNV chưa được set, set = doctorId
    const MaNV = examination.MaNV || doctorId;

    await this.serviceRepository.updateMedicalExamination(examinationId, {
      TrieuChung,
      ChanDoan,
      NgayTaiKham,
      MaNV, // Giữ nguyên MaNV cũ hoặc set = current doctor nếu chưa có
    });

    // Xóa tất cả đơn thuốc cũ
    await this.serviceRepository.deletePrescriptionsByExamination(
      examinationId
    );

    // Thêm đơn thuốc mới
    if (prescriptions && prescriptions.length > 0) {
      const validPrescriptions = prescriptions.filter((p) => p.MaSP);
      if (validPrescriptions.length > 0) {
        for (const prescription of validPrescriptions) {
          await this.serviceRepository.addPrescription(
            examinationId,
            prescription
          );
        }
      }
    }

    return { success: true, message: "Cập nhật hồ sơ khám thành công" };
  }
}

module.exports = ServiceService;
