import React from 'react';
import Sidebar from '@components/layout/CustomerDashboard/Sidebar';
import Header from '@components/layout/CustomerDashboard/Header';
import './CustomerDashboard.css';

const CustomerDashboard = ({ children, title = 'Tổng quan' }) => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header title={title} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
