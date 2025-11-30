const Joi = require('joi');

const createProductSchema = {
    body: Joi.object({
        MaSP: Joi.string().trim().min(1).max(10).required().messages({
            'any.required': 'Mã sản phẩm là bắt buộc',
            'string.min': 'Mã sản phẩm không được để trống',
            'string.max': 'Mã sản phẩm không được vượt quá 10 ký tự'
        }),
        TenSP: Joi.string().trim().min(1).max(100).required().messages({
            'any.required': 'Tên sản phẩm là bắt buộc',
            'string.min': 'Tên sản phẩm không được để trống',
            'string.max': 'Tên sản phẩm không được vượt quá 100 ký tự'
        }),
        LoaiSP: Joi.string().trim().max(50).messages({
            'string.max': 'Loại sản phẩm không được vượt quá 50 ký tự'
        }),
        XuatXu: Joi.string().trim().max(50).messages({
            'string.max': 'Xuất xứ không được vượt quá 50 ký tự'
        }),
        HanSD: Joi.date().greater('now').messages({
            'date.base': 'Hạn sử dụng không hợp lệ',
            'date.greater': 'Hạn sử dụng phải sau ngày hiện tại'
        }),
        MoTa: Joi.string().trim().max(500).messages({
            'string.max': 'Mô tả không được vượt quá 500 ký tự'
        }),
        GiaGoc: Joi.number().min(0).messages({
            'number.min': 'Giá gốc không thể âm'
        })
    })
};

const updateProductSchema = {
    body: Joi.object({
        TenSP: Joi.string().trim().min(1).max(100).messages({
            'string.min': 'Tên sản phẩm không được để trống',
            'string.max': 'Tên sản phẩm không được vượt quá 100 ký tự'
        }),
        LoaiSP: Joi.string().trim().max(50).messages({
            'string.max': 'Loại sản phẩm không được vượt quá 50 ký tự'
        }),
        XuatXu: Joi.string().trim().max(50).messages({
            'string.max': 'Xuất xứ không được vượt quá 50 ký tự'
        }),
        HanSD: Joi.date().greater('now').messages({
            'date.base': 'Hạn sử dụng không hợp lệ',
            'date.greater': 'Hạn sử dụng phải sau ngày hiện tại'
        }),
        MoTa: Joi.string().trim().max(500).messages({
            'string.max': 'Mô tả không được vượt quá 500 ký tự'
        })
    }).min(1).messages({
        'object.min': 'Ít nhất một trường cần được cập nhật'
    })
};

const updatePriceSchema = {
    body: Joi.object({
        price: Joi.number().min(0).required().messages({
            'any.required': 'Giá sản phẩm là bắt buộc',
            'number.min': 'Giá sản phẩm không thể âm'
        }),
        effectiveDate: Joi.date().min('now').default(() => new Date()).messages({
            'date.min': 'Ngày áp dụng không thể là ngày trong quá khứ'
        })
    })
};

const updateInventorySchema = {
    body: Joi.object({
        MaSP: Joi.string().required().messages({
            'any.required': 'Mã sản phẩm là bắt buộc'
        }),
        MaCN: Joi.string().required().messages({
            'any.required': 'Mã chi nhánh là bắt buộc'
        }),
        SoLuongThayDoi: Joi.number().integer().not(0).required().messages({
            'any.required': 'Số lượng thay đổi là bắt buộc',
            'number.integer': 'Số lượng phải là số nguyên',
            'any.invalid': 'Số lượng thay đổi không thể bằng 0'
        }),
        LoaiGiaoDich: Joi.string().valid('Nhập hàng', 'Xuất hàng', 'Điều chỉnh', 'Hủy hàng').required().messages({
            'any.required': 'Loại giao dịch là bắt buộc',
            'any.only': 'Loại giao dịch không hợp lệ'
        }),
        LyDo: Joi.string().trim().max(200).messages({
            'string.max': 'Lý do không được vượt quá 200 ký tự'
        })
    })
};

const bulkUpdateInventorySchema = {
    body: Joi.object({
        updates: Joi.array().items(
            Joi.object({
                MaSP: Joi.string().required(),
                MaCN: Joi.string().required(),
                SoLuongThayDoi: Joi.number().integer().not(0).required(),
                LoaiGiaoDich: Joi.string().valid('Nhập hàng', 'Xuất hàng', 'Điều chỉnh', 'Hủy hàng').required(),
                LyDo: Joi.string().trim().max(200)
            })
        ).min(1).max(50).required().messages({
            'any.required': 'Danh sách cập nhật là bắt buộc',
            'array.min': 'Phải có ít nhất 1 cập nhật',
            'array.max': 'Không được vượt quá 50 cập nhật cùng lúc'
        })
    })
};

const productFilterSchema = {
    query: Joi.object({
        category: Joi.string().trim().messages({
            'string.base': 'Loại sản phẩm không hợp lệ'
        }),
        search: Joi.string().trim().min(1).messages({
            'string.min': 'Từ khóa tìm kiếm không được để trống'
        }),
        page: Joi.number().integer().min(1).default(1).messages({
            'number.min': 'Trang phải lớn hơn 0'
        }),
        limit: Joi.number().integer().min(1).max(100).default(50).messages({
            'number.min': 'Số lượng phải lớn hơn 0',
            'number.max': 'Số lượng không được vượt quá 100'
        })
    })
};

const inventoryFilterSchema = {
    query: Joi.object({
        branchId: Joi.string().messages({
            'string.base': 'Mã chi nhánh không hợp lệ'
        }),
        productId: Joi.string().messages({
            'string.base': 'Mã sản phẩm không hợp lệ'
        }),
        page: Joi.number().integer().min(1).default(1).messages({
            'number.min': 'Trang phải lớn hơn 0'
        }),
        limit: Joi.number().integer().min(1).max(100).default(50).messages({
            'number.min': 'Số lượng phải lớn hơn 0',
            'number.max': 'Số lượng không được vượt quá 100'
        })
    })
};

const alertFilterSchema = {
    query: Joi.object({
        branchId: Joi.string().messages({
            'string.base': 'Mã chi nhánh không hợp lệ'
        }),
        threshold: Joi.number().integer().min(1).default(10).messages({
            'number.min': 'Ngưỡng cảnh báo phải lớn hơn 0'
        }),
        daysBefore: Joi.number().integer().min(1).default(30).messages({
            'number.min': 'Số ngày cảnh báo phải lớn hơn 0'
        })
    })
};

module.exports = {
    createProductSchema,
    updateProductSchema,
    updatePriceSchema,
    updateInventorySchema,
    bulkUpdateInventorySchema,
    productFilterSchema,
    inventoryFilterSchema,
    alertFilterSchema
};