import React from 'react';
import '../assets/Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = ({ items, separator = '/', className, ...props }: BreadcrumbProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumb-root ${className || ''}`}
      {...props}
    >
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="breadcrumb-item">
              {!isLast && item.href ? (
                <a href={item.href} className="breadcrumb-link">
                  {item.label}
                </a>
              ) : (
                <span
                  className={`breadcrumb-current ${isLast ? 'breadcrumb-current-last' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

