import React from 'react';
import '../assets/input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="input-group">
      {label && <span className="input-label">{label}</span>}
      
      <input 
        className={`input-modern ${error ? 'error' : ''} ${className || ''}`}
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