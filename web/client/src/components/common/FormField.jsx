import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const fieldId = `field-${name}`;
  
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-error-600 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Icon size={20} />
          </div>
        )}
        
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
            Icon ? 'pl-11' : ''
          } ${
            error 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          } ${className}`}
          {...props}
        />
      </div>
      
      {error && <span className="text-sm text-error-600">{error}</span>}
    </div>
  );
};

export default FormField;