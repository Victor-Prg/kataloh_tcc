import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ... seus imports existentes (Login, Register, Dashboard)
// Temporary placeholder until the component is created
const HistoricoRepasses = () => <div>HistoricoRepasses - Component not implemented yet</div>;

function App() {
  return (
<BrowserRouter>
      <BrowserRouter>
        <div className="h-full min-h-screen font-sans text-[var(--text-primary)] bg-[var(--bg-body)] transition-colors duration-300">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<div>Login - Em construção</div>} />
            <Route path="/register" element={<div>Register - Em construção</div>} />
            {/* TODO: Import ForgotPassword component or create it */}
            <Route path="/forgot" element={<div>Esqueci minha senha - Em construção</div>} />

            {/* Rota do Dashboard Principal */}
            {/* Rota do Dashboard Principal */}
            <Route path="/dashboard" element={<Navigate to="/" />} />

            {/* --- NOVA ROTA FINANCEIRO --- */}
            {/* O ideal seria ter um layout pai para Sidebar, mas por enquanto: */}
            <Route path="/financeiro/historico" element={
               // Aqui você provavelmente vai querer envolver com o Layout do Dashboard
               // Se o seu Dashboard.tsx for um layout, use Nested Routes.
               // Se não, vamos renderizar direto para teste:
               <div className="flex h-screen bg-[var(--bg-body)]">
                  {/* Você precisará importar Sidebar e Navbar aqui se não usar Layout Wrapper */}
                  <div className="flex-1 p-6 overflow-auto">
                     <HistoricoRepasses />
                  </div>
               </div>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>

      </BrowserRouter>
   );
}

export default App;