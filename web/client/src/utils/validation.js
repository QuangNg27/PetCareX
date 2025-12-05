// Validation utilities for forms

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Password validation (synchronized with server: minimum 6 characters)
export const validatePassword = (password) => {
  // At least 6 characters, contains at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,50}$/;
  const vietnameseAccentRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;
  return passwordRegex.test(password) && !vietnameseAccentRegex.test(password);
};

// Phone validation (Vietnamese format - synchronized with server: 10-11 digits)
export const validatePhone = (phone) => {
  const phoneRegex = /^0[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

// CCCD validation (12 digits)
export const validateCCCD = (cccd) => {
  const cccdRegex = /^\d{12}$/;
  return cccdRegex.test(cccd);
};

// Username validation (synchronized with server: alphanumeric, 3-50 characters)
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Name validation
export const validateName = (name) => {
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Date validation (must be 18+ years old)
export const validateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18;
  }
  
  return age >= 18;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Username validation
  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập';
  } else if (!validateUsername(formData.username)) {
    errors.username = 'Tên đăng nhập không hợp lệ (3-20 ký tự, chỉ chữ, số và dấu gạch dưới)';
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (formData.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  return errors;
};

// Signup Step 1 validation (Account Info)
export const validateSignupStep1 = (formData) => {
  const errors = {};
  
  // Username validation
  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập';
  } else if (!validateUsername(formData.username)) {
    errors.username = 'Tên đăng nhập không hợp lệ (3-20 ký tự, chỉ chữ, số và dấu gạch dưới)';
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Mật khẩu phải có từ 6-50 ký tự (gồm chữ hoa, chữ thường và số, không dấu)';
  }
  
  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return errors;
};

// Signup Step 2 validation (Personal Info)
export const validateSignupStep2 = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên';
  } else if (!validateName(formData.fullName)) {
    errors.fullName = 'Họ và tên không hợp lệ (2-50 ký tự, chỉ chữ cái)';
  }
  
  // Email validation
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  // Phone validation
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  
  // Citizen ID validation
  if (!formData.citizenId || !formData.citizenId.trim()) {
    errors.citizenId = 'Vui lòng nhập CCCD/CMND';
  } else if (!validateCCCD(formData.citizenId)) {
    errors.citizenId = 'CCCD/CMND phải có đúng 12 số';
  }
  
  // Birth date validation
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'Ngày sinh không được để trống';
  } else if (!validateAge(formData.dateOfBirth)) {
    errors.dateOfBirth = 'Người dùng phải từ 18 tuổi trở lên';
  }
  
  return errors;
};

// Change password validation
export const validateChangePasswordForm = (formData) => {
  const errors = {};
  
  // Current password validation
  if (!formData.currentPassword) {
    errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
  }
  
  // New password validation
  if (!formData.newPassword) {
    errors.newPassword = 'Vui lòng nhập mật khẩu mới';
  } else if (!validatePassword(formData.newPassword)) {
    errors.newPassword = 'Mật khẩu mới phải có 6-50 ký tự (bao gồm chữ hoa, chữ thường và số, không dấu)';
  } else if (formData.newPassword === formData.currentPassword) {
    errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
  }
  
  // Confirm new password validation
  if (!formData.confirmNewPassword) {
    errors.confirmNewPassword = 'Vui lòng xác nhận mật khẩu mới';
  } else if (formData.newPassword !== formData.confirmNewPassword) {
    errors.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return errors;
};

// Generic validation helpers
export const isRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} là bắt buộc`;
  }
  return null;
};

export const minLength = (value, length, fieldName) => {
  if (value && value.toString().length < length) {
    return `${fieldName} phải có ít nhất ${length} ký tự`;
  }
  return null;
};

export const maxLength = (value, length, fieldName) => {
  if (value && value.toString().length > length) {
    return `${fieldName} không được vượt quá ${length} ký tự`;
  }
  return null;
};

export const isNumeric = (value, fieldName) => {
  if (value && isNaN(value)) {
    return `${fieldName} phải là số`;
  }
  return null;
};

export const isPositive = (value, fieldName) => {
  if (value && parseFloat(value) <= 0) {
    return `${fieldName} phải là số dương`;
  }
  return null;
};