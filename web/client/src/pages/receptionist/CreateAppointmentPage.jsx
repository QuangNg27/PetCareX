import React from 'react';
import ReceptionistDashboard from '@components/layout/ReceptionistDashboard/ReceptionistDashboard';
import CreateAppointmentView from '@components/receptionist/CreateAppointmentView';

const CreateAppointmentPage = () => {
  return (
    <ReceptionistDashboard title="Tạo lịch hẹn cho khách hàng">
      <CreateAppointmentView />
    </ReceptionistDashboard>
  );
};

export default CreateAppointmentPage;
