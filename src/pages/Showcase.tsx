import { useState } from 'react';
import { SignIn, Check, Warning, Trash, Info, Sun, Moon } from 'phosphor-react';
import { 
  Button,
  Input,
  Text,
  Stack,
  Card,
  Avatar,
  Switch,
  Toast,
  type ToastMessage,
  Modal,
  Badge,
  Skeleton,
  Tooltip,
  Header,
  Sidebar,
  Footer,
  useTheme,
} from '../components';

export const Showcase = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { isDark, toggleTheme } = useTheme();

  const addToast = (type: 'success' | 'error') => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, {
      id,
      type,
      title: type === 'success' ? 'Sucesso!' : 'Erro!',
      description: type === 'success' ? 'Ação concluída.' : 'Falha na operação.'
    }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const simularCarregamento = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  const [activeSection, setActiveSection] = useState('status');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <Text style={{ fontWeight: 'bold' }}>Meu Design System</Text>
             <Button 
                label="" 
                variant="outline" 
                icon={isDark ? <Sun size={20} /> : <Moon size={20} />} 
                onClick={toggleTheme} 
             />
        </div>
      </Header>

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar 
            collapsed={sidebarCollapsed} 
            onNavigate={scrollToSection} 
            activeSection={activeSection}
        />

        <main style={{ flex: 1, padding: '40px 20px', backgroundColor: 'var(--bg-body)', overflowY: 'auto' }}>
            
            <div className="toast-container">
                {toasts.map(t => <Toast key={t.id} message={t} onRemove={removeToast} />)}
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Stack gap={50}>
                
                <div style={{ textAlign: 'center' }}>
                    <Text as="h1" size="heading">Showcase de Components</Text>
                    <Text color="#666">meus components</Text>
                </div>

                {/* 1. STATUS E FEEDBACK */}
                <section id="status">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>1. Status & Feedback</Text>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <Card>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Badges</Text>
                        <Stack direction="row" gap={10} style={{ flexWrap: 'wrap' }}>
                        <Badge label="Novo" variant="neutro" />
                        <Badge label="Sucesso" variant="sucesso" />
                        <Badge label="Alerta" variant="aviso" />
                        <Badge label="Erro" variant="perigo" />
                        </Stack>
                    </Card>

                    <Card>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Skeleton</Text>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <div style={{ flex: 1 }}>
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="50%" />
                        </div>
                        </div>
                    </Card>
                    </div>
                </section>

                {/* 2. AÇÕES E INTERAÇÃO */}
                <section id="actions">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>2. Ações</Text>
                    <Card>
                    <Stack gap={20}>
                        <Stack direction="row" gap={15} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button label="Primary" variant="primary" />
                        <Button label="Secondary" variant="secondary" />
                        <Button label="Outline" variant="outline" />
                        <Button label="Loading" isLoading={loadingBtn} onClick={simularCarregamento} />
                        <Button label="" icon={<SignIn size={20}/>} />
                        </Stack>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: 20 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Tooltips</Text>
                        <Stack direction="row" gap={20}>
                            <Tooltip content="Excluir Item">
                            <Button variant="outline" icon={<Trash size={20} color="red"/>} label="" />
                            </Tooltip>
                            <Tooltip content="Mais Detalhes">
                            <Info size={32} color="#007AFF" style={{ cursor: 'help' }} />
                            </Tooltip>
                        </Stack>
                        </div>
                    </Stack>
                    </Card>
                </section>

                {/* 3. FORMULÁRIOS */}
                <section id="forms">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>3. Formulários</Text>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <Card variant="outlined">
                        <Input label="Nome" placeholder="Seu nome..." />
                        <Input label="Senha" type="password" />
                        </Card>
                        <Card variant="outlined">
                        <Stack gap={20}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Notificações</Text>
                            <Switch checked={switch1} onToggle={() => setSwitch1(!switch1)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Modo Noturno</Text>
                            <Switch checked={switch2} onToggle={() => setSwitch2(!switch2)} />
                            </div>
                        </Stack>
                        </Card>
                    </div>
                </section>

                {/* 4. VISUAL E MODAL */}
                <section id="visual">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>4. Visual & Overlay</Text>
                    <Card variant="flat">
                    <Stack direction="row" gap={30} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                        
                        <Stack gap={5} style={{ alignItems: 'center' }}>
                            <Text size="sm">Avatars</Text>
                            <Stack direction="row" gap={10}>
                            <Avatar initials="PM" size="lg" />
                            <Avatar initials="JD" size="md" />
                            </Stack>
                        </Stack>

                        <Stack gap={5} style={{ alignItems: 'center' }}>
                            <Text size="sm">Teste o Modal</Text>
                            <Button label="Abrir Modal" onClick={() => setModalAberto(true)} />
                        </Stack>

                        <Stack gap={5} style={{ alignItems: 'center' }}>
                            <Text size="sm">Toasts</Text>
                            <div style={{ display: 'flex', gap: 5 }}>
                            <Button label="Ok" variant="secondary" onClick={() => addToast('success')} icon={<Check size={18}/>} />
                            <Button label="Erro" variant="outline" onClick={() => addToast('error')} icon={<Warning size={18}/>} />
                            </div>
                        </Stack>

                    </Stack>
                    </Card>
                </section>

                {/* 5. TAMANHOS DE BOTÕES */}
                <section id="sizes">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>5. Tamanhos de Botões</Text>
                    <Card variant="flat">
                        <Stack gap={20}>
                            {/* Linha dos Botões */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
                                <Button label="Small (sm)" variant="primary" size="sm" />
                                <Button label="Medium (md)" variant="primary" size="md" />
                                <Button label="Large (lg)" variant="primary" size="lg" />
                            </div>

                            {/* Linha dos Ícones */}
                            <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 15 }}>
                                <Text size="sm">Funciona com ícones também:</Text>
                                <Button label="Excluir" variant="outline" size="sm" icon={<Trash size={14}/>} />
                                <Button label="Comprar" variant="secondary" size="lg" icon={<SignIn size={24}/>} />
                            </div>
                        </Stack>
                    </Card>
                </section>

                </Stack> {/* Fim do Stack Principal */}
            </div>
        </main>
      </div>

      <Footer />

      {/* --- MODAL --- */}
      <Modal 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        title="Confirmar Ação"
      >
        <Stack gap={20}>
          <Text>AOBA!!!</Text>
          <div style={{ padding: 15, background: '#f9f9f9', borderRadius: 8, border: '1px dashed #ccc' }}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <Button label="Cancelar" variant="outline" onClick={() => setModalAberto(false)} />
            <Button 
              label="Confirmar" 
              variant="primary" 
              onClick={() => {
                setModalAberto(false);
                addToast('success');
              }} 
            />
          </div>
        </Stack>
      </Modal>

    </div>
  );
};
