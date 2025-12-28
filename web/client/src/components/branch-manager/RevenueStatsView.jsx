import React, { useState } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueStatsView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN;
  
  // Set default dates - last 30 days
  const getDefaultEndDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  };
  
  const currentYear = new Date().getFullYear();
  
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startYear, setStartYear] = useState(currentYear - 5);
  const [endYear, setEndYear] = useState(currentYear);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRevenueStats = async () => {
    if (!branchId) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare params based on period
      let param1, param2;
      
      switch (period) {
        case 'day':
          param1 = startDate;
          param2 = endDate;
          break;
        case 'month':
          param1 = selectedYear.toString();
          param2 = null;
          break;
        case 'quarter':
          param1 = selectedYear.toString();
          param2 = null;
          break;
        case 'year':
          param1 = startYear.toString();
          param2 = endYear.toString();
          break;
        default:
          param1 = startDate;
          param2 = endDate;
      }
      

      const data = await branchManagerService.getRevenueStats(
        branchId, 
        period, 
        param1, 
        param2
      );
      
      const rawRevenue = data.data.revenue || [];
      
      // Map field names based on period type
      const mappedRevenue = rawRevenue.map(item => {
        let label = '';
        let revenue = item.DoanhThu || item.TongDoanhThu || 0;
        
        if (item.Ngay) {
          label = new Date(item.Ngay).toLocaleDateString('vi-VN');
        } else if (item.Thang && item.Nam) {
          label = `Tháng ${item.Thang}/${item.Nam}`;
        } else if (item.Quy && item.Nam) {
          label = `${item.TenQuy || 'Q' + item.Quy} ${item.Nam}`;
        } else if (item.Nam) {
          label = `Năm ${item.Nam}`;
        }
        
        return {
          ThoiGian: label,
          DoanhThu: revenue
        };
      });
      
      setRevenueData(mappedRevenue);
      const total = mappedRevenue.reduce((sum, item) => sum + (item.DoanhThu || 0), 0);
      setTotalRevenue(total);
      setHasFetched(true);
    } catch (error) {
      console.error('Lỗi khi tải thống kê doanh thu:', error);
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  };
  
  const renderDateInputs = () => {
    switch (period) {
      case 'day':
        return (
          <>
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
          </>
        );
      
      case 'month':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn năm
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2000"
              max={currentYear + 10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      case 'quarter':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn năm
            </label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              min="2000"
              max={currentYear + 10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      case 'year':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ năm
              </label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                min="2000"
                max={currentYear + 10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến năm
              </label>
              <input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
                min="2000"
                max={currentYear + 10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        );
      
      default:
        return null;
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

          {renderDateInputs()}

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
      {revenueData.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-medium opacity-90">Tổng doanh thu ({periodLabels[period]})</h3>
          <p className="text-4xl font-bold mt-2">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
          <p className="text-sm opacity-75 mt-2">
            {period === 'day' && `Từ ${new Date(startDate).toLocaleDateString('vi-VN')} đến ${new Date(endDate).toLocaleDateString('vi-VN')}`}
            {period === 'month' && `Năm ${selectedYear}`}
            {period === 'quarter' && `Năm ${selectedYear}`}
            {period === 'year' && `Từ năm ${startYear} đến năm ${endYear}`}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Biểu đồ doanh thu</h3>
        
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !hasFetched ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">Chọn kỳ thống kê và bấm "Xem thống kê"</p>
              <p className="text-sm mt-2">Dữ liệu doanh thu sẽ được hiển thị tại đây</p>
            </div>
          </div>
        ) : revenueData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-medium">Không có dữ liệu doanh thu</p>
              <p className="text-sm mt-2">
                {period === 'day' && `Không có hóa đơn nào từ ${new Date(startDate).toLocaleDateString('vi-VN')} đến ${new Date(endDate).toLocaleDateString('vi-VN')}`}
                {period === 'month' && `Không có hóa đơn nào trong năm ${selectedYear}`}
                {period === 'quarter' && `Không có hóa đơn nào trong năm ${selectedYear}`}
                {period === 'year' && `Không có hóa đơn nào từ năm ${startYear} đến năm ${endYear}`}
              </p>
            </div>
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
