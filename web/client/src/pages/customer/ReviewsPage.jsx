import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import ReviewsView from '@components/customer/ReviewsView';

const ReviewsPage = () => {
  return (
    <CustomerDashboard>
      <ReviewsView />
    </CustomerDashboard>
  );
};

export default ReviewsPage;
