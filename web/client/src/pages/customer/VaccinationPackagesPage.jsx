import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import VaccinationPackagesView from '@components/customer/VaccinationPackagesView';

const VaccinationPackagesPage = () => {
  return (
    <CustomerDashboard>
      <VaccinationPackagesView />
    </CustomerDashboard>
  );
};

export default VaccinationPackagesPage;
