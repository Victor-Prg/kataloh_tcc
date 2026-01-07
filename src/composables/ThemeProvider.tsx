import React, { useState, useEffect } from 'react';
import { ThemeContext, type PaletteName } from './ThemeContext';

const DEFAULT_PALETTE: PaletteName = 'NTX';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('mode') === 'dark');
  const [palette, setPaletteState] = useState<PaletteName>(
    () => (localStorage.getItem('palette') as PaletteName) || DEFAULT_PALETTE
  );

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-palette', palette);
    root.setAttribute('data-mode', isDark ? 'dark' : 'light');

    // mantém compatibilidade com CSS que usa classe .dark
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    localStorage.setItem('mode', isDark ? 'dark' : 'light');
    localStorage.setItem('palette', palette);
  }, [isDark, palette]);

  const toggleTheme = () => setIsDark((prev: boolean) => !prev);
  
  const setPalette = (newPalette: PaletteName) => {
    setPaletteState(newPalette);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
