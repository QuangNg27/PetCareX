import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import { 
  UserIcon, 
  LockIcon, 
  EditIcon, 
  XIcon, 
  SaveIcon,
  CameraIcon,
  PetIcon,
  CalendarIcon,
  DollarSignIcon,
  ChartBarIcon
} from '@components/common/icons';
import './ProfileView.css';

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
      <div className="profile-view">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-view">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={loadProfile} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const profileData = profile || user;

  return (
    <div className="profile-view">
      <div className="profile-header">
        <h2>Hồ sơ cá nhân</h2>
        <button 
          className="edit-profile-btn"
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

      <div className="profile-content">
        {/* Profile Avatar Section */}
        <div className="profile-card avatar-card">
          <div className="avatar-section">
            <div className="profile-avatar-large">
              {profileData?.HoTen?.charAt(0) || 'U'}
            </div>
            {isEditing && (
              <button className="change-avatar-btn">
                <CameraIcon size={16} /> Thay đổi ảnh
              </button>
            )}
          </div>
          <div className="profile-summary">
            <h3>{profileData?.HoTen || 'Chưa cập nhật'}</h3>
            <p className="profile-role">
              <span className="role-badge">Khách hàng</span>
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-card">
          <h3 className="card-title">
            <span className="card-icon">
              <UserIcon size={24} />
            </span>
            Thông tin cá nhân
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Họ và tên</label>
              {isEditing ? (
                <input 
                  type="text" 
                  defaultValue={profileData?.HoTen} 
                  className="info-input"
                />
              ) : (
                <p>{profileData?.HoTen || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>Ngày sinh</label>
              {isEditing ? (
                <input 
                  type="date" 
                  defaultValue={profileData?.NgaySinh} 
                  className="info-input"
                />
              ) : (
                <p>{profileData?.NgaySinh || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>Giới tính</label>
              {isEditing ? (
                <select defaultValue={profileData?.GioiTinh} className="info-input">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <p>{profileData?.GioiTinh || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>Số điện thoại</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  defaultValue={profileData?.SDT} 
                  className="info-input"
                />
              ) : (
                <p>{profileData?.SDT || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item">
              <label>CCCD</label>
              {isEditing ? (
                <input 
                  type="text" 
                  defaultValue={profileData?.CCCD} 
                  className="info-input"
                />
              ) : (
                <p>{profileData?.CCCD || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className="info-item full-width">
              <label>Email</label>
              {isEditing ? (
                <input 
                  type="email" 
                  defaultValue={profileData?.Email} 
                  className="info-input"
                />
              ) : (
                <p>{profileData?.Email || 'Chưa cập nhật'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="card-actions">
              <button className="save-btn">
                <SaveIcon size={18} /> Lưu thay đổi
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="profile-card">
          <h3 className="card-title">
            <span className="card-icon">
              <LockIcon size={24} />
            </span>
            Thông tin tài khoản
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Tên đăng nhập</label>
              <p>{profileData?.TenDangNhap || 'Chưa cập nhật'}</p>
            </div>

            <div className="info-item">
              <label>Mật khẩu</label>
              <button className="change-password-btn">
                Đổi mật khẩu
              </button>
            </div>

            <div className="info-item">
              <label>Điểm tích lũy</label>
              <p className="loyalty-points">
                <span className="points-value">
                  {profileData?.DiemTichLuy || 0}
                </span>
                <span className="points-label">điểm</span>
              </p>
            </div>

            <div className="info-item">
              <label>Hạng thành viên</label>
              <p>
                <span className="member-tier">
                  {profileData?.HangThanhVien || 'Bạc'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="profile-card">
          <h3 className="card-title">
            <span className="card-icon">
              <ChartBarIcon size={24} />
            </span>
            Thống kê hoạt động
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <PetIcon size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-value">{profileData?.SoLuongThuCung || 0}</p>
                <p className="stat-label">Thú cưng</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <CalendarIcon size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-value">{profileData?.SoLanDatHen || 0}</p>
                <p className="stat-label">Lịch hẹn</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <DollarSignIcon size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-value">
                  {(profileData?.TongChiTieu || 0).toLocaleString('vi-VN')}đ
                </p>
                <p className="stat-label">Tổng chi tiêu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
