import React from 'react';
import '../assets/EmptyState.css';
import { Button, type ButtonProps } from './Button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  actionProps?: Omit<ButtonProps, 'label' | 'children' | 'onClick'>;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, actionLabel, onActionClick, actionProps, className, ...props }, ref) => {
    return (
      <div ref={ref} className={`empty-state ${className || ''}`} {...props}>
        {icon && <div className="empty-state-icon">{icon}</div>}
        <div className="empty-state-content">
          <div className="empty-state-title">{title}</div>
          {description && <div className="empty-state-description">{description}</div>}
        </div>
        {actionLabel && onActionClick && (
          <div className="empty-state-action">
            <Button
              variant="primary"
              size="sm"
              label={actionLabel}
              onClick={onActionClick}
              {...actionProps}
            />
          </div>
        )}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';

