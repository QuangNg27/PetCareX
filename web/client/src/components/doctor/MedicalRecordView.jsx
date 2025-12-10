import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  XIcon,
} from "@components/common/icons";

const MedicalRecordView = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([
    {
      id: 1,
      MaLichHen: "LH001",
      TenKhachHang: "Nguyễn Văn A",
      TenThuCung: "Max",
      NgayKham: "2024-12-05",
      TrieuChung: "Ho, sốt",
      ChanDoan: "Viêm đường hô hấp",
      ToaThuoc: "Paracetamol 500mg x2/ngày, Amoxicillin 250mg x3/ngày",
      NgayTaiKham: "2024-12-12",
      TrangThai: "Đã khám",
    },
    {
      id: 2,
      MaLichHen: "LH002",
      TenKhachHang: "Trần Thị B",
      TenThuCung: "Luna",
      NgayKham: "2024-12-06",
      TrieuChung: "Tiêu chảy, không ăn",
      ChanDoan: "Viêm dạ dày",
      ToaThuoc: "Probiotics, Omeprazole 10mg x2/ngày",
      NgayTaiKham: "2024-12-13",
      TrangThai: "Đã khám",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    MaLichHen: "",
    TenKhachHang: "",
    TenThuCung: "",
    NgayKham: "",
    TrieuChung: "",
    ChanDoan: "",
    ToaThuoc: "",
    NgayTaiKham: "",
    TrangThai: "Chưa khám",
  });

  const handleAddClick = () => {
    setFormData({
      MaLichHen: "",
      TenKhachHang: "",
      TenThuCung: "",
      NgayKham: "",
      TrieuChung: "",
      ChanDoan: "",
      ToaThuoc: "",
      NgayTaiKham: "",
      TrangThai: "Chưa khám",
    });
    setShowAddForm(true);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setRecords(
        records.map((r) =>
          r.id === editingId ? { ...formData, id: editingId } : r
        )
      );
      setEditingId(null);
    } else {
      setRecords([...records, { ...formData, id: Date.now() }]);
    }
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hồ sơ y tế</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {records.length} hồ sơ
          </p>
        </div>
        {!showAddForm && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={handleAddClick}
          >
            <PlusIcon size={18} /> Thêm hồ sơ
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? "Chỉnh sửa hồ sơ" : "Thêm hồ sơ mới"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã lịch hẹn *
              </label>
              <input
                type="text"
                value={formData.MaLichHen}
                onChange={(e) =>
                  setFormData({ ...formData, MaLichHen: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={editingId !== null}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng *
              </label>
              <input
                type="text"
                value={formData.TenKhachHang}
                onChange={(e) =>
                  setFormData({ ...formData, TenKhachHang: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thú cưng *
              </label>
              <input
                type="text"
                value={formData.TenThuCung}
                onChange={(e) =>
                  setFormData({ ...formData, TenThuCung: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày khám *
              </label>
              <input
                type="date"
                value={formData.NgayKham}
                onChange={(e) =>
                  setFormData({ ...formData, NgayKham: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.TrangThai}
                onChange={(e) =>
                  setFormData({ ...formData, TrangThai: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Chưa khám">Chưa khám</option>
                <option value="Đã khám">Đã khám</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Triệu chứng *
            </label>
            <textarea
              value={formData.TrieuChung}
              onChange={(e) =>
                setFormData({ ...formData, TrieuChung: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Mô tả triệu chứng..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chẩn đoán *
            </label>
            <textarea
              value={formData.ChanDoan}
              onChange={(e) =>
                setFormData({ ...formData, ChanDoan: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Kết quả chẩn đoán..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Toa thuốc *
            </label>
            <textarea
              value={formData.ToaThuoc}
              onChange={(e) =>
                setFormData({ ...formData, ToaThuoc: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Danh sách thuốc và liều lượng..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày tái khám
            </label>
            <input
              type="date"
              value={formData.NgayTaiKham}
              onChange={(e) =>
                setFormData({ ...formData, NgayTaiKham: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <SaveIcon size={18} /> Lưu
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              <XIcon size={18} /> Hủy
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Mã LH
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Thú cưng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ngày khám
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Triệu chứng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Chẩn đoán
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ngày tái khám
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {record.MaLichHen}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.TenKhachHang}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.TenThuCung}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(record.NgayKham).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-xs truncate" title={record.TrieuChung}>
                    {record.TrieuChung}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-xs truncate" title={record.ChanDoan}>
                    {record.ChanDoan}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.NgayTaiKham
                    ? new Date(record.NgayTaiKham).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.TrangThai === "Đã khám"
                        ? "bg-green-100 text-green-800"
                        : record.TrangThai === "Chưa khám"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.TrangThai}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <DeleteIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalRecordView;
