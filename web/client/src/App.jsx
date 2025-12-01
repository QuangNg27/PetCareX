import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import LoginPage from '@pages/LoginPage';
import SignUpPage from '@pages/SignUpPage';
import '@styles/globals.css';
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
