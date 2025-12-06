import React, { useState } from 'react';
import { 
  ShieldIcon,
  CheckIcon,
  XIcon,
  PetIcon,
  CalendarIcon,
  PlusIcon
} from '@components/common/icons';
import './VaccinationPackagesView.css';

const VaccinationPackagesView = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [vaccineSearch, setVaccineSearch] = useState('');
  const [vaccineDates, setVaccineDates] = useState({});

  // Danh sách gói tiêm đã đăng ký
  const packages = [
    {
      id: 1,
      TenGoi: 'Gói tiêm cơ bản',
      TenThuCung: 'Max',
      LoaiThuCung: 'Chó Golden Retriever',
      NgayDangKy: '2024-01-15',
      UuDai: '10%',
      TrangThai: 'Đang thực hiện',
      SoMuiHoanThanh: 2,
      TongSoMui: 3,
      CacVacxin: [
        { id: 1, TenVaccine: 'Vaccine phòng dại (Rabies)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-01-20' },
        { id: 2, TenVaccine: 'Vaccine 5 bệnh (DHPPL)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-02-20' },
        { id: 3, TenVaccine: 'Vaccine Parvo', LieuLuong: '1ml', TrangThai: 'Chưa tiêm', NgayTiem: null }
      ]
    },
    {
      id: 2,
      TenGoi: 'Gói tiêm nâng cao',
      TenThuCung: 'Luna',
      LoaiThuCung: 'Mèo Ba Tư',
      NgayDangKy: '2024-02-10',
      UuDai: '15%',
      TrangThai: 'Đang thực hiện',
      SoMuiHoanThanh: 1,
      TongSoMui: 5,
      CacVacxin: [
        { id: 1, TenVaccine: 'Vaccine phòng dại (Rabies)', LieuLuong: '0.5ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-02-15' },
        { id: 2, TenVaccine: 'Vaccine 5 bệnh (DHPPL)', LieuLuong: '1ml', TrangThai: 'Chưa tiêm', NgayTiem: null },
        { id: 3, TenVaccine: 'Vaccine 7 bệnh (DHPPI+LR)', LieuLuong: '1ml', TrangThai: 'Chưa tiêm', NgayTiem: null },
        { id: 4, TenVaccine: 'Vaccine Care (Canine)', LieuLuong: '1ml', TrangThai: 'Chưa tiêm', NgayTiem: null },
        { id: 5, TenVaccine: 'Vaccine Parvo', LieuLuong: '1ml', TrangThai: 'Chưa tiêm', NgayTiem: null }
      ]
    },
    {
      id: 3,
      TenGoi: 'Gói tiêm toàn diện',
      TenThuCung: 'Max',
      LoaiThuCung: 'Chó Golden Retriever',
      NgayDangKy: '2023-12-01',
      UuDai: '20%',
      TrangThai: 'Hoàn thành',
      SoMuiHoanThanh: 7,
      TongSoMui: 7,
      CacVacxin: [
        { id: 1, TenVaccine: 'Vaccine phòng dại (Rabies)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2023-12-05' },
        { id: 2, TenVaccine: 'Vaccine 5 bệnh (DHPPL)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-01-05' },
        { id: 3, TenVaccine: 'Vaccine 7 bệnh (DHPPI+LR)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-02-05' },
        { id: 4, TenVaccine: 'Vaccine Care (Canine)', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-03-05' },
        { id: 5, TenVaccine: 'Vaccine Parvo', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-04-05' },
        { id: 6, TenVaccine: 'Vaccine Distemper', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-05-05' },
        { id: 7, TenVaccine: 'Vaccine Hepatitis', LieuLuong: '1ml', TrangThai: 'Đã tiêm', NgayTiem: '2024-06-05' }
      ]
    }
  ];

  const handleViewDetail = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

  // Danh sách gói tiêm có thể đăng ký
  const availableVaccines = [
    { id: 1, name: 'Vaccine phòng dại (Rabies)' },
    { id: 2, name: 'Vaccine 5 bệnh (DHPPL)' },
    { id: 3, name: 'Vaccine 7 bệnh (DHPPI+LR)' },
    { id: 4, name: 'Vaccine Care (Canine)' },
    { id: 5, name: 'Vaccine Parvo' },
    { id: 6, name: 'Vaccine Distemper' },
    { id: 7, name: 'Vaccine Hepatitis' }
  ];

  const durations = [
    { value: '6', label: '6 tháng', discount: '5%' },
    { value: '12', label: '12 tháng', discount: '10%' },
    { value: '18', label: '18 tháng', discount: '15%' }
  ];

  const handleVaccineToggle = (vaccineId) => {
    if (selectedVaccines.includes(vaccineId)) {
      setSelectedVaccines(selectedVaccines.filter(id => id !== vaccineId));
      const newDates = { ...vaccineDates };
      delete newDates[vaccineId];
      setVaccineDates(newDates);
    } else {
      setSelectedVaccines([...selectedVaccines, vaccineId]);
    }
  };

  const handleDateChange = (vaccineId, date) => {
    setVaccineDates({
      ...vaccineDates,
      [vaccineId]: date
    });
  };

  // Tính toán ngày min và max dựa trên duration
  const getDateLimits = () => {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    
    if (!selectedDuration) {
      return { minDate, maxDate: null };
    }
    
    const months = parseInt(selectedDuration);
    const maxDateObj = new Date(today);
    maxDateObj.setMonth(maxDateObj.getMonth() + months);
    const maxDate = maxDateObj.toISOString().split('T')[0];
    
    return { minDate, maxDate };
  };

  const filteredVaccines = availableVaccines.filter(vaccine =>
    vaccine.name.toLowerCase().includes(vaccineSearch.toLowerCase())
  );

  return (
    <div className="vaccination-packages-view">
      <div className="packages-header">
        <div className="header-info">
          <h2>Gói tiêm phòng</h2>
          <p className="packages-count">{packages.length} gói đã đăng ký</p>
        </div>
        <button className="register-package-btn" onClick={() => setShowRegisterModal(true)}>
          <PlusIcon size={18} /> Đăng ký gói tiêm
        </button>
      </div>

      <div className="packages-list">
        {packages.map(pkg => (
          <div key={pkg.id} className={`package-card ${pkg.TrangThai === 'Hoàn thành' ? 'completed' : ''}`}>
            <div className="package-header">
              <div className="package-icon">
                <ShieldIcon size={24} />
              </div>
              <div className="package-info">
                <h3>{pkg.TenGoi}</h3>
                <p className="package-pet">
                  <PetIcon size={14} /> {pkg.TenThuCung} - {pkg.LoaiThuCung}
                </p>
              </div>
              <div className={`package-status ${pkg.TrangThai === 'Hoàn thành' ? 'completed' : 'active'}`}>
                {pkg.TrangThai}
              </div>
            </div>

            <div className="package-body">
              <div className="package-progress">
                <div className="progress-info">
                  <span>Tiến độ</span>
                  <span className="progress-fraction">{pkg.SoMuiHoanThanh}/{pkg.TongSoMui} mũi</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(pkg.SoMuiHoanThanh / pkg.TongSoMui) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="package-meta">
                <div className="meta-item">
                  <CalendarIcon size={14} />
                  <span>Đăng ký: {new Date(pkg.NgayDangKy).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="meta-item discount">
                  <span className="discount-badge">Giảm {pkg.UuDai}</span>
                </div>
              </div>
            </div>

            <div className="package-footer">
              <button className="view-detail-btn" onClick={() => handleViewDetail(pkg)}>
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPackage && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết gói tiêm - {selectedPackage.TenGoi}</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="package-detail-info">
                <div className="detail-row">
                  <span className="detail-label">Thú cưng:</span>
                  <span className="detail-value">{selectedPackage.TenThuCung} - {selectedPackage.LoaiThuCung}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ngày đăng ký:</span>
                  <span className="detail-value">{new Date(selectedPackage.NgayDangKy).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ưu đãi:</span>
                  <span className="detail-value discount">Giảm {selectedPackage.UuDai}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className={`detail-value status ${selectedPackage.TrangThai === 'Hoàn thành' ? 'completed' : 'active'}`}>
                    {selectedPackage.TrangThai}
                  </span>
                </div>
              </div>

              <div className="vaccines-detail">
                <h4>Danh sách mũi tiêm</h4>
                <table className="vaccine-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên vaccine</th>
                      <th>Liều lượng</th>
                      <th>Ngày tiêm</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPackage.CacVacxin.map((vaccine, index) => (
                      <tr key={vaccine.id} className={vaccine.TrangThai === 'Đã tiêm' ? 'completed' : ''}>
                        <td>{index + 1}</td>
                        <td>{vaccine.TenVaccine}</td>
                        <td>{vaccine.LieuLuong}</td>
                        <td>{vaccine.NgayTiem ? new Date(vaccine.NgayTiem).toLocaleDateString('vi-VN') : 'Chưa tiêm'}</td>
                        <td>
                          <span className={`vaccine-status ${vaccine.TrangThai === 'Đã tiêm' ? 'completed' : 'pending'}`}>
                            {vaccine.TrangThai === 'Đã tiêm' ? <CheckIcon size={14} /> : '—'}
                            {vaccine.TrangThai}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setShowDetailModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Package Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đăng ký gói tiêm phòng</h3>
              <button className="close-btn" onClick={() => setShowRegisterModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-section">
                <label>Chọn thú cưng *</label>
                <select className="form-input">
                  <option value="">Chọn thú cưng</option>
                  <option value="1">Max</option>
                  <option value="2">Luna</option>
                  <option value="3">Bunny</option>
                </select>
              </div>

              <div className="vaccines-selection">
                <h4>Chọn các mũi tiêm (tối thiểu 1 mũi)</h4>
                <div className="vaccine-search">
                  <input 
                    type="text" 
                    className="form-input search-input"
                    placeholder="Tìm kiếm và chọn vaccine..."
                    value={vaccineSearch}
                    onChange={(e) => setVaccineSearch(e.target.value)}
                  />
                  
                  {vaccineSearch && (
                    <div className="vaccine-dropdown">
                      {filteredVaccines
                        .filter(v => !selectedVaccines.includes(v.id))
                        .map(vaccine => (
                          <div 
                            key={vaccine.id} 
                            className="vaccine-dropdown-item"
                            onClick={() => {
                              handleVaccineToggle(vaccine.id);
                              setVaccineSearch('');
                            }}
                          >
                            {vaccine.name}
                          </div>
                        ))
                      }
                      {filteredVaccines.filter(v => !selectedVaccines.includes(v.id)).length === 0 && (
                        <div className="vaccine-dropdown-empty">Không tìm thấy vaccine</div>
                      )}
                    </div>
                  )}
                </div>

                {selectedVaccines.length > 0 && (
                  <div className="selected-vaccines">
                    <div className="selected-vaccines-header">
                      <span>Đã chọn {selectedVaccines.length} mũi tiêm - Chỉ định ngày tiêm:</span>
                      {!selectedDuration && (
                        <span className="warning-text">⚠ Chọn thời gian gói tiêm để giới hạn ngày</span>
                      )}
                    </div>
                    <div className="selected-vaccines-list">
                      {selectedVaccines.map(vaccineId => {
                        const vaccine = availableVaccines.find(v => v.id === vaccineId);
                        const { minDate, maxDate } = getDateLimits();
                        return (
                          <div key={vaccineId} className="selected-vaccine-item">
                            <div className="vaccine-item-header">
                              <span className="vaccine-item-name">{vaccine.name}</span>
                              <button 
                                type="button"
                                className="remove-vaccine-btn"
                                onClick={() => handleVaccineToggle(vaccineId)}
                              >
                                <XIcon size={14} />
                              </button>
                            </div>
                            <input 
                              type="date"
                              className="form-input vaccine-date-input"
                              value={vaccineDates[vaccineId] || ''}
                              onChange={(e) => handleDateChange(vaccineId, e.target.value)}
                              min={minDate}
                              max={maxDate || ''}
                              placeholder="Chọn ngày tiêm"
                              disabled={!selectedDuration}
                            />
                            {selectedDuration && (
                              <small className="date-hint">
                                Từ hôm nay đến {new Date(maxDate).toLocaleDateString('vi-VN')}
                              </small>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="duration-selection">
                <h4>Chọn thời gian gói tiêm *</h4>
                <p className="duration-note">Lưu ý: Chọn thời gian gói trước để giới hạn ngày tiêm trong khoảng thời gian</p>
                <div className="duration-options">
                  {durations.map(duration => (
                    <label key={duration.value} className="duration-option">
                      <input 
                        type="radio" 
                        name="duration" 
                        value={duration.value}
                        checked={selectedDuration === duration.value}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                      />
                      <div className="duration-option-content">
                        <div className="duration-label">{duration.label}</div>
                        <div className="duration-discount">Giảm {duration.discount}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedVaccines.length > 0 && selectedDuration && (
                <div className="package-summary">
                  <h4>Tóm tắt gói đăng ký</h4>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span>Số mũi tiêm:</span>
                      <strong>{selectedVaccines.length} mũi</strong>
                    </div>
                    <div className="summary-row">
                      <span>Thời gian:</span>
                      <strong>{durations.find(d => d.value === selectedDuration)?.label}</strong>
                    </div>
                    <div className="summary-row highlight">
                      <span>Ưu đãi:</span>
                      <strong className="discount-text">Giảm {durations.find(d => d.value === selectedDuration)?.discount}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowRegisterModal(false)}>
                Hủy
              </button>
              <button className="confirm-btn">
                <CheckIcon size={18} /> Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationPackagesView;
