import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import AppointmentsView from '@components/customer/AppointmentsView';

const AppointmentsPage = () => {
  return (
    <CustomerDashboard title="Lịch hẹn">
      <AppointmentsView />
    </CustomerDashboard>
  );
};

export default AppointmentsPage;
