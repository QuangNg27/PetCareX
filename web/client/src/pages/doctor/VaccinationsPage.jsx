import React from "react";
import DoctorDashboardLayout from "@components/layout/DoctorDashboard/DoctorDashboardLayout";
import VaccinationRecordView from "@components/doctor/VaccinationRecordView";

const VaccinationsPage = () => {
  return (
    <DoctorDashboardLayout title="Tiêm phòng">
      <VaccinationRecordView />
    </DoctorDashboardLayout>
  );
};

export default VaccinationsPage;
