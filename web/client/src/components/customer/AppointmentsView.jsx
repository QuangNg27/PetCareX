import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  CalendarIcon,
  PetIcon,
  MapPinIcon,
  ClipboardIcon,
  XIcon,
  EyeIcon,
  UserIcon,
  FilterIcon
} from '@components/common/icons';

const AppointmentsView = () => {
  const { appointments: cachedAppointments, fetchAppointments, pets: cachedPets } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterPet, setFilterPet] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    // If we have cached data, use it immediately
    if (cachedAppointments) {
      return;
    }

    // Otherwise, fetch fresh data
    try {
      setLoading(true);
      setError(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const appointments = cachedAppointments || [];
  const pets = cachedPets || [];

  // Get unique pets from appointments
  const uniquePets = useMemo(() => {
    const petMap = new Map();
    appointments.forEach(apt => {
      if (apt.TenThuCung) {
        petMap.set(apt.TenThuCung, apt.TenThuCung);
      }
    });
    return Array.from(petMap.values());
  }, [appointments]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Filter by pet
      if (filterPet !== 'all' && apt.TenThuCung !== filterPet) {
        return false;
      }

      // Filter by specific date
      if (filterDate) {
        const aptDate = new Date(apt.NgayHen).toISOString().split('T')[0];
        if (aptDate !== filterDate) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, filterPet, filterDate]);

  const handleClearFilters = () => {
    setFilterPet('all');
    setFilterDate('');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h2>
        <p className="text-sm text-gray-600 mt-1">
          Tổng số: {filteredAppointments.length} lịch hẹn
          {(filterPet !== 'all' || filterDate) && ` (đã lọc từ ${appointments.length})`}
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FilterIcon size={18} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter by Pet */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Thú cưng</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filterPet}
              onChange={(e) => setFilterPet(e.target.value)}
            >
              <option value="all">Tất cả thú cưng</option>
              {uniquePets.map((petName) => (
                <option key={petName} value={petName}>{petName}</option>
              ))}
            </select>
          </div>

          {/* Filter by Date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày cụ thể</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500">{error}</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <CalendarIcon size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500">
                {appointments.length === 0 ? 'Không có lịch hẹn nào' : 'Không tìm thấy lịch hẹn phù hợp với bộ lọc'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex">
                <div className="flex flex-col items-center justify-center px-6 py-4 bg-primary-50 border-r border-primary-100">
                  <div className="text-3xl font-bold text-primary-600">{new Date(appointment.NgayHen).getDate()}</div>
                  <div className="text-sm text-primary-700 font-medium">Tháng {new Date(appointment.NgayHen).getMonth() + 1}</div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{appointment.TenDichVu}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PetIcon size={16} className="text-gray-400" />
                          <span>{appointment.TenThuCung}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPinIcon size={16} className="text-gray-400" />
                          <span>{appointment.TenChiNhanh}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowDetails(true);
                      }}
                    >
                      <EyeIcon size={18} /> Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      )}

      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết lịch hẹn</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowDetails(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <ClipboardIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Mã lịch hẹn</span>
                  <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold">
                    {selectedAppointment.MaLichHen}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CalendarIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(selectedAppointment.NgayHen).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <ClipboardIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</span>
                  <span className="text-gray-900">{selectedAppointment.TenDichVu}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <PetIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Thú cưng</span>
                  <span className="text-gray-900">
                    {selectedAppointment.TenThuCung}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPinIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Chi nhánh</span>
                  <span className="text-gray-900">{selectedAppointment.TenChiNhanh}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <UserIcon size={18} className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</span>
                  <span className={selectedAppointment.TenBacSi === 'Chưa cập nhật' ? 'text-gray-400 italic' : 'text-gray-900'}>
                    {selectedAppointment.TenBacSi}
                  </span>
                </div>
              </div>

              {selectedAppointment.Thuoc && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <ClipboardIcon size={18} className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Thuốc</span>
                    <span className={selectedAppointment.Thuoc === 'Chưa cập nhật' ? 'text-gray-400 italic' : 'text-gray-900'}>
                      {selectedAppointment.Thuoc}
                    </span>
                  </div>
                </div>
              )}

              {selectedAppointment.GoiTiem && (
                <>
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                    <ClipboardIcon size={18} className="text-primary-600 mt-0.5" />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-primary-900 mb-1">Gói tiêm</span>
                      <div className="font-semibold text-primary-800 mb-1">Gói tiêm {selectedAppointment.GoiTiem.MaGoi || 'N/A'}</div>
                      {selectedAppointment.GoiTiem.UuDai != null && selectedAppointment.GoiTiem.UuDai > 0 && (
                        <div className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                          Ưu đãi {(selectedAppointment.GoiTiem.UuDai * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <ClipboardIcon size={18} className="text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-gray-700 mb-3">Vaccine</span>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-2 gap-px bg-gray-200">
                          <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-700">Tên vaccine</div>
                          <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-700">Liều lượng</div>
                        </div>
                        {selectedAppointment.GoiTiem.CacVacxin.map((vaccine, index) => (
                          <div key={index} className="grid grid-cols-2 gap-px bg-gray-200">
                            <div className="px-4 py-3 bg-white text-sm text-gray-900">{vaccine.TenVaccine}</div>
                            <div className={`px-4 py-3 bg-white text-sm ${vaccine.LieuLuong === 'Chưa cập nhật' ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                              {vaccine.LieuLuong}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setShowDetails(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsView;
