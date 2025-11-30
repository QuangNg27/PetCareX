const Joi = require('joi');

const createInvoiceSchema = {
    body: Joi.object({
        MaKH: Joi.string().required().messages({
            'any.required': 'Mã khách hàng là bắt buộc'
        }),
        MaCN: Joi.string().required().messages({
            'any.required': 'Mã chi nhánh là bắt buộc'
        }),
        NgayLap: Joi.date().default(new Date()).messages({
            'date.base': 'Ngày lập không hợp lệ'
        }),
        HinhThucTT: Joi.string().valid('Tiền mặt', 'Chuyển khoản', 'Thẻ tín dụng').default('Tiền mặt').messages({
            'any.only': 'Hình thức thanh toán không hợp lệ'
        }),
        CT_SanPham: Joi.array().items(
            Joi.object({
                MaSP: Joi.string().required().messages({
                    'any.required': 'Mã sản phẩm là bắt buộc'
                }),
                SoLuong: Joi.number().integer().min(1).required().messages({
                    'any.required': 'Số lượng là bắt buộc',
                    'number.min': 'Số lượng phải lớn hơn 0'
                })
            })
        ).default([]).messages({
            'array.base': 'Danh sách sản phẩm không hợp lệ'
        }),
        CT_DichVu: Joi.array().items(
            Joi.object({
                MaDV: Joi.string().required().messages({
                    'any.required': 'Mã dịch vụ là bắt buộc'
                }),
                MaKB_MaTP: Joi.string().allow(null).messages({
                    'string.base': 'Mã khám bệnh/tiêm phòng không hợp lệ'
                })
            })
        ).default([]).messages({
            'array.base': 'Danh sách dịch vụ không hợp lệ'
        })
    }).custom((value, helpers) => {
        // At least one product or service is required
        if ((!value.CT_SanPham || value.CT_SanPham.length === 0) && 
            (!value.CT_DichVu || value.CT_DichVu.length === 0)) {
            return helpers.error('custom.emptyInvoice');
        }
        return value;
    }).messages({
        'custom.emptyInvoice': 'Hóa đơn phải có ít nhất một sản phẩm hoặc dịch vụ'
    })
};

const updatePaymentSchema = {
    body: Joi.object({
        paymentAmount: Joi.number().min(0).required().messages({
            'any.required': 'Số tiền thanh toán là bắt buộc',
            'number.min': 'Số tiền thanh toán không thể âm'
        })
    })
};

const cancelInvoiceSchema = {
    body: Joi.object({
        reason: Joi.string().trim().min(10).max(500).required().messages({
            'any.required': 'Lý do hủy hóa đơn là bắt buộc',
            'string.min': 'Lý do phải có ít nhất 10 ký tự',
            'string.max': 'Lý do không được vượt quá 500 ký tự'
        })
    })
};

const invoiceFilterSchema = {
    query: Joi.object({
        startDate: Joi.date().messages({
            'date.base': 'Ngày bắt đầu không hợp lệ'
        }),
        endDate: Joi.date().greater(Joi.ref('startDate')).messages({
            'date.base': 'Ngày kết thúc không hợp lệ',
            'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
        }),
        page: Joi.number().integer().min(1).default(1).messages({
            'number.min': 'Trang phải lớn hơn 0'
        }),
        limit: Joi.number().integer().min(1).max(100).default(10).messages({
            'number.min': 'Số lượng phải lớn hơn 0',
            'number.max': 'Số lượng không được vượt quá 100'
        })
    })
};

const analyticsFilterSchema = {
    query: Joi.object({
        branchId: Joi.string().messages({
            'string.base': 'Mã chi nhánh không hợp lệ'
        }),
        startDate: Joi.date().messages({
            'date.base': 'Ngày bắt đầu không hợp lệ'
        }),
        endDate: Joi.date().greater(Joi.ref('startDate')).messages({
            'date.base': 'Ngày kết thúc không hợp lệ',
            'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
        }),
        limit: Joi.number().integer().min(1).max(50).default(10).messages({
            'number.min': 'Số lượng phải lớn hơn 0',
            'number.max': 'Số lượng không được vượt quá 50'
        })
    })
};

module.exports = {
    createInvoiceSchema,
    updatePaymentSchema,
    cancelInvoiceSchema,
    invoiceFilterSchema,
    analyticsFilterSchema
};