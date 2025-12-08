import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { customerService } from '@services/customerService';
import { 
  PetIcon, 
  PlusIcon,
  EditIcon,
  DeleteIcon,
  XIcon,
  SaveIcon
} from '@components/common/icons';

const PetsView = () => {
  const { user, pets: cachedPets, fetchPets } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newPet, setNewPet] = useState({
    Ten: '',
    Loai: '',
    Giong: '',
    GioiTinh: 'Đực',
    NgaySinh: '',
    TinhTrangSucKhoe: ''
  });
  const [editPet, setEditPet] = useState({
    Ten: '',
    Loai: '',
    Giong: '',
    GioiTinh: 'Đực',
    NgaySinh: '',
    TinhTrangSucKhoe: ''
  });

  useEffect(() => {
    loadPets();
  }, [cachedPets]);

  const loadPets = async () => {
    // Use cached data if available
    if (cachedPets) {
      setPets(cachedPets.map(pet => ({
        id: pet.MaTC,
        TenThuCung: pet.Ten,
        Loai: pet.Loai,
        GiongLoai: pet.Giong,
        GioiTinh: pet.GioiTinh,
        NgaySinh: pet.NgaySinh,
        TinhTrang: pet.TinhTrangSucKhoe
      })));
      return;
    }

    // Otherwise fetch fresh data
    try {
      setLoading(true);
      setError(null);
      const petsData = await fetchPets();
      setPets(petsData.map(pet => ({
        id: pet.MaTC,
        TenThuCung: pet.Ten,
        Loai: pet.Loai,
        GiongLoai: pet.Giong,
        GioiTinh: pet.GioiTinh,
        NgaySinh: pet.NgaySinh,
        TinhTrang: pet.TinhTrangSucKhoe
      })));
    } catch (err) {
      console.error('Error loading pets:', err);
      setError('Không thể tải danh sách thú cưng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewPet(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPet = async () => {
    if (!newPet.Ten || !newPet.Loai) {
      alert('Vui lòng nhập tên và loài thú cưng');
      return;
    }

    setIsSaving(true);
    try {
      const response = await customerService.pets.create(newPet);
      if (response.success) {
        alert('Thêm thú cưng thành công!');
        setShowAddForm(false);
        setNewPet({
          Ten: '',
          Loai: '',
          Giong: '',
          GioiTinh: 'Đực',
          NgaySinh: '',
          TinhTrangSucKhoe: ''
        });
        // Force refresh pets from server
        await fetchPets(true);
      } else {
        alert(response.message || 'Thêm thú cưng thất bại');
      }
    } catch (err) {
      console.error('Error adding pet:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm thú cưng');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (pet) => {
    setSelectedPet(pet);
    setEditPet({
      Ten: pet.TenThuCung,
      Loai: pet.Loai,
      Giong: pet.GiongLoai,
      GioiTinh: pet.GioiTinh,
      NgaySinh: pet.NgaySinh,
      TinhTrangSucKhoe: pet.TinhTrang
    });
    setShowEditForm(true);
  };

  const handleEditPet = async () => {
    if (!editPet.Ten || !editPet.Loai) {
      alert('Vui lòng nhập tên và loài thú cưng');
      return;
    }

    setIsSaving(true);
    try {
      const response = await customerService.pets.update(selectedPet.id, editPet);
      if (response.success) {
        alert('Cập nhật thú cưng thành công!');
        setShowEditForm(false);
        setSelectedPet(null);
        // Force refresh pets from server
        await fetchPets(true);
      } else {
        alert(response.message || 'Cập nhật thú cưng thất bại');
      }
    } catch (err) {
      console.error('Error updating pet:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thú cưng');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (pet) => {
    setSelectedPet(pet);
    setShowDeleteConfirm(true);
  };

  const handleDeletePet = async () => {
    setIsSaving(true);
    try {
      const response = await customerService.pets.delete(selectedPet.id);
      if (response.success) {
        alert('Xóa thú cưng thành công!');
        setShowDeleteConfirm(false);
        setSelectedPet(null);
        // Force refresh pets from server
        await fetchPets(true);
      } else {
        alert(response.message || 'Xóa thú cưng thất bại');
      }
    } catch (err) {
      console.error('Error deleting pet:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa thú cưng');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditPet(prev => ({ ...prev, [field]: value }));
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
    
    if (ageInMonths < 12) {
      return `${ageInMonths} tháng`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} tuổi`;
    }
  };

  const getPetIcon = (type) => {
    return <PetIcon size={32} />;
  };

  const getPetColor = (type) => {
    const colors = {
      'Chó': 'dog',
      'Mèo': 'cat',
      'Thỏ': 'rabbit',
      'Chim': 'bird',
      'Khác': 'other'
    };
    return colors[type] || 'other';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh sách thú cưng</h2>
          <p className="text-sm text-gray-600 mt-1">Tổng số: {pets.length} thú cưng</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={() => setShowAddForm(true)}>
          <PlusIcon size={18} /> Thêm thú cưng
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-red-500">{error}</div>
        </div>
      ) : pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <PetIcon size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500">Chưa có thú cưng nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white ${
                  getPetColor(pet.Loai) === 'dog' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  getPetColor(pet.Loai) === 'cat' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                  getPetColor(pet.Loai) === 'rabbit' ? 'bg-gradient-to-br from-pink-500 to-pink-600' :
                  'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  {getPetIcon(pet.Loai)}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={() => handleEditClick(pet)}
                  >
                    <EditIcon size={16} />
                  </button>
                  <button 
                    className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                    onClick={() => handleDeleteClick(pet)}
                  >
                    <DeleteIcon size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{pet.TenThuCung}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Loài:</span>
                  <span className="font-medium text-gray-900">{pet.Loai}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giống:</span>
                  <span className="font-medium text-gray-900">{pet.GiongLoai}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giới tính:</span>
                  <span className="font-medium text-gray-900">{pet.GioiTinh}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ngày sinh:</span>
                  <span className="font-medium text-gray-900">{new Date(pet.NgaySinh).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span className="inline-flex items-center px-2 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">{pet.TinhTrang}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Thêm thú cưng mới</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowAddForm(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên thú cưng *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập tên thú cưng"
                    value={newPet.Ten}
                    onChange={(e) => handleInputChange('Ten', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loài *</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newPet.Loai}
                    onChange={(e) => handleInputChange('Loai', e.target.value)}
                  >
                    <option value="">Chọn loài</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                    <option value="Thỏ">Thỏ</option>
                    <option value="Chim">Chim</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giống</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập giống"
                    value={newPet.Giong}
                    onChange={(e) => handleInputChange('Giong', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newPet.GioiTinh}
                    onChange={(e) => handleInputChange('GioiTinh', e.target.value)}
                  >
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newPet.NgaySinh}
                    onChange={(e) => handleInputChange('NgaySinh', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng sức khỏe</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập tình trạng"
                    value={newPet.TinhTrangSucKhoe}
                    onChange={(e) => handleInputChange('TinhTrangSucKhoe', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button 
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
                onClick={() => setShowAddForm(false)}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddPet}
                disabled={isSaving}
              >
                <SaveIcon size={18} /> {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditForm && selectedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin thú cưng</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowEditForm(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên thú cưng *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập tên thú cưng"
                    value={editPet.Ten}
                    onChange={(e) => handleEditInputChange('Ten', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loài *</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={editPet.Loai}
                    onChange={(e) => handleEditInputChange('Loai', e.target.value)}
                  >
                    <option value="">Chọn loài</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                    <option value="Thỏ">Thỏ</option>
                    <option value="Chim">Chim</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giống</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập giống"
                    value={editPet.Giong}
                    onChange={(e) => handleEditInputChange('Giong', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={editPet.GioiTinh}
                    onChange={(e) => handleEditInputChange('GioiTinh', e.target.value)}
                  >
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={editPet.NgaySinh}
                    onChange={(e) => handleEditInputChange('NgaySinh', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng sức khỏe</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                    placeholder="Nhập tình trạng"
                    value={editPet.TinhTrangSucKhoe}
                    onChange={(e) => handleEditInputChange('TinhTrangSucKhoe', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button 
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
                onClick={() => setShowEditForm(false)}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button 
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleEditPet}
                disabled={isSaving}
              >
                <SaveIcon size={18} /> {isSaving ? 'Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-100 mx-auto mb-4">
                <DeleteIcon size={24} className="text-error-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Xác nhận xóa thú cưng</h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa <strong>{selectedPet.TenThuCung}</strong>? Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex gap-3">
                <button 
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                >
                  Hủy
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeletePet}
                  disabled={isSaving}
                >
                  <DeleteIcon size={18} /> {isSaving ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsView;
