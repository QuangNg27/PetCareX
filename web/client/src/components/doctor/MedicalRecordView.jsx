import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import doctorService from "@services/doctorService";
import productService from "@services/productService";
import customerService from "@services/customerService";
import {
  PlusIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  DeleteIcon,
} from "@components/common/icons";

const MedicalRecordView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    MaTC: "",
    MaDV: "",
    MaCN: "",
    MaNV: "",
    TenKhachHang: "",
    TenThuCung: "",
    NgayKham: "",
    TrieuChung: "",
    ChanDoan: "",
    ToaThuoc: "",
    NgayTaiKham: "",
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [pets, setPets] = useState([]);

  // Load danh sách hồ sơ
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const branchId = user?.MaCN;
        const res = await doctorService.getExaminations(branchId);
        const items =
          (res && (res.data || res.examinations)) ||
          (Array.isArray(res) ? res : []);

        if (!mounted) return;
        setRecords(
          items.map((r) => ({
            ...r,
            id: r.MaKB,
          }))
        );
      } catch (err) {
        console.error("Lỗi tải hồ sơ:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user?.MaCN]);

  // Load thuốc và thú cưng
  useEffect(() => {
    const loadDataForForm = async () => {
      try {
        const medicinesRes = await productService.getMedicines(
          user?.MaCN || null
        );
        setProducts(
          (medicinesRes && (medicinesRes.data || medicinesRes.products)) ||
            medicinesRes ||
            []
        );

        const petsRes = await customerService.pets.getAll();
        const petsList =
          (petsRes && (petsRes.data || petsRes.pets)) ||
          (Array.isArray(petsRes) ? petsRes : []);
        setPets(petsList);
      } catch (e) {
        console.warn("Lỗi tải dữ liệu form:", e);
      }
    };
    if (showAddForm) loadDataForForm();
  }, [showAddForm, user?.MaCN]);

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData({
      MaCN: user?.MaCN || "",
      MaNV: user?.MaNV || "",
      MaTC: "",
      MaDV: "2",
      NgayKham: new Date().toISOString().split("T")[0],
      TrieuChung: "",
      ChanDoan: "",
      NgayTaiKham: "",
      TenKhachHang: "",
      TenThuCung: "",
    });
    setPrescriptions([]);
    setShowAddForm(true);
  };

  const handleEdit = async (record) => {
    setEditingId(record.MaKB);
    setFormData({
      ...record,
      NgayKham: record.NgayKham
        ? new Date(record.NgayKham).toISOString().split("T")[0]
        : "",
    });

    try {
      const prescriptionsData = await doctorService.getPrescriptions(
        record.MaKB
      );
      const presc = prescriptionsData.data || prescriptionsData || [];
      setPrescriptions(
        presc.map((p) => ({
          MaSP: p.MaSP,
          SoLuong: p.SoLuong,
          TenSP: p.TenSP,
          Gia: p.Gia,
        }))
      );
    } catch (err) {
      console.error("Lỗi load thuốc:", err);
      setPrescriptions([]);
    }

    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // TRƯỜNG HỢP TẠO MỚI
      if (!editingId) {
        if (!formData.MaCN) {
          setError({ message: "Vui lòng nhập Mã Chi Nhánh" });
          setLoading(false);
          return;
        }
        if (!formData.MaNV) {
          setError({ message: "Vui lòng nhập Mã Nhân Viên" });
          setLoading(false);
          return;
        }
        if (!formData.MaTC) {
          setError({ message: "Vui lòng nhập hoặc chọn Mã Thú Cưng" });
          setLoading(false);
          return;
        }
        if (!formData.NgayKham) {
          setError({ message: "Vui lòng nhập Ngày khám" });
          setLoading(false);
          return;
        }

        const createPayload = {
          MaCN: parseInt(formData.MaCN),
          MaNV: user?.MaNV,
          MaTC: parseInt(formData.MaTC),
          MaDV: 2,
          NgayKham: formData.NgayKham,
          TrieuChung: formData.TrieuChung || null,
          ChanDoan: formData.ChanDoan || null,
          NgayTaiKham: formData.NgayTaiKham || null,
          prescriptions: prescriptions.filter((p) => p.MaSP && p.SoLuong > 0),
        };

        const result = await doctorService.createMedicalExamination(
          createPayload
        );

        toast.success("Tạo hồ sơ thành công!");
        window.location.reload();
        return;
      }

      // TRƯỜNG HỢP CẬP NHẬT
      const updatePayload = {
        examData: {
          TrieuChung: formData.TrieuChung,
          ChanDoan: formData.ChanDoan,
          NgayTaiKham: formData.NgayTaiKham || null,
        },
        prescriptions: prescriptions
          .filter((p) => p.MaSP && p.SoLuong > 0)
          .map((p) => ({
            MaSP: p.MaSP,
            SoLuong: p.SoLuong || 1,
          })),
      };

      await doctorService.updateMedicalExaminationWithPrescriptions(
        editingId,
        updatePayload
      );

      setRecords(
        records.map((r) =>
          r.MaKB === editingId ? { ...r, ...updatePayload.examData } : r
        )
      );
      toast.success("Cập nhật thành công!");
      setShowAddForm(false);
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Lỗi khi lưu dữ liệu";
      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const addPrescriptionRow = () =>
    setPrescriptions([...prescriptions, { MaSP: "", SoLuong: 1 }]);

  const removePrescriptionRow = async (idx) => {
    const prescription = prescriptions[idx];

    // Nếu là edit mode và thuốc đã được lưu vào DB (có TenSP)
    if (editingId && prescription.TenSP) {
      try {
        await doctorService.deletePrescription(editingId, prescription.MaSP);
        toast.success("Xóa thuốc thành công!");
      } catch (err) {
        console.error("Lỗi xóa thuốc:", err);
        toast.error(
          "Lỗi xóa thuốc: " + (err.response?.data?.message || err.message)
        );
        return;
      }
    }

    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const updatePrescriptionRow = (idx, field, value) => {
    setPrescriptions(
      prescriptions.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  };

  // --- RENDER ---
  return (
    <div className="p-6">
      {error && (
        <div className="text-red-600 mb-4 bg-red-50 p-2 rounded">
          {error.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hồ sơ y tế</h2>
          <p className="text-sm text-gray-600">
            Tổng số: {records.length} hồ sơ
          </p>
        </div>

        {/* Nút thêm mới */}
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={20} /> Tạo hồ sơ khám
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? `Chỉnh sửa hồ sơ #${editingId}` : "Tạo hồ sơ khám mới"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chỉ hiện dropdown chọn khi tạo mới */}
            {!editingId ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Chi Nhánh *
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập mã chi nhánh"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.MaCN}
                    onChange={(e) =>
                      setFormData({ ...formData, MaCN: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Nhân Viên *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded bg-gray-100"
                    value={formData.MaNV}
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tự động từ bác sĩ đang đăng nhập
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã Thú Cưng *
                  </label>
                  <input
                    type="number"
                    placeholder="Nhập mã hoặc chọn từ dropdown"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.MaTC}
                    onChange={(e) => {
                      setFormData({ ...formData, MaTC: e.target.value });
                      // Nếu có pet khớp với mã, cập nhật tên
                      const pet = pets.find(
                        (p) => p.MaTC === parseInt(e.target.value)
                      );
                      if (pet) {
                        setFormData((prev) => ({
                          ...prev,
                          TenThuCung: pet.Ten,
                          TenKhachHang: pet.TenKhachHang || "",
                        }));
                      }
                    }}
                    list="pets-list"
                  />
                  <datalist id="pets-list">
                    {pets.map((pet) => (
                      <option
                        key={pet.MaTC}
                        value={pet.MaTC}
                        label={`${pet.Ten} (${pet.Loai}) - ${pet.TenKhachHang}`}
                      />
                    ))}
                  </datalist>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">Khách hàng</label>
                  <div className="p-2 bg-gray-100 rounded">
                    {formData.TenKhachHang}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Thú cưng</label>
                  <div className="p-2 bg-gray-100 rounded">
                    {formData.TenThuCung}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày khám
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={formData.NgayKham}
                onChange={(e) =>
                  setFormData({ ...formData, NgayKham: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày tái khám
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded"
                value={formData.NgayTaiKham}
                onChange={(e) =>
                  setFormData({ ...formData, NgayTaiKham: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Triệu chứng
            </label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border rounded"
              value={formData.TrieuChung}
              onChange={(e) =>
                setFormData({ ...formData, TrieuChung: e.target.value })
              }
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Chẩn đoán</label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border rounded"
              value={formData.ChanDoan}
              onChange={(e) =>
                setFormData({ ...formData, ChanDoan: e.target.value })
              }
            />
          </div>

          {/* Phần kê đơn thuốc - CÓ XÓA */}
          <div className="mt-4 border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Kê đơn thuốc
            </label>
            {prescriptions.map((p, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                {editingId && p.TenSP ? (
                  <>
                    <div className="flex-1 px-3 py-2 bg-gray-50 rounded border">
                      {p.TenSP} {p.Gia && `(${p.Gia}đ)`}
                    </div>
                    <input
                      type="number"
                      className="border rounded w-20 px-2 py-1"
                      min="1"
                      value={p.SoLuong}
                      onChange={(e) =>
                        updatePrescriptionRow(
                          idx,
                          "SoLuong",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                    <button
                      onClick={() => removePrescriptionRow(idx)}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                      title="Xóa thuốc"
                    >
                      <XIcon size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <select
                      className="border rounded px-2 py-1 flex-1"
                      value={p.MaSP || ""}
                      onChange={(e) =>
                        updatePrescriptionRow(
                          idx,
                          "MaSP",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="">Chọn thuốc...</option>
                      {products.map((prod) => (
                        <option key={prod.MaSP} value={prod.MaSP}>
                          {prod.TenSP} (Ton: {prod.SLTonKho})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="border rounded w-20 px-2 py-1"
                      min="1"
                      value={p.SoLuong}
                      onChange={(e) =>
                        updatePrescriptionRow(
                          idx,
                          "SoLuong",
                          parseInt(e.target.value) || 1
                        )
                      }
                    />
                    <button
                      onClick={() => removePrescriptionRow(idx)}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                      title="Xóa thuốc"
                    >
                      <XIcon size={18} />
                    </button>
                  </>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPrescriptionRow}
              className="text-sm text-blue-600 hover:underline"
            >
              + Thêm thuốc
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <SaveIcon size={18} /> Lưu hồ sơ
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Thú cưng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Ngày khám
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Chẩn đoán
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.MaKB} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{record.TenKhachHang}</td>
                <td className="px-6 py-4 text-sm">{record.TenThuCung}</td>
                <td className="px-6 py-4 text-sm">
                  {record.NgayKham
                    ? new Date(record.NgayKham).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">
                  {record.ChanDoan}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(record)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Sửa"
                  >
                    <EditIcon size={18} />
                  </button>
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
