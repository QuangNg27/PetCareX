const express = require("express");
const InvoiceController = require("../controllers/InvoiceController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authorizeRoles");

const router = express.Router();
const invoiceController = new InvoiceController();

// Create new invoice
router.post(
  "/",
  authMiddleware,
  authorizeRoles([
    "Bán hàng",
    "Tiếp tân",
    "Quản lý chi nhánh",
    "Quản lý công ty",
  ]),
  invoiceController.createInvoice
);

// Customer endpoints (specific routes must be registered before the generic '/:invoiceId')
router.get(
  "/customer/:customerId",
  authMiddleware,
  authorizeRoles([
    "Khách hàng",
    "Tiếp tân",
    "Quản lý chi nhánh",
    "Quản lý công ty",
  ]),
  invoiceController.getCustomerInvoices
);

// My invoices (for customers)
router.get(
  "/my/invoices",
  authMiddleware,
  authorizeRoles(["Khách hàng"]),
  invoiceController.getMyInvoices
);

// Branch management endpoints
router.get(
  "/branch/:branchId",
  authMiddleware,
  authorizeRoles(["Quản lý chi nhánh", "Quản lý công ty"]),
  invoiceController.getBranchInvoices
);

// Get customer pets services for creating invoice
router.get(
  "/customer-services/:customerId",
  authMiddleware,
  authorizeRoles([
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
    "Quản lý chi nhánh",
    "Quản lý công ty",
  ]),
  invoiceController.getCustomerPetsServices
);

// Get medicines for examination
router.get(
  "/exam/:MaKB/medicines",
  authMiddleware,
  authorizeRoles([
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
    "Quản lý chi nhánh",
    "Quản lý công ty",
  ]),
  invoiceController.getMedicinesForExam
);

// Get vaccines for vaccination
router.get(
  "/vaccination/:MaTP/vaccines",
  authMiddleware,
  authorizeRoles([
    "Khách hàng",
    "Bán hàng",
    "Tiếp tân",
    "Quản lý chi nhánh",
    "Quản lý công ty",
  ]),
  invoiceController.getVaccinesForVaccination
);

// Get specific invoice details (generic param route should come after specific routes)
router.get("/:invoiceId", authMiddleware, invoiceController.getInvoice);

module.exports = router;
