import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import { 
  UserIcon, 
  LockIcon, 
  EditIcon, 
  XIcon, 
  SaveIcon,
  PetIcon,
  CalendarIcon,
  DollarSignIcon,
  ChartBarIcon
} from '@components/common/icons';

const ProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   loadProfile();
  // }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await customerService.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
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
          <button onClick={loadProfile} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
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
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <XIcon size={18} /> Hủy
            </>
          ) : (
            <>
              <EditIcon size={18} /> Chỉnh sửa
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Avatar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profileData?.HoTen?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{profileData?.HoTen || 'Chưa cập nhật'}</h3>
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
                  defaultValue={profileData?.HoTen} 
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
                  defaultValue={profileData?.NgaySinh} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.NgaySinh || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              {isEditing ? (
                <select defaultValue={profileData?.GioiTinh} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
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
                  defaultValue={profileData?.SDT} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.SDT || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CCCD</label>
              {isEditing ? (
                <input 
                  type="text" 
                  defaultValue={profileData?.CCCD} 
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
                  defaultValue={profileData?.Email} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData?.Email || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <SaveIcon size={18} /> Lưu thay đổi
              </button>
              <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setIsEditing(false)}>
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
              <p className="text-gray-900">{profileData?.TenDangNhap || 'Chưa cập nhật'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
                Đổi mật khẩu
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Điểm tích lũy</label>
              <p className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary-600">
                  {profileData?.DiemTichLuy || 0}
                </span>
                <span className="text-sm text-gray-600">điểm</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hạng thành viên</label>
              <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                {profileData?.HangThanhVien || 'Bạc'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 mb-6">
            <span className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon size={24} />
            </span>
            Thống kê hoạt động
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                <PetIcon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profileData?.SoLuongThuCung || 0}</p>
                <p className="text-sm text-gray-600">Thú cưng</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profileData?.SoLanDatHen || 0}</p>
                <p className="text-sm text-gray-600">Lịch hẹn</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-lg flex items-center justify-center">
                <DollarSignIcon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(profileData?.TongChiTieu || 0).toLocaleString('vi-VN')}đ
                </p>
                <p className="text-sm text-gray-600">Tổng chi tiêu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
