const express = require('express');
const InvoiceController = require('../controllers/InvoiceController');
const auth = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const validateRequest = require('../middleware/validateRequest');
const invoiceValidation = require('../utils/invoiceValidation');

const router = express.Router();
const invoiceController = new InvoiceController();

// Create new invoice
router.post('/',
    auth,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(invoiceValidation.createInvoiceSchema),
    invoiceController.createInvoice.bind(invoiceController)
);

// Get specific invoice details
router.get('/:invoiceId',
    auth,
    invoiceController.getInvoice.bind(invoiceController)
);

// Customer endpoints
router.get('/customer/:customerId',
    auth,
    authorizeRoles(['Khách hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    invoiceController.getCustomerInvoices.bind(invoiceController)
);

// My invoices (for customers)
router.get('/my/invoices',
    auth,
    authorizeRoles(['Khách hàng']),
    invoiceController.getMyInvoices.bind(invoiceController)
);

// Branch management endpoints
router.get('/branch/:branchId',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    invoiceController.getBranchInvoices.bind(invoiceController)
);

router.get('/branch/:branchId/revenue/daily',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    invoiceController.getDailyRevenue.bind(invoiceController)
);

// Payment management
router.put('/:invoiceId/payment',
    auth,
    authorizeRoles(['Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(invoiceValidation.updatePaymentSchema),
    invoiceController.updateInvoicePayment.bind(invoiceController)
);

// Invoice cancellation (managers only)
router.post('/:invoiceId/cancel',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    validateRequest(invoiceValidation.cancelInvoiceSchema),
    invoiceController.cancelInvoice.bind(invoiceController)
);

// Analytics endpoints
router.get('/analytics/top-customers',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    invoiceController.getTopCustomers.bind(invoiceController)
);

router.get('/analytics/statistics',
    auth,
    authorizeRoles(['Quản lý chi nhánh', 'Quản lý công ty']),
    invoiceController.getInvoiceStatistics.bind(invoiceController)
);

// PDF generation
router.get('/:invoiceId/pdf',
    auth,
    invoiceController.generateInvoicePdf.bind(invoiceController)
);

module.exports = router;