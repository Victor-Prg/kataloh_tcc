import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './composables/ThemeProvider';

// Páginas
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import Dashboard from './pages/auth/dashboard'; // Ajustei o caminho (provavelmente não está em /auth)
import HistoricoRepasses from './pages/financeiro/HistoricoRepasses'; // A página nova que criamos

// Layouts
import DashboardLayout from './components/DashboardLayout'; // <--- IMPORTANTE: Recuperar o layout

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-full font-sans text-[var(--text-primary)] bg-[var(--bg-body)]">
          <Routes>
            
            {/* --- ROTAS PÚBLICAS (Sem Sidebar) --- */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            {/* --- ROTAS PROTEGIDAS (Com Sidebar e Navbar) --- */}
            {/* Envolvemos as páginas internas com o DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/financeiro/historico" element={<HistoricoRepasses />} />
            </Route>

            {/* --- Fallback --- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider> // <--- O ERRO ESTAVA AQUI: Faltava fechar essa tag
  );
};

export default App;