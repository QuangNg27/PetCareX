import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignupProvider } from '@context/SignupContext';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';

const SignupWrapper = () => {
  return (
    <SignupProvider>
      <Routes>
        <Route index element={<Navigate to="step1" replace />} />
        <Route path="step1" element={<SignupStep1 />} />
        <Route path="step2" element={<SignupStep2 />} />
      </Routes>
    </SignupProvider>
  );
};

export default SignupWrapper;