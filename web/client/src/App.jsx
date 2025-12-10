import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@context/AuthContext";
import LoginPage from "@pages/LoginPage";
import SignUpPage from "@pages/SignUpPage";
import DashboardHome from "@pages/customer/DashboardHome";
import ProfilePage from "@pages/customer/ProfilePage";
import PetsPage from "@pages/customer/PetsPage";
import AppointmentsPage from "@pages/customer/AppointmentsPage";
import ServicesPage from "@pages/customer/ServicesPage";
import VaccinationPackagesPage from "@pages/customer/VaccinationPackagesPage";
import LoyaltyPage from "@pages/customer/LoyaltyPage";
import ReviewsPage from "@pages/customer/ReviewsPage";
import BranchManagerDashboard from "@pages/branch-manager/BranchManagerDashboard";
import CompanyManagerDashboard from "@pages/company-manager/CompanyManagerDashboard";
import DoctorDashboard from "@pages/doctor/DoctorDashboard";
import MedicalRecordsPage from "@pages/doctor/MedicalRecordsPage";
import VaccinationsPage from "@pages/doctor/VaccinationsPage";
import InvoicePage from "@pages/sales/InvoicePage";
import "./App.css";

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
            <Route
              path="/customer/appointments"
              element={<AppointmentsPage />}
            />
            <Route path="/customer/services" element={<ServicesPage />} />
            <Route
              path="/customer/vaccination-packages"
              element={<VaccinationPackagesPage />}
            />
            <Route path="/customer/loyalty" element={<LoyaltyPage />} />
            <Route path="/customer/reviews" element={<ReviewsPage />} />

            {/* Branch Manager routes */}
            <Route
              path="/branch-manager/dashboard"
              element={<BranchManagerDashboard />}
            />
            <Route
              path="/preview/branch-manager"
              element={<BranchManagerDashboard />}
            />

            {/* Company Manager routes */}
            <Route
              path="/company-manager/dashboard"
              element={<CompanyManagerDashboard />}
            />
            <Route
              path="/preview/company-manager"
              element={<CompanyManagerDashboard />}
            />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

            {/* Doctor routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor/medical-records"
              element={<MedicalRecordsPage />}
            />
            <Route path="/doctor/vaccinations" element={<VaccinationsPage />} />

            {/* Sales routes - Invoice only */}
            <Route path="/sales/invoice" element={<InvoicePage />} />
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

export default App;
