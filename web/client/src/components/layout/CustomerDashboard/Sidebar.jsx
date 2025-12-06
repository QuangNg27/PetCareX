import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  PetIcon, 
  CalendarIcon,
  ClipboardIcon,
  StarIcon,
  MessageIcon,
  ShieldIcon
} from '@components/common/icons';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    {
      icon: HomeIcon,
      label: 'Tổng quan',
      path: '/customer/dashboard',
      end: true
    },
    {
      icon: PetIcon,
      label: 'Thú cưng của tôi',
      path: '/customer/pets'
    },
    {
      icon: CalendarIcon,
      label: 'Lịch hẹn',
      path: '/customer/appointments'
    },
    {
      icon: ClipboardIcon,
      label: 'Dịch vụ',
      path: '/customer/services'
    },
    {
      icon: ShieldIcon,
      label: 'Gói tiêm',
      path: '/customer/vaccination-packages'
    },
    {
      icon: StarIcon,
      label: 'Điểm tích lũy',
      path: '/customer/loyalty'
    },
    {
      icon: MessageIcon,
      label: 'Đánh giá',
      path: '/customer/reviews'
    }
  ];

  return (
    <aside className="customer-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <PetIcon size={32} />
          </div>
          <span className="logo-text">PetCareX</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">
                    <IconComponent size={20} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
