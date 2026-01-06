import React from 'react';
import '../assets/Header.css';
import { List } from 'phosphor-react'; // Ícone de menu

interface HeaderProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  onMenuClick?: () => void; // <--- NOVA PROP
}

export const Header = ({ logo, children, onMenuClick }: HeaderProps) => {
  return (
    <header className="header-container">
      
      <div className="header-logo">
        {/* Se a função onMenuClick existir, mostra o botão de menu antes do logo */}
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', 
              marginRight: 16, display: 'flex', color: 'var(--text-primary)' 
            }}
          >
            <List size={28} />
          </button>
        )}
        
        {logo || 'MinhaMarca'}
      </div>
      
      <div className="header-actions">
        {children}
      </div>
    </header>
  );
};