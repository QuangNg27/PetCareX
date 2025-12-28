import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';

const EmployeePerformanceView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN;
  
  const [performanceData, setPerformanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    fetchPerformance();
    if (branchId) {
      fetchRatingStats();
    }
  }, [branchId]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const data = await branchManagerService.getEmployeePerformance();
      console.log('Employee performance data:', data);
      setPerformanceData(data.performance || []);
    } catch (error) {
      console.error('Lỗi khi tải hiệu suất nhân viên:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const response = await branchManagerService.getBranchRatingStats(branchId);
      console.log('Rating stats:', response);
      setRatingStats(response.data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê đánh giá:', error);
    }
  };

  const getFilteredData = () => {
    return performanceData.filter(emp => {
      const matchesName = emp.HoTen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = positionFilter === '' || emp.ChucVu === positionFilter;
      return matchesName && matchesPosition;
    });
  };

  const getAverageRating = () => {
    if (!ratingStats) return 0;
    return parseFloat(ratingStats.DiemTongTB || 0).toFixed(1);
  };

  const getTotalReviews = () => {
    return ratingStats?.TongSoDanhGia || 0;
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Điểm đánh giá chi nhánh</h3>
            <p className="text-sm text-gray-600">Đánh giá từ khách hàng</p>
            {ratingStats && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-600">Chất lượng dịch vụ: <span className="font-semibold">{ratingStats.DiemChatLuongTB?.toFixed(1) || 0}/5</span></p>
                <p className="text-xs text-gray-600">Thái độ nhân viên: <span className="font-semibold">{ratingStats.ThaiDoNVTB?.toFixed(1) || 0}/5</span></p>
                <p className="text-xs text-gray-600">Mức độ hài lòng: <span className="font-semibold">{ratingStats.MucDoHaiLongTB?.toFixed(1) || 0}/5</span></p>
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-5xl font-bold text-yellow-500">⭐</span>
              <span className="text-5xl font-bold text-gray-900">{getAverageRating()}</span>
            </div>
            <p className="text-sm text-gray-500">
              {getTotalReviews() > 0 ? `${getTotalReviews()} đánh giá` : 'Chưa có đánh giá'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
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
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chức vụ
            </label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="Bác sĩ">Bác sĩ</option>
              <option value="Bán hàng">Bán hàng</option>
              <option value="Tiếp tân">Tiếp tân</option>
            </select>
          </div>
          <button
            onClick={fetchPerformance}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Làm mới
          </button>
        </div>
      </div>

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
              <thead className="bg-gray-50 sticky top-0 z-10">
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
                      {emp.SoLuotKhamBenh || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {emp.SoLuotTiemPhong || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                      {emp.SoDonHang || 0}
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
