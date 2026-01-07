import React from 'react';
import '../assets/Alert.css';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      description,
      icon,
      actionLabel,
      onActionClick,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`alert alert-${variant} ${className || ''}`}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {icon && <div className="alert-icon">{icon}</div>}

        <div className="alert-content">
          {title && <div className="alert-title">{title}</div>}
          {description && <div className="alert-description">{description}</div>}
        </div>

        {actionLabel && onActionClick && (
          <button className="alert-action" type="button" onClick={onActionClick}>
            {actionLabel}
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
