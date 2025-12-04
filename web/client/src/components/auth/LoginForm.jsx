import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import FormField from '@components/common/FormField';
import Button from '@components/common/Button';
import { UserIcon, PasswordIcon, EyeIcon, EyeOffIcon } from '@components/common/icons';
import { useAuth } from '@context/AuthContext';
import { validateLoginForm } from '@utils/validation';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role
        const redirectPath = result.user.role === 'admin' ? '/admin' : '/dashboard';
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({ general: result.message || 'Đăng nhập thất bại' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle="Chào mừng bạn quay trở lại với PetCareX"
    >
      <form onSubmit={handleSubmit} className="login-form">
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
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Ghi nhớ đăng nhập
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="login-button"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <div className="form-footer">
          <p>
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="signup-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;