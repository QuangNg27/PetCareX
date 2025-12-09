import React, { useState } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { SearchIcon, ClockIcon, FileTextIcon } from '@components/common/icons';

const PetHistoryView = () => {
  const [petId, setPetId] = useState('');
  const [petHistory, setPetHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!petId) {
      setError('Vui lòng nhập mã thú cưng');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Mock data
      const mockHistory = {
        pet: {
          MaTC: petId,
          Ten: 'Lucky',
          Loai: 'Chó',
          Giong: 'Golden Retriever',
          GioiTinh: 'Đực',
          NgaySinh: '2020-05-15',
          TenChuNhan: 'Nguyễn Văn A',
          SoDT: '0901234567'
        },
        medicalHistory: [
          { MaKB: 1, NgayKham: '2024-12-01', TrieuChung: 'Ho, sốt nhẹ', ChanDoan: 'Viêm đường hô hấp', TenBacSi: 'BS. Trần Minh', ChiPhi: 250000 },
          { MaKB: 2, NgayKham: '2024-11-15', TrieuChung: 'Tiêu chảy', ChanDoan: 'Rối loạn tiêu hóa', TenBacSi: 'BS. Lê Hương', ChiPhi: 180000 },
          { MaKB: 3, NgayKham: '2024-10-20', TrieuChung: 'Khám định kỳ', ChanDoan: 'Khỏe mạnh', TenBacSi: 'BS. Trần Minh', ChiPhi: 150000 },
          { MaKB: 4, NgayKham: '2024-09-10', TrieuChung: 'Da ngứa, rụng lông', ChanDoan: 'Viêm da dị ứng', TenBacSi: 'BS. Nguyễn An', ChiPhi: 320000 },
          { MaKB: 5, NgayKham: '2024-08-05', TrieuChung: 'Sưng chân', ChanDoan: 'Nhiễm trùng vết thương', TenBacSi: 'BS. Lê Hương', ChiPhi: 280000 },
        ],
        vaccinationHistory: [
          { MaTP: 1, NgayTiem: '2024-12-05', TenVacXin: 'Vaccine dại', LoaiVacXin: 'Phòng bệnh dại', TenBacSi: 'BS. Nguyễn An', NgayTaiKham: '2025-12-05', TrangThai: 'Đã tiêm' },
          { MaTP: 2, NgayTiem: '2024-11-10', TenVacXin: 'Vaccine 7 bệnh', LoaiVacXin: 'Phòng bệnh tổng hợp', TenBacSi: 'BS. Trần Minh', NgayTaiKham: '2025-11-10', TrangThai: 'Đã tiêm' },
          { MaTP: 3, NgayTiem: '2024-06-15', TenVacXin: 'Vaccine dại', LoaiVacXin: 'Phòng bệnh dại', TenBacSi: 'BS. Lê Hương', NgayTaiKham: '2025-06-15', TrangThai: 'Đã tiêm' },
          { MaTP: 4, NgayTiem: '2024-05-20', TenVacXin: 'Vaccine 5 bệnh', LoaiVacXin: 'Phòng bệnh tổng hợp', TenBacSi: 'BS. Nguyễn An', NgayTaiKham: null, TrangThai: 'Đã tiêm' },
        ]
      };
      
      setPetHistory(mockHistory);
      
      // const data = await branchManagerService.getPetHistory(petId);
      // setPetHistory(data.data);
    } catch (err) {
      setError('Không tìm thấy thông tin thú cưng');
      setPetHistory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lịch sử khám & tiêm chủng thú cưng</h2>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập mã thú cưng..."
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Pet Information */}
      {petHistory && (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin thú cưng</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Tên</p>
                <p className="font-semibold text-gray-900">{petHistory.pet?.Ten}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Loại</p>
                <p className="font-semibold text-gray-900">{petHistory.pet?.Loai}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giống</p>
                <p className="font-semibold text-gray-900">{petHistory.pet?.Giong}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tuổi</p>
                <p className="font-semibold text-gray-900">
                  {petHistory.pet?.NgaySinh 
                    ? Math.floor((new Date() - new Date(petHistory.pet.NgaySinh)) / (365.25 * 24 * 60 * 60 * 1000)) + ' tuổi'
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Lịch sử khám bệnh
              </h3>
            </div>
            {petHistory.medicalHistory && petHistory.medicalHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày khám
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triệu chứng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chẩn đoán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {petHistory.medicalHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.NgayKham).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {record.TrieuChung || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {record.ChanDoan || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.TenBacSi || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có lịch sử khám bệnh</p>
              </div>
            )}
          </div>

          {/* Vaccination History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Lịch sử tiêm chủng
              </h3>
            </div>
            {petHistory.vaccinationHistory && petHistory.vaccinationHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tiêm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vắc-xin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ thực hiện
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {petHistory.vaccinationHistory.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.NgayTiem).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.TenVacXin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.LoaiVacXin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.TenBacSi || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.TrangThai || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có lịch sử tiêm chủng</p>
              </div>
            )}
          </div>

          {/* Vaccination Packages */}
          {petHistory.vaccinationPackages && petHistory.vaccinationPackages.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Gói tiêm chủng</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên gói
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đăng ký
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số mũi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đã tiêm
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá gói
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {petHistory.vaccinationPackages.map((pkg, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pkg.TenGoi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(pkg.NgayDangKy).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pkg.SoMui}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pkg.DaTiem || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {pkg.GiaGoi?.toLocaleString('vi-VN')} VNĐ
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

export default PetHistoryView;
