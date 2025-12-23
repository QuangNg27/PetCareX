import React from 'react';
import Sidebar from '@components/layout/ReceptionistDashboard/Sidebar';
import Header from '@components/layout/ReceptionistDashboard/Header';

const ReceptionistDashboard = ({ children, title = 'Tổng quan' }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
