import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const iconClass = Icon ? `btn-with-icon icon-${iconPosition}` : '';
  const allClasses = [baseClasses, variantClass, sizeClass, iconClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={allClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      )}
      
      {!loading && children && (
        <span className="btn-text">{children}</span>
      )}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
      )}
    </button>
  );
};

export default Button;