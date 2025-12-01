import React from 'react';
import './FormField.css';

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
  ...props 
}) => {
  const fieldId = `field-${name}`;
  
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={fieldId} className="field-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="field-wrapper">
        {Icon && (
          <div className="field-icon">
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
          className={`field-input ${error ? 'error' : ''} ${Icon ? 'has-icon' : ''}`}
          {...props}
        />
      </div>
      
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default FormField;