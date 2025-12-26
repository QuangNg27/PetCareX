import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@context/AuthContext";
import doctorService from "@services/doctorService";
import { EditIcon, ChevronDownIcon } from "@components/common/icons";

const VaccinationRecordView = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;

  const toggleRowExpand = (recordId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRows(newExpanded);
  };

  // Reset to page 1 when user/branch changes
  useEffect(() => {
    setCurrentPage(1);
  }, [user?.MaCN]);

  // no product selection anymore — this page only assigns the current doctor to a session

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log("VaccinationRecordView: user object =", user);

        // Guard: only load if user is authenticated AND has MaNV (doctor ID)
        if (!user || !user.MaTK || !user.MaNV) {
          // eslint-disable-next-line no-console
          console.warn(
            "VaccinationRecordView: incomplete user data, skipping API call. User=",
            user
          );
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        const branchId = user?.MaCN;
        // Debug: log branchId and call result to diagnose empty responses/timeouts
        // eslint-disable-next-line no-console
        console.log(
          "VaccinationRecordView: user authenticated, requesting vaccinations, branchId=",
          branchId,
          "user.MaNV=",
          user?.MaNV,
          "user.MaTK=",
          user?.MaTK
        );
        const res = await doctorService.getVaccinations(branchId);
        // eslint-disable-next-line no-console
        console.log("VaccinationRecordView: vaccinations response:", res);
        let items = [];
        let total = 0;

        if (res && res.data) {
          items = res.data;
          total = res.total || res.data.length;
        } else if (res && res.vaccinations) {
          items = res.vaccinations;
          total = res.totalCount || res.vaccinations.length;
        } else if (Array.isArray(res)) {
          items = res;
          total = res.length;
        }

        // Filter: only show vaccinations without assigned doctor or assigned to current user
        const filteredItems = items.filter(
          (r) => !r.MaNV || r.MaNV === user?.MaNV
        );

        if (!mounted) return;

        setTotalRecords(filteredItems.length);

        // Base mapping for vaccination sessions
        const baseRecords = filteredItems.map((r, idx) => ({
          id: r.id || r.MaTP || idx,
          MaTP: r.MaTP || r.id || null,
          TenThuCung: r.TenThuCung || r.petName || r.Ten || "",
          NgayTiem: r.NgayTiem || r.date || r.ngay || "",
          NgayTiemTiep: r.NgayTiemTiep || r.nextDate || "",
          TenKhachHang: r.TenKhachHang || r.customerName || "",
          TenBacSi: r.TenBacSi || r.doctorName || "",
          MaNV: r.MaNV || r.MaBacSi || null,
          // vaccines will be attached below by fetching details per MaTP
          Vaccines: [],
          GhiChu: r.GhiChu || r.note || "",
        }));

        // Try to fetch vaccine items (Chi_tiet_tiem_phong) for each session in parallel
        try {
          const detailsResponses = await Promise.all(
            baseRecords.map(async (rec) => {
              if (!rec.MaTP) return { MaTP: rec.MaTP, vaccines: [] };
              try {
                const dRes = await doctorService.getVaccinationDetails(
                  rec.MaTP
                );
                const vaccines = (dRes && (dRes.data || dRes.vaccines)) || [];
                return { MaTP: rec.MaTP, vaccines };
              } catch (e) {
                // eslint-disable-next-line no-console
                console.warn(
                  "Failed to load vaccination details for MaTP=",
                  rec.MaTP,
                  e
                );
                return { MaTP: rec.MaTP, vaccines: [] };
              }
            })
          );

          const detailsMap = new Map();
          detailsResponses.forEach((d) => detailsMap.set(d.MaTP, d.vaccines));

          const merged = baseRecords.map((rec) => ({
            ...rec,
            Vaccines: detailsMap.get(rec.MaTP) || [],
          }));

          // Paginate results
          const startIdx = (currentPage - 1) * itemsPerPage;
          const paginatedRecords = merged.slice(
            startIdx,
            startIdx + itemsPerPage
          );

          setRecords(paginatedRecords);
          setError(null); // Clear any previous errors on successful load
        } catch (e) {
          // If details fetching fails, still show baseRecords
          // eslint-disable-next-line no-console
          console.error("Error fetching vaccination details:", e);
          // Paginate baseRecords
          const startIdx = (currentPage - 1) * itemsPerPage;
          const paginatedRecords = baseRecords.slice(
            startIdx,
            startIdx + itemsPerPage
          );
          setRecords(paginatedRecords);
          setError(null); // Clear errors on successful base records load
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Lỗi tải hồ sơ tiêm chủng:", err);
        const message =
          err?.response?.data?.message || err?.message || "Lỗi khi gọi API";
        const status = err?.response?.status || null;
        setError({ message, status, raw: err });
        // fallback: keep empty so dev knows API failed
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user, currentPage]);

  // Assign the current logged-in doctor (user.MaNV) to the vaccination session.
  // The backend `updateVaccinationDetails` endpoint will accept an empty details array
  // and should set MaNV = req.user.MaNV. We call it with [] to trigger assignment.
  const handleAssign = async (record) => {
    if (!record) return;
    if (record.MaNV) {
      toast.error("Phiên này đã có bác sĩ phụ trách");
      return;
    }

    try {
      setLoading(true);
      const id = record.MaTP || record.id;
      await doctorService.updateVaccinationDetails(id, []);
      // Update local record to mark it assigned to the current user
      setRecords((prev) =>
        prev.map((r) =>
          r.id === record.id || r.MaTP === record.MaTP
            ? {
                ...r,
                MaNV: user?.MaNV || r.MaNV,
                TenBacSi: user?.Ten || user?.HoTen || r.TenBacSi,
              }
            : r
        )
      );
      toast.success(
        `Nhận phiên tiêm cho ${record.TenThuCung || "(không tên)"} thành công!`
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to assign vaccination session:", err);
      toast.error("Gán phiên thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          Lỗi khi tải dữ liệu: {error.message || JSON.stringify(error)}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tiêm phòng</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng số: {records.length} bản ghi
          </p>
        </div>
        {/* Create/add disabled: component is edit-only per requirements */}
      </div>

      {/* Form removed: this page does not create new vaccination records; doctors only assign themselves to sessions */}

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Thú cưng
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Bác sĩ phụ trách
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
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.map((record) => (
              <React.Fragment key={record.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.TenThuCung}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.MaNV ? (
                      <span title={record.TenBacSi}>
                        MaNV: {record.MaNV}
                        {record.TenBacSi && (
                          <div className="text-xs text-gray-500">
                            {record.TenBacSi}
                          </div>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {/* summary: show comma-separated vaccine names if available */}
                    <div
                      className="max-w-xs truncate"
                      title={
                        record.Vaccines && record.Vaccines.length
                          ? record.Vaccines.map(
                              (v) =>
                                v.TenVaccine || v.TenSP || v.TenVacXin || v.name
                            ).join(", ")
                          : "-"
                      }
                    >
                      {record.Vaccines && record.Vaccines.length
                        ? record.Vaccines.map(
                            (v) =>
                              v.TenVaccine || v.TenSP || v.TenVacXin || v.name
                          ).join(", ")
                        : "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.Vaccines && record.Vaccines.length
                      ? record.Vaccines.map((v) => v.LieuLuong || "-").join(
                          ", "
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.NgayTiem
                      ? new Date(record.NgayTiem).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAssign(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Nhận phiên tiêm"
                      >
                        <EditIcon size={18} />
                      </button>
                      <button
                        onClick={() => toggleRowExpand(record.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={
                          expandedRows.has(record.id)
                            ? "Ẩn chi tiết"
                            : "Xem chi tiết"
                        }
                      >
                        <ChevronDownIcon
                          size={18}
                          className={`transform transition-transform ${
                            expandedRows.has(record.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Details row: show vaccine item rows matching the SQL - only if expanded */}
                {expandedRows.has(record.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      {record.Vaccines && record.Vaccines.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-gray-700">
                            <thead>
                              <tr>
                                <th className="px-3 py-2 text-left font-medium">
                                  Thú cưng
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Tên vắc-xin
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Liều lượng
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                  Ngày tiêm
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {record.Vaccines.map((v, i) => (
                                <tr key={i} className="">
                                  <td className="px-3 py-2">
                                    {v.TenThuCung || record.TenThuCung || "-"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {v.TenVaccine ||
                                      v.TenSP ||
                                      v.TenVacXin ||
                                      v.name ||
                                      "-"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {v.LieuLuong || "-"}
                                  </td>
                                  <td className="px-3 py-2">
                                    {v.NgayTiem
                                      ? new Date(v.NgayTiem).toLocaleDateString(
                                          "vi-VN"
                                        )
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Không có vắc-xin chi tiết cho phiên này.
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRecords > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {Math.ceil(totalRecords / itemsPerPage)}{" "}
            (Tổng: {totalRecords})
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ← Trước
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(totalRecords / itemsPerPage),
                    currentPage + 1
                  )
                )
              }
              disabled={currentPage >= Math.ceil(totalRecords / itemsPerPage)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationRecordView;
