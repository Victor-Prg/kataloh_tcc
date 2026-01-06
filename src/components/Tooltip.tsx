import React from 'react';
import '../assets/Tooltip.css';

interface TooltipProps {
  content: string; // O texto da dica
  children: React.ReactNode; // O elemento que recebe o hover
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="tooltip-wrapper">
      {children}
      <div className="tooltip-box">
        {content}
      </div>
    </div>
  );
};