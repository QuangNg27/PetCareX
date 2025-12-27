const InvoiceService = require("../services/InvoiceService");
const { AppError } = require("../middleware/errorHandler");

class InvoiceController {
  constructor() {
    this.invoiceService = new InvoiceService();

    // Bind methods to preserve 'this' context
    this.createInvoice = this.createInvoice.bind(this);
    this.getInvoice = this.getInvoice.bind(this);
    this.getCustomerInvoices = this.getCustomerInvoices.bind(this);
    this.getMyInvoices = this.getMyInvoices.bind(this);
    this.getBranchInvoices = this.getBranchInvoices.bind(this);
    this.getCustomerPetsServices = this.getCustomerPetsServices.bind(this);
    this.getMedicinesForExam = this.getMedicinesForExam.bind(this);
    this.getVaccinesForVaccination = this.getVaccinesForVaccination.bind(this);
  }

  async createInvoice(req, res, next) {
    try {
      const { MaKH, MaCN, NgayLap, HinhThucTT, CT_SanPham, CT_DichVu } =
        req.body;
      const requesterId = req.user.MaTK || req.user.userId; // Fix: use MaTK or userId
      const userRole = req.user.role;

      const result = await this.invoiceService.createInvoice(
        {
          MaKH,
          MaCN,
          NgayLap,
          HinhThucTT,
          CT_SanPham,
          CT_DichVu,
        },
        requesterId,
        userRole,
        req.user // Pass full user object
      );

      res.status(201).json({
        success: true,
        message: "Tạo hóa đơn thành công",
        data: result,
      });
    } catch (error) {
      console.error("[createInvoice] Error:", error);
      next(error);
    }
  }

  async getInvoice(req, res, next) {
    try {
      const { invoiceId } = req.params;
      const requesterId = req.user.MaTK || req.user.userId;
      const userRole = req.user.role;

      const invoice = await this.invoiceService.getInvoice(
        invoiceId,
        requesterId,
        userRole
      );

      res.json({
        success: true,
        data: { invoice },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerInvoices(req, res, next) {
    try {
      const { customerId } = req.params;
      const { page, limit } = req.query;
      const requesterId = req.user.MaTK || req.user.userId;
      const userRole = req.user.role;

      const result = await this.invoiceService.getCustomerInvoices(
        customerId,
        requesterId,
        userRole,
        {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyInvoices(req, res, next) {
    try {
      const { page, limit } = req.query;
      const customerId = req.user.MaTK || req.user.userId;
      const userRole = req.user.role;

      const result = await this.invoiceService.getCustomerInvoices(
        customerId,
        customerId,
        userRole,
        {
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 10,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchInvoices(req, res, next) {
    try {
      const { branchId } = req.params;
      const { startDate, endDate, page, limit } = req.query;
      const requesterId = req.user.MaTK || req.user.userId;
      const userRole = req.user.role;

      const result = await this.invoiceService.getBranchInvoices(
        branchId,
        {
          startDate,
          endDate,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 50,
        },
        requesterId,
        userRole
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCustomerPetsServices(req, res, next) {
    try {
      const { customerId } = req.params;
      const requesterId = req.user.MaTK || req.user.userId;
      const userRole = req.user.role;

      const result = await this.invoiceService.getCustomerPetsServices(
        parseInt(customerId),
        requesterId,
        userRole
      );

      // Prevent caching for dynamic customer services
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMedicinesForExam(req, res, next) {
    try {
      const { MaKB } = req.params;

      const medicines = await this.invoiceService.getMedicinesForExam(
        parseInt(MaKB)
      );

      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");

      res.json({
        success: true,
        data: {
          MaKB: parseInt(MaKB),
          medicines: medicines || [],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getVaccinesForVaccination(req, res, next) {
    try {
      const { MaTP } = req.params;

      const vaccines = await this.invoiceService.getVaccinesForVaccination(
        parseInt(MaTP)
      );

      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");

      res.json({
        success: true,
        data: {
          MaTP: parseInt(MaTP),
          vaccines: vaccines || [],
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InvoiceController;
