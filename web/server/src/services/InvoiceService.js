const InvoiceRepository = require('../repositories/InvoiceRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const { AppError } = require('../middleware/errorHandler');

class InvoiceService {
    constructor() {
        this.invoiceRepository = new InvoiceRepository();
        this.customerRepository = new CustomerRepository();
    }

    async createInvoice(invoiceData, requesterId, userRole) {
        const { MaKH, MaCN, NgayLap, HinhThucTT, CT_SanPham, CT_DichVu } = invoiceData;

        // Validate customer ownership for customers
        if (userRole === 'Khách hàng' && MaKH !== requesterId) {
            throw new AppError('Bạn chỉ có thể tạo hóa đơn cho chính mình', 403);
        }

        // Product and service validation will be handled by Add_HoaDon stored procedure

        const result = await this.invoiceRepository.createInvoice({
            MaKH,
            MaCN,
            MaNV: requesterId, // Employee creating the invoice
            NgayLap,
            HinhThucTT,
            CT_SanPham,
            CT_DichVu
        });

        return result;
    }

    async getInvoice(invoiceId, requesterId, userRole) {
        const invoice = await this.invoiceRepository.getInvoiceDetails(invoiceId);
        
        if (!invoice) {
            throw new AppError('Không tìm thấy hóa đơn', 404);
        }

        // Validate access permissions
        if (userRole === 'Khách hàng' && invoice.MaKH !== requesterId) {
            throw new AppError('Bạn không có quyền xem hóa đơn này', 403);
        }

        return invoice;
    }

    async getCustomerInvoices(customerId, requesterId, userRole, pagination = {}) {
        // Customers can only view their own invoices
        if (userRole === 'Khách hàng' && customerId !== requesterId) {
            throw new AppError('Bạn chỉ có thể xem hóa đơn của chính mình', 403);
        }

        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const invoices = await this.invoiceRepository.getCustomerInvoices(customerId, limit, offset);
        
        // Get total count for pagination
        const totalResult = await this.invoiceRepository.getCustomerInvoiceCount(customerId);
        const total = totalResult?.total || 0;

        return {
            invoices,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
    }

    async getBranchInvoices(branchId, filters, requesterId, userRole) {
        // Only branch managers and company managers can view branch invoices
        if (!['Quản lý chi nhánh', 'Quản lý công ty'].includes(userRole)) {
            throw new AppError('Bạn không có quyền xem báo cáo chi nhánh', 403);
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
        const stats = await this.invoiceRepository.getInvoiceStatistics(branchId, startDate, endDate);

        return {
            invoices,
            statistics: stats,
            filters: { branchId, startDate, endDate }
        };
    }
}

module.exports = InvoiceService;