import React from 'react';
import '../assets/Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  const hasError = !!error;

  return (
    <div className="input-group">
      {label && <span className="input-label">{label}</span>}
      
      <input 
        className={`input-modern ${hasError ? 'error' : ''} ${className || ''}`}
        aria-invalid={hasError || undefined}
        {...props} 
      />
      
      {error && (
        <span className="input-error-msg">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};
