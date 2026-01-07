import { createContext } from 'react';

// Paletas disponíveis no sistema
export type PaletteName = 'NTX' | 'Brand' | 'Neutral' | 'SoftPurple' | 'Editorial' | 'DeepPurple' | 'Graphite' | 'Nude' | 'Clinic' | 'Fashion' ;

// Define o formato do nosso contexto
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  palette: PaletteName;
  setPalette: (palette: PaletteName) => void;
}

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

