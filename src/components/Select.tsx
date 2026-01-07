import React from 'react';
import '../assets/Select.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, disabled, className, value, defaultValue, ...props }, ref) => {
    const hasError = !!error;
    const showPlaceholder = placeholder && (value === undefined || value === '' || value === null);

    return (
      <div className="input-group">
        {label && <span className="input-label">{label}</span>}

        <select
          ref={ref}
          className={`select-modern ${hasError ? 'error' : ''} ${className || ''}`}
          aria-invalid={hasError || undefined}
          disabled={disabled}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={true} hidden={!showPlaceholder}>
              {placeholder}
            </option>
          )}

          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <span className="input-error-msg">
            ⚠️ {error}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

