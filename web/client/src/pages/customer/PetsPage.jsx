import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import PetsView from '@components/customer/PetsView';

const PetsPage = () => {
  return (
    <CustomerDashboard title="Thú cưng của tôi">
      <PetsView />
    </CustomerDashboard>
  );
};

export default PetsPage;
