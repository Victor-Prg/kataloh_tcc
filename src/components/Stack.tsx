import React from 'react';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> { // <--- Estende atributos de DIV
  children: React.ReactNode;
  gap?: number;
  direction?: 'row' | 'column';
}

export const Stack = ({ 
  children, 
  gap = 10, 
  direction = 'column',
  style,      // <--- Aceita style
  className,  // <--- Aceita className
  ...props 
}: StackProps) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};