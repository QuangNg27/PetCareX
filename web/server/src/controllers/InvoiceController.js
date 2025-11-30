const InvoiceService = require('../services/InvoiceService');
const { AppError } = require('../middleware/errorHandler');

class InvoiceController {
    constructor() {
        this.invoiceService = new InvoiceService();
    }

    async createInvoice(req, res, next) {
        try {
            const { MaKH, MaCN, NgayLap, HinhThucTT, CT_SanPham, CT_DichVu } = req.body;
            const requesterId = req.user.id;
            const userRole = req.user.role;

            const result = await this.invoiceService.createInvoice({
                MaKH,
                MaCN,
                NgayLap,
                HinhThucTT,
                CT_SanPham,
                CT_DichVu
            }, requesterId, userRole);

            res.status(201).json({
                success: true,
                message: 'Tạo hóa đơn thành công',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getInvoice(req, res, next) {
        try {
            const { invoiceId } = req.params;
            const requesterId = req.user.id;
            const userRole = req.user.role;

            const invoice = await this.invoiceService.getInvoice(invoiceId, requesterId, userRole);

            res.json({
                success: true,
                data: { invoice }
            });
        } catch (error) {
            next(error);
        }
    }

    async getCustomerInvoices(req, res, next) {
        try {
            const { customerId } = req.params;
            const { page, limit } = req.query;
            const requesterId = req.user.id;
            const userRole = req.user.role;

            const result = await this.invoiceService.getCustomerInvoices(
                customerId, 
                requesterId, 
                userRole, 
                { 
                    page: parseInt(page) || 1, 
                    limit: parseInt(limit) || 10 
                }
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyInvoices(req, res, next) {
        try {
            const { page, limit } = req.query;
            const customerId = req.user.id;
            const userRole = req.user.role;

            const result = await this.invoiceService.getCustomerInvoices(
                customerId,
                customerId,
                userRole,
                {
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 10
                }
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getBranchInvoices(req, res, next) {
        try {
            const { branchId } = req.params;
            const { startDate, endDate, page, limit } = req.query;
            const requesterId = req.user.id;
            const userRole = req.user.role;

            const result = await this.invoiceService.getBranchInvoices(
                branchId,
                {
                    startDate,
                    endDate,
                    page: parseInt(page) || 1,
                    limit: parseInt(limit) || 50
                },
                requesterId,
                userRole
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InvoiceController;