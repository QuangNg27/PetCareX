import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import {
  SearchIcon,
  CalendarIcon,
  UserIcon,
  PetIcon,
  RefreshIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardIcon
} from '@components/common/icons';

const AppointmentsView = () => {
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, examination, vaccination
  const [filterDate, setFilterDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleSearchCustomer = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      alert('Vui lòng nhập số điện thoại hợp lệ (10 số)');
      return;
    }

    setLoading(true);
    try {
      const response = await customerService.searchCustomers(searchPhone);
      if (response.success && response.data && response.data.length > 0) {
        const customer = response.data[0];
        setCustomerData(customer);
        await fetchCustomerAppointments(customer.MaKH);
      } else {
        alert('Không tìm thấy khách hàng với số điện thoại này');
        setCustomerData(null);
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      alert('Có lỗi khi tìm kiếm khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerAppointments = async (customerId) => {
    setLoading(true);
    try {
      // Lấy danh sách thú cưng của khách hàng
      const petsResponse = await customerService.getCustomerPets(customerId);
      const pets = petsResponse.success ? petsResponse.data : [];
      
      if (pets.length === 0) {
        alert('Khách hàng chưa có thú cưng nào');
        setAppointments([]);
        setFilteredAppointments([]);
        setLoading(false);
        return;
      }
      
      // Lấy lịch sử khám bệnh và tiêm phòng của tất cả thú cưng (dùng API cho staff)
      const allAppointments = [];
      for (const pet of pets) {
        const [medicalHistory, vaccHistory] = await Promise.all([
          customerService.pets.getStaffMedicalHistory(pet.MaTC),
          customerService.pets.getStaffVaccinationHistory(pet.MaTC)
        ]);
        
        if (medicalHistory.success && medicalHistory.data) {
          medicalHistory.data.forEach(exam => {
            allAppointments.push({
              type: 'examination',
              date: exam.NgayKham,
              appointmentId: exam.MaKB,
              petId: pet.MaTC,
              petName: pet.Ten,
              doctorName: exam.TenBacSi,
              serviceName: exam.TenDV,
              branchName: exam.TenCN,
              symptom: exam.TrieuChung,
              diagnosis: exam.ChanDoan,
              nextCheckup: exam.NgayTaiKham
            });
          });
        }
        
        if (vaccHistory.success && vaccHistory.data) {
          vaccHistory.data.forEach(vacc => {
            allAppointments.push({
              type: 'vaccination',
              date: vacc.NgayTiem,
              appointmentId: vacc.MaTP,
              petId: pet.MaTC,
              petName: pet.Ten,
              doctorName: vacc.TenBacSi,
              serviceName: vacc.TenDV,
              branchName: vacc.TenCN,
              packageId: vacc.MaGoi,
              discount: vacc.UuDai
            });
          });
        }
      }
      
      // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
      allAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(allAppointments);
      setFilteredAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Có lỗi khi tải lịch hẹn');
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever appointments, filterType, or filterDate changes
  React.useEffect(() => {
    let filtered = [...appointments];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(apt => apt.type === filterType);
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === filterDate;
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, filterType, filterDate]);

  const getTypeBadge = (type) => {
    if (type === 'examination') {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
          🩺 Khám bệnh
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
          💉 Tiêm phòng
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleRefresh = () => {
    if (customerData) {
      fetchCustomerAppointments(customerData.MaKH);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ClipboardIcon size={28} />
          Lịch sử khám chữa bệnh
        </h1>
        <p className="text-gray-600">
          Tra cứu và xem lịch sử khám bệnh và tiêm phòng của khách hàng
        </p>
      </div>

      {/* Customer Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tìm kiếm khách hàng
        </h3>
        <div className="flex gap-3">
          <input
            type="tel"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Nhập số điện thoại khách hàng (10 số)"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            maxLength={10}
          />
          <button
            onClick={handleSearchCustomer}
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <SearchIcon size={18} />
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
        
        {customerData && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircleIcon size={20} className="text-green-600" />
              Thông tin khách hàng
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Họ tên:</span>
                <span className="ml-2 font-medium text-gray-900">{customerData.HoTen}</span>
              </div>
              <div>
                <span className="text-gray-600">SĐT:</span>
                <span className="ml-2 font-medium text-gray-900">{customerData.SoDT}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium text-gray-900">{customerData.Email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Cấp độ:</span>
                <span className="ml-2 font-medium text-gray-900">{customerData.TenCapDo || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {customerData && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại dịch vụ
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="examination">Khám bệnh</option>
                  <option value="vaccination">Tiêm phòng</option>
                </select>
              </div>

              {/* Date filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày khám/tiêm
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshIcon size={18} />
                  Làm mới
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold">{filteredAppointments.length}</span> lịch hẹn
              </div>
            </div>
          </div>

          {/* Appointments List */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <ClipboardIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không có lịch hẹn nào
              </h3>
              <p className="text-gray-600">
                {filterDate || filterType !== 'all'
                  ? 'Không tìm thấy lịch sử phù hợp với bộ lọc'
                  : 'Khách hàng chưa có lịch sử khám chữa bệnh'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại dịch vụ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày khám/tiêm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thú cưng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => {
                      return (
                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.appointmentId}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {getTypeBadge(appointment.type)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={14} className="text-gray-400" />
                              {formatDate(appointment.date)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex flex-col">
                              <span className="flex items-center gap-1 font-medium">
                                <PetIcon size={14} className="text-gray-400" />
                                {appointment.petName || appointment.petId}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            <span className="flex items-center gap-1">
                              <UserIcon size={14} className="text-gray-400" />
                              {appointment.doctorName || 'Chưa có'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetail(appointment)}
                              className="text-primary-600 hover:text-primary-900 font-medium"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết lịch hẹn
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Mã lịch hẹn</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedAppointment.appointmentId}
                    </div>
                  </div>
                  <div>
                    {getTypeBadge(selectedAppointment.type)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ngày khám/tiêm</div>
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <CalendarIcon size={16} />
                      {formatDate(selectedAppointment.date)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Thú cưng</div>
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <PetIcon size={16} />
                      {selectedAppointment.petName || selectedAppointment.petId}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Bác sĩ</div>
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <UserIcon size={16} />
                      {selectedAppointment.doctorName || 'Chưa có'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Chi nhánh</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedAppointment.branchName || 'N/A'}
                    </div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {selectedAppointment.type === 'examination' ? 'Triệu chứng' : 'Ghi chú'}
                    </div>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedAppointment.notes}
                    </div>
                  </div>
                )}

                {selectedAppointment.diagnosis && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Chẩn đoán</div>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedAppointment.diagnosis}
                    </div>
                  </div>
                )}

                {selectedAppointment.ThuocDaDung && selectedAppointment.ThuocDaDung.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Thuốc đã dùng</div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <ul className="space-y-1">
                        {selectedAppointment.ThuocDaDung.map((med, idx) => (
                          <li key={idx} className="text-sm text-gray-900">
                            • {med.TenSP} - Số lượng: {med.SoLuong}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedAppointment.Vaccines && selectedAppointment.Vaccines.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Vaccine đã tiêm</div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <ul className="space-y-1">
                        {selectedAppointment.Vaccines.map((vac, idx) => (
                          <li key={idx} className="text-sm text-gray-900">
                            • {vac.TenVaccine} {vac.LieuLuong ? `- ${vac.LieuLuong}` : ''} ({vac.TrangThai})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
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
