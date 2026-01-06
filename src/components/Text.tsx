import React from 'react';
import { theme } from './theme';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'p' | 'span';
  size?: keyof typeof theme.fontSizes;
  color?: string;
  children: React.ReactNode;
}

export const Text = ({ 
  as = 'p', 
  size = 'md', 
  color, // Removemos o valor padrão fixo aqui para tratar na lógica abaixo
  children,
  style,
  className,
  ...props
}: TextProps) => {
  const Component = as;
  
  // Se size não existir no tema, usa '16px' como segurança
  const fontSize = theme.fontSizes[size] || '16px';

  // LÓGICA DO DARK MODE:
  // Se uma cor foi passada via prop, usa ela.
  // Se não, usa a variável CSS que se adapta ao tema (Escuro/Claro).
  const finalColor = color || 'var(--text-primary)';

  return (
    <Component 
      style={{ 
        fontSize, 
        color: finalColor,
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        transition: 'color 0.3s ease', // Suaviza a troca de tema
        ...style 
      }} 
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};