import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import FormField from '@components/common/FormField';
import Button from '@components/common/Button';
import { UserIcon, PasswordIcon, EyeIcon, EyeOffIcon } from '@components/common/icons';
import { useSignup } from '@context/SignupContext';
import { validateSignupStep1 } from '@utils/validation';
import './SignupStep1.css';

const SignupStep1 = () => {
  const navigate = useNavigate();
  const { signupData, updateSignupData, nextStep } = useSignup();
  
  const [formData, setFormData] = useState({
    username: signupData.username || '',
    password: signupData.password || '',
    confirmPassword: signupData.confirmPassword || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateSignupStep1(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Save data to context
      updateSignupData(formData);
      
      // Move to next step
      nextStep();
      navigate('/signup/step2');
      
    } catch (error) {
      console.error('Step 1 error:', error);
      setErrors({ 
        general: 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <AuthLayout 
      title="Tạo tài khoản mới" 
      subtitle="Bước 1: Thông tin đăng nhập"
    >
      <div className="signup-progress">
        <div className="progress-bar">
          <div className="progress-step active">1</div>
          <div className="progress-line"></div>
          <div className="progress-step">2</div>
        </div>
        <div className="progress-labels">
          <span className="active">Thông tin đăng nhập</span>
          <span>Thông tin cá nhân</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="signup-step1-form">
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}
        
        <FormField
          label="Tên đăng nhập"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          placeholder="Nhập tên đăng nhập"
          icon={UserIcon}
          required
        />

        <div className="password-field">
          <FormField
            label="Mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Nhập mật khẩu"
            icon={PasswordIcon}
            required
          />
          
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="password-field">
          <FormField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            icon={PasswordIcon}
            required
          />
          
          <button
            type="button"
            className="password-toggle"
            onClick={toggleConfirmPasswordVisibility}
            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="next-button"
          >
            {loading ? 'Đang xử lý...' : 'Tiếp theo'}
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

export default SignupStep1;