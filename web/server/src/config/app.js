const { ERROR_MESSAGES } = require('./constants');

// Cấu hình response format chuẩn
const RESPONSE_FORMAT = {
    success: (data, message = 'Tạo mới thành công', statusCode = 200) => ({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    }),
    
    error: (message = ERROR_MESSAGES.SERVER_ERROR, statusCode = 500, details = null) => ({
        success: false,
        message,
        error: details,
        timestamp: new Date().toISOString()
    }),
    
    paginated: (data, pagination, message = 'Lấy dữ liệu thành công') => ({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages: Math.ceil(pagination.total / pagination.limit)
        },
        timestamp: new Date().toISOString()
    })
};

module.exports = {
    RESPONSE_FORMAT
};