const Joi = require('joi');

// Auth validation schemas
const registerSchema = Joi.object({
    HoTen: Joi.string().min(2).max(100).required()
        .messages({ 'any.required': 'Họ tên là bắt buộc' }),
    SoDT: Joi.string().pattern(/^[0-9]{10,11}$/).required()
        .messages({ 
            'any.required': 'Số điện thoại là bắt buộc',
            'string.pattern.base': 'Số điện thoại không hợp lệ'
        }),
    Email: Joi.string().email().max(255).required()
        .messages({ 
            'any.required': 'Email là bắt buộc',
            'string.email': 'Email không hợp lệ'
        }),
    CCCD: Joi.string().length(12).pattern(/^[0-9]{12}$/).required()
        .messages({ 
            'any.required': 'CCCD là bắt buộc',
            'string.length': 'CCCD phải có 12 số',
            'string.pattern.base': 'CCCD chỉ được chứa số'
        }),
    GioiTinh: Joi.string().valid('Nam', 'Nữ').required()
        .messages({ 'any.required': 'Giới tính là bắt buộc' }),
    // Remove date validation - let database trigger handle it
    NgaySinh: Joi.date().required()
        .messages({ 'any.required': 'Ngày sinh là bắt buộc' }),
    TenDangNhap: Joi.string().alphanum().min(3).max(50).required()
        .messages({ 
            'any.required': 'Tên đăng nhập là bắt buộc',
            'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
            'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ và số'
        }),
    MatKhau: Joi.string().min(6).required()
        .messages({ 
            'any.required': 'Mật khẩu là bắt buộc',
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự'
        })
});

const loginSchema = Joi.object({
    TenDangNhap: Joi.string().required()
        .messages({ 'any.required': 'Tên đăng nhập là bắt buộc' }),
    MatKhau: Joi.string().required()
        .messages({ 'any.required': 'Mật khẩu là bắt buộc' })
});

const changePasswordSchema = Joi.object({
    MatKhauCu: Joi.string().required()
        .messages({ 'any.required': 'Mật khẩu cũ là bắt buộc' }),
    MatKhauMoi: Joi.string().min(6).required()
        .messages({ 
            'any.required': 'Mật khẩu mới là bắt buộc',
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự'
        })
});

// Pet validation schemas
const createPetSchema = Joi.object({
    Ten: Joi.string().min(1).max(50).required()
        .messages({ 'any.required': 'Tên thú cưng là bắt buộc' }),
    Loai: Joi.string().min(1).max(10).required()
        .messages({ 'any.required': 'Loài là bắt buộc' }),
    Giong: Joi.string().min(1).max(50).required()
        .messages({ 'any.required': 'Giống là bắt buộc' }),
    GioiTinh: Joi.string().valid('Đực', 'Cái').required()
        .messages({ 'any.required': 'Giới tính là bắt buộc' }),
    // Remove date validation - let database trigger handle it  
    NgaySinh: Joi.date().required()
        .messages({ 'any.required': 'Ngày sinh là bắt buộc' }),
    TinhTrangSucKhoe: Joi.string().max(100).allow('', null)
});

const updatePetSchema = Joi.object({
    Ten: Joi.string().min(1).max(50),
    Loai: Joi.string().min(1).max(10),
    Giong: Joi.string().min(1).max(50),
    GioiTinh: Joi.string().valid('Đực', 'Cái'),
    NgaySinh: Joi.date().max('now'),
    TinhTrangSucKhoe: Joi.string().max(100).allow('', null)
});

// Service validation schemas
const medicalExaminationSchema = Joi.object({
    MaCN: Joi.number().integer().positive().required()
        .messages({ 'any.required': 'Mã chi nhánh là bắt buộc' }),
    MaDV: Joi.number().integer().positive().required()
        .messages({ 'any.required': 'Mã dịch vụ là bắt buộc' }),
    MaTC: Joi.number().integer().positive().required()
        .messages({ 'any.required': 'Mã thú cưng là bắt buộc' }),
    NgayKham: Joi.date().max('now').required()
        .messages({ 
            'any.required': 'Ngày khám là bắt buộc',
            'date.max': 'Ngày khám không được lớn hơn ngày hiện tại'
        }),
    TrieuChung: Joi.string().max(255).allow('', null),
    ChanDoan: Joi.string().max(255).allow('', null),
    NgayTaiKham: Joi.date().min('now').allow(null)
        .messages({ 'date.min': 'Ngày tái khám phải lớn hơn ngày hiện tại' })
});

// Invoice validation schemas
const createInvoiceSchema = Joi.object({
    MaKH: Joi.number().integer().positive().required()
        .messages({ 'any.required': 'Mã khách hàng là bắt buộc' }),
    MaCN: Joi.number().integer().positive().required()
        .messages({ 'any.required': 'Mã chi nhánh là bắt buộc' }),
    NgayLap: Joi.date().max('now').required()
        .messages({ 
            'any.required': 'Ngày lập là bắt buộc',
            'date.max': 'Ngày lập không được lớn hơn ngày hiện tại'
        }),
    HinhThucTT: Joi.string().valid('Chuyển khoản', 'Tiền mặt').required()
        .messages({ 'any.required': 'Hình thức thanh toán là bắt buộc' }),
    CT_SanPham: Joi.array().items(
        Joi.object({
            MaSP: Joi.number().integer().positive().required(),
            SoLuong: Joi.number().integer().positive().required(),
            GiaApDung: Joi.number().positive().required()
        })
    ).default([]),
    CT_DichVu: Joi.array().items(
        Joi.object({
            MaCN: Joi.number().integer().positive().required(),
            MaDV: Joi.number().integer().positive().required(),
            MaTC: Joi.number().integer().positive().required(),
            MaKB: Joi.number().integer().positive().allow(null),
            MaTP: Joi.number().integer().positive().allow(null),
            GiaApDung: Joi.number().positive().required()
        })
    ).default([])
});

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMessage
            });
        }
        req.body = value;
        next();
    };
};

module.exports = {
    // Schemas
    registerSchema,
    loginSchema,
    changePasswordSchema,
    createPetSchema,
    updatePetSchema,
    medicalExaminationSchema,
    createInvoiceSchema,
    
    // Middleware
    validate
};