import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './composables/ThemeProvider';

// Páginas de Autenticação
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';
import Dashboard from './pages/auth/dashboard';

// Páginas Financeiras
import Treasury from './pages/financeiro/treasury';
import FinanceiroRepasses from './pages/financeiro/repasses';
import HistoricoRepasses from './pages/financeiro/HistoricoRepasses';

// Páginas Admin
import AdminGerenciarLojas from './pages/admin/gerenciar-lojas';
import AdminPedidosLoja from './pages/admin/pedidos-loja';

// --- IMPORTAÇÕES DE CLIENTES ---
// Verifique se o caminho da pasta é 'clientes' (plural) mesmo
import { Lojas } from './pages/clientes/Lojas'; 
import { LojaDetalhes } from './pages/clientes/LojaDetalhes'; 

// Layout
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="h-full font-sans text-[var(--text-primary)] bg-[var(--bg-body)]">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            {/* Rotas Protegidas (DashboardLayout) */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* --- AQUI ESTÁ A CORREÇÃO DAS ROTAS --- */}
              
              {/* 1. Rota da Listagem (/clientes) */}
              {/* É para cá que o botão "Voltar" do LojaDetalhes aponta */}
              <Route path="/clientes" element={<Lojas />} />

              {/* 2. Rota de Detalhes (/cliente/lojas/:id) */}
              {/* É para cá que o Card do Lojas aponta */}
              <Route path="/cliente/lojas/:id" element={<LojaDetalhes />} />
              
              {/* ------------------------------------- */}

              {/* Outras Rotas */}
              <Route path="/financeiro/repasses" element={<FinanceiroRepasses />} />
              <Route path="/financeiro/historico" element={<HistoricoRepasses />} />
              <Route path="/financeiro/tesouraria" element={<Treasury />} />
              <Route path="/admin/gerenciar-lojas" element={<AdminGerenciarLojas />} />
              <Route path="/admin/pedidos-loja/:lojaId" element={<AdminPedidosLoja />} />
            </Route>

            {/* Fallback: Se a rota não existir, volta pro Login */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;