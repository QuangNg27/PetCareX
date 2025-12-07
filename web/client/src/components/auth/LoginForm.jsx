import React, { useState } from 'react';
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
    setErrors({}); // Clear previous errors
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role
        let redirectPath;
        if (result.user.role === 'Khách hàng') {
          redirectPath = '/customer/dashboard';
        } else if (result.user.role === 'Bác sĩ') {
          redirectPath = '/doctor/dashboard';
        } else if (result.user.role === 'Bán hàng') {
          redirectPath = '/sales/dashboard';
        } else if (result.user.role === 'Quản lý chi nhánh') {
          redirectPath = '/branch-manager/dashboard';
        } else if (result.user.role === 'Quản lý công ty') {
          redirectPath = '/admin/dashboard';
        }
        navigate(redirectPath, { replace: true });
      } else {
        console.log('Login failed:', result.message);
        setErrors({ general: result.message || 'Đăng nhập thất bại' });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setErrors({ general: errorMessage });
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
        {errors.general && (
          <div className="p-4 bg-error-50 border border-error-200 text-error-700 rounded-lg text-sm">
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