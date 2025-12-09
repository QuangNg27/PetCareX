import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { CalendarIcon, PetIcon } from '@components/common/icons';

const VaccinationListView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN || 1;
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vaccinatedPets, setVaccinatedPets] = useState([
    { MaTC: 1, TenTC: 'Lucky', Loai: 'Chó', Giong: 'Golden Retriever', TenChuNhan: 'Nguyễn Văn A', TenVacXin: 'Rabies', NgayTiem: '2024-12-05', TenBacSi: 'BS. Trần Minh' },
    { MaTC: 2, TenTC: 'Mimi', Loai: 'Mèo', Giong: 'Ba Tư', TenChuNhan: 'Trần Thị B', TenVacXin: 'FVRCP', NgayTiem: '2024-12-06', TenBacSi: 'BS. Lê Hương' },
    { MaTC: 3, TenTC: 'Max', Loai: 'Chó', Giong: 'Husky', TenChuNhan: 'Lê Văn C', TenVacXin: 'DHPP', NgayTiem: '2024-12-07', TenBacSi: 'BS. Trần Minh' },
    { MaTC: 4, TenTC: 'Bella', Loai: 'Chó', Giong: 'Poodle', TenChuNhan: 'Phạm Thị D', TenVacXin: 'Rabies', NgayTiem: '2024-12-08', TenBacSi: 'BS. Nguyễn An' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchVaccinatedPets = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockPets = [
        { MaTC: 1, TenTC: 'Lucky', Loai: 'Chó', Giong: 'Golden Retriever', TenChuNhan: 'Nguyễn Văn A', TenVacXin: 'Rabies', NgayTiem: '2024-12-05', TenBacSi: 'BS. Trần Minh' },
        { MaTC: 2, TenTC: 'Mimi', Loai: 'Mèo', Giong: 'Ba Tư', TenChuNhan: 'Trần Thị B', TenVacXin: 'FVRCP', NgayTiem: '2024-12-06', TenBacSi: 'BS. Lê Hương' },
        { MaTC: 3, TenTC: 'Max', Loai: 'Chó', Giong: 'Husky', TenChuNhan: 'Lê Văn C', TenVacXin: 'DHPP', NgayTiem: '2024-12-07', TenBacSi: 'BS. Trần Minh' },
        { MaTC: 4, TenTC: 'Bella', Loai: 'Chó', Giong: 'Poodle', TenChuNhan: 'Phạm Thị D', TenVacXin: 'Rabies', NgayTiem: '2024-12-08', TenBacSi: 'BS. Nguyễn An' },
      ];
      setVaccinatedPets(mockPets);
      // const data = await branchManagerService.getVaccinatedPets(branchId, startDate, endDate);
      // setVaccinatedPets(data.data.pets || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách thú cưng tiêm phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách thú cưng được tiêm phòng</h2>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onClick={fetchVaccinatedPets}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">Tổng số thú cưng đã tiêm</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{vaccinatedPets.length}</p>
          </div>
          <CalendarIcon className="h-12 w-12 text-green-500" />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Từ {new Date(startDate).toLocaleDateString('vi-VN')} đến {new Date(endDate).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* Vaccinated Pets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : vaccinatedPets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <PetIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Không có thú cưng nào được tiêm phòng trong kỳ này</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã TC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên thú cưng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giống
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vắc-xin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tiêm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaccinatedPets.map((pet, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pet.MaTC}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.TenTC}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.Loai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.Giong}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.TenChuNhan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.TenVacXin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.NgayTiem ? new Date(pet.NgayTiem).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pet.TenBacSi || 'N/A'}
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

export default VaccinationListView;
