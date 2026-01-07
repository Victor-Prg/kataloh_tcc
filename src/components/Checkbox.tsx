import React from 'react';
import '../assets/Checkbox.css';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked, defaultChecked, disabled, ...props }, ref) => {
    const isControlled = checked !== undefined;

    return (
      <label className={`checkbox-root ${disabled ? 'checkbox-disabled' : ''}`}>
        <input
          ref={ref}
          type="checkbox"
          className={`checkbox-input ${className || ''}`}
          disabled={disabled}
          checked={isControlled ? checked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          aria-checked={isControlled ? checked : undefined}
          aria-disabled={disabled || undefined}
          {...props}
        />
        <span className="checkbox-box" />
        {label && <span className="checkbox-label">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
