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
import './DashboardHome.css';

const DashboardHome = () => {
  return (
    <CustomerDashboard>
      <div className="dashboard-home">
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon pets">
              <PetIcon size={28} />
            </div>
            <div className="stat-content">
              <h3>Thú cưng</h3>
              <p className="stat-number">3</p>
              <span className="stat-label">Đang chăm sóc</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon appointments">
              <CalendarIcon size={28} />
            </div>
            <div className="stat-content">
              <h3>Lịch hẹn</h3>
              <p className="stat-number">2</p>
              <span className="stat-label">Sắp tới</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon points">
              <StarIcon size={28} />
            </div>
            <div className="stat-content">
              <h3>Điểm tích lũy</h3>
              <p className="stat-number">1,250</p>
              <span className="stat-label">Điểm khả dụng</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Upcoming Appointments */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <CalendarIcon size={20} /> Lịch hẹn sắp tới
              </h2>
              <a href="/customer/appointments" className="view-all-link">
                Xem tất cả →
              </a>
            </div>
            <div className="appointments-list">
              <div className="appointment-item">
                <div className="appointment-date">
                  <div className="date-day">15</div>
                  <div className="date-month">Th12</div>
                </div>
                <div className="appointment-info">
                  <h4>Khám sức khỏe định kỳ</h4>
                  <p className="appointment-pet">
                    <PetIcon size={14} /> Max - Chó Golden Retriever
                  </p>
                  <p className="appointment-time">
                    <MapPinIcon size={14} /> Chi nhánh Quận 1
                  </p>
                </div>
              </div>

              <div className="appointment-item">
                <div className="appointment-date">
                  <div className="date-day">20</div>
                  <div className="date-month">Th12</div>
                </div>
                <div className="appointment-info">
                  <h4>Tiêm phòng văc-xin</h4>
                  <p className="appointment-pet">
                    <PetIcon size={14} /> Luna - Mèo Ba Tư
                  </p>
                  <p className="appointment-time">
                    <MapPinIcon size={14} /> Chi nhánh Quận 3
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* My Pets */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <PetIcon size={20} /> Thú cưng của tôi
              </h2>
              <a href="/customer/pets" className="view-all-link">
                Xem tất cả →
              </a>
            </div>
            <div className="pets-list">
              <div className="pet-item">
                <div className="pet-avatar dog">
                  <PetIcon size={24} />
                </div>
                <div className="pet-info">
                  <h4>Max</h4>
                  <p>Golden Retriever • 3 tuổi</p>
                </div>
                <button className="pet-action-btn">Chi tiết</button>
              </div>

              <div className="pet-item">
                <div className="pet-avatar cat">
                  <PetIcon size={24} />
                </div>
                <div className="pet-info">
                  <h4>Luna</h4>
                  <p>Mèo Ba Tư • 2 tuổi</p>
                </div>
                <button className="pet-action-btn">Chi tiết</button>
              </div>

              <div className="pet-item">
                <div className="pet-avatar rabbit">
                  <PetIcon size={24} />
                </div>
                <div className="pet-info">
                  <h4>Bunny</h4>
                  <p>Thỏ Hà Lan • 1 tuổi</p>
                </div>
                <button className="pet-action-btn">Chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerDashboard>
  );
};

export default DashboardHome;
