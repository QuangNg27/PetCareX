import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { UsersIcon, AlertCircleIcon } from '@components/common/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CustomerStatsView = () => {
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    customersByLevel: [],
    inactiveCustomersList: [],
  });
  const [inactiveDays, setInactiveDays] = useState(90);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  useEffect(() => {
    fetchCustomerStats();
  }, [inactiveDays]);

  const fetchCustomerStats = async () => {
    try {
      setLoading(true);
      const data = await branchManagerService.getCustomerStats(inactiveDays);
      console.log('Customer stats:', data);
      setCustomerStats(data.data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê khách hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelDistribution = () => {
    if (!customerStats?.customersByLevel) return [];
    return customerStats.customersByLevel.map(item => ({
      name: item.TenCapDo,
      value: item.SoLuong
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê khách hàng</h2>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Ngưỡng không hoạt động:
          </label>
          <select
            value={inactiveDays}
            onChange={(e) => setInactiveDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={30}>30 ngày</option>
            <option value={60}>60 ngày</option>
            <option value={90}>90 ngày</option>
            <option value={180}>180 ngày</option>
            <option value={365}>1 năm</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng khách hàng</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {customerStats?.totalCustomers || 0}
                  </p>
                </div>
                <UsersIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Khách hoạt động</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {customerStats?.activeCustomers || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Khách không hoạt động</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {customerStats?.inactiveCustomers || 0}
                  </p>
                </div>
                <AlertCircleIcon className="h-12 w-12 text-orange-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Lâu hơn {inactiveDays} ngày
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ không hoạt động</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {customerStats?.totalCustomers > 0
                    ? ((customerStats.inactiveCustomers / customerStats.totalCustomers) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Customer Level Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Phân bố theo cấp độ thành viên
              </h3>
              {getLevelDistribution().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getLevelDistribution()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {getLevelDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Thống kê theo cấp độ
              </h3>
              {customerStats?.customersByLevel && customerStats.customersByLevel.length > 0 ? (
                <div className="space-y-4">
                  {customerStats.customersByLevel.map((level, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{level.TenCapDo}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{level.SoLuong}</p>
                        <p className="text-xs text-gray-500">
                          {customerStats.totalCustomers > 0
                            ? ((level.SoLuong / customerStats.totalCustomers) * 100).toFixed(1)
                            : 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Inactive Customers List */}
          {customerStats?.inactiveCustomersList && customerStats.inactiveCustomersList.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AlertCircleIcon className="h-5 w-5 text-orange-600" />
                  Danh sách khách hàng không hoạt động ({customerStats.inactiveCustomersList.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Khách hàng không có giao dịch trong {inactiveDays} ngày qua
                </p>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã KH
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Họ tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cấp độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lần cuối
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số ngày
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerStats.inactiveCustomersList.map((customer) => (
                      <tr key={customer.MaKH} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.MaKH}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.HoTen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.SoDT}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.Email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {customer.TenCapDo || 'Cơ bản'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.LanCuoi ? new Date(customer.LanCuoi).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-orange-600">
                          {customer.SoNgay} ngày
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerStatsView;
