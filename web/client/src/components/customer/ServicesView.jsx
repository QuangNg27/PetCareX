import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '@services/serviceService';
import apiClient from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';
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
  const { user, pets: cachedPets, fetchPets, fetchAppointments } = useAuth();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [vaccines, setVaccines] = useState([{ id: 1, name: '' }]);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [branchServices, setBranchServices] = useState({}); // Store services by branch ID
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [branches, setBranches] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [bookingData, setBookingData] = useState({
    petId: '',
    branchId: '',
    appointmentDate: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [branchesResponse, petsData, vaccinesResponse] = await Promise.all([
        apiClient.get(ENDPOINTS.BRANCHES.LIST),
        cachedPets ? Promise.resolve(cachedPets) : fetchPets(),
        apiClient.get(`${ENDPOINTS.PRODUCTS.CATEGORIES}?category=Vaccine`)
      ]);
      
      setBranches(branchesResponse.data?.data || branchesResponse.data || []);
      setPets(petsData || []);
      setAvailableVaccines(vaccinesResponse.data?.data || vaccinesResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
    setBookingData({
      petId: '',
      branchId: '',
      appointmentDate: ''
    });
    setShowBookingModal(true);
    
    // Filter branches that have this service
    filterBranchesForService(service.id);
  };

  const filterBranchesForService = async (serviceId) => {
    try {
      // Load service availability for all branches
      const branchPromises = branches.map(async (branch) => {
        try {
          const response = await serviceService.getByBranch(branch.MaChiNhanh);
          const services = response.data?.services || response.services || [];
          return {
            branchId: branch.MaChiNhanh,
            hasService: services.some(s => s.MaDV === serviceId)
          };
        } catch (err) {
          return { branchId: branch.MaChiNhanh, hasService: false };
        }
      });
      
      const results = await Promise.all(branchPromises);
      const availableBranchIds = results
        .filter(r => r.hasService)
        .map(r => r.branchId);
      
      setFilteredBranches(branches.filter(b => availableBranchIds.includes(b.MaChiNhanh)));
    } catch (err) {
      console.error('Error filtering branches:', err);
      setFilteredBranches(branches); // Fallback to all branches
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBooking = async () => {
    // Validation
    if (!bookingData.petId || !bookingData.branchId || !bookingData.appointmentDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (selectedService.LoaiDichVu === 'tiem-phong') {
      const hasEmptyVaccine = vaccines.some(v => !v.name.trim());
      if (hasEmptyVaccine) {
        alert('Vui lòng nhập tên tất cả các mũi tiêm');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (selectedService.LoaiDichVu === 'kham-benh') {
        // Create examination
        const examData = {
          MaCN: parseInt(bookingData.branchId),
          MaDV: selectedService.id,
          MaTC: parseInt(bookingData.petId),
          NgayKham: bookingData.appointmentDate
        };
        
        const response = await serviceService.examinations.create(examData);
        if (response.success) {
          alert('Đặt lịch khám bệnh thành công!');
          await fetchAppointments(true); // Refresh appointments
          setShowBookingModal(false);
        } else {
          alert(response.message || 'Đặt lịch thất bại');
        }
      } else if (selectedService.LoaiDichVu === 'tiem-phong') {
        // Create vaccination
        const vaccData = {
          MaCN: parseInt(bookingData.branchId),
          MaDV: selectedService.id,
          MaTC: parseInt(bookingData.petId),
          NgayTiem: bookingData.appointmentDate,
          vaccines: vaccines.map(v => ({ name: v.name }))
        };
        
        const response = await serviceService.vaccinations.create(vaccData);
        if (response.success) {
          alert('Đặt lịch tiêm phòng thành công!');
          await fetchAppointments(true); // Refresh appointments
          setShowBookingModal(false);
        } else {
          alert(response.message || 'Đặt lịch thất bại');
        }
      }
    } catch (err) {
      console.error('Error booking service:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.TenDichVu}</h3>
                <p className="text-gray-600 mb-6">{service.MoTa}</p>
              </div>

              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full"
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
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={bookingData.petId}
                    onChange={(e) => handleInputChange('petId', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Chọn thú cưng</option>
                    {pets.map(pet => (
                      <option key={pet.MaTC} value={pet.MaTC}>
                        {pet.Ten} - {pet.Loai}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chi nhánh *</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={bookingData.branchId}
                    onChange={(e) => handleInputChange('branchId', e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Chọn chi nhánh</option>
                    {filteredBranches.length === 0 ? (
                      <option value="" disabled>Không có chi nhánh cung cấp dịch vụ này</option>
                    ) : (
                      filteredBranches.map(branch => {
                      // Extract city from address (last part after comma)
                      const city = branch.DiaChi?.split(',').pop()?.trim() || '';
                      return (
                        <option key={branch.MaChiNhanh} value={branch.MaChiNhanh}>
                          {branch.TenChiNhanh}{city ? ` - ${city}` : ''}
                        </option>
                      );
                    }))}
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
                        {availableVaccines.map(vaccine => (
                          <option key={vaccine.MaSP} value={vaccine.TenSP}>
                            {vaccine.LoaiVaccine && ` - ${vaccine.LoaiVaccine}`}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={bookingData.appointmentDate}
                    onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button 
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
                onClick={() => setShowBookingModal(false)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
              >
                <CheckIcon size={18} /> {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;
