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
import './PetsView.css';

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
    <div className="pets-view">
      <div className="pets-header">
        <div className="header-info">
          <h2>Danh sách thú cưng</h2>
          <p className="pet-count">Tổng số: {pets.length} thú cưng</p>
        </div>
        <button className="add-pet-btn" onClick={() => setShowAddForm(true)}>
          <PlusIcon size={18} /> Thêm thú cưng
        </button>
      </div>

      <div className="pets-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <div className="pet-card-header">
              <div className={`pet-avatar ${getPetColor(pet.Loai)}`}>
                {getPetIcon(pet.Loai)}
              </div>
              <div className="pet-actions">
                <button className="icon-btn">
                  <EditIcon size={16} />
                </button>
                <button className="icon-btn delete">
                  <DeleteIcon size={16} />
                </button>
              </div>
            </div>
            
            <div className="pet-card-body">
              <h3>{pet.TenThuCung}</h3>
              
              <div className="pet-info-grid">
                <div className="info-row">
                  <span className="label">Loài:</span>
                  <span className="value">{pet.Loai}</span>
                </div>
                <div className="info-row">
                  <span className="label">Giống:</span>
                  <span className="value">{pet.GiongLoai}</span>
                </div>
                <div className="info-row">
                  <span className="label">Giới tính:</span>
                  <span className="value">{pet.GioiTinh}</span>
                </div>
                <div className="info-row">
                  <span className="label">Ngày sinh:</span>
                  <span className="value">{new Date(pet.NgaySinh).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tình trạng:</span>
                  <span className="value status-healthy">{pet.TinhTrang}</span>
                </div>
              </div>
            </div>

            <div className="pet-card-footer">
              <button className="view-detail-btn">
                <CalendarIcon size={16} /> Xem lịch sử
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pet Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm thú cưng mới</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Tên thú cưng *</label>
                  <input type="text" className="form-input" placeholder="Nhập tên thú cưng" />
                </div>

                <div className="form-group">
                  <label>Loài *</label>
                  <select className="form-input">
                    <option value="">Chọn loài</option>
                    <option value="Chó">Chó</option>
                    <option value="Mèo">Mèo</option>
                    <option value="Thỏ">Thỏ</option>
                    <option value="Chim">Chim</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Giống</label>
                  <input type="text" className="form-input" placeholder="Nhập giống" />
                </div>

                <div className="form-group">
                  <label>Giới tính</label>
                  <select className="form-input">
                    <option value="Đực">Đực</option>
                    <option value="Cái">Cái</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input type="date" className="form-input" />
                </div>

                <div className="form-group">
                  <label>Tình trạng sức khỏe</label>
                  <input type="text" className="form-input" placeholder="Nhập tình trạng" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Hủy
              </button>
              <button className="save-btn">
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
