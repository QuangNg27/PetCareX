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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dịch vụ chăm sóc thú cưng</h2>
        <p className="text-sm text-gray-600 mt-1">{services.length} dịch vụ</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className={`p-6 rounded-xl shadow-sm border-2 hover:shadow-md transition-all ${
            service.Color === 'blue' ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100' :
            service.Color === 'green' ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100' :
            'border-gray-200 bg-white'
          }`}>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.TenDichVu}</h3>
              <p className="text-gray-600 mb-6">{service.MoTa}</p>

              <button 
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBookingModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Đặt lịch - {selectedService.TenDichVu}</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowBookingModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thú cưng *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Chọn thú cưng</option>
                    <option value="1">Max</option>
                    <option value="2">Luna</option>
                    <option value="3">Bunny</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chi nhánh *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Chọn chi nhánh</option>
                    <option value="1">123 Nguyễn Huệ, Q.1</option>
                    <option value="2">456 Lê Văn Sỹ, Q.3</option>
                    <option value="3">789 Nguyễn Trãi, Q.5</option>
                  </select>
                </div>

                {selectedService.LoaiDichVu === 'tiem-phong' && (
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Danh sách mũi tiêm *</label>
                      <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm" onClick={addVaccine}>
                        <PlusIcon size={16} /> Thêm mũi tiêm
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {vaccines.map((vaccine, index) => (
                        <div key={vaccine.id} className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold">{index + 1}</span>
                          <input 
                            type="text" 
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                            placeholder="Nhập tên mũi tiêm"
                            value={vaccine.name}
                            onChange={(e) => updateVaccineName(vaccine.id, e.target.value)}
                            list="vaccine-suggestions"
                          />
                          {vaccines.length > 1 && (
                            <button 
                              type="button" 
                              className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setShowBookingModal(false)}>
                Hủy
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
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
