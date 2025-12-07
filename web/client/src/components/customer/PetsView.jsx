import React, { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { 
  PetIcon, 
  PlusIcon,
  EditIcon,
  DeleteIcon,
  CalendarIcon,
  XIcon,
  SaveIcon
} from '@components/common/icons';

const PetsView = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [pets, setPets] = useState([
    {
      id: 1,
      TenThuCung: 'Max',
      Loai: 'Chó',
      GiongLoai: 'Golden Retriever',
      GioiTinh: 'Đực',
      NgaySinh: '2021-03-15',
      CanNang: 25,
      MauLong: 'Vàng',
      TinhTrang: 'Khỏe mạnh'
    },
    {
      id: 2,
      TenThuCung: 'Luna',
      Loai: 'Mèo',
      GiongLoai: 'Mèo Ba Tư',
      GioiTinh: 'Cái',
      NgaySinh: '2022-06-20',
      CanNang: 4,
      MauLong: 'Trắng',
      TinhTrang: 'Khỏe mạnh'
    },
    {
      id: 3,
      TenThuCung: 'Bunny',
      Loai: 'Thỏ',
      GiongLoai: 'Thỏ Hà Lan',
      GioiTinh: 'Cái',
      NgaySinh: '2023-01-10',
      CanNang: 1.5,
      MauLong: 'Xám',
      TinhTrang: 'Khỏe mạnh'
    }
  ]);

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
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <EditIcon size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors">
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

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
                <CalendarIcon size={16} /> Xem lịch sử
              </button>
            </div>
          </div>
        ))}
      </div>

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
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Nhập tên thú cưng" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loài *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
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
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Nhập giống" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng sức khỏe</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Nhập tình trạng" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors" onClick={() => setShowAddForm(false)}>
                Hủy
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <SaveIcon size={18} /> Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsView;
