import React from "react";
import Sidebar from "@components/layout/DoctorDashboard/Sidebar";
import Header from "@components/layout/DoctorDashboard/Header";

const DoctorDashboardLayout = ({ children, title = "Tổng quan" }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DoctorDashboardLayout;
