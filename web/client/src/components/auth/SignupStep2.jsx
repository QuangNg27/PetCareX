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
import './SignupStep2.css';

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
    gender: signupData.gender || 'male'
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
    
    try {
      // Combine all data
      const fullSignupData = {
        ...signupData,
        ...formData
      };
      
      // Map to backend format
      const backendData = {
        tenDangNhap: fullSignupData.username,
        matKhau: fullSignupData.password,
        hoTen: fullSignupData.fullName,
        email: fullSignupData.email,
        soDT: fullSignupData.phone,
        cccd: fullSignupData.citizenId,
        ngaySinh: fullSignupData.dateOfBirth,
        gioiTinh: fullSignupData.gender
      };
      
      // Register user
      const result = await signup(backendData);
      
      if (result.success) {
        resetSignup();
        navigate('/login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.' 
          }
        });
      } else {
        setErrors({ general: result.message || 'Đăng ký thất bại' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        general: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Tạo tài khoản mới" 
      subtitle="Bước 2: Thông tin cá nhân"
    >
      <div className="signup-progress">
        <div className="progress-bar">
          <div className="progress-step completed">1</div>
          <div className="progress-line completed"></div>
          <div className="progress-step active">2</div>
        </div>
        <div className="progress-labels">
          <span className="completed">Thông tin đăng nhập</span>
          <span className="active">Thông tin cá nhân</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="signup-step2-form">
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="field-label">
              Giới tính <span className="required-asterisk">*</span>
            </label>
            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                />
                <span className="radio-mark"></span>
                Nam
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                />
                <span className="radio-mark"></span>
                Nữ
              </label>
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleInputChange}
                />
                <span className="radio-mark"></span>
                Khác
              </label>
            </div>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="back-button"
          >
            Quay lại
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="submit-button"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Hoàn thành'}
          </Button>
        </div>

        <div className="form-footer">
          <p>
            Đã có tài khoản?{' '}
            <Link to="/login" className="login-link">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupStep2;