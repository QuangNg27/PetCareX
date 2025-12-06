import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  CalendarIcon,
  PetIcon,
  MapPinIcon,
  ClipboardIcon,
  XIcon,
  EyeIcon,
  UserIcon
} from '@components/common/icons';
import './AppointmentsView.css';

const AppointmentsView = () => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      MaLichHen: 'KB001',
      NgayHen: '2025-12-15',
      TenDichVu: 'Khám sức khỏe định kỳ',
      TenThuCung: 'Max',
      LoaiThuCung: 'Chó',
      TenChiNhanh: '123 Nguyễn Huệ, Q.1',
      DiaChiChiNhanh: '123 Nguyễn Huệ, Q.1',
      TrangThai: 'Đã xác nhận',
      GhiChu: '',
      TenBacSi: 'Chưa cập nhật',
      Thuoc: 'Chưa cập nhật'
    },
    {
      id: 2,
      MaLichHen: 'TP002',
      NgayHen: '2025-12-20',
      TenDichVu: 'Tiêm phòng',
      TenThuCung: 'Luna',
      LoaiThuCung: 'Mèo',
      TenChiNhanh: '456 Lê Văn Sỹ, Q.3',
      DiaChiChiNhanh: '456 Lê Văn Sỹ, Q.3',
      TrangThai: 'Chờ xác nhận',
      GhiChu: '',
      TenBacSi: 'Chưa cập nhật',
      GoiTiem: {
        TenGoi: 'Gói tiêm phòng cơ bản cho mèo',
        CacVacxin: [
          { TenVaccine: 'Vắc-xin phòng bệnh dại', LieuLuong: 'Chưa cập nhật' },
          { TenVaccine: 'Vắc-xin phòng cúm mèo', LieuLuong: 'Chưa cập nhật' },
          { TenVaccine: 'Vắc-xin phòng giun đũa', LieuLuong: 'Chưa cập nhật' }
        ],
        UuDai: '15%'
      }
    },
    {
      id: 3,
      MaLichHen: 'DV003',
      NgayHen: '2025-11-10',
      TenDichVu: 'Tắm và cắt tỉa lông',
      TenThuCung: 'Max',
      LoaiThuCung: 'Chó',
      TenChiNhanh: '123 Nguyễn Huệ, Q.1',
      DiaChiChiNhanh: '123 Nguyễn Huệ, Q.1',
      TrangThai: 'Hoàn thành',
      GhiChu: '',
      TenBacSi: 'Chưa cập nhật'
    }
  ]);

  const getStatusClass = (status) => {
    const statusMap = {
      'Đã xác nhận': 'confirmed',
      'Chờ xác nhận': 'pending',
      'Hoàn thành': 'completed',
      'Đã hủy': 'cancelled'
    };
    return statusMap[status] || 'pending';
  };

  const getPetColor = (type) => {
    const colors = {
      'Chó': 'dog',
      'Mèo': 'cat',
      'Thỏ': 'rabbit',
      'Chim': 'bird'
    };
    return colors[type] || 'other';
  };

  return (
    <div className="appointments-view">
      <div className="appointments-header">
        <div className="header-info">
          <h2>Quản lý lịch hẹn</h2>
          <p className="appointments-count">Tổng số: {appointments.length} lịch hẹn</p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon size={64} />
            <p>Không có lịch hẹn nào</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-date-badge">
                <div className="date-day">{new Date(appointment.NgayHen).getDate()}</div>
                <div className="date-month">Tháng {new Date(appointment.NgayHen).getMonth() + 1}</div>
              </div>

              <div className="appointment-content">
                <div className="appointment-main">
                  <h3>{appointment.TenDichVu}</h3>
                  <div className="appointment-details">
                    <div className="detail-item">
                      <PetIcon size={16} />
                      <span>{appointment.TenThuCung} - {appointment.LoaiThuCung}</span>
                    </div>
                    <div className="detail-item">
                      <MapPinIcon size={16} />
                      <span>{appointment.TenChiNhanh}</span>
                    </div>
                    {appointment.GhiChu && (
                      <div className="detail-item">
                        <ClipboardIcon size={16} />
                        <span>{appointment.GhiChu}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="appointment-actions">
                  <button 
                    className="view-details-btn"
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
          ))
        )}
      </div>

      {/* View Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết lịch hẹn</h3>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-section">
                <div className="detail-row">
                  <div className="detail-label">
                    <ClipboardIcon size={18} />
                    <span>Mã lịch hẹn</span>
                  </div>
                  <div className="detail-value">
                    <span className="appointment-code">{selectedAppointment.MaLichHen}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">
                    <CalendarIcon size={18} />
                    <span>Ngày hẹn</span>
                  </div>
                  <div className="detail-value">
                    {new Date(selectedAppointment.NgayHen).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">
                    <ClipboardIcon size={18} />
                    <span>Dịch vụ</span>
                  </div>
                  <div className="detail-value">{selectedAppointment.TenDichVu}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">
                    <PetIcon size={18} />
                    <span>Thú cưng</span>
                  </div>
                  <div className="detail-value">
                    {selectedAppointment.TenThuCung} ({selectedAppointment.LoaiThuCung})
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">
                    <MapPinIcon size={18} />
                    <span>Chi nhánh</span>
                  </div>
                  <div className="detail-value">
                    {selectedAppointment.TenChiNhanh}
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">
                    <UserIcon size={18} />
                    <span>Bác sĩ</span>
                  </div>
                  <div className="detail-value">
                    <span className={selectedAppointment.TenBacSi === 'Chưa cập nhật' ? 'not-updated' : ''}>
                      {selectedAppointment.TenBacSi}
                    </span>
                  </div>
                </div>

                {selectedAppointment.Thuoc && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <ClipboardIcon size={18} />
                      <span>Thuốc</span>
                    </div>
                    <div className="detail-value">
                      <span className={selectedAppointment.Thuoc === 'Chưa cập nhật' ? 'not-updated' : ''}>
                        {selectedAppointment.Thuoc}
                      </span>
                    </div>
                  </div>
                )}

                {selectedAppointment.GhiChu && (
                  <div className="detail-row">
                    <div className="detail-label">
                      <ClipboardIcon size={18} />
                      <span>Ghi chú</span>
                    </div>
                    <div className="detail-value">{selectedAppointment.GhiChu}</div>
                  </div>
                )}

                {selectedAppointment.GoiTiem && (
                  <>
                    <div className="detail-row">
                      <div className="detail-label">
                        <ClipboardIcon size={18} />
                        <span>Gói tiêm</span>
                      </div>
                      <div className="detail-value">
                        <div className="package-name">{selectedAppointment.GoiTiem.TenGoi}</div>
                        <div className="package-discount">Ưu đãi {selectedAppointment.GoiTiem.UuDai}</div>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">
                        <ClipboardIcon size={18} />
                        <span>Vaccine</span>
                      </div>
                      <div className="detail-value">
                        <div className="vaccine-table">
                          <div className="vaccine-header">
                            <div className="vaccine-header-name">Tên vaccine</div>
                            <div className="vaccine-header-dosage">Liều lượng</div>
                          </div>
                          {selectedAppointment.GoiTiem.CacVacxin.map((vaccine, index) => (
                            <div key={index} className="vaccine-row">
                              <div className="vaccine-name">{vaccine.TenVaccine}</div>
                              <div className={`vaccine-dosage ${vaccine.LieuLuong === 'Chưa cập nhật' ? 'not-updated' : ''}`}>
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
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowDetails(false)}>
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
