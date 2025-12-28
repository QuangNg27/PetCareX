import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import FormField from '@components/common/FormField';
import Button from '@components/common/Button';
import { 
  UserIcon, 
  EmailIcon, 
  PhoneIcon, 
  IdCardIcon, 
  CalendarIcon 
} from '@components/common/icons';
import { useSignup } from '@context/SignupContext';
import { useAuth } from '@context/AuthContext';
import { validateSignupStep2 } from '@utils/validation';

const SignupStep2 = () => {
  const navigate = useNavigate();
  const { signupData, updateSignupData, prevStep, resetSignup } = useSignup();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: signupData.fullName || '',
    email: signupData.email || '',
    phone: signupData.phone || '',
    citizenId: signupData.citizenId || '',
    dateOfBirth: signupData.dateOfBirth || '',
    gender: signupData.gender || 'Nam'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBack = () => {
    updateSignupData(formData);
    prevStep();
    navigate('/signup/step1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateSignupStep2(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Combine all data
      const fullSignupData = {
        ...signupData,
        ...formData
      };
      
      // Map to backend format
      const backendData = {
        TenDangNhap: fullSignupData.username,
        MatKhau: fullSignupData.password,
        HoTen: fullSignupData.fullName,
        Email: fullSignupData.email,
        SoDT: fullSignupData.phone,
        CCCD: fullSignupData.citizenId,
        NgaySinh: fullSignupData.dateOfBirth,
        GioiTinh: fullSignupData.gender
      };
      
      // Register user
      const result = await signup(backendData);
      
      if (result.success) {
        resetSignup();
        alert('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
        navigate('/login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.' 
          }
        });
      } else {
        console.error('Signup failed:', result);
        setErrors({ general: result.message || 'Đăng ký thất bại' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Có lỗi xảy ra. Vui lòng thử lại sau.';
      
      setErrors({ general: errorMessage });
      alert(`Lỗi đăng ký: ${errorMessage}`); // Temporary alert for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Tạo tài khoản mới" 
      subtitle="Bước 2: Thông tin cá nhân"
    >
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-primary-600 font-semibold text-xs mt-2 whitespace-nowrap">Thông tin đăng nhập</span>
            </div>
            <div className="w-24 h-1 bg-primary-600 mb-6"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-primary-600 font-semibold text-xs mt-2 whitespace-nowrap">Thông tin cá nhân</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <FormField
          label="Họ và tên"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
          placeholder="Nhập họ và tên"
          icon={UserIcon}
          required
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="Nhập địa chỉ email"
          icon={EmailIcon}
          required
        />

        <FormField
          label="Số điện thoại"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          placeholder="Nhập số điện thoại"
          icon={PhoneIcon}
          required
        />

        <FormField
          label="Số CCCD/CMND"
          name="citizenId"
          type="text"
          value={formData.citizenId}
          onChange={handleInputChange}
          error={errors.citizenId}
          placeholder="Nhập số CCCD/CMND"
          icon={IdCardIcon}
          required
        />

        <FormField
          label="Ngày sinh"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          error={errors.dateOfBirth}
          icon={CalendarIcon}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Giới tính <span className="text-error-500">*</span>
          </label>
          <div className="flex gap-6">
            {['Nam', 'Nữ'].map((genderValue) => (
              <label className="flex items-center gap-2 cursor-pointer" key={genderValue}>
                <input
                  type="radio"
                  name="gender"
                  value={genderValue}
                  checked={formData.gender === genderValue}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{genderValue}</span>
              </label>
            ))}
          </div>
          {errors.gender && <span className="text-xs text-error-600">{errors.gender}</span>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            Quay lại
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Hoàn thành'}
          </Button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupStep2;