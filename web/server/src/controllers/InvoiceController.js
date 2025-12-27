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

      console.log(
        "[createInvoice] MaKH:",
        MaKH,
        "MaCN:",
        MaCN,
        "requesterId:",
        requesterId,
        "userRole:",
        userRole
      );

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

      console.log(
        `[InvoiceController.getCustomerPetsServices] Fetching for customerId: ${customerId}, requesterId: ${requesterId}, userRole: ${userRole}`
      );

      const result = await this.invoiceService.getCustomerPetsServices(
        parseInt(customerId),
        requesterId,
        userRole
      );

      console.log(
        `[InvoiceController.getCustomerPetsServices] Result - total: ${
          result.total
        }, services count: ${result.services?.length || 0}`
      );
      console.log(
        `[InvoiceController.getCustomerPetsServices] First service:`,
        result.services?.[0]
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
      console.error(
        `[InvoiceController.getCustomerPetsServices] Error: ${error.message}`,
        error
      );
      next(error);
    }
  }

  async getMedicinesForExam(req, res, next) {
    try {
      const { MaKB } = req.params;

      console.log(
        `[InvoiceController.getMedicinesForExam] Fetching medicines for MaKB: ${MaKB}`
      );

      const medicines = await this.invoiceService.getMedicinesForExam(
        parseInt(MaKB)
      );

      console.log(
        `[InvoiceController.getMedicinesForExam] Found ${
          medicines?.length || 0
        } medicines`
      );
      console.log(
        `[InvoiceController.getMedicinesForExam] Medicines data:`,
        medicines
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
      console.error(
        `[InvoiceController.getMedicinesForExam] Error: ${error.message}`,
        error
      );
      next(error);
    }
  }

  async getVaccinesForVaccination(req, res, next) {
    try {
      const { MaTP } = req.params;

      console.log(
        `[InvoiceController.getVaccinesForVaccination] Fetching vaccines for MaTP: ${MaTP}`
      );

      const vaccines = await this.invoiceService.getVaccinesForVaccination(
        parseInt(MaTP)
      );

      console.log(
        `[InvoiceController.getVaccinesForVaccination] Found ${
          vaccines?.length || 0
        } vaccines`
      );
      console.log(
        `[InvoiceController.getVaccinesForVaccination] Vaccines data:`,
        vaccines
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
      console.error(
        `[InvoiceController.getVaccinesForVaccination] Error: ${error.message}`,
        error
      );
      next(error);
    }
  }
}

module.exports = InvoiceController;
