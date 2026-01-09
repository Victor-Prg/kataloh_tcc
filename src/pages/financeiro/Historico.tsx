import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './composables/ThemeProvider';

// Páginas
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import Dashboard from './pages/dashboard'; 
import HistoricoRepasses from './pages/financeiro/HistoricoRepasses'; // Sua nova página

// Layout
import DashboardLayout from './layouts/DashboardLayout'; // O arquivo criado acima

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-full font-sans text-[var(--text-primary)] bg-[var(--bg-body)]">
          <Routes>
            
            {/* ROTAS PÚBLICAS (Sem Sidebar) */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            {/* ROTAS PROTEGIDAS (Com Sidebar e Navbar) */}
            <Route element={<DashboardLayout />}>
              
              {/* Ao acessar /dashboard, carrega o Dashboard antigo */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Ao acessar /financeiro/historico, carrega a nova tabela */}
              <Route path="/financeiro/historico" element={<HistoricoRepasses />} />
              
              {/* Outras rotas futuras... */}
              <Route path="/loja/listagem" element={<div>Página de Listagem</div>} />
              
            </Route>

            {/* Rota Desconhecida -> Login */}
            <Route path="*" element={<Navigate to="/" />} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;