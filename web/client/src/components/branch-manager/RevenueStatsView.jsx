import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const RevenueStatsView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN || 1;
  
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenueData, setRevenueData] = useState([
    { ThoiGian: 'T7/2024', DoanhThu: 45000000, SoDonHang: 85 },
    { ThoiGian: 'T8/2024', DoanhThu: 52000000, SoDonHang: 95 },
    { ThoiGian: 'T9/2024', DoanhThu: 48000000, SoDonHang: 88 },
    { ThoiGian: 'T10/2024', DoanhThu: 61000000, SoDonHang: 110 },
    { ThoiGian: 'T11/2024', DoanhThu: 58000000, SoDonHang: 102 },
    { ThoiGian: 'T12/2024', DoanhThu: 65000000, SoDonHang: 118 },
  ]);
  const [totalRevenue, setTotalRevenue] = useState(329000000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockRevenue = [
        { ThoiGian: 'T7/2024', DoanhThu: 45000000, SoDonHang: 85 },
        { ThoiGian: 'T8/2024', DoanhThu: 52000000, SoDonHang: 95 },
        { ThoiGian: 'T9/2024', DoanhThu: 48000000, SoDonHang: 88 },
        { ThoiGian: 'T10/2024', DoanhThu: 61000000, SoDonHang: 110 },
        { ThoiGian: 'T11/2024', DoanhThu: 58000000, SoDonHang: 102 },
        { ThoiGian: 'T12/2024', DoanhThu: 65000000, SoDonHang: 118 },
      ];
      setRevenueData(mockRevenue);
      const total = mockRevenue.reduce((sum, item) => sum + (item.DoanhThu || 0), 0);
      setTotalRevenue(total);
      // const data = await branchManagerService.getRevenueStats(branchId, period, startDate, endDate);
      // setRevenueData(data.data.revenue || []);
      // const total = (data.data.revenue || []).reduce((sum, item) => sum + (item.DoanhThu || 0), 0);
      // setTotalRevenue(total);
    } catch (error) {
      console.error('Lỗi khi tải thống kê doanh thu:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodLabels = {
    day: 'Theo ngày',
    month: 'Theo tháng',
    quarter: 'Theo quý',
    year: 'Theo năm'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Thống kê doanh thu</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kỳ thống kê
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchRevenueStats}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem thống kê
            </button>
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-lg font-medium opacity-90">Tổng doanh thu ({periodLabels[period]})</h3>
        <p className="text-4xl font-bold mt-2">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
        <p className="text-sm opacity-75 mt-2">
          Từ {new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ doanh thu</h3>
        
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : revenueData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <p>Không có dữ liệu trong khoảng thời gian này</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ThoiGian" />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                width={60}
              />
              <Tooltip 
                formatter={(value) => value.toLocaleString('vi-VN') + ' VNĐ'}
                labelFormatter={(label) => `Thời gian: ${label}`}
              />
              <Bar dataKey="DoanhThu" fill="#3B82F6" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueStatsView;
