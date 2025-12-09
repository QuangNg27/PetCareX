import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  DollarSignIcon, 
  SyringeIcon, 
  PackageIcon, 
  FileTextIcon, 
  TrendingUpIcon, 
  UsersIcon, 
  ToolIcon,
  LogOutIcon
} from '@components/common/icons';
import EmployeesView from '@components/branch-manager/EmployeesView';
import RevenueStatsView from '@components/branch-manager/RevenueStatsView';
import VaccinationListView from '@components/branch-manager/VaccinationListView';
import ProductInventoryView from '@components/branch-manager/ProductInventoryView';
import PetHistoryView from '@components/branch-manager/PetHistoryView';
import EmployeePerformanceView from '@components/branch-manager/EmployeePerformanceView';
import CustomerStatsView from '@components/branch-manager/CustomerStatsView';
import ServiceManagementView from '@components/branch-manager/ServiceManagementView';

const BranchManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');
  
  // Mock user for preview
  const currentUser = user || { TenDangNhap: 'Manager Demo', MaCN: 1 };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'employees', label: 'Nhân viên', icon: UserIcon },
    { id: 'revenue', label: 'Doanh thu', icon: DollarSignIcon },
    { id: 'vaccination', label: 'Tiêm phòng', icon: SyringeIcon },
    { id: 'inventory', label: 'Tồn kho & Văc-xin', icon: PackageIcon },
    { id: 'petHistory', label: 'Lịch sử thú cưng', icon: FileTextIcon },
    { id: 'performance', label: 'Hiệu suất NV', icon: TrendingUpIcon },
    { id: 'customers', label: 'Khách hàng', icon: UsersIcon },
    { id: 'services', label: 'Quản lý dịch vụ', icon: ToolIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeesView />;
      case 'revenue':
        return <RevenueStatsView />;
      case 'vaccination':
        return <VaccinationListView />;
      case 'inventory':
        return <ProductInventoryView />;
      case 'petHistory':
        return <PetHistoryView />;
      case 'performance':
        return <EmployeePerformanceView />;
      case 'customers':
        return <CustomerStatsView />;
      case 'services':
        return <ServiceManagementView />;
      default:
        return <EmployeesView />;
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
                Quản lý chi nhánh
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Chào mừng, {currentUser?.TenDangNhap} - Chi nhánh #{currentUser?.MaCN}
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

export default BranchManagerDashboard;
