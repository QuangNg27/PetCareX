import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardIcon,
  CalendarIcon,
  PetIcon,
  MapPinIcon,
  XIcon,
  CheckIcon,
  PlusIcon,
  DeleteIcon
} from '@components/common/icons';
import './ServicesView.css';

const ServicesView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [vaccines, setVaccines] = useState([{ id: 1, name: '' }]);
  const [selectedPackage, setSelectedPackage] = useState('');

  // Danh sách gói tiêm đã đăng ký
  const registeredPackages = [
    {
      id: 1,
      name: 'Gói tiêm cơ bản (3 mũi) - Giảm 10%',
      vaccines: [
        { id: 1, name: 'Vaccine phòng dại (Rabies)', completed: true },
        { id: 2, name: 'Vaccine 5 bệnh (DHPPL)', completed: true },
        { id: 3, name: 'Vaccine Parvo', completed: false }
      ]
    },
    {
      id: 2,
      name: 'Gói tiêm nâng cao (5 mũi) - Giảm 15%',
      vaccines: [
        { id: 1, name: 'Vaccine phòng dại (Rabies)', completed: false },
        { id: 2, name: 'Vaccine 5 bệnh (DHPPL)', completed: false },
        { id: 3, name: 'Vaccine 7 bệnh (DHPPI+LR)', completed: false },
        { id: 4, name: 'Vaccine Care (Canine)', completed: false },
        { id: 5, name: 'Vaccine Parvo', completed: false }
      ]
    },
    {
      id: 3,
      name: 'Gói tiêm toàn diện (7 mũi) - Giảm 20%',
      vaccines: [
        { id: 1, name: 'Vaccine phòng dại (Rabies)', completed: false },
        { id: 2, name: 'Vaccine 5 bệnh (DHPPL)', completed: false },
        { id: 3, name: 'Vaccine 7 bệnh (DHPPI+LR)', completed: false },
        { id: 4, name: 'Vaccine Care (Canine)', completed: false },
        { id: 5, name: 'Vaccine Parvo', completed: false },
        { id: 6, name: 'Vaccine Distemper', completed: false },
        { id: 7, name: 'Vaccine Hepatitis', completed: false }
      ]
    }
  ];

  const services = [
    {
      id: 1,
      TenDichVu: 'Khám bệnh',
      MoTa: 'Khám sức khỏe tổng quát, phát hiện và điều trị các vấn đề sức khỏe cho thú cưng',
      LoaiDichVu: 'kham-benh',
      Color: 'blue'
    },
    {
      id: 2,
      TenDichVu: 'Tiêm phòng',
      MoTa: 'Tiêm các loại vaccine phòng bệnh để bảo vệ sức khỏe thú cưng',
      LoaiDichVu: 'tiem-phong',
      Color: 'green'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.LoaiDichVu === selectedCategory);

  const handleBookService = (service) => {
    setSelectedService(service);
    setVaccines([{ id: 1, name: '' }]);
    setSelectedPackage('');
    setShowBookingModal(true);
  };

  const handlePackageChange = (packageId) => {
    setSelectedPackage(packageId);
    // Reset vaccines khi thay đổi gói
    setVaccines([{ id: 1, name: '' }]);
  };

  const addVaccine = () => {
    setVaccines([...vaccines, { id: Date.now(), name: '' }]);
  };

  const removeVaccine = (id) => {
    if (vaccines.length > 1) {
      setVaccines(vaccines.filter(v => v.id !== id));
    }
  };

  const updateVaccineName = (id, name) => {
    setVaccines(vaccines.map(v => v.id === id ? { ...v, name } : v));
  };

  return (
    <div className="services-view">
      <div className="services-header">
        <div className="header-info">
          <h2>Dịch vụ chăm sóc thú cưng</h2>
          <p className="services-count">{services.length} dịch vụ</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className={`service-card ${service.Color}`}>
            <div className="service-content">
              <h3>{service.TenDichVu}</h3>
              <p className="service-description">{service.MoTa}</p>

              <button 
                className="book-btn"
                onClick={() => handleBookService(service)}
              >
                <CalendarIcon size={16} /> Đặt lịch
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đặt lịch - {selectedService.TenDichVu}</h3>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Thú cưng *</label>
                  <select className="form-input">
                    <option value="">Chọn thú cưng</option>
                    <option value="1">Max</option>
                    <option value="2">Luna</option>
                    <option value="3">Bunny</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Chi nhánh *</label>
                  <select className="form-input">
                    <option value="">Chọn chi nhánh</option>
                    <option value="1">123 Nguyễn Huệ, Q.1</option>
                    <option value="2">456 Lê Văn Sỹ, Q.3</option>
                    <option value="3">789 Nguyễn Trãi, Q.5</option>
                  </select>
                </div>

                {selectedService.LoaiDichVu === 'tiem-phong' && (
                  <div className="form-group full-width">
                    <div className="vaccines-header">
                      <label>Danh sách mũi tiêm *</label>
                      <button type="button" className="add-vaccine-btn" onClick={addVaccine}>
                        <PlusIcon size={16} /> Thêm mũi tiêm
                      </button>
                    </div>
                    
                    <div className="vaccines-list">
                      {vaccines.map((vaccine, index) => (
                        <div key={vaccine.id} className="vaccine-item">
                          <span className="vaccine-number">{index + 1}</span>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Nhập tên mũi tiêm"
                            value={vaccine.name}
                            onChange={(e) => updateVaccineName(vaccine.id, e.target.value)}
                            list="vaccine-suggestions"
                          />
                          {vaccines.length > 1 && (
                            <button 
                              type="button" 
                              className="remove-vaccine-btn"
                              onClick={() => removeVaccine(vaccine.id)}
                            >
                              <DeleteIcon size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <datalist id="vaccine-suggestions">
                        <option value="Vaccine phòng dại (Rabies)" />
                        <option value="Vaccine 5 bệnh (DHPPL)" />
                        <option value="Vaccine 7 bệnh (DHPPI+LR)" />
                        <option value="Vaccine Care (Canine)" />
                        <option value="Vaccine Parvo" />
                        <option value="Vaccine Distemper" />
                        <option value="Vaccine Hepatitis" />
                      </datalist>
                    </div>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Ngày hẹn *</label>
                  <input type="date" className="form-input" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowBookingModal(false)}>
                Hủy
              </button>
              <button className="confirm-btn">
                <CheckIcon size={18} /> Xác nhận đặt lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;
