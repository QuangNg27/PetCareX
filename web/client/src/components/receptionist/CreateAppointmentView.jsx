import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import { serviceService } from '@services/serviceService';
import apiClient from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';
import { 
  validatePhone, 
  validateEmail, 
  validateName, 
  validateCCCD,
  isRequired 
} from '@utils/validation';
import {
  SearchIcon,
  UserIcon,
  PetIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
  CheckIcon,
  ClipboardIcon
} from '@components/common/icons';

const CreateAppointmentView = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  // Load services and vaccines when component mounts
  React.useEffect(() => {
    console.log('useEffect triggered, user:', user);
    console.log('user.MaCN:', user?.MaCN);
    
    const loadData = async () => {
      // Fallback to branch 1 if MaCN is null (for testing)
      const branchId = user?.MaCN || 1;
      
      if (!user) {
        console.log('No user, skipping loadData');
        return;
      }
      
      try {
        // Load services
        console.log('Loading services for branch:', branchId);
        const servicesResponse = await apiClient.get(ENDPOINTS.BRANCHES.SERVICES(branchId));
        console.log('Services response:', servicesResponse);
        console.log('Services data:', servicesResponse.data);
        if (servicesResponse.data.success) {
          console.log('Setting available services:', servicesResponse.data.data);
          setAvailableServices(servicesResponse.data.data);
          
          // Only load vaccines if vaccination service is available
          const hasVaccinationService = servicesResponse.data.data.some(s => 
            s.TenDichVu?.toLowerCase().includes('tiêm')
          );
          
          if (hasVaccinationService) {
            console.log('Vaccination service found, loading vaccines...');
            setLoadingVaccines(true);
            const vaccinesResponse = await apiClient.get(ENDPOINTS.PRODUCTS.BY_BRANCH, {
              params: {
                branchId: branchId,
                category: 'Vaccine'
              }
            });
            if (vaccinesResponse.data.success) {
              setAvailableVaccines(vaccinesResponse.data.data.products.map(v => ({
                id: v.MaSP,
                name: v.TenSP,
                stock: v.SLTonKho,
                description: v.LoaiVaccine || 'Vaccine phòng bệnh'
              })));
            }
            setLoadingVaccines(false);
          } else {
            console.log('No vaccination service, skipping vaccine loading');
          }
        } else {
          console.error('Services response not successful:', servicesResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setLoadingVaccines(false);
      }
    };
    loadData();
  }, [user]);
  
  const [searchPhone, setSearchPhone] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    HoTen: '',
    SDT: '',
    Email: '',
    CCCD: '',
    GioiTinh: 'Nam',
    NgaySinh: ''
  });

  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetForm, setNewPetForm] = useState({
    Ten: '',
    Loai: '',
    Giong: '',
    GioiTinh: 'Đực',
    NgaySinh: '',
    TinhTrangSucKhoe: 'Bình thường'
  });

  const [serviceType, setServiceType] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [vaccineSearch, setVaccineSearch] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customerErrors, setCustomerErrors] = useState({});
  const [petErrors, setPetErrors] = useState({});

  const fetchCustomerPets = async (customerId) => {
    try {
      const response = await customerService.getCustomerPets(customerId);
      if (response.success && response.data) {
        setPets(response.data);
      }
    } catch (error) {
      console.error('Error fetching customer pets:', error);
      setPets([]);
    }
  };

  const handleSearchCustomer = async () => {
    if (!validatePhone(searchPhone)) {
      alert('Số điện thoại không hợp lệ (phải là 10 số, bắt đầu bằng 0)');
      return;
    }

    setLoading(true);
    try {
      const response = await customerService.searchCustomers(searchPhone);
      if (response.success && response.data && response.data.length > 0) {
        const customer = response.data[0];
        setCustomerData(customer);
        setIsNewCustomer(false);
        // Fetch pets của khách hàng
        await fetchCustomerPets(customer.MaKH);
        alert(`Tìm thấy khách hàng cũ: ${customer.HoTen}`);
      } else {
        setIsNewCustomer(true);
        setCustomerData(null);
        setNewCustomerForm({ ...newCustomerForm, SDT: searchPhone });
        alert('Không tìm thấy - Đây là khách hàng mới. Vui lòng nhập thông tin.');
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      setIsNewCustomer(true);
      setCustomerData(null);
      setNewCustomerForm({ ...newCustomerForm, SDT: searchPhone });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    const errors = {};
    
    // Validate required fields
    if (!newCustomerForm.HoTen || !newCustomerForm.HoTen.trim()) {
      errors.HoTen = 'Vui lòng nhập họ tên';
    } else if (!validateName(newCustomerForm.HoTen)) {
      errors.HoTen = 'Họ tên không hợp lệ (2-50 ký tự, chỉ chữ cái)';
    }
    
    if (!newCustomerForm.SDT || !newCustomerForm.SDT.trim()) {
      errors.SDT = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(newCustomerForm.SDT)) {
      errors.SDT = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    }
    
    if (!newCustomerForm.Email || !newCustomerForm.Email.trim()) {
      errors.Email = 'Vui lòng nhập email';
    } else if (!validateEmail(newCustomerForm.Email)) {
      errors.Email = 'Email không hợp lệ';
    }
    
    if (!newCustomerForm.CCCD || !newCustomerForm.CCCD.trim()) {
      errors.CCCD = 'Vui lòng nhập CCCD';
    } else if (!validateCCCD(newCustomerForm.CCCD)) {
      errors.CCCD = 'CCCD phải có đúng 12 số';
    }
    
    if (!newCustomerForm.NgaySinh) {
      errors.NgaySinh = 'Vui lòng chọn ngày sinh';
    }
    
    if (Object.keys(errors).length > 0) {
      setCustomerErrors(errors);
      const errorMessages = Object.values(errors).join('\n');
      alert(errorMessages);
      return;
    }
    
    setCustomerErrors({});

    setSaving(true);
    try {
      const customerData = {
        HoTen: newCustomerForm.HoTen,
        SoDT: newCustomerForm.SDT,
        Email: newCustomerForm.Email || null,
        CCCD: newCustomerForm.CCCD,
        GioiTinh: newCustomerForm.GioiTinh,
        NgaySinh: newCustomerForm.NgaySinh
      };

      const response = await customerService.createCustomer(customerData);
      
      if (response.success) {
        alert('Tạo khách hàng mới thành công!');
        const createdCustomer = {
          MaKH: response.data.MaKH,
          HoTen: newCustomerForm.HoTen,
          SDT: newCustomerForm.SDT,
          SoDT: newCustomerForm.SDT,
          Email: newCustomerForm.Email,
          CCCD: newCustomerForm.CCCD,
          GioiTinh: newCustomerForm.GioiTinh,
          NgaySinh: newCustomerForm.NgaySinh
        };
        setCustomerData(createdCustomer);
        setIsNewCustomer(false);
        setStep(2);
      } else {
        alert(response.message || 'Tạo khách hàng thất bại');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo khách hàng';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPet = async () => {
    const errors = {};
    
    if (!newPetForm.Ten || !newPetForm.Ten.trim()) {
      errors.Ten = 'Vui lòng nhập tên thú cưng';
    } else if (newPetForm.Ten.length < 2 || newPetForm.Ten.length > 50) {
      errors.Ten = 'Tên thú cưng phải từ 2-50 ký tự';
    }
    
    if (!newPetForm.Loai || !newPetForm.Loai.trim()) {
      errors.Loai = 'Vui lòng nhập loài thú cưng';
    }
    
    if (!newPetForm.Giong || !newPetForm.Giong.trim()) {
      errors.Giong = 'Vui lòng nhập giống thú cưng';
    }
    
    if (Object.keys(errors).length > 0) {
      setPetErrors(errors);
      const errorMessages = Object.values(errors).join('\n');
      alert(errorMessages);
      return;
    }
    
    setPetErrors({});

    if (!customerData || !customerData.MaKH) {
      alert('Không tìm thấy thông tin khách hàng');
      return;
    }

    setSaving(true);
    try {
      const petData = {
        Ten: newPetForm.Ten,
        Loai: newPetForm.Loai,
        Giong: newPetForm.Giong || null,
        GioiTinh: newPetForm.GioiTinh,
        NgaySinh: newPetForm.NgaySinh || null,
        TinhTrangSucKhoe: newPetForm.TinhTrangSucKhoe
      };

      const response = await customerService.createPetForCustomer(customerData.MaKH, petData);
      
      if (response.success) {
        const newPet = {
          MaTC: response.data.MaTC,
          Ten: newPetForm.Ten,
          Loai: newPetForm.Loai,
          Giong: newPetForm.Giong,
          GioiTinh: newPetForm.GioiTinh,
          NgaySinh: newPetForm.NgaySinh,
          TinhTrangSucKhoe: newPetForm.TinhTrangSucKhoe
        };
        
        setPets([...pets, newPet]);
        setShowAddPetForm(false);
        setNewPetForm({
          Ten: '',
          Loai: '',
          Giong: '',
          GioiTinh: 'Đực',
          NgaySinh: '',
          TinhTrangSucKhoe: 'Bình thường'
        });
        alert('Thêm thú cưng thành công!');
      } else {
        alert(response.message || 'Thêm thú cưng thất bại');
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thêm thú cưng';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const togglePetSelection = (petId) => {
    setSelectedPets(prev => {
      if (prev.includes(petId)) {
        return prev.filter(id => id !== petId);
      } else {
        return [...prev, petId];
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!customerData) {
        alert('Vui lòng tìm kiếm hoặc tạo khách hàng trước');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedPets.length === 0) {
        alert('Vui lòng chọn ít nhất một thú cưng');
        return;
      }
      setStep(3);
    }
  };

  const handleCreateAppointments = async () => {
    if (!serviceType) {
      alert('Vui lòng chọn loại dịch vụ');
      return;
    }
    if (!appointmentDate) {
      alert('Vui lòng chọn ngày hẹn');
      return;
    }
    if (serviceType === 'vaccination' && selectedVaccines.length === 0) {
      alert('Vui lòng chọn ít nhất một vaccine');
      return;
    }

    setSaving(true);
    try {
      // Find service IDs from available services
      console.log('Available services:', availableServices);
      const examinationService = availableServices.find(s => s.TenDichVu?.toLowerCase().includes('khám'));
      const vaccinationService = availableServices.find(s => s.TenDichVu?.toLowerCase().includes('tiêm'));
      
      console.log('Examination service:', examinationService);
      console.log('Vaccination service:', vaccinationService);

      const promises = selectedPets.map(async (petId) => {
        const pet = pets.find(p => p.MaTC === petId);
        
        if (serviceType === 'examination') {
          if (!examinationService) {
            console.error('Available services:', availableServices);
            throw new Error('Không tìm thấy dịch vụ khám bệnh trong danh sách dịch vụ');
          }
          const appointmentData = {
            MaCN: user.MaCN || 1,
            MaDV: examinationService.MaDichVu,
            MaTC: petId,
            NgayKham: appointmentDate
          };
          return await serviceService.examinations.create(appointmentData);
        } else {
          if (!vaccinationService) {
            throw new Error('Không tìm thấy dịch vụ tiêm phòng');
          }
          const vaccData = {
            MaCN: user.MaCN || 1,
            MaDV: vaccinationService.MaDichVu,
            MaTC: petId,
            NgayTiem: appointmentDate,
            vaccines: selectedVaccines.map(v => ({ MaSP: v.id }))
          };
          return await serviceService.vaccinations.create(vaccData);
        }
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        alert(`Tạo ${selectedPets.length} lịch hẹn thành công!`);
        resetForm();
      } else {
        alert('Một số lịch hẹn tạo thất bại');
      }
    } catch (error) {
      console.error('Error creating appointments:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch hẹn');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSearchPhone('');
    setCustomerData(null);
    setIsNewCustomer(false);
    setPets([]);
    setSelectedPets([]);
    setServiceType('');
    setAppointmentDate('');
    setSelectedVaccines([]);
    setNewCustomerForm({ HoTen: '', SDT: '', Email: '', CCCD: '', GioiTinh: 'Nam', NgaySinh: '' });
  };

  const toggleVaccineSelection = (vaccine) => {
    setSelectedVaccines(prev => {
      const exists = prev.find(v => v.id === vaccine.id);
      if (exists) {
        return prev.filter(v => v.id !== vaccine.id);
      } else {
        return [...prev, vaccine];
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Khách hàng' },
            { num: 2, label: 'Thú cưng' },
            { num: 3, label: 'Dịch vụ' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    step >= s.num
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.num ? <CheckIcon size={24} /> : s.num}
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step > s.num ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Customer */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserIcon size={24} />
            Thông tin khách hàng
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm khách hàng theo số điện thoại
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nhập số điện thoại (10 số)"
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
            <p className="text-xs text-gray-500 mt-1">
              💡 Tìm khách hàng để xác định là khách cũ hay khách mới
            </p>
          </div>

          {customerData && !isNewCustomer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckIcon size={20} className="text-green-600" />
                Tìm thấy khách hàng (Khách cũ)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.HoTen}</span>
                </div>
                <div>
                  <span className="text-gray-600">SĐT:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.SDT || customerData.SoDT}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.Email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">CCCD:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.CCCD || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Giới tính:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.GioiTinh || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Ngày sinh:</span>
                  <span className="ml-2 font-medium text-gray-900">{customerData.NgaySinh ? new Date(customerData.NgaySinh).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {isNewCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-4">
                Khách hàng mới - Vui lòng nhập thông tin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newCustomerForm.HoTen}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, HoTen: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newCustomerForm.SDT}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, SDT: e.target.value })}
                    maxLength={10}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newCustomerForm.Email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, Email: e.target.value })}
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số CCCD/CMND <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newCustomerForm.CCCD}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, CCCD: e.target.value })}
                    maxLength={12}
                    placeholder="Nhập số CCCD/CMND"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newCustomerForm.NgaySinh}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, NgaySinh: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nam"
                        checked={newCustomerForm.GioiTinh === 'Nam'}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, GioiTinh: e.target.value })}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Nam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Nữ"
                        checked={newCustomerForm.GioiTinh === 'Nữ'}
                        onChange={(e) => setNewCustomerForm({ ...newCustomerForm, GioiTinh: e.target.value })}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Nữ</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCreateCustomer}
                  disabled={saving}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Đang tạo...' : 'Tạo khách hàng'}
                </button>
              </div>
            </div>
          )}

          {customerData && !isNewCustomer && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Tiếp theo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Pets */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PetIcon size={24} />
            Chọn thú cưng
          </h2>

          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <span className="text-sm text-gray-600">Khách hàng: </span>
            <span className="text-sm font-semibold text-gray-900">
              {customerData?.HoTen} - {customerData?.SDT}
            </span>
          </div>

          {pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {pets.map((pet) => (
                <div
                  key={pet.MaTC}
                  onClick={() => togglePetSelection(pet.MaTC)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPets.includes(pet.MaTC)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{pet.Ten}</h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Loài: {pet.Loai}</p>
                        <p>Giống: {pet.Giong || 'N/A'}</p>
                        <p>Giới tính: {pet.GioiTinh}</p>
                      </div>
                    </div>
                    {selectedPets.includes(pet.MaTC) && (
                      <CheckIcon size={24} className="text-primary-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Khách hàng chưa có thú cưng nào
            </div>
          )}

          {!showAddPetForm && (
            <button
              onClick={() => setShowAddPetForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon size={20} />
              Thêm thú cưng mới
            </button>
          )}

          {showAddPetForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900">Thêm thú cưng mới</h3>
                <button
                  onClick={() => setShowAddPetForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XIcon size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên thú cưng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newPetForm.Ten}
                    onChange={(e) => setNewPetForm({ ...newPetForm, Ten: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loài <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Chó, Mèo, ..."
                    value={newPetForm.Loai}
                    onChange={(e) => setNewPetForm({ ...newPetForm, Loai: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giống <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newPetForm.Giong}
                    onChange={(e) => setNewPetForm({ ...newPetForm, Giong: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newPetForm.GioiTinh}
                    onChange={(e) => setNewPetForm({ ...newPetForm, GioiTinh: e.target.value })}
                  >
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newPetForm.NgaySinh}
                    onChange={(e) => setNewPetForm({ ...newPetForm, NgaySinh: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tình trạng sức khỏe
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={newPetForm.TinhTrangSucKhoe}
                    onChange={(e) => setNewPetForm({ ...newPetForm, TinhTrangSucKhoe: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddPetForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddPet}
                  disabled={saving}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {saving ? 'Đang thêm...' : 'Thêm thú cưng'}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Quay lại
            </button>
            <button
              onClick={handleNextStep}
              disabled={selectedPets.length === 0}
              className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Service */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ClipboardIcon size={24} />
            Chọn dịch vụ và đặt lịch
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-gray-600">Khách hàng: </span>
                <span className="font-semibold text-gray-900">
                  {customerData?.HoTen} - {customerData?.SDT}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Số thú cưng: </span>
                <span className="font-semibold text-gray-900">{selectedPets.length}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Loại dịch vụ <span className="text-red-500">*</span>
            </label>
            {availableServices.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Đang tải dịch vụ...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableServices.some(s => s.TenDichVu?.toLowerCase().includes('khám')) && (
                  <button
                    onClick={() => setServiceType('examination')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      serviceType === 'examination'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🩺</div>
                      <div className="font-semibold text-gray-900">Khám bệnh</div>
                      <div className="text-xs text-gray-600 mt-1">Khám sức khỏe tổng quát</div>
                    </div>
                  </button>
                )}
                {availableServices.some(s => s.TenDichVu?.toLowerCase().includes('tiêm')) && (
                  <button
                    onClick={() => setServiceType('vaccination')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      serviceType === 'vaccination'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">💉</div>
                      <div className="font-semibold text-gray-900">Tiêm phòng</div>
                      <div className="text-xs text-gray-600 mt-1">Tiêm vắc-xin phòng bệnh</div>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hẹn <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {serviceType === 'vaccination' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn vaccine <span className="text-red-500">*</span>
              </label>
              {loadingVaccines ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải danh sách vaccine...</p>
                </div>
              ) : availableVaccines.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Không có vaccine nào</p>
                </div>
              ) : (
              <>
              <div className="mb-3">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Tìm kiếm vaccine..."
                  value={vaccineSearch}
                  onChange={(e) => setVaccineSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableVaccines
                  .filter(v => v.name.toLowerCase().includes(vaccineSearch.toLowerCase()) || 
                               v.description.toLowerCase().includes(vaccineSearch.toLowerCase()))
                  .map((vaccine) => (
                  <div
                    key={vaccine.id}
                    onClick={() => toggleVaccineSelection(vaccine)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedVaccines.find(v => v.id === vaccine.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        selectedVaccines.find(v => v.id === vaccine.id)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedVaccines.find(v => v.id === vaccine.id) && (
                          <CheckIcon size={14} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{vaccine.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{vaccine.description}</div>
                      </div>
                    </div>
                  </div>
                  ))}
              </div>
              </>
              )}
              <p className="text-xs text-gray-500 mt-2">
                💡 Có thể chọn nhiều vaccine cho mỗi thú cưng
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Quay lại
            </button>
            <button
              onClick={handleCreateAppointments}
              disabled={saving || !serviceType || !appointmentDate || (serviceType === 'vaccination' && selectedVaccines.length === 0)}
              className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <SaveIcon size={20} />
              {saving ? 'Đang tạo...' : 'Tạo lịch hẹn'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAppointmentView;
