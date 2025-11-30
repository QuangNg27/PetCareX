const Joi = require('joi');

const createEmployeeSchema = {
    body: Joi.object({
        MaNV: Joi.string().trim().min(1).max(10).required().messages({
            'any.required': 'Mã nhân viên là bắt buộc',
            'string.min': 'Mã nhân viên không được để trống',
            'string.max': 'Mã nhân viên không được vượt quá 10 ký tự'
        }),
        HoTen: Joi.string().trim().min(1).max(100).required().messages({
            'any.required': 'Họ tên là bắt buộc',
            'string.min': 'Họ tên không được để trống',
            'string.max': 'Họ tên không được vượt quá 100 ký tự'
        }),
        NgaySinh: Joi.date().max('now').required().messages({
            'any.required': 'Ngày sinh là bắt buộc',
            'date.max': 'Ngày sinh không thể là ngày trong tương lai'
        }),
        GioiTinh: Joi.string().valid('Nam', 'Nữ').required().messages({
            'any.required': 'Giới tính là bắt buộc',
            'any.only': 'Giới tính phải là "Nam" hoặc "Nữ"'
        }),
        SoDT: Joi.string().trim().pattern(/^[0-9]{10,11}$/).required().messages({
            'any.required': 'Số điện thoại là bắt buộc',
            'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
        Email: Joi.string().trim().email().max(100).messages({
            'string.email': 'Email không hợp lệ',
            'string.max': 'Email không được vượt quá 100 ký tự'
        }),
        DiaChi: Joi.string().trim().max(200).messages({
            'string.max': 'Địa chỉ không được vượt quá 200 ký tự'
        }),
        ChucVu: Joi.string().valid('Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty').required().messages({
            'any.required': 'Chức vụ là bắt buộc',
            'any.only': 'Chức vụ không hợp lệ'
        })
    })
};

const updateEmployeeSchema = {
    body: Joi.object({
        HoTen: Joi.string().trim().min(1).max(100).messages({
            'string.min': 'Họ tên không được để trống',
            'string.max': 'Họ tên không được vượt quá 100 ký tự'
        }),
        NgaySinh: Joi.date().max('now').messages({
            'date.max': 'Ngày sinh không thể là ngày trong tương lai'
        }),
        GioiTinh: Joi.string().valid('Nam', 'Nữ').messages({
            'any.only': 'Giới tính phải là "Nam" hoặc "Nữ"'
        }),
        SoDT: Joi.string().trim().pattern(/^[0-9]{10,11}$/).messages({
            'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
        Email: Joi.string().trim().email().max(100).messages({
            'string.email': 'Email không hợp lệ',
            'string.max': 'Email không được vượt quá 100 ký tự'
        }),
        DiaChi: Joi.string().trim().max(200).messages({
            'string.max': 'Địa chỉ không được vượt quá 200 ký tự'
        }),
        ChucVu: Joi.string().valid('Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty').messages({
            'any.only': 'Chức vụ không hợp lệ'
        })
    }).min(1).messages({
        'object.min': 'Ít nhất một trường cần được cập nhật'
    })
};

const updateProfileSchema = {
    body: Joi.object({
        HoTen: Joi.string().trim().min(1).max(100).messages({
            'string.min': 'Họ tên không được để trống',
            'string.max': 'Họ tên không được vượt quá 100 ký tự'
        }),
        NgaySinh: Joi.date().max('now').messages({
            'date.max': 'Ngày sinh không thể là ngày trong tương lai'
        }),
        GioiTinh: Joi.string().valid('Nam', 'Nữ').messages({
            'any.only': 'Giới tính phải là "Nam" hoặc "Nữ"'
        }),
        SoDT: Joi.string().trim().pattern(/^[0-9]{10,11}$/).messages({
            'string.pattern.base': 'Số điện thoại phải có 10-11 chữ số'
        }),
        Email: Joi.string().trim().email().max(100).messages({
            'string.email': 'Email không hợp lệ',
            'string.max': 'Email không được vượt quá 100 ký tự'
        }),
        DiaChi: Joi.string().trim().max(200).messages({
            'string.max': 'Địa chỉ không được vượt quá 200 ký tự'
        })
        // Note: ChucVu is excluded from profile updates for regular employees
    }).min(1).messages({
        'object.min': 'Ít nhất một trường cần được cập nhật'
    })
};

const assignEmployeeSchema = {
    body: Joi.object({
        MaNV: Joi.string().required().messages({
            'any.required': 'Mã nhân viên là bắt buộc'
        }),
        MaCN: Joi.string().required().messages({
            'any.required': 'Mã chi nhánh là bắt buộc'
        }),
        NgayBD: Joi.date().min('now').required().messages({
            'any.required': 'Ngày bắt đầu là bắt buộc',
            'date.min': 'Ngày bắt đầu không thể là ngày trong quá khứ'
        }),
        Luong: Joi.number().min(1000000).required().messages({
            'any.required': 'Mức lương là bắt buộc',
            'number.min': 'Mức lương phải ít nhất 1,000,000 VND'
        })
    })
};

const terminateAssignmentSchema = {
    body: Joi.object({
        endDate: Joi.date().min('now').required().messages({
            'any.required': 'Ngày kết thúc là bắt buộc',
            'date.min': 'Ngày kết thúc không thể là ngày trong quá khứ'
        }),
        reason: Joi.string().trim().max(200).messages({
            'string.max': 'Lý do không được vượt quá 200 ký tự'
        })
    })
};

const updateSalarySchema = {
    body: Joi.object({
        newSalary: Joi.number().min(1000000).required().messages({
            'any.required': 'Mức lương mới là bắt buộc',
            'number.min': 'Mức lương phải ít nhất 1,000,000 VND'
        }),
        effectiveDate: Joi.date().min('now').required().messages({
            'any.required': 'Ngày hiệu lực là bắt buộc',
            'date.min': 'Ngày hiệu lực không thể là ngày trong quá khứ'
        })
    })
};

const employeeFilterSchema = {
    query: Joi.object({
        branchId: Joi.string().messages({
            'string.base': 'Mã chi nhánh không hợp lệ'
        }),
        role: Joi.string().valid('Bác sĩ', 'Bán hàng', 'Tiếp tân', 'Quản lý chi nhánh', 'Quản lý công ty').messages({
            'any.only': 'Chức vụ không hợp lệ'
        }),
        activeOnly: Joi.boolean().default(true).messages({
            'boolean.base': 'activeOnly phải là true hoặc false'
        })
    })
};

const performanceFilterSchema = {
    query: Joi.object({
        startDate: Joi.date().messages({
            'date.base': 'Ngày bắt đầu không hợp lệ'
        }),
        endDate: Joi.date().greater(Joi.ref('startDate')).messages({
            'date.base': 'Ngày kết thúc không hợp lệ',
            'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
        })
    })
};

const scheduleFilterSchema = {
    query: Joi.object({
        date: Joi.date().required().messages({
            'any.required': 'Ngày làm việc là bắt buộc',
            'date.base': 'Ngày làm việc không hợp lệ'
        })
    })
};

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    updateProfileSchema,
    assignEmployeeSchema,
    terminateAssignmentSchema,
    updateSalarySchema,
    employeeFilterSchema,
    performanceFilterSchema,
    scheduleFilterSchema
};