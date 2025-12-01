import React from 'react';

// Base Icon component với props chung
const BaseIcon = ({ children, size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

// Authentication Icons
export const UserIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </BaseIcon>
);

export const PasswordIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </BaseIcon>
);

export const EyeIcon = ({ size = 24, ...props }) => (
  <BaseIcon size={size} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </BaseIcon>
);

export const EyeOffIcon = ({ size = 24, ...props }) => (
  <BaseIcon size={size} {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </BaseIcon>
);

// Form Icons
export const EmailIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </BaseIcon>
);

export const PhoneIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </BaseIcon>
);

export const CalendarIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </BaseIcon>
);

export const IdCardIcon = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <path d="M7 8h4"/>
    <path d="M7 12h10"/>
    <path d="M7 16h6"/>
  </BaseIcon>
);

// Navigation Icons
export const HomeIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </BaseIcon>
);

export const PetIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="11.5" cy="8.5" r="2.5"/>
    <path d="M11.5 15.5c-4 0-7.5-2-7.5-6 0-1 1-2 2.5-2s2.5 1 2.5 2c0 1 1 2 2.5 2s2.5-1 2.5-2c0-1 1-2 2.5-2s2.5 1 2.5 2c0 4-3.5 6-7.5 6z"/>
  </BaseIcon>
);

// Action Icons
export const SearchIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </BaseIcon>
);

export const EditIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </BaseIcon>
);

export const DeleteIcon = (props) => (
  <BaseIcon {...props}>
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </BaseIcon>
);

export const SaveIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </BaseIcon>
);

// Status Icons
export const CheckIcon = (props) => (
  <BaseIcon {...props}>
    <polyline points="20,6 9,17 4,12"/>
  </BaseIcon>
);

export const XIcon = (props) => (
  <BaseIcon {...props}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </BaseIcon>
);

export const AlertIcon = (props) => (
  <BaseIcon {...props}>
    <triangle points="10.29,3 21.86,19 2.71,19"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </BaseIcon>
);