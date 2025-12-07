import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import { 
  PetIcon, 
  CalendarIcon, 
  StarIcon,
  ClockIcon,
  MapPinIcon,
  AwardIcon
} from '@components/common/icons';

const DashboardHome = () => {
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
                <p className="text-3xl font-bold text-gray-900">3</p>
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
                <p className="text-3xl font-bold text-gray-900">2</p>
                <span className="text-xs text-gray-500">Sắp tới</span>
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
                <p className="text-3xl font-bold text-gray-900">1,250</p>
                <span className="text-xs text-gray-500">Điểm khả dụng</span>
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
                <CalendarIcon size={20} /> Lịch hẹn sắp tới
              </h2>
              <a href="/customer/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả →
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-xs">Th12</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Khám sức khỏe định kỳ</h4>
                  <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <PetIcon size={14} /> Max - Chó Golden Retriever
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon size={14} /> Chi nhánh Quận 1
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                  <div className="text-2xl font-bold">20</div>
                  <div className="text-xs">Th12</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Tiêm phòng văc-xin</h4>
                  <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <PetIcon size={14} /> Luna - Mèo Ba Tư
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon size={14} /> Chi nhánh Quận 3
                  </p>
                </div>
              </div>
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
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center">
                  <PetIcon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Max</h4>
                  <p className="text-sm text-gray-600">Golden Retriever • 3 tuổi</p>
                </div>
                <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">Chi tiết</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center">
                  <PetIcon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Luna</h4>
                  <p className="text-sm text-gray-600">Mèo Ba Tư • 2 tuổi</p>
                </div>
                <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">Chi tiết</button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl flex items-center justify-center">
                  <PetIcon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Bunny</h4>
                  <p className="text-sm text-gray-600">Thỏ Hà Lan • 1 tuổi</p>
                </div>
                <button className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">Chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboard>
  );
};

export default DashboardHome;
