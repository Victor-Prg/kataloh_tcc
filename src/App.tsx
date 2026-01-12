import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './composables/ThemeProvider';

// Páginas
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import Dashboard from './pages/auth/dashboard';
import Treasury from './pages/financeiro/treasury';
import { Lojas } from './pages/clientes/Lojas';
import { LojaDetalhes } from './pages/clientes/LojaDetalhes';
import FinanceiroRepasses from './pages/financeiro/repasses';
import HistoricoRepasses from './pages/financeiro/HistoricoRepasses';

// Layouts
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-full font-sans text-[var(--text-primary)] bg-[var(--bg-body)]">
          <Routes>
            // Exemplo de como ficaria no seu Router
            <Route path="/cliente/lojas" element={<Lojas />} />
            <Route path="/cliente/lojas/:id" element={<LojaDetalhes />} />
            {/* --- ROTAS PÚBLICAS (Sem Sidebar) --- */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            {/* --- ROTAS PROTEGIDAS (Com Sidebar e Navbar) --- */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/financeiro/repasses" element={<FinanceiroRepasses />} />
              <Route path="/financeiro/historico" element={<HistoricoRepasses />} />
              <Route path="/financeiro/tesouraria" element={<Treasury />} />
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
