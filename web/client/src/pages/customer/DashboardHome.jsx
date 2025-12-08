import React, { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import customerService from '@services/customerService';
import { 
  PetIcon, 
  CalendarIcon, 
  StarIcon,
  ClockIcon,
  MapPinIcon,
  AwardIcon
} from '@components/common/icons';

const DashboardHome = () => {
  const { user, pets: cachedPets, spending: cachedSpending, appointments: cachedAppointments, fetchPets, fetchUserData, fetchAppointments } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // If we have all cached data, use it immediately
    if (cachedPets && cachedSpending && cachedAppointments) {
      return;
    }

    // Otherwise, fetch fresh data
    setLoading(true);
    try {
      await Promise.all([
        fetchPets(),
        fetchUserData(),
        fetchAppointments()
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
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

  const getPetColor = (type) => {
    const colors = {
      'Chó': 'from-blue-500 to-blue-600',
      'Mèo': 'from-orange-500 to-orange-600',
      'Thỏ': 'from-pink-500 to-pink-600',
      'Chim': 'from-green-500 to-green-600',
      'Khác': 'from-gray-500 to-gray-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const totalPets = cachedPets?.length || 0;
  const appointments = cachedAppointments || [];
  const upcomingAppointments = appointments.length;
  const loyaltyPoints = user?.DiemLoyalty || 0;
  const membershipTier = user?.TenCapDo || 'Cơ bản';
  const yearlySpending = cachedSpending?.ChiTieuNam || 0;

  const displayPets = cachedPets || [];

  const formatDate = (dateString) => {
    if (!dateString) return { day: '--', month: '--' };
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: `Th${date.getMonth() + 1}`
    };
  };

  return (
    <CustomerDashboard>
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center">
                <PetIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Thú cưng</h3>
                <p className="text-3xl font-bold text-gray-900">{totalPets}</p>
                <span className="text-xs text-gray-500">Đang chăm sóc</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center">
                <CalendarIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Lịch hẹn</h3>
                <p className="text-3xl font-bold text-gray-900">{upcomingAppointments}</p>
                <span className="text-xs text-gray-500">Đã đặt</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center">
                <StarIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Điểm tích lũy</h3>
                <p className="text-3xl font-bold text-gray-900">{loyaltyPoints.toLocaleString('vi-VN')}</p>
                <span className="text-xs text-gray-500">Hạng {membershipTier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <CalendarIcon size={20} /> Lịch hẹn gần đây
              </h2>
              <a href="/customer/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </a>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>Chưa có lịch hẹn nào</p>
                </div>
              ) : (
                appointments.slice(0, 2).map((apt, index) => {
                  const { day, month } = formatDate(apt.NgayHen);
                  return (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                        <div className="text-2xl font-bold">{day}</div>
                        <div className="text-xs">{month}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{apt.TenDichVu}</h4>
                        <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <PetIcon size={14} /> {apt.TenThuCung} - {apt.LoaiThuCung}
                        </p>
                        {apt.TenChiNhanh && (
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPinIcon size={14} /> {apt.TenChiNhanh}
                          </p>
                        )}
                        {apt.ChanDoan && (
                          <p className="text-xs text-gray-500 mt-1">Chẩn đoán: {apt.ChanDoan}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* My Pets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <PetIcon size={20} /> Thú cưng của tôi
              </h2>
              <a href="/customer/pets" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </a>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : displayPets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Chưa có thú cưng nào</div>
              ) : (
                displayPets.slice(0, 3).map((pet) => (
                  <div key={pet.MaTC} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getPetColor(pet.Loai)} text-white rounded-xl flex items-center justify-center`}>
                      <PetIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{pet.Ten}</h4>
                      <p className="text-sm text-gray-600">{pet.Giong} • {calculateAge(pet.NgaySinh)}</p>
                    </div>
                    <a href="/customer/pets" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">Chi tiết</a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboard>
  );
};

export default DashboardHome;
