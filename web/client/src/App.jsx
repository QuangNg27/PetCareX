import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import '@styles/globals.css';
import './App.css';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup/*" element={<SignUpPage />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* Specific Account Pages */}
            {/* Add ProtectedRoute later!*/}
            {/* Customer Route */}
            <Route path="/profile" element={<ProfilePage activeTab={'profile'}/>}/>
            <Route path="/pets" element={<ProfilePage activeTab={'pets'}/>}/>
            <Route path="/appointment" element={<ProfilePage activeTab={'appointment'}/>}/>
            <Route path="/ratings" element={<ProfilePage activeTab={'ratings'}/>}/>

            {/* Accounting Route */}

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
