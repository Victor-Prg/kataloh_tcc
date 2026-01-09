import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import Dashboard from './pages/auth/dashboard'; // Certifique-se que este arquivo existe aqui

function App() {
  return (
    <BrowserRouter>
      {/* Container principal que herda as cores do tema */}
      <div className="h-full min-h-screen font-sans text-[var(--text-primary)] bg-[var(--bg-body)] transition-colors duration-300">
        <Routes>
          {/* --- Rotas Públicas --- */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* --- Rota do Dashboard --- */}
          {/* Ao acessar /dashboard, renderiza a página completa com Sidebar */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* --- Fallback --- */}
          {/* Qualquer rota desconhecida redireciona para o Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;