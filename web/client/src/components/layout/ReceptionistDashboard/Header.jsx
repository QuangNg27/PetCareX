import React from 'react';
import { useAuth } from '@context/AuthContext';

const Header = ({ title = 'Tổng quan' }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.HoTen?.charAt(0) || 'T'}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-gray-900">
              {user?.HoTen || user?.TenDangNhap || 'Tiếp tân'}
            </div>
            <div className="text-xs text-gray-600">Nhân viên tiếp tân</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
