import React from 'react';
import '../assets/Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const hasError = !!error;
    const showHelper = helperText && !error;

    return (
      <div className="input-group">
        {label && <span className="input-label">{label}</span>}

        <textarea
          ref={ref}
          className={`textarea-modern ${hasError ? 'error' : ''} ${className || ''}`}
          aria-invalid={hasError || undefined}
          {...props}
        />

        {error && (
          <span className="input-error-msg">
            ⚠️ {error}
          </span>
        )}

        {showHelper && (
          <span className="textarea-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

