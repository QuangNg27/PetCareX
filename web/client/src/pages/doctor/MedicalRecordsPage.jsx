import React from "react";
import DoctorDashboardLayout from "@components/layout/DoctorDashboard/DoctorDashboardLayout";
import MedicalRecordView from "@components/doctor/MedicalRecordView";

const MedicalRecordsPage = () => {
  return (
    <DoctorDashboardLayout title="Hồ sơ y tế">
      <MedicalRecordView />
    </DoctorDashboardLayout>
  );
};

export default MedicalRecordsPage;
