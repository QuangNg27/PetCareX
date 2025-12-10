import React from "react";
import DoctorDashboardLayout from "@components/layout/DoctorDashboard/DoctorDashboardLayout";
import {
  ClipboardIcon,
  ShieldIcon,
  CalendarIcon,
  CheckIcon,
} from "@components/common/icons";

const DoctorDashboard = () => {
  return (
    <DoctorDashboardLayout title="Tổng quan">
      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center">
                <CalendarIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Lịch hẹn hôm nay
                </h3>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <span className="text-xs text-gray-500">Chưa xử lý</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center">
                <CheckIcon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Đã khám
                </h3>
                <p className="text-3xl font-bold text-gray-900">28</p>
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
                <p className="text-3xl font-bold text-gray-900">156</p>
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
                <p className="text-3xl font-bold text-gray-900">89</p>
                <span className="text-xs text-gray-500">Tháng này</span>
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
              <a
                href="/doctor/medical-records"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Xem tất cả →
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                  <div className="text-2xl font-bold">08:30</div>
                  <div className="text-xs">AM</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Khám sức khỏe định kỳ
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Max - Chó Golden Retriever
                  </p>
                  <p className="text-sm text-gray-600">
                    Khách hàng: Nguyễn Văn A
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                  <div className="text-2xl font-bold">10:00</div>
                  <div className="text-xs">AM</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Tiêm phòng vắc-xin
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">Luna - Mèo Ba Tư</p>
                  <p className="text-sm text-gray-600">
                    Khách hàng: Trần Thị B
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg">
                  <div className="text-2xl font-bold">14:00</div>
                  <div className="text-xs">PM</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Khám bệnh
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Bunny - Thỏ Hà Lan
                  </p>
                  <p className="text-sm text-gray-600">Khách hàng: Lê Văn C</p>
                </div>
              </div>
            </div>
          </div>

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
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    Viêm đường hô hấp
                  </h4>
                  <p className="text-sm text-gray-600">
                    Max - Chó | 05/12/2024
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Triệu chứng: Ho, sốt
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex-shrink-0">
                  Đã khám
                </span>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    Viêm dạ dày
                  </h4>
                  <p className="text-sm text-gray-600">
                    Luna - Mèo | 06/12/2024
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Triệu chứng: Tiêu chảy, không ăn
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex-shrink-0">
                  Đã khám
                </span>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    Kiểm tra sức khỏe
                  </h4>
                  <p className="text-sm text-gray-600">
                    Bunny - Thỏ | 04/12/2024
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Triệu chứng: Không có
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex-shrink-0">
                  Đã khám
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboard;
