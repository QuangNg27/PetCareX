import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import { 
  UserIcon, 
  LockIcon, 
  EditIcon, 
  XIcon, 
  SaveIcon,
  EyeIcon,
  EyeOffIcon
} from '@components/common/icons';

const ProfileView = () => {
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const { user, fetchUserData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [spending, setSpending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới và xác nhận không khớp');
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await customerService.updatePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (response.success) {
        alert('Đổi mật khẩu thành công!');
        setShowChangePassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(response.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, spendingResponse] = await Promise.all([
        customerService.getProfile(),
        customerService.getSpending()
      ]);
      
      // Extract data from response
      const profileData = profileResponse.data || profileResponse;
      const spendingData = spendingResponse.data || spendingResponse;
      
      setProfile(profileData);
      setSpending(spendingData);
      setEditedData(profileData);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await customerService.updateProfile(editedData);
      
      if (response.success) {
        setProfile(editedData);
        setIsEditing(false);
        if (fetchUserData) {
          await fetchUserData();
        }
        alert('Cập nhật thông tin thành công!');
      } else {
        alert(response.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-5xl mb-4">⚠️</span>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadProfileData} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const profileData = profile || user;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h2>
        {!isEditing ? (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <EditIcon size={18} /> Chỉnh sửa
          </button>
        ) : (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleCancelEdit}
          >
            <XIcon size={18} /> Hủy
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Avatar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {(user?.TenDangNhap || profileData?.TenDangNhap || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.TenDangNhap || profileData?.TenDangNhap || 'Chưa cập nhật'}</h3>
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Khách hàng
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
            <span className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <UserIcon size={24} />
            </span>
            Thông tin cá nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedData?.HoTen || ''} 
                  onChange={(e) => handleInputChange('HoTen', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.HoTen || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
              {isEditing ? (
                <input 
                  type="date" 
                  value={formatDateForInput(editedData?.NgaySinh) || ''} 
                  onChange={(e) => handleInputChange('NgaySinh', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{formatDate(profileData?.NgaySinh) || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              {isEditing ? (
                <select 
                  value={editedData?.GioiTinh || ''} 
                  onChange={(e) => handleInputChange('GioiTinh', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              ) : (
                <p className="text-gray-900">{profileData?.GioiTinh || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={editedData?.SoDT || ''} 
                  onChange={(e) => handleInputChange('SoDT', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.SoDT || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CCCD</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedData?.CCCD || ''} 
                  onChange={(e) => handleInputChange('CCCD', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.CCCD || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={editedData?.Email || ''} 
                  onChange={(e) => handleInputChange('Email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.Email || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <SaveIcon size={18} /> Lưu thay đổi
                  </>
                )}
              </button>
              <button 
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
            <span className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <LockIcon size={24} />
            </span>
            Thông tin tài khoản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
              <p className="text-gray-900">{user?.TenDangNhap || profileData?.TenDangNhap || 'Chưa cập nhật'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              {!showChangePassword ? (
                <button
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  onClick={() => setShowChangePassword(true)}
                >
                  Đổi mật khẩu
                </button>
              ) : (
                <div className="space-y-2 mt-2">
                  <div className="relative mb-2">
                    <input
                      type={showPassword.old ? "text" : "password"}
                      placeholder="Mật khẩu hiện tại"
                      value={passwordData.oldPassword}
                      onChange={e => handlePasswordInputChange('oldPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                    >
                      {showPassword.old ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                    </span>
                  </div>
                  <div className="relative mb-2">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      placeholder="Mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={e => handlePasswordInputChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPassword.new ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                    </span>
                  </div>
                  <div className="relative mb-2">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={e => handlePasswordInputChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPassword.confirm ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Đang đổi...' : 'Xác nhận đổi'}
                    </button>
                    <button
                      onClick={() => { setShowChangePassword(false); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); }}
                      disabled={isChangingPassword}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
