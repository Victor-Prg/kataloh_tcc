import React, { createContext, useState, useEffect } from 'react';

// Define o formato do nosso contexto
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const ThemeProviderInternal = ({ children }: { children: React.ReactNode }) => {
  // Tenta ler do localStorage ou começa como falso (claro)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // A MÁGICA: Adiciona ou remove a classe 'dark' no <body>
    // E TAMBÉM atualiza o atributo data-theme para compatibilidade com CSS legado
    if (isDark) {
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider = ThemeProviderInternal;
export const useTheme = () => React.useContext(ThemeContext);
