import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import LoyaltyView from '@components/customer/LoyaltyView';

const LoyaltyPage = () => {
  return (
    <CustomerDashboard>
      <LoyaltyView />
    </CustomerDashboard>
  );
};

export default LoyaltyPage;
