const InvoiceRepository = require("../repositories/InvoiceRepository");
const CustomerRepository = require("../repositories/CustomerRepository");
const AuthRepository = require("../repositories/AuthRepository");
const { AppError } = require("../middleware/errorHandler");

class InvoiceService {
  constructor() {
    this.invoiceRepository = new InvoiceRepository();
    this.customerRepository = new CustomerRepository();
    this.authRepository = new AuthRepository();
  }

  async createInvoice(invoiceData, requesterId, userRole, requestUser = {}) {
    const {
      MaKH,
      NgayLap,
      HinhThucTT,
      CT_SanPham = [],
      CT_DichVu = [],
    } = invoiceData;

    // Only sales staff can create invoices
    if (userRole !== "Bán hàng") {
      throw new AppError(
        "Chỉ nhân viên bán hàng mới có quyền tạo hóa đơn",
        403
      );
    }

    // Validate required fields
    if (!MaKH || !NgayLap || !HinhThucTT) {
      throw new AppError(
        "Thiếu thông tin bắt buộc: MaKH, NgayLap, HinhThucTT",
        400
      );
    }

    // Get employee's branch - use MaNV from user object if available
    let MaCN = null;

    if (requestUser?.MaNV) {
      // Get from employee history
      const employeeBranchInfo =
        await this.authRepository.getEmployeeBranchInfo(requestUser.MaNV);
      if (employeeBranchInfo && employeeBranchInfo.MaCN) {
        MaCN = employeeBranchInfo.MaCN;
      }
    }

    if (!MaCN) {
      // Fallback: try with requesterId (for backward compatibility)
      const employeeBranchInfo =
        await this.authRepository.getEmployeeBranchInfo(requesterId);
      if (employeeBranchInfo && employeeBranchInfo.MaCN) {
        MaCN = employeeBranchInfo.MaCN;
      }
    }

    if (!MaCN) {
      throw new AppError("Không tìm thấy chi nhánh của nhân viên", 404);
    }

    // At least one of CT_SanPham or CT_DichVu must be provided
    if (CT_SanPham.length === 0 && CT_DichVu.length === 0) {
      throw new AppError(
        "Hóa đơn phải có ít nhất một chi tiết sản phẩm hoặc dịch vụ",
        400
      );
    }

    // Map and validate CT_SanPham
    // Expected: { MaSP, SoLuong, GiaApDung }
    const mappedSanPham = CT_SanPham.map((item) => {
      if (!item.MaSP || !item.SoLuong || !item.GiaApDung) {
        throw new AppError(
          "Chi tiết sản phẩm thiếu: MaSP, SoLuong, GiaApDung",
          400
        );
      }
      return {
        MaSP: parseInt(item.MaSP),
        SoLuong: parseInt(item.SoLuong),
        GiaApDung: parseFloat(item.GiaApDung),
      };
    });

    // Map and validate CT_DichVu
    // Expected: { MaDV, MaTC, MaKB?, MaTP?, GiaApDung }
    const mappedDichVu = CT_DichVu.map((item) => {
      if (!item.MaDV || !item.MaTC || !item.GiaApDung) {
        throw new AppError(
          "Chi tiết dịch vụ thiếu: MaDV, MaTC, GiaApDung",
          400
        );
      }
      return {
        MaCN: MaCN, // Use employee's branch
        MaDV: parseInt(item.MaDV),
        MaTC: parseInt(item.MaTC),
        MaKB: item.MaKB ? parseInt(item.MaKB) : null,
        MaTP: item.MaTP ? parseInt(item.MaTP) : null,
        GiaApDung: parseFloat(item.GiaApDung),
      };
    });

    // Call repository with properly mapped data
    const result = await this.invoiceRepository.createInvoice({
      MaKH: parseInt(MaKH),
      MaCN: parseInt(MaCN),
      MaNV: requesterId, // Employee creating the invoice
      NgayLap,
      HinhThucTT,
      CT_SanPham: mappedSanPham,
      CT_DichVu: mappedDichVu,
    });

    return result;
  }

  async getInvoice(invoiceId, requesterId, userRole) {
    const invoice = await this.invoiceRepository.getInvoiceDetails(invoiceId);

    if (!invoice) {
      throw new AppError("Không tìm thấy hóa đơn", 404);
    }

    // Validate access permissions
    if (userRole === "Khách hàng" && invoice.MaKH !== requesterId) {
      throw new AppError("Bạn không có quyền xem hóa đơn này", 403);
    }

    return invoice;
  }

  async getCustomerInvoices(
    customerId,
    requesterId,
    userRole,
    pagination = {}
  ) {
    // Customers can only view their own invoices
    if (userRole === "Khách hàng" && customerId !== requesterId) {
      throw new AppError("Bạn chỉ có thể xem hóa đơn của chính mình", 403);
    }

    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const invoices = await this.invoiceRepository.getCustomerInvoices(
      customerId,
      limit,
      offset
    );

    // Get total count for pagination
    const totalResult = await this.invoiceRepository.getCustomerInvoiceCount(
      customerId
    );
    const total = totalResult?.total || 0;

    return {
      invoices,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getBranchInvoices(branchId, filters, requesterId, userRole) {
    // Only branch managers and company managers can view branch invoices
    if (!["Quản lý chi nhánh", "Quản lý công ty"].includes(userRole)) {
      throw new AppError("Bạn không có quyền xem báo cáo chi nhánh", 403);
    }

    const { startDate, endDate, page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    const invoices = await this.invoiceRepository.getBranchInvoices(
      branchId,
      startDate,
      endDate,
      limit,
      offset
    );

    // Get statistics for the same period
    const stats = await this.invoiceRepository.getInvoiceStatistics(
      branchId,
      startDate,
      endDate
    );

    return {
      invoices,
      statistics: stats,
      filters: { branchId, startDate, endDate },
    };
  }

  async getCustomerPetsServices(customerId, requesterId, userRole) {
    // Customers can only view their own pets services
    if (userRole === "Khách hàng" && customerId !== requesterId) {
      throw new AppError(
        "Bạn chỉ có thể xem dịch vụ của các thú cưng của mình",
        403
      );
    }

    const flatServices = await this.invoiceRepository.getCustomerPetsServices(
      customerId
    );

    // Chỉ lấy dịch vụ chính (Khám bệnh và Tiêm phòng), bỏ Thuốc và Vắc xin
    const mainServices = [];
    const seenKeys = new Set();

    flatServices.forEach((row) => {
      let loaiDichVu = (row.LoaiDichVu || "").trim();

      console.log(
        `[InvoiceService.getCustomerPetsServices] Processing: loai="${loaiDichVu}", MaKB=${row.MaKB}, MaTP=${row.MaTP}, TenThuCung="${row.TenThuCung}", TenDV="${row.TenDV}"`
      );

      // Chỉ lấy dịch vụ chính (Khám bệnh hoặc Tiêm phòng)
      if (
        loaiDichVu.includes("Khám") ||
        loaiDichVu.toLowerCase().includes("khám")
      ) {
        const key = `exam_${row.MaKB}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          mainServices.push({
            loai: "Khám bệnh",
            MaKB: row.MaKB,
            MaDV: row.MaDV,
            MaTC: row.MaTC,
            TenThuCung: row.TenThuCung,
            TenDV: row.TenDV,
            GiaDichVu: row.GiaDichVu,
            NgayDichVu: row.NgayDichVu,
          });
        }
      } else if (
        loaiDichVu.includes("Tiêm") ||
        loaiDichVu.toLowerCase().includes("tiêm")
      ) {
        const key = `vacc_${row.MaTP}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          console.log(
            `[InvoiceService.getCustomerPetsServices] ✓ ADDING VACCINATION: MaTP=${row.MaTP}, TenDV="${row.TenDV}"`
          );
          mainServices.push({
            loai: "Tiêm phòng",
            MaTP: row.MaTP,
            MaDV: row.MaDV,
            MaTC: row.MaTC,
            TenThuCung: row.TenThuCung,
            TenDV: row.TenDV,
            GiaDichVu: row.GiaDichVu,
            NgayDichVu: row.NgayDichVu,
          });
        }
      } else {
        console.log(
          `[InvoiceService.getCustomerPetsServices] ✗ SKIPPING (not Khám/Tiêm): loai="${loaiDichVu}"`
        );
      }
    });

    console.log(
      `[InvoiceService.getCustomerPetsServices] Customer ${customerId} services count: ${
        mainServices?.length || 0
      }`
    );

    return {
      customerId,
      services: mainServices || [],
      total: mainServices?.length || 0,
    };
  }

  async getMedicinesForExam(MaKB) {
    return await this.invoiceRepository.getMedicinesForExam(MaKB);
  }

  async getVaccinesForVaccination(MaTP) {
    return await this.invoiceRepository.getVaccinesForVaccination(MaTP);
  }
}

module.exports = InvoiceService;
