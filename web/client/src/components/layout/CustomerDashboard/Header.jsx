import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { UserIcon, LogOutIcon, AwardIcon } from '@components/common/icons';
import './Header.css';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
      </div>

      <div className="header-right">
        {/* User Menu */}
        <div className="header-user">
          <button 
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.HoTen?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.TenDangNhap || 'User'}</span>
              <span className="user-role">
                <AwardIcon size={12} /> {user?.HangThanhVien || 'Vàng'}
              </span>
            </div>
            <span className="dropdown-icon">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="user-avatar-large">
                  {user?.HoTen?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <p className="user-name-large">{user?.HoTen || 'User'}</p>
                  <p className="user-email">{user?.Email || 'email@example.com'}</p>
                </div>
              </div>
              <div className="user-dropdown-menu">
                <a href="/customer/profile" className="dropdown-item">
                  <UserIcon size={18} /> Hồ sơ cá nhân
                </a>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <LogOutIcon size={18} /> Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
