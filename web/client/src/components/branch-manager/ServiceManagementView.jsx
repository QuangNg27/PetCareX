import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { EditIcon, SaveIcon, XIcon } from '@components/common/icons';

const ServiceManagementView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN || 1;
  
  const [services, setServices] = useState([
    { MaDV: 1, TenDV: 'Khám tổng quát', LoaiDV: 'Khám bệnh', MoTa: 'Khám sức khỏe tổng quát cho thú cưng', GiaDichVu: 200000, GiaApDung: 180000, TrangThai: 'Hoạt động' },
    { MaDV: 2, TenDV: 'Tiêm phòng cơ bản', LoaiDV: 'Tiêm phòng', MoTa: 'Tiêm các loại vắc-xin cơ bản', GiaDichVu: 150000, GiaApDung: 150000, TrangThai: 'Hoạt động' },
    { MaDV: 3, TenDV: 'Spa thú cưng', LoaiDV: 'Spa', MoTa: 'Tắm, cắt tỉa lông, vệ sinh', GiaDichVu: 300000, GiaApDung: 250000, TrangThai: 'Hoạt động' },
    { MaDV: 4, TenDV: 'Phẫu thuật nhỏ', LoaiDV: 'Phẫu thuật', MoTa: 'Các ca phẫu thuật nhỏ', GiaDichVu: 2000000, GiaApDung: 2000000, TrangThai: 'Hoạt động' },
    { MaDV: 5, TenDV: 'Nha khoa', LoaiDV: 'Khám bệnh', MoTa: 'Làm sạch răng, nhổ răng', GiaDichVu: 500000, GiaApDung: 450000, TrangThai: 'Tạm dừng' },
  ]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockServices = [
        { MaDV: 1, TenDV: 'Khám tổng quát', LoaiDV: 'Khám bệnh', MoTa: 'Khám sức khỏe tổng quát cho thú cưng', GiaDichVu: 200000, GiaApDung: 180000, TrangThai: 'Hoạt động' },
        { MaDV: 2, TenDV: 'Tiêm phòng cơ bản', LoaiDV: 'Tiêm phòng', MoTa: 'Tiêm các loại vắc-xin cơ bản', GiaDichVu: 150000, GiaApDung: 150000, TrangThai: 'Hoạt động' },
        { MaDV: 3, TenDV: 'Spa thú cưng', LoaiDV: 'Spa', MoTa: 'Tắm, cắt tỉa lông, vệ sinh', GiaDichVu: 300000, GiaApDung: 250000, TrangThai: 'Hoạt động' },
        { MaDV: 4, TenDV: 'Phẫu thuật nhỏ', LoaiDV: 'Phẫu thuật', MoTa: 'Các ca phẫu thuật nhỏ', GiaDichVu: 2000000, GiaApDung: 2000000, TrangThai: 'Hoạt động' },
        { MaDV: 5, TenDV: 'Nha khoa', LoaiDV: 'Khám bệnh', MoTa: 'Làm sạch răng, nhổ răng', GiaDichVu: 500000, GiaApDung: 450000, TrangThai: 'Tạm dừng' },
      ];
      setServices(mockServices);
      // const data = await branchManagerService.getBranchServices(branchId);
      // setServices(data.data.services || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service.MaDV);
    setEditForm({
      TrangThai: service.TrangThai || 'Hoạt động'
    });
  };

  const handleCancel = () => {
    setEditingService(null);
    setEditForm({});
  };

  const handleSave = async (serviceId) => {
    try {
      setSaving(true);
      await branchManagerService.updateBranchService(branchId, serviceId, editForm);
      
      // Update local state
      setServices(services.map(s => 
        s.MaDV === serviceId 
          ? { ...s, ...editForm }
          : s
      ));
      
      setEditingService(null);
      setEditForm({});
      
      alert('Cập nhật dịch vụ thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật dịch vụ:', error);
      alert('Có lỗi xảy ra khi cập nhật dịch vụ');
    } finally {
      setSaving(false);
    }
  };

  const getServiceTypeColor = (type) => {
    const colors = {
      'Khám bệnh': 'bg-blue-100 text-blue-800',
      'Tiêm phòng': 'bg-green-100 text-green-800',
      'Spa': 'bg-purple-100 text-purple-800',
      'Phẫu thuật': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ chi nhánh</h2>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 Bạn có thể chỉnh sửa trạng thái của dịch vụ tại chi nhánh này.
        </p>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Không có dịch vụ nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã DV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => {
                  const isEditing = editingService === service.MaDV;
                  
                  return (
                    <tr key={service.MaDV} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.MaDV}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.TenDV}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {isEditing ? (
                          <select
                            value={editForm.TrangThai}
                            onChange={(e) => setEditForm({ ...editForm, TrangThai: e.target.value })}
                            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Tạm dừng">Tạm dừng</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.TrangThai === 'Hoạt động' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.TrangThai || 'Hoạt động'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSave(service.MaDV)}
                              disabled={saving}
                              className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                              title="Lưu"
                            >
                              <SaveIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={saving}
                              className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                              title="Hủy"
                            >
                              <XIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(service)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Chỉnh sửa"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Tổng số dịch vụ</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{services.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Dịch vụ hoạt động</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {services.filter(s => s.TrangThai === 'Hoạt động').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Dịch vụ tạm dừng</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">
            {services.filter(s => s.TrangThai === 'Tạm dừng').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagementView;
