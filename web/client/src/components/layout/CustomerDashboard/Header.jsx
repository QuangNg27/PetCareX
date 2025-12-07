import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { UserIcon, LogOutIcon, AwardIcon } from '@components/common/icons';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Get user data with fallbacks
  const displayName = user?.TenDangNhap || 'User';
  const fullName = user?.HoTen || user?.TenDangNhap || 'User';
  const userEmail = user?.Email || '';
  const membershipTier = user?.spending?.HangThanhVien || 'Cơ bản';
  const userInitial = (user?.TenDangNhap || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1">
      </div>

      <div className="flex items-center gap-4">
        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userInitial}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-gray-900">{displayName}</div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <AwardIcon size={12} /> {membershipTier}
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-br from-primary-50 to-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {userInitial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{fullName}</p>
                    <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <a href="/customer/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <UserIcon size={18} /> Hồ sơ cá nhân
                </a>
                <div className="my-1 border-t border-gray-200"></div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors">
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
