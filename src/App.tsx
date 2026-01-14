import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './composables/ThemeProvider';

// Páginas de Autenticação
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot';

// Dashboards
import Dashboard from './pages/admin/home';
import LojaDashboard from './pages/loja/dashboard';
import Tesouraria from './pages/admin/financeiro/tesouraria';
import { Lojas } from './pages/clientes/Lojas';
import { LojaDetalhes } from './pages/clientes/LojaDetalhes';
import FinanceiroRepasses from './pages/admin/financeiro/repasses';
import HistoricoRepasses from './pages/admin/financeiro/HistoricoRepasses';
import AdminGerenciarLojas from './pages/admin/lojas/gerenciar-lojas';
import AdminPedidosLoja from './pages/admin/lojas/pedidos-loja';
import RecepcaoLoja from './pages/loja/recepcao';
import NewPedido from './pages/loja/new-pedido';
import LojaFinanceiro from './pages/loja/financeiro';
import ExtratoLoja from './pages/loja/extrato';
import MenuCadastro from './pages/loja/cadastros/menu';
import ProdutosCadastro from './pages/loja/cadastros/produtos';
import EntregadoresCadastro from './pages/loja/cadastros/entregadores';

// --- IMPORTAÇÕES DE CLIENTES ---
// Verifique se o caminho da pasta é 'clientes' (plural) mesmo


// Layout
import DashboardLayout from './components/DashboardLayout';

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

            {/* Rotas Protegidas (DashboardLayout) */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Cliente */}
              <Route path="/cliente/lojas" element={<Lojas />} />
              <Route path="/cliente/lojas/:id" element={<LojaDetalhes />} />
              
              {/* Loja */}
              <Route path="/loja/dashboard" element={<LojaDashboard />} />
              <Route path="/loja/recepcao" element={<RecepcaoLoja />} />
              <Route path="/loja/newpedido" element={<NewPedido />} />
              <Route path="/loja/financeiro" element={<LojaFinanceiro />} />
              <Route path="/loja/extrato" element={<ExtratoLoja />} />
              <Route path="/loja/cadastros/menu" element={<MenuCadastro />} />
              <Route path="/loja/cadastros/produtos" element={<ProdutosCadastro />} />
              <Route path="/loja/cadastros/entregadores" element={<EntregadoresCadastro />} />
              
              {/* Financeiro */}
              <Route path="/financeiro/repasses" element={<FinanceiroRepasses />} />
              <Route path="/financeiro/historico" element={<HistoricoRepasses />} />
              <Route path="/financeiro/tesouraria" element={<Tesouraria />} />
              
              {/* Admin */}
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
}

export default App;
