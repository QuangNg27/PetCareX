import React from 'react';
import CustomerDashboard from '@components/layout/CustomerDashboard/CustomerDashboard';
import ProfileView from '@components/customer/ProfileView';

const ProfilePage = () => {
  return (
    <CustomerDashboard title="Hồ sơ cá nhân">
      <ProfileView />
    </CustomerDashboard>
  );
};

export default ProfilePage;
