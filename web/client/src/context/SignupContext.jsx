import React, { createContext, useContext, useState } from 'react';

const SignupContext = createContext();

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export const SignupProvider = ({ children }) => {
  const [signupData, setSignupData] = useState({
    // Step 1: Account Info
    username: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Personal Info
    fullName: '',
    email: '',
    phone: '',
    citizenId: '',
    dateOfBirth: '',
    gender: 'Nam'
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateSignupData = (data) => {
    setSignupData(prev => ({
      ...prev,
      ...data
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSignup = () => {
    setSignupData({
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      phone: '',
      citizenId: '',
      dateOfBirth: '',
      gender: 'Nam'
    });
    setCurrentStep(1);
  };

  const value = {
    signupData,
    currentStep,
    updateSignupData,
    nextStep,
    prevStep,
    resetSignup
  };

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
};

export default SignupContext;