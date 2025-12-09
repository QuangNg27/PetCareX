import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const SystemRevenueView = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [viewType, setViewType] = useState('total'); // total, branch

  // Mock data - Doanh thu toàn hệ thống theo tháng
  const totalRevenueData = [
    { month: 'T1', revenue: 150000000 },
    { month: 'T2', revenue: 180000000 },
    { month: 'T3', revenue: 220000000 },
    { month: 'T4', revenue: 195000000 },
    { month: 'T5', revenue: 240000000 },
    { month: 'T6', revenue: 280000000 },
    { month: 'T7', revenue: 310000000 },
    { month: 'T8', revenue: 295000000 },
    { month: 'T9', revenue: 330000000 },
    { month: 'T10', revenue: 350000000 },
    { month: 'T11', revenue: 380000000 },
    { month: 'T12', revenue: 420000000 },
  ];

  // Mock data - Doanh thu theo chi nhánh
  const branchRevenueData = [
    { branch: 'CN Quận 1', revenue: 850000000, growth: 15.5 },
    { branch: 'CN Quận 3', revenue: 720000000, growth: 12.3 },
    { branch: 'CN Tân Bình', revenue: 680000000, growth: 18.7 },
    { branch: 'CN Bình Thạnh', revenue: 620000000, growth: 10.2 },
    { branch: 'CN Phú Nhuận', revenue: 580000000, growth: 14.8 },
    { branch: 'CN Quận 7', revenue: 560000000, growth: 16.3 },
    { branch: 'CN Thủ Đức', revenue: 540000000, growth: 20.5 },
    { branch: 'CN Gò Vấp', revenue: 510000000, growth: 11.7 },
    { branch: 'CN Quận 10', revenue: 480000000, growth: 13.2 },
    { branch: 'CN Bình Tân', revenue: 450000000, growth: 9.8 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = totalRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgMonthlyRevenue = totalRevenue / totalRevenueData.length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại thống kê
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('total')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewType === 'total'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toàn hệ thống
              </button>
              <button
                onClick={() => setViewType('branch')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  viewType === 'branch'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Theo chi nhánh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tổng doanh thu năm {selectedYear}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Doanh thu trung bình/tháng
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(avgMonthlyRevenue)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tổng số chi nhánh
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {branchRevenueData.length}
          </div>
        </div>
      </div>

      {/* Charts */}
      {viewType === 'total' ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Biểu đồ doanh thu theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={totalRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Doanh thu" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Doanh thu theo chi nhánh
          </h3>
          
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={branchRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SystemRevenueView;
