import React from 'react';
import { Text } from './Text';
import { X } from 'phosphor-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    // 1. O Overlay (Fundo escuro atrás do modal)
    <div 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', // Mantém escuro sempre para foco
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(3px)'
      }} 
      onClick={onClose}
    >
      
      {/* 2. O Conteúdo do Modal (A janela) */}
      <div 
        style={{
          // MUDANÇA PARA DARK MODE: Usa as variáveis CSS
          backgroundColor: 'var(--bg-card)', 
          color: 'var(--text-primary)',
          
          padding: '24px',
          borderRadius: '12px',
          width: '500px',
          maxWidth: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          border: '1px solid var(--border-color)', // Borda sutil para contraste no dark mode
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
      >
        
        {/* CABEÇALHO */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <Text
            as="h2"
            size="lg"
            style={{ fontWeight: 'bold', fontSize: 28 }}
          >
            {title}
          </Text>
          
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '4px',
              display: 'flex',
              color: 'var(--text-secondary)', // Ícone X adaptável
              transition: 'color 0.2s'
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* CORPO */}
        <div>
          {children}
        </div>

      </div>
    </div>
  );
};
