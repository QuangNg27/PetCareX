import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSignIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  UserIcon,
  LogOutIcon
} from '@components/common/icons';
import SystemRevenueView from '@components/company-manager/SystemRevenueView';
import TopServicesView from '@components/company-manager/TopServicesView';
import PetStatisticsView from '@components/company-manager/PetStatisticsView';
import MembershipStatusView from '@components/company-manager/MembershipStatusView';
import EmployeeManagementView from '@components/company-manager/EmployeeManagementView';

const CompanyManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('revenue');
  
  const currentUser = user || { TenDangNhap: 'Company Manager' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'revenue', label: 'Doanh thu hệ thống', icon: DollarSignIcon },
    { id: 'services', label: 'Dịch vụ hàng đầu', icon: TrendingUpIcon },
    { id: 'pets', label: 'Thống kê thú cưng', icon: UsersIcon },
    { id: 'membership', label: 'Tình hình hội viên', icon: UsersIcon },
    { id: 'employees', label: 'Quản lý nhân sự', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'revenue':
        return <SystemRevenueView />;
      case 'services':
        return <TopServicesView />;
      case 'pets':
        return <PetStatisticsView />;
      case 'membership':
        return <MembershipStatusView />;
      case 'employees':
        return <EmployeeManagementView />;
      default:
        return <SystemRevenueView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý công ty
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Chào mừng, {currentUser?.TenDangNhap}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
            >
              <LogOutIcon className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyManagerDashboard;
