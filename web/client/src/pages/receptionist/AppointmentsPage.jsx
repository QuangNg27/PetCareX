import React from 'react';
import ReceptionistDashboard from '@components/layout/ReceptionistDashboard/ReceptionistDashboard';
import AppointmentsView from '@components/receptionist/AppointmentsView';

const AppointmentsPage = () => {
  return (
    <ReceptionistDashboard>
      <AppointmentsView />
    </ReceptionistDashboard>
  );
};

export default AppointmentsPage;
