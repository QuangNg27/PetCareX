import React from "react";
import DoctorDashboardLayout from "@components/layout/DoctorDashboard/DoctorDashboardLayout";
import MedicalRecordView from "@components/doctor/MedicalRecordView";

const MedicalRecordsPage = () => {
  return (
    <DoctorDashboardLayout title="Khám bệnh">
      <MedicalRecordView />
    </DoctorDashboardLayout>
  );
};

export default MedicalRecordsPage;
