import React from 'react';
import '../assets/Button.css';
import { CircleNotch } from 'phosphor-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  label, 
  icon, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  
  const content = label || children;
  
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <CircleNotch size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20} className="icon-spin" />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      
      {content && <span className="btn-label">{content}</span>}
    </button>
  );
};
