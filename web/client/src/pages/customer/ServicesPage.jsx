import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import ServicesView from '@components/customer/ServicesView';

const ServicesPage = () => {
  return (
    <CustomerDashboard title="Dịch vụ">
      <ServicesView />
    </CustomerDashboard>
  );
};

export default ServicesPage;
