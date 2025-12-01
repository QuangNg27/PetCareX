import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-container">
        {/* Logo và branding */}
        <div className="auth-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" className="logo-icon">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="brand-text">PetCareX</span>
          </div>
          <p className="brand-tagline">Chăm sóc thú cưng chuyên nghiệp</p>
        </div>

        {/* Form content */}
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          
          <div className="auth-content">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>&copy; 2025 PetCareX. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;