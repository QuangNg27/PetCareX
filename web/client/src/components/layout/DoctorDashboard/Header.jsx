import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { UserIcon, LogOutIcon } from "@components/common/icons";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        {/* User Info Display */}
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-gray-900">
            {user?.TenDangNhap || "Doctor"}
          </div>
          <div className="text-xs text-gray-600">
            {user?.VaiTro || "Bác sĩ"}
          </div>
        </div>
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user?.HoTen?.charAt(0) || "D"}
        </div>
      </div>
    </header>
  );
};

export default Header;
