import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './composables/ThemeProvider'

// 1. IMPORTAR O CART PROVIDER
import { CartProvider } from './composables/CartContext' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {/* 2. ENVOLVER O APP COM O CART PROVIDER */}
      <CartProvider>
        <App />
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
)