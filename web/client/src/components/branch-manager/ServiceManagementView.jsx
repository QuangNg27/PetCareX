import React, { useState, useEffect } from 'react';
import { branchManagerService } from '@services/branchManagerService';
import { useAuth } from '@context/AuthContext';
import { EditIcon, SaveIcon, XIcon } from '@components/common/icons';

const ServiceManagementView = () => {
  const { user } = useAuth();
  const branchId = user?.MaCN;
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (branchId) {
      fetchServices();
    }
  }, [branchId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await branchManagerService.getBranchServices(branchId);
      console.log('Services data:', data);
      setServices(data.services || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (service) => {
    const newStatus = service.TrangThai === 'Hoạt động' ? 'Tạm dừng' : 'Hoạt động';
    
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${newStatus === 'Hoạt động' ? 'kích hoạt' : 'tạm dừng'} dịch vụ "${service.TenDV}"?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      await branchManagerService.updateServiceStatus(branchId, service.MaDV, newStatus);
      
      // Update local state
      setServices(services.map(s => 
        s.MaDV === service.MaDV 
          ? { ...s, TrangThai: newStatus }
          : s
      ));
      
      alert(`Cập nhật trạng thái dịch vụ thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái dịch vụ:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái dịch vụ');
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
          💡 Danh sách các dịch vụ hiện có tại chi nhánh này và giá áp dụng hiện tại.
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
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã DV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
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
                {services.map((service) => (
                  <tr key={service.MaDV} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.MaDV}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.TenDV}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {service.Gia ? service.Gia.toLocaleString('vi-VN') + ' ₫' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        service.TrangThai === 'Hoạt động' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.TrangThai}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        disabled={saving}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          service.TrangThai === 'Hoạt động'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {service.TrangThai === 'Hoạt động' ? 'Tạm dừng' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Tổng số dịch vụ</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{services.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Dịch vứ hoạt động</p>
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
