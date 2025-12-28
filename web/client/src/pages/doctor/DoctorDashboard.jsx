import React, { useEffect, useState } from "react";
import DoctorDashboardLayout from "@components/layout/DoctorDashboard/DoctorDashboardLayout";
import {
  ClipboardIcon,
  ShieldIcon,
  CalendarIcon,
  CheckIcon,
} from "@components/common/icons";
import doctorService from "../../services/doctorService";
import { useAuth } from "@context/AuthContext";

const DoctorDashboard = () => {
  const [examinations, setExaminations] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { initialized, user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);

        // Compute branch id from possible user fields
        const branchId =
          user?.MaCN ||
          user?.MaChiNhanh ||
          user?.Ma_CN ||
          user?.branchId ||
          null;

        const [exRes, vacRes] = await Promise.all([
          doctorService.getExaminations(branchId),
          doctorService.getVaccinations(branchId),
        ]);

        if (!mounted) return;

        setExaminations(Array.isArray(exRes?.data) ? exRes.data : exRes || []);
        setVaccinations(
          Array.isArray(vacRes?.data) ? vacRes.data : vacRes || []
        );
      } catch (err) {
        // keep empty arrays on error; developer can inspect console
        // eslint-disable-next-line no-console
        console.error("Failed to load doctor dashboard data:", err);
        setExaminations([]);
        setVaccinations([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Only load after auth is initialized so token is attached to apiClient
    if (initialized) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [initialized, user]);

  const recentRecords = [...examinations]
    .map((e) => ({
      title: e.ChanDoan || e.TenDV || "Khám bệnh",
      pet: e.TenThuCung || e.TenThuCungName || "-",
      date: e.NgayKham || e.Ngay || e.date || null,
      symptoms: e.TrieuChung || e.TrieuChungBenh || "-",
    }))
    .filter((r) => r.date)
    .map((r) => ({ ...r, dateObj: new Date(r.date) }))
    .filter((r) => !Number.isNaN(r.dateObj.getTime()))
    .sort((a, b) => b.dateObj - a.dateObj)
    .slice(0, 3);

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString();
  };

  const formatTime = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const stats = {
    examinedThisMonth: examinations.filter((e) => {
      const dt = new Date(e.NgayKham || e.Ngay || e.date || null);
      if (Number.isNaN(dt.getTime())) return false;
      const now = new Date();
      // Also ensure the record belongs to this doctor's branch and to this doctor
      const branchId =
        user?.MaCN || user?.MaChiNhanh || user?.Ma_CN || user?.branchId || null;
      const empId = user?.MaNV || null;
      const matchBranch = branchId == null ? true : e?.MaCN == branchId;
      const matchEmp = empId == null ? true : e?.MaNV == empId;

      return (
        dt.getMonth() === now.getMonth() &&
        dt.getFullYear() === now.getFullYear() &&
        matchBranch &&
        matchEmp
      );
    }).length,
    totalProfiles: (() => {
      const branchId =
        user?.MaCN || user?.MaChiNhanh || user?.Ma_CN || user?.branchId || null;
      const empId = user?.MaNV || null;
      return examinations.filter((e) => {
        const eBranch =
          e?.MaCN || e?.MaChiNhanh || e?.Ma_CN || e?.branchId || null;
        const branchMatch = branchId == null ? true : eBranch === branchId;
        const empMatch = empId == null ? true : e?.MaNV === empId;
        return branchMatch && empMatch;
      }).length;
    })(),
    vaccinatedThisMonth: vaccinations.filter((v) => {
      const dt = new Date(v.NgayTiem || v.Ngay || v.date || null);
      if (Number.isNaN(dt.getTime())) return false;
      const now = new Date();
      const branchId =
        user?.MaCN || user?.MaChiNhanh || user?.Ma_CN || user?.branchId || null;
      const empId = user?.MaNV || null;
      const matchBranch = branchId == null ? true : v?.MaCN == branchId;
      const matchEmp = empId == null ? true : v?.MaNV == empId;
      return (
        dt.getMonth() === now.getMonth() &&
        dt.getFullYear() === now.getFullYear() &&
        matchBranch &&
        matchEmp
      );
    }).length,
  };
  return (
    <DoctorDashboardLayout title="Tổng quan">
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center">
                <CheckIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Đã khám
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.examinedThisMonth}
                </p>
                <span className="text-xs text-gray-500">Tháng này</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center">
                <ClipboardIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Hồ sơ y tế
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.totalProfiles}
                </p>
                <span className="text-xs text-gray-500">Tổng cộng</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center">
                <ShieldIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Tiêm chủng
                </h3>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.vaccinatedThisMonth}
                </p>
                <span className="text-xs text-gray-500">Tháng này</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upcoming appointments removed per request */}

          {/* Recent Medical Records */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <ClipboardIcon size={20} /> Hồ sơ y tế gần đây
              </h2>
              <a
                href="/doctor/medical-records"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Xem tất cả →
              </a>
            </div>
            <div className="space-y-4">
              {loading && (
                <div className="text-sm text-gray-500">Đang tải hồ sơ...</div>
              )}
              {!loading && recentRecords.length === 0 && (
                <div className="text-sm text-gray-500">Chưa có hồ sơ y tế</div>
              )}
              {!loading &&
                recentRecords.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <ClipboardIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {rec.pet} | {formatDate(rec.date)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Triệu chứng: {rec.symptoms}
                      </p>
                    </div>
                    {/* status badge removed per request */}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboard;
