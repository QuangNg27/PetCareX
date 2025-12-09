import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import FormField from '@components/common/FormField';
import Button from '@components/common/Button';
import { UserIcon, PasswordIcon, EyeIcon, EyeOffIcon } from '@components/common/icons';
import { useAuth } from '@context/AuthContext';
import { validateLoginForm } from '@utils/validation';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the specific field error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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

    // Only clear errors when validation passes
    setLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role (support both 'role' and 'VaiTro')
        const userRole = result.user.VaiTro || result.user.role;
        let redirectPath = '/customer/dashboard'; // Default path
        
        if (userRole === 'Khách hàng') {
          redirectPath = '/customer/dashboard';
        } else if (userRole === 'Bác sĩ') {
          redirectPath = '/doctor/dashboard';
        } else if (userRole === 'Bán hàng') {
          redirectPath = '/sales/dashboard';
        } else if (userRole === 'Quản lý chi nhánh') {
          redirectPath = '/branch-manager/dashboard';
        } else if (userRole === 'Quản lý công ty') {
          redirectPath = '/company-manager/dashboard';
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        setGeneralError(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setGeneralError(errorMessage);
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {generalError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">{generalError}</div>
            <button
              type="button"
              onClick={() => setGeneralError('')}
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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

        <div className="relative">
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
          
          {formData.password && (
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          )}
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500" />
            <span className="text-sm text-gray-700">Ghi nhớ đăng nhập</span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;