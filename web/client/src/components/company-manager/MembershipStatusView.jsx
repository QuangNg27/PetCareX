import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const MembershipStatusView = () => {
  // Mock data - Tình hình hội viên
  const membershipData = [
    { type: 'Cơ bản', count: 2450, percentage: 49, color: '#94a3b8' },
    { type: 'Thân thiết', count: 1800, percentage: 36, color: '#3b82f6' },
    { type: 'VIP', count: 750, percentage: 15, color: '#f59e0b' },
  ];

  // Mock data - Thống kê theo chi nhánh
  const branchMembershipData = [
    { branch: 'CN Quận 1', coban: 520, thanthiet: 380, vip: 180 },
    { branch: 'CN Quận 3', coban: 480, thanthiet: 360, vip: 140 },
    { branch: 'CN Tân Bình', coban: 450, thanthiet: 340, vip: 130 },
    { branch: 'CN Bình Thạnh', coban: 510, thanthiet: 370, vip: 150 },
    { branch: 'CN Phú Nhuận', coban: 490, thanthiet: 350, vip: 150 },
  ];

  const totalMembers = membershipData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Tổng số hội viên
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {totalMembers.toLocaleString('vi-VN')}
          </div>
        </div>
        {membershipData.map((tier, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Hội viên {tier.type}
            </div>
            <div className="text-2xl font-bold" style={{ color: tier.color }}>
              {tier.count.toLocaleString('vi-VN')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {tier.percentage}% tổng số
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố hội viên theo loại
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={membershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {membershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Chi tiết thống kê
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Loại thẻ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {membershipData.map((tier, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tier.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {tier.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tier.count.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tier.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStatusView;
