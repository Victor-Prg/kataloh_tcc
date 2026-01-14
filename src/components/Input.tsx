import React from 'react';
import '../assets/Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Adicionamos a tipagem do ícone
}

export const Input = ({ label, error, icon, className, ...props }: InputProps) => {
  const hasError = !!error;

  return (
    <div className="input-group">
      {label && <span className="input-label">{label}</span>}
      
      <div className="relative flex items-center w-full">
        {/* Se houver ícone, renderiza posicionado à esquerda */}
        {icon && (
          <div className="absolute left-3 text-[var(--text-secondary)] pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        <input 
          className={`input-modern ${hasError ? 'error' : ''} ${icon ? '!pl-10' : ''} ${className || ''}`}
          aria-invalid={hasError || undefined}
          {...props} 
        />
      </div>
      
      {error && (
        <span className="input-error-msg">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};