// Vai trò người dùng
const USER_ROLES = {
    CUSTOMER: 'Khách hàng',
    DOCTOR: 'Bác sĩ', 
    SALES: 'Bán hàng',
    RECEPTIONIST: 'Tiếp tân',
    BRANCH_MANAGER: 'Quản lý chi nhánh',
    COMPANY_MANAGER: 'Quản lý công ty'
};

// Nhóm vai trò cho phân quyền
const ROLE_GROUPS = {
    STAFF: [USER_ROLES.DOCTOR, USER_ROLES.SALES, USER_ROLES.RECEPTIONIST],
    MANAGERS: [USER_ROLES.BRANCH_MANAGER, USER_ROLES.COMPANY_MANAGER],
    MEDICAL_STAFF: [USER_ROLES.DOCTOR],
    ALL_STAFF: [USER_ROLES.DOCTOR, USER_ROLES.SALES, USER_ROLES.RECEPTIONIST, USER_ROLES.BRANCH_MANAGER, USER_ROLES.COMPANY_MANAGER]
};

// Trạng thái
const STATUS = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Hủy bỏ'
};

// Thông báo lỗi tiếng Việt
const ERROR_MESSAGES = {
    // Auth errors
    INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng',
    UNAUTHORIZED: 'Bạn không có quyền truy cập',
    TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
    INVALID_TOKEN: 'Token không hợp lệ',
    
    // Validation errors
    REQUIRED_FIELD: 'Trường này là bắt buộc',
    INVALID_EMAIL: 'Email không hợp lệ',
    INVALID_PHONE: 'Số điện thoại không hợp lệ',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
    
    // Business logic errors
    INSUFFICIENT_INVENTORY: 'Không đủ hàng trong kho',
    EMPLOYEE_NOT_QUALIFIED: 'Nhân viên không đủ trình độ thực hiện dịch vụ này',
    OUTSIDE_BUSINESS_HOURS: 'Ngoài giờ làm việc',
    BRANCH_ACCESS_DENIED: 'Bạn không có quyền truy cập chi nhánh này',
    
    // Generic errors
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    ALREADY_EXISTS: 'Dữ liệu đã tồn tại',
    SERVER_ERROR: 'Lỗi máy chủ nội bộ',
    DATABASE_ERROR: 'Lỗi cơ sở dữ liệu'
};

module.exports = {
    USER_ROLES,
    ROLE_GROUPS,
    STATUS,
    ERROR_MESSAGES
};