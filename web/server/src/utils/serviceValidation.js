const Joi = require('joi');

const createExaminationSchema = {
    body: Joi.object({
        MaCN: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn chi nhánh'
        }),
        MaDV: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn dịch vụ khám'
        }),
        MaTC: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn thú cưng'
        }),
        MaNV: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn bác sĩ'
        }),
        NgayKham: Joi.date().min('now').required().messages({
            'any.required': 'Vui lòng chọn ngày khám',
            'date.min': 'Ngày khám không thể là ngày trong quá khứ'
        }),
        TrieuChung: Joi.string().allow('').messages({
            'string.base': 'Triệu chứng phải là văn bản'
        }),
        ChanDoan: Joi.string().allow('').messages({
            'string.base': 'Chẩn đoán phải là văn bản'
        }),
        NgayTaiKham: Joi.date().allow(null).messages({
            'date.base': 'Ngày tái khám không hợp lệ'
        })
    })
};

const updateExaminationSchema = {
    body: Joi.object({
        TrieuChung: Joi.string().allow('').messages({
            'string.base': 'Triệu chứng phải là văn bản'
        }),
        ChanDoan: Joi.string().allow('').messages({
            'string.base': 'Chẩn đoán phải là văn bản'
        }),
        NgayTaiKham: Joi.date().allow(null).messages({
            'date.base': 'Ngày tái khám không hợp lệ'
        })
    })
};

const addPrescriptionSchema = {
    body: Joi.object({
        prescriptions: Joi.array().items(
            Joi.object({
                MaSP: Joi.string().required().messages({
                    'any.required': 'Mã sản phẩm là bắt buộc'
                }),
                SoLuong: Joi.number().integer().min(1).required().messages({
                    'any.required': 'Số lượng là bắt buộc',
                    'number.min': 'Số lượng phải lớn hơn 0'
                })
            })
        ).min(1).required().messages({
            'any.required': 'Danh sách thuốc là bắt buộc',
            'array.min': 'Phải có ít nhất 1 loại thuốc'
        })
    })
};

const createVaccinationSchema = {
    body: Joi.object({
        MaCN: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn chi nhánh'
        }),
        MaDV: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn dịch vụ tiêm phòng'
        }),
        MaTC: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn thú cưng'
        }),
        MaNV: Joi.string().required().messages({
            'any.required': 'Vui lòng chọn bác sĩ'
        }),
        NgayTiem: Joi.date().min('now').required().messages({
            'any.required': 'Vui lòng chọn ngày tiêm',
            'date.min': 'Ngày tiêm không thể là ngày trong quá khứ'
        })
    })
};

const addVaccinationDetailsSchema = {
    body: Joi.object({
        details: Joi.array().items(
            Joi.object({
                MaSP: Joi.string().required().messages({
                    'any.required': 'Mã vắc xin là bắt buộc'
                }),
                LieuLuong: Joi.string().required().messages({
                    'any.required': 'Liều lượng là bắt buộc'
                }),
                TrangThai: Joi.string().valid('Thành công', 'Thất bại').default('Thành công').messages({
                    'any.only': 'Trạng thái phải là "Thành công" hoặc "Thất bại"'
                }),
                MaGoi: Joi.string().allow(null).messages({
                    'string.base': 'Mã gói không hợp lệ'
                })
            })
        ).min(1).required().messages({
            'any.required': 'Danh sách vắc xin là bắt buộc',
            'array.min': 'Phải có ít nhất 1 loại vắc xin'
        })
    })
};

const createVaccinationPackageSchema = {
    body: Joi.object({
        NgayBatDau: Joi.date().min('now').required().messages({
            'any.required': 'Ngày bắt đầu là bắt buộc',
            'date.min': 'Ngày bắt đầu không thể là ngày trong quá khứ'
        }),
        NgayKetThuc: Joi.date().greater(Joi.ref('NgayBatDau')).required().messages({
            'any.required': 'Ngày kết thúc là bắt buộc',
            'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
        })
    })
};

const updateServicePriceSchema = {
    body: Joi.object({
        price: Joi.number().min(0).required().messages({
            'any.required': 'Giá dịch vụ là bắt buộc',
            'number.min': 'Giá dịch vụ không thể âm'
        }),
        effectiveDate: Joi.date().min('now').required().messages({
            'any.required': 'Ngày áp dụng là bắt buộc',
            'date.min': 'Ngày áp dụng không thể là ngày trong quá khứ'
        })
    })
};

module.exports = {
    createExaminationSchema,
    updateExaminationSchema,
    addPrescriptionSchema,
    createVaccinationSchema,
    addVaccinationDetailsSchema,
    createVaccinationPackageSchema,
    updateServicePriceSchema
};