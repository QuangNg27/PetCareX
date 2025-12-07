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
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="h-16 p-6 border-b border-gray-200 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
            <PetIcon size={24} />
          </div>
          <span className="text-xl font-bold text-gray-900">PetCareX</span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className={({ isActive }) => isActive ? 'text-primary-600' : 'text-gray-500'}>
                    <IconComponent size={20} />
                  </span>
                  <span>{item.label}</span>
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
