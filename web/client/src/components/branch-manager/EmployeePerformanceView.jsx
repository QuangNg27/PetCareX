import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';

const EmployeePerformanceView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN || 1;
  
  const [performanceData, setPerformanceData] = useState([
    { MaNV: 1, HoTen: 'Trần Minh', ChucVu: 'Bác sĩ', SoLanKham: 145, SoLanTiem: 89 },
    { MaNV: 2, HoTen: 'Lê Hương', ChucVu: 'Bác sĩ', SoLanKham: 138, SoLanTiem: 76 },
    { MaNV: 3, HoTen: 'Nguyễn An', ChucVu: 'Bác sĩ', SoLanKham: 110, SoLanTiem: 62 },
    { MaNV: 4, HoTen: 'Phạm Thu', ChucVu: 'Nhân viên bán hàng', SoDonHang: 125 },
    { MaNV: 5, HoTen: 'Trương Mai', ChucVu: 'Nhân viên bán hàng', SoDonHang: 98 },
    { MaNV: 6, HoTen: 'Hoàng Linh', ChucVu: 'Tiếp tân' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockPerformance = [
        { MaNV: 1, HoTen: 'Trần Minh', ChucVu: 'Bác sĩ', SoLanKham: 145, SoLanTiem: 89 },
        { MaNV: 2, HoTen: 'Lê Hương', ChucVu: 'Bác sĩ', SoLanKham: 138, SoLanTiem: 76 },
        { MaNV: 3, HoTen: 'Nguyễn An', ChucVu: 'Bác sĩ', SoLanKham: 110, SoLanTiem: 62 },
        { MaNV: 4, HoTen: 'Phạm Thu', ChucVu: 'Nhân viên bán hàng', SoDonHang: 125 },
        { MaNV: 5, HoTen: 'Trương Mai', ChucVu: 'Nhân viên bán hàng', SoDonHang: 98 },
        { MaNV: 6, HoTen: 'Hoàng Linh', ChucVu: 'Tiếp tân' },
      ];
      setPerformanceData(mockPerformance);
      // const data = await branchManagerService.getEmployeePerformance(branchId, startDate, endDate);
      // setPerformanceData(data.data.performance || []);
    } catch (error) {
      console.error('Lỗi khi tải hiệu suất nhân viên:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    return performanceData.filter(emp => 
      emp.HoTen.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTopDoctors = () => {
    return [...performanceData]
      .filter(emp => emp.ChucVu === 'Bác sĩ')
      .sort((a, b) => ((b.SoLanKham || 0) + (b.SoLanTiem || 0)) - ((a.SoLanKham || 0) + (a.SoLanTiem || 0)))
      .slice(0, 3);
  };

  const getTopSalesmen = () => {
    return [...performanceData]
      .filter(emp => emp.ChucVu === 'Nhân viên bán hàng')
      .sort((a, b) => (b.SoDonHang || 0) - (a.SoDonHang || 0))
      .slice(0, 3);
  };

  const getAverageRating = () => {
    return 4.6; // Mock: Điểm đánh giá chung cho chi nhánh
  };

  const getTotalReviews = () => {
    return performanceData.length * 15; // Mock: giả sử mỗi nhân viên có trung bình 15 đánh giá
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hiệu suất nhân viên</h2>
      </div>

      {/* Overall Rating Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Điểm đánh giá chung</h3>
            <p className="text-sm text-gray-600">Đánh giá trung bình từ khách hàng cho toàn bộ nhân viên</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-5xl font-bold text-yellow-500">⭐</span>
              <span className="text-5xl font-bold text-gray-900">{getAverageRating()}</span>
            </div>
            <p className="text-sm text-gray-500">
              Dựa trên {getTotalReviews()} đánh giá
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm nhân viên
            </label>
            <input
              type="text"
              placeholder="Nhập tên nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
              onClick={fetchPerformance}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      {performanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Bác sĩ */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Bác sĩ xuất sắc</h3>
            <div className="space-y-3">
              {getTopDoctors().map((emp, index) => (
                <div 
                  key={emp.MaNV} 
                  className={`p-4 rounded-lg flex items-center gap-4 ${
                    index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                    index === 1 ? 'bg-gray-50 border-2 border-gray-400' :
                    'bg-orange-50 border-2 border-orange-400'
                  }`}
                >
                  <p className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </p>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {emp.HoTen}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {emp.SoLanKham} lần khám • {emp.SoLanTiem} lần tiêm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Nhân viên bán hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Nhân viên bán hàng xuất sắc</h3>
            <div className="space-y-3">
              {getTopSalesmen().map((emp, index) => (
                <div 
                  key={emp.MaNV} 
                  className={`p-4 rounded-lg flex items-center gap-4 ${
                    index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                    index === 1 ? 'bg-gray-50 border-2 border-gray-400' :
                    'bg-orange-50 border-2 border-orange-400'
                  }`}
                >
                  <p className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </p>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {emp.HoTen}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {emp.SoDonHang} đơn hàng
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : getFilteredData().length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Không tìm thấy nhân viên phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chức vụ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lần khám
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lần tiêm
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đơn hàng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredData().map((emp) => (
                  <tr key={emp.MaNV} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.HoTen}</div>
                      <div className="text-sm text-gray-500">ID: {emp.MaNV}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        emp.ChucVu === 'Bác sĩ' ? 'bg-blue-100 text-blue-800' :
                        emp.ChucVu === 'Nhân viên bán hàng' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {emp.ChucVu}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {emp.ChucVu === 'Bác sĩ' ? (emp.SoLanKham || 0) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {emp.ChucVu === 'Bác sĩ' ? (emp.SoLanTiem || 0) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                      {emp.ChucVu === 'Nhân viên bán hàng' ? (emp.SoDonHang || 0) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePerformanceView;
