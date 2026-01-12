import React from 'react';
import '../assets/Card.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  hoverable?: boolean;
  padding?: string;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ 
  children, 
  variant = 'elevated', 
  hoverable = false, 
  padding,
  className,
  onClick
}: CardProps) => {
  
  const classes = `card card-${variant} ${hoverable ? 'card-hoverable' : ''} ${className || ''}`;

  return (
    <div 
      className={classes} 
      onClick={onClick}
      style={{ padding: padding }}
    >
      {children}
    </div>
  );
};
