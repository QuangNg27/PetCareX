import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/layout/AuthLayout';
import FormField from '@components/common/FormField';
import Button from '@components/common/Button';
import { UserIcon, PasswordIcon, EyeIcon, EyeOffIcon } from '@components/common/icons';
import { useSignup } from '@context/SignupContext';
import { validateSignupStep1 } from '@utils/validation';

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
            <div className="w-24 h-1 bg-gray-200 mb-6"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-gray-400 text-xs mt-2 whitespace-nowrap">Thông tin cá nhân</span>
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
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          )}
        </div>

        <div className="relative">
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
          
          {formData.confirmPassword && (
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          )}
        </div>

        <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Đang xử lý...' : 'Tiếp theo'}
        </Button>

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

export default SignupStep1;