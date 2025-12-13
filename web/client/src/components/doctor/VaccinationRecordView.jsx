import React, { useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  XIcon,
} from "@components/common/icons";

const VaccinationRecordView = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([
    {
      id: 1,
      MaLichHen: "LH001",
      TenThuCung: "Max",
      TenVacXin: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
      LieuLuong: "1ml",
      NgayTiem: "2024-12-01",
      NgayTiemTiep: "2025-03-01",
      TrangThai: "Đã tiêm",
      GhiChu: "Tiêm lần thứ 1",
    },
    {
      id: 2,
      MaLichHen: "LH002",
      TenThuCung: "Luna",
      TenVacXin: "Rabies (Bệnh dại)",
      LieuLuong: "0.5ml",
      NgayTiem: "2024-12-02",
      NgayTiemTiep: "2025-12-02",
      TrangThai: "Đã tiêm",
      GhiChu: "Tiêm lần đầu",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    MaLichHen: "",
    TenThuCung: "",
    TenVacXin: "",
    LieuLuong: "",
    NgayTiem: "",
    NgayTiemTiep: "",
    TrangThai: "Chưa tiêm",
    GhiChu: "",
  });

  const vaccinationOptions = [
    "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
    "Rabies (Bệnh dại)",
    "Leptospirosis",
    "Bordetella",
    "FeLV (Feline Leukemia)",
    "FIV (Feline Immunodeficiency Virus)",
    "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
    "Khác",
  ];

  const handleAddClick = () => {
    setFormData({
      MaLichHen: "",
      TenThuCung: "",
      TenVacXin: "",
      LieuLuong: "",
      NgayTiem: "",
      NgayTiemTiep: "",
      TrangThai: "Chưa tiêm",
      GhiChu: "",
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
          <h2 className="text-2xl font-bold text-gray-900">Hồ sơ tiêm chủng</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {records.length} bản ghi
          </p>
        </div>
        {!showAddForm && (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={handleAddClick}
          >
            <PlusIcon size={18} /> Thêm bản ghi
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingId
              ? "Chỉnh sửa hồ sơ tiêm chủng"
              : "Thêm hồ sơ tiêm chủng mới"}
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
                Tên vắc-xin *
              </label>
              <select
                value={formData.TenVacXin}
                onChange={(e) =>
                  setFormData({ ...formData, TenVacXin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Chọn vắc-xin</option>
                {vaccinationOptions.map((vaccine) => (
                  <option key={vaccine} value={vaccine}>
                    {vaccine}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liều lượng *
              </label>
              <input
                type="text"
                value={formData.LieuLuong}
                onChange={(e) =>
                  setFormData({ ...formData, LieuLuong: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="vd: 1ml, 0.5ml"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tiêm *
              </label>
              <input
                type="date"
                value={formData.NgayTiem}
                onChange={(e) =>
                  setFormData({ ...formData, NgayTiem: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tiêm tiếp theo
              </label>
              <input
                type="date"
                value={formData.NgayTiemTiep}
                onChange={(e) =>
                  setFormData({ ...formData, NgayTiemTiep: e.target.value })
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
                <option value="Chưa tiêm">Chưa tiêm</option>
                <option value="Đã tiêm">Đã tiêm</option>
                <option value="Quá hạn">Quá hạn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              value={formData.GhiChu}
              onChange={(e) =>
                setFormData({ ...formData, GhiChu: e.target.value })
              }
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ghi chú thêm..."
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
                Thú cưng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Tên vắc-xin
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Liều lượng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ngày tiêm
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ngày tiêm tiếp
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Ghi chú
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
                  {record.TenThuCung}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-xs" title={record.TenVacXin}>
                    {record.TenVacXin}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.LieuLuong}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(record.NgayTiem).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.NgayTiemTiep
                    ? new Date(record.NgayTiemTiep).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.TrangThai === "Đã tiêm"
                        ? "bg-green-100 text-green-800"
                        : record.TrangThai === "Chưa tiêm"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.TrangThai}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-xs truncate" title={record.GhiChu}>
                    {record.GhiChu || "-"}
                  </div>
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

export default VaccinationRecordView;
