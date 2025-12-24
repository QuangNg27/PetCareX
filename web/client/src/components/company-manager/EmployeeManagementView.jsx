import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from '../layout/ConfirmOverlay/confirmationBox';
import { employeeSchema } from './employeeSchema';
import { companyManagerService } from '@services/companyManagerService';

const EmployeeManagementView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployeeData] = useState([]);
  const [employeeRoles, setRoles] = useState([]);
  const [branch, setBranch] = useState([]);

  const [showDialog, setShowDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await companyManagerService.getEmployees();
      console.log('Customer stats:', data);
      setEmployeeData(data.data.employee_data);
      setRoles(data.data.role_data);
      setBranch(data.data.branch_data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê nhân viên:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const removeEmployees = async (id) => {
    try {
      const response = await companyManagerService.deleteEmployee(id);
      if (response.success) {
        setEmployeeData(prev => prev.filter(emp => emp.id !== id));
      }
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
    }
  }

  const roles = employeeRoles.map(r => r.ChucVu);

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = filterBranch === 'all' || emp.currentBranch === filterBranch;
    const matchRole = filterRole === 'all' || emp.role === filterRole;
    return matchSearch && matchBranch && matchRole;
  });

  //////////////////////// EDIT and ADD

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
  if (showEditModal && selectedEmployee) {
    // Populate for editing
    reset({
      fullName: selectedEmployee.name,
      gender: selectedEmployee.gender,
      dob: selectedEmployee.dob,
      entryDate: selectedEmployee.startDate,
      role: selectedEmployee.role,
      branch: selectedEmployee.branch,
      salary: selectedEmployee.salary,
    });
  } else if (showAddModal) {
    // Clear form for adding
    reset({
      fullName: "",
      gender: "",
      dob: "",
      entryDate: "",
      role: "",
      branch: "",
      salary: 0,
    })
  }
}, [showAddModal, showEditModal, selectedEmployee, reset]);

  const editFormRef = useRef();

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const onSubmit = async (data) => {
  try {
    if (selectedEmployee) {
      // Edit
      const response = await companyManagerService.updateEmployee(selectedEmployee.id, data);
  
      if (!response.success) throw new Error("Cập nhật thất bại");
      setEmployeeData(prev =>
        prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...response.data } : emp)
      );
    } else {
      // Add 
      console.log("Adding employee with data:", data);
      const response = await companyManagerService.addEmployee(data);

      if (!response.success) throw new Error("Thêm thất bại");
      setEmployeeData(prev => [...prev, response.data]);
    }

    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedEmployee(null);
    reset();
  } catch (err) {
    console.error(err);
  }
};
  //////////////////////// DELETE

  const handleConfirm = () => {
    setConfirmed(true);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleDelete = (id, employeeObject) => {
    setDeleteId(id);     
    setSelectedEmployee(employeeObject);
    setShowDialog(true); 
  };

  useEffect(() => {
  if (!confirmed || deleteId === null) return;

  removeEmployees(deleteId);

  setConfirmed(false);
  setDeleteId(null);
  }, [confirmed]);

  //////////////////////// 

  const handleViewHistory = (employee) => {
    setSelectedEmployee(employee);
    setShowHistoryModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tên nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi nhánh
            </label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="none">Không có chi nhánh</option>
              {branch.map(b => (
                <option key={b.MaCN} value={b.TenCN}>{b.TenCN}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chức vụ
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              + Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách nhân viên
          </h3>
          <span className="text-sm text-gray-600">
            Tổng: {filteredEmployees.length} nhân viên
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mã NV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Giới tính
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ngày vào làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Chi nhánh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewHistory(employee)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    NV{employee.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(employee.dob)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(employee.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.currentBranch === "none" ? "Không có" : employee.currentBranch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(employee.salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id, employee)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Xóa
                      </button>

                      {showDialog && (
                        <ConfirmDialog
                          message={`Bạn có chắc chắn muốn xóa nhân viên: ${selectedEmployee?.name || selectedEmployee?.id}?`}
                          onConfirm={handleConfirm}
                          onCancel={handleCancel}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form 
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            ref={editFormRef}
            key={showEditModal ? selectedEmployee?.id : "add"} 
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showAddModal ? 'Thêm nhân viên mới' : 'Cập nhật thông tin nhân viên'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  name='fullName'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  {...register("gender")}
                  name='gender'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  {...register("dob")}
                  name="dob"
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày vào làm
                </label>
                <input
                  {...register("entryDate")}
                  name='entryDate'
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.entryDate && <p className="text-red-500 text-sm">{errors.entryDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chức vụ
                </label>
                <select
                  {...register("role")}
                  name='role'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn chức vụ</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi nhánh
                </label>
                <select
                  {...register("branch")}
                  name='branch'
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn chi nhánh</option>
                  <option value="none">Không có chi nhánh</option>
                  {branch.map(b => (
                    <option key={b.MaCN} value={b.MaCN}>{b.TenCN}</option>
                  ))}
                </select>
                {errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lương
                </label>
                <input
                  {...register("salary", { valueAsNumber: true })}
                  name='salary'
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button"
                onClick={() => reset({
                  fullName: "",
                  gender: "",
                  dob: "",
                  entryDate: "",
                  role: "",
                  branch: "",
                  salary: 0,
                })} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedEmployee(null);
                  reset({
                    fullName: "",
                    gender: "",
                    dob: "",
                    entryDate: "",
                    role: "",
                    branch: "",
                    salary: 0,
                  })
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {showAddModal ? 'Thêm' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer History Modal */}
      {showHistoryModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Lịch sử điều động - {selectedEmployee.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mã NV: NV{selectedEmployee.id.toString().padStart(4, '0')} | 
                  Chi nhánh hiện tại: {selectedEmployee.branch}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedEmployee(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Employee Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Giới tính</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEmployee.gender}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Ngày sinh</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(selectedEmployee.dob)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Ngày vào làm</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(selectedEmployee.startDate)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Chức vụ</div>
                  <div className="text-sm font-medium text-gray-900">{selectedEmployee.role}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Lịch sử điều động</h4>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {selectedEmployee.transferHistory.map((transfer, index) => (
                  <div key={index} className="relative pl-10 pb-8 last:pb-0">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {index === 0 ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        )}
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-gray-900">
                          {transfer.from ? `${transfer.from} → ${transfer.to}` : `Vào làm: ${transfer.to}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transfer.date)}
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Hiện tại
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementView;
