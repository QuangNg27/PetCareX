import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import DashboardHome from '@pages/customer/DashboardHome';
import ProfilePage from '@pages/customer/ProfilePage';
import PetsPage from '@pages/customer/PetsPage';
import AppointmentsPage from '@pages/customer/AppointmentsPage';
import ServicesPage from '@pages/customer/ServicesPage';
import VaccinationPackagesPage from '@pages/customer/VaccinationPackagesPage';
import LoyaltyPage from '@pages/customer/LoyaltyPage';
import ReviewsPage from '@pages/customer/ReviewsPage';
import BranchManagerDashboard from '@pages/branch-manager/BranchManagerDashboard';
import CompanyManagerDashboard from '@pages/company-manager/CompanyManagerDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignUpPage />} />
            
            {/* Customer routes */}
            <Route path="/customer/dashboard" element={<DashboardHome />} />
            <Route path="/customer/profile" element={<ProfilePage />} />
            <Route path="/customer/pets" element={<PetsPage />} />
            <Route path="/customer/appointments" element={<AppointmentsPage />} />
            <Route path="/customer/services" element={<ServicesPage />} />
            <Route path="/customer/vaccination-packages" element={<VaccinationPackagesPage />} />
            <Route path="/customer/loyalty" element={<LoyaltyPage />} />
            <Route path="/customer/reviews" element={<ReviewsPage />} />
            
            {/* Branch Manager routes */}
            <Route path="/branch-manager/dashboard" element={<BranchManagerDashboard />} />
            
            {/* Company Manager routes */}
            <Route path="/company-manager/dashboard" element={<CompanyManagerDashboard />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
