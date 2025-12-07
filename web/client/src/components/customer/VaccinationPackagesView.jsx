import React, { useState, useMemo } from 'react';
import { 
  ShieldIcon,
  CheckIcon,
  XIcon,
  PetIcon,
  CalendarIcon,
  PlusIcon
} from '@components/common/icons';

// Constants
const AVAILABLE_VACCINES = [
  { id: 1, name: 'Vaccine phòng dại (Rabies)' },
  { id: 2, name: 'Vaccine 5 bệnh (DHPPL)' },
  { id: 3, name: 'Vaccine 7 bệnh (DHPPI+LR)' },
  { id: 4, name: 'Vaccine Care (Canine)' },
  { id: 5, name: 'Vaccine Parvo' },
  { id: 6, name: 'Vaccine Distemper' },
  { id: 7, name: 'Vaccine Hepatitis' }
];

const DURATIONS = [
  { value: '6', label: '6 tháng', discount: '5%' },
  { value: '12', label: '12 tháng', discount: '10%' },
  { value: '18', label: '18 tháng', discount: '15%' }
];

const MOCK_PACKAGES = [
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

const VaccinationPackagesView = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [vaccineSearch, setVaccineSearch] = useState('');
  const [vaccineDates, setVaccineDates] = useState({});

  const packages = MOCK_PACKAGES;

  const handleViewDetail = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailModal(true);
  };

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
    setVaccineDates(prev => ({
      ...prev,
      [vaccineId]: date
    }));
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

  // Memoized filtered vaccines
  const filteredVaccines = useMemo(() => 
    AVAILABLE_VACCINES.filter(vaccine =>
      vaccine.name.toLowerCase().includes(vaccineSearch.toLowerCase())
    ),
    [vaccineSearch]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="pb-4 border-b-2 border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-0.5">Gói tiêm phòng</h2>
          <p className="text-sm text-gray-600">{packages.length} gói đã đăng ký</p>
        </div>
        <button 
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-success-500 to-success-600 text-white text-sm font-semibold rounded-lg shadow-lg shadow-success-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-success-500/40 transition-all duration-300"
          onClick={() => setShowRegisterModal(true)}
        >
          <PlusIcon size={18} /> Đăng ký gói tiêm
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {packages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              pkg.TrangThai === 'Hoàn thành' 
                ? 'border-success-300 bg-gradient-to-b from-success-50 to-white hover:border-success-400' 
                : 'border-gray-200 hover:border-primary-300 hover:shadow-primary-500/15'
            }`}
          >
            {/* Package Header */}
            <div className="flex items-center gap-3 p-5 bg-gray-50 border-b border-gray-200 min-h-[88px]">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${
                pkg.TrangThai === 'Hoàn thành'
                  ? 'bg-gradient-to-br from-success-500 to-success-600'
                  : 'bg-gradient-to-br from-primary-500 to-primary-600'
              }`}>
                <ShieldIcon size={24} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{pkg.TenGoi}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 leading-tight">
                  <PetIcon size={14} /> {pkg.TenThuCung} - {pkg.LoaiThuCung}
                </p>
              </div>
              <span className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex-shrink-0 self-start ${
                pkg.TrangThai === 'Hoàn thành'
                  ? 'bg-success-100 text-success-700'
                  : 'bg-primary-100 text-primary-700'
              }`}>
                {pkg.TrangThai}
              </span>
            </div>

            {/* Package Body */}
            <div className="p-5 flex flex-col gap-4">
              {/* Progress */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-semibold">Tiến độ tiêm</span>
                  <span className="text-primary-600 font-bold">{pkg.SoMuiHoanThanh}/{pkg.TongSoMui} mũi hoàn thành</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-md overflow-hidden relative">
                  <div 
                    className={`h-full flex items-center justify-end pr-2 absolute left-0 top-0 transition-all duration-500 ${
                      pkg.TrangThai === 'Hoàn thành'
                        ? 'bg-gradient-to-r from-success-500 to-success-600'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600'
                    }`}
                    style={{ width: `${(pkg.SoMuiHoanThanh / pkg.TongSoMui) * 100}%` }}
                  >
                    <span className="text-white text-[11px] font-bold drop-shadow">
                      {Math.round((pkg.SoMuiHoanThanh / pkg.TongSoMui) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <CalendarIcon size={14} />
                  <span>Đăng ký: {new Date(pkg.NgayDangKy).toLocaleDateString('vi-VN')}</span>
                </div>
                <span className="px-2.5 py-1 bg-error-100 text-error-700 text-xs font-bold rounded">
                  Giảm {pkg.UuDai}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <button 
                className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => handleViewDetail(pkg)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-xl max-h-[90vh] overflow-y-auto shadow-2xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết gói tiêm - {selectedPackage.TenGoi}</h3>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setShowDetailModal(false)}
              >
                <XIcon size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Package Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Thú cưng:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedPackage.TenThuCung} - {selectedPackage.LoaiThuCung}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Ngày đăng ký:</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(selectedPackage.NgayDangKy).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Ưu đãi:</span>
                  <span className="text-sm font-bold text-error-600">Giảm {selectedPackage.UuDai}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-600">Trạng thái:</span>
                  <span className={`text-sm font-bold ${
                    selectedPackage.TrangThai === 'Hoàn thành' ? 'text-success-600' : 'text-primary-600'
                  }`}>
                    {selectedPackage.TrangThai}
                  </span>
                </div>
              </div>

              {/* Vaccines Table */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-4">Danh sách mũi tiêm</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">STT</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tên vaccine</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Liều lượng</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày tiêm</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPackage.CacVacxin.map((vaccine, index) => (
                        <tr 
                          key={vaccine.id} 
                          className={vaccine.TrangThai === 'Đã tiêm' ? 'bg-success-50' : 'bg-white hover:bg-gray-50'}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{vaccine.TenVaccine}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vaccine.LieuLuong}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {vaccine.NgayTiem ? new Date(vaccine.NgayTiem).toLocaleDateString('vi-VN') : 'Chưa tiêm'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              vaccine.TrangThai === 'Đã tiêm' 
                                ? 'bg-success-100 text-success-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {vaccine.TrangThai === 'Đã tiêm' && <CheckIcon size={14} />}
                              {vaccine.TrangThai}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-5 border-t border-gray-200">
              <button 
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Package Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={() => setShowRegisterModal(false)}>
          <div className="bg-white rounded-xl max-h-[90vh] overflow-y-auto shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Đăng ký gói tiêm phòng</h3>
              <button 
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => setShowRegisterModal(false)}
              >
                <XIcon size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Pet Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Chọn thú cưng *</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                  <option value="">Chọn thú cưng</option>
                  <option value="1">Max</option>
                  <option value="2">Luna</option>
                  <option value="3">Bunny</option>
                </select>
              </div>

              {/* Duration Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Chọn thời gian gói tiêm *</h4>
                <p className="text-sm text-gray-600 mb-3 p-3 bg-primary-50 border-l-4 border-primary-500 rounded">
                  Lưu ý: Chọn thời gian gói trước để giới hạn ngày tiêm trong khoảng thời gian
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {DURATIONS.map(duration => (
                    <label 
                      key={duration.value} 
                      className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDuration === duration.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="duration" 
                        value={duration.value}
                        checked={selectedDuration === duration.value}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-base font-bold text-gray-900 mb-1">{duration.label}</div>
                      <div className="text-sm font-semibold text-success-600">Giảm {duration.discount}</div>
                      {selectedDuration === duration.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <CheckIcon size={12} className="text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Vaccine Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Chọn các mũi tiêm (tối thiểu 1 mũi)</h4>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Tìm kiếm và chọn vaccine..."
                    value={vaccineSearch}
                    onChange={(e) => setVaccineSearch(e.target.value)}
                  />
                  
                  {vaccineSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredVaccines
                        .filter(v => !selectedVaccines.includes(v.id))
                        .map(vaccine => (
                          <div 
                            key={vaccine.id} 
                            className="px-4 py-2.5 hover:bg-primary-50 cursor-pointer text-sm text-gray-900 transition-colors"
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
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">Không tìm thấy vaccine</div>
                      )}
                    </div>
                  )}
                </div>

                {selectedVaccines.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-900">
                        Đã chọn {selectedVaccines.length} mũi tiêm - Chỉ định ngày tiêm:
                      </span>
                      {!selectedDuration && (
                        <span className="flex items-center gap-1 text-xs font-medium text-error-600">
                          ⚠ Chọn thời gian gói tiêm để giới hạn ngày
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {selectedVaccines.map(vaccineId => {
                        const vaccine = AVAILABLE_VACCINES.find(v => v.id === vaccineId);
                        const { minDate, maxDate } = getDateLimits();
                        return (
                          <div key={vaccineId} className="flex flex-col gap-2 p-3 bg-white border border-primary-300 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-900">{vaccine.name}</span>
                              <button 
                                type="button"
                                className="w-6 h-6 flex items-center justify-center bg-error-100 hover:bg-error-200 border border-error-300 rounded-full text-error-700 transition-colors"
                                onClick={() => handleVaccineToggle(vaccineId)}
                              >
                                <XIcon size={14} />
                              </button>
                            </div>
                            <input 
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                              value={vaccineDates[vaccineId] || ''}
                              onChange={(e) => handleDateChange(vaccineId, e.target.value)}
                              min={minDate}
                              max={maxDate || ''}
                              placeholder="Chọn ngày tiêm"
                              disabled={!selectedDuration}
                            />
                            {selectedDuration && (
                              <small className="text-xs text-gray-600 italic">
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

              {/* Package Summary */}
              {selectedVaccines.length > 0 && selectedDuration && (
                <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300 rounded-lg">
                  <h4 className="text-base font-bold text-gray-900 mb-3">Tóm tắt gói đăng ký</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Số mũi tiêm:</span>
                      <strong className="text-gray-900">{selectedVaccines.length} mũi</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Thời gian:</span>
                      <strong className="text-gray-900">{DURATIONS.find(d => d.value === selectedDuration)?.label}</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-primary-300">
                      <span className="text-gray-700 font-semibold">Ưu đãi:</span>
                      <strong className="text-lg text-success-600">Giảm {DURATIONS.find(d => d.value === selectedDuration)?.discount}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button 
                className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                onClick={() => setShowRegisterModal(false)}
              >
                Hủy
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
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
