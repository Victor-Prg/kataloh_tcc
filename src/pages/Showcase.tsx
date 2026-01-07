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
  ConfirmModal,
  Badge,
  Skeleton,
  Tooltip,
  Header,
  Sidebar,
  Footer,
  useTheme,
  Textarea,
  Select,
  Checkbox,
  Alert,
  EmptyState,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Pagination,
  usePagination,
  Breadcrumb,
  Calendar,
  DatePicker,
  ProgressBar,
  ErrorBoundary,
} from '../components';

export const Showcase = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmModalAberto, setConfirmModalAberto] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [plano, setPlano] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [tabelaCarregando] = useState(false);
  const [tabAtiva, setTabAtiva] = useState(0);
  const [forcarErro, setForcarErro] = useState(false);
  const usuariosTodos = [
    { id: 1, nome: 'Ana Silva', email: 'ana@example.com' },
    { id: 2, nome: 'João Souza', email: 'joao@example.com' },
    { id: 3, nome: 'Maria Oliveira', email: 'maria@example.com' },
    { id: 4, nome: 'Pedro Santos', email: 'pedro@example.com' },
    { id: 5, nome: 'Carla Lima', email: 'carla@example.com' },
  ];
  const { page: paginaAtual, pageSize, totalPages, goToPage } = usePagination({
    totalItems: usuariosTodos.length,
    pageSize: 2,
  });
  const inicio = (paginaAtual - 1) * pageSize;
  const usuarios = usuariosTodos.slice(inicio, inicio + pageSize);

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

                {/* 0. BREADCRUMB */}
                <section id="breadcrumb">
                    <Card variant="flat">
                      <Breadcrumb
                        items={[
                          { label: 'Home', href: '#' },
                          { label: 'Layouts', href: '#' },
                          { label: 'Showcase' },
                        ]}
                        separator=">"
                      />
                    </Card>
                </section>

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
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Skeleton, Alerts & Progress</Text>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Skeleton variant="circular" width={40} height={40} />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="50%" />
                            </div>
                          </div>
                          <Alert
                            variant="success"
                            title="Tudo certo!"
                            description="Sua ação foi concluída com sucesso."
                            icon={<Check size={18} />}
                            actionLabel="Ver detalhes"
                            onActionClick={() => addToast('success')}
                          />
                          <Alert
                            variant="error"
                            title="Algo deu errado"
                            description="Tente novamente em alguns instantes."
                            icon={<Warning size={18} />}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            <Text size="sm">Carregando dados (default)</Text>
                            <ProgressBar value={45} />
                            <Text size="sm">Processo concluído (success)</Text>
                            <ProgressBar value={100} variant="success" />
                            <Text size="sm">Falha na sincronização (error)</Text>
                            <ProgressBar value={70} variant="error" />
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
                        <DatePicker
                          label="Data de nascimento"
                          placeholder="DD/MM/AAAA"
                        />
                        <Textarea
                          label="Descrição"
                          placeholder="Conte mais sobre você..."
                          helperText="Até 500 caracteres"
                          rows={4}
                        />
                        <Select
                          label="Plano"
                          value={plano}
                          onChange={event => setPlano(event.target.value)}
                          placeholder="Selecione um plano"
                          options={[
                            { label: 'Grátis', value: 'free' },
                            { label: 'Pro', value: 'pro' },
                            { label: 'Enterprise', value: 'enterprise' },
                          ]}
                          error={plano === '' ? 'Selecione um plano' : undefined}
                        />
                        <Checkbox
                          checked={aceitaTermos}
                          onChange={event => setAceitaTermos(event.target.checked)}
                          label="Aceito os termos de uso"
                        />
                        <Checkbox
                          defaultChecked
                          label="Quero receber novidades por e-mail"
                        />
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
                            <Text size="sm">ConfirmModal (perigo)</Text>
                            <Button
                              label="Excluir item"
                              variant="outline"
                              icon={<Trash size={20} color="red" />}
                              onClick={() => setConfirmModalAberto(true)}
                            />
                        </Stack>

                        <Stack gap={5} style={{ alignItems: 'center' }}>
                            <Text size="sm">Toasts</Text>
                            <div style={{ display: 'flex', gap: 5 }}>
                            <Button label="Ok" variant="secondary" onClick={() => addToast('success')} icon={<Check size={18}/>} />
                            <Button label="Erro" variant="outline" onClick={() => addToast('error')} icon={<Warning size={18}/>} />
                            </div>
                        </Stack>

                        <Stack gap={5} style={{ alignItems: 'center', minWidth: 260 }}>
                            <Text size="sm">Empty State</Text>
                            <EmptyState
                              title="Nenhum dado encontrado"
                              description="Quando houver registros, eles aparecerão aqui."
                              actionLabel="Adicionar registro"
                              onActionClick={() => addToast('success')}
                              icon={<Info size={28} />}
                            />
                        </Stack>

                        <Stack gap={5} style={{ alignItems: 'center' }}>
                            <Text size="sm">Calendar</Text>
                            <Calendar />
                        </Stack>

                    </Stack>
                    </Card>
                </section>

                {/* 6. TABELA */}
                <section id="table">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>6. Tabela</Text>
                    <Card variant="outlined">
                      <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Usuários</Text>
                      <Table<{ id: number; nome: string; email: string }>
                        columns={[
                          {
                            key: 'nome',
                            header: 'Nome',
                            renderCell: row => row.nome,
                          },
                          {
                            key: 'email',
                            header: 'E-mail',
                            renderCell: row => row.email,
                          },
                          {
                            key: 'acoes',
                            header: 'Ações',
                            renderCell: () => (
                              <Button
                                size="sm"
                                variant="outline"
                                label="Ver detalhes"
                                onClick={() => addToast('success')}
                              />
                            ),
                          },
                        ]}
                        data={usuarios}
                        loading={tabelaCarregando}
                        rowKey={row => row.id}
                        onRowClick={() => addToast('success')}
                      />
                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination
                          currentPage={paginaAtual}
                          totalPages={totalPages}
                          onPageChange={goToPage}
                          showFirstLast
                        />
                      </div>
                    </Card>
                </section>

                {/* 5. TAMANHOS DE BOTÕES */}
                <section id="sizes">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>5. Tamanhos de Botões</Text>
                    <Card variant="flat">
                        <Stack gap={20}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
                                <Button label="Small (sm)" variant="primary" size="sm" />
                                <Button label="Medium (md)" variant="primary" size="md" />
                                <Button label="Large (lg)" variant="primary" size="lg" />
                            </div>

                            <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 15 }}>
                                <Text size="sm">Funciona com ícones também:</Text>
                                <Button label="Excluir" variant="outline" size="sm" icon={<Trash size={14}/>} />
                                <Button label="Comprar" variant="secondary" size="lg" icon={<SignIn size={24}/>} />
                            </div>
                        </Stack>
                    </Card>
                </section>

                {/* 7. Tabs + ErrorBoundary */}
                <section id="tabs">
                    <Text as="h2" size="lg" style={{ marginBottom: 15, borderBottom: '1px solid #ddd' }}>7. Tabs & ErrorBoundary</Text>
                    <Card variant="outlined">
                      <Stack gap={16}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text size="sm">Exemplo de ErrorBoundary envolvendo um componente com erro em runtime.</Text>
                          <Button
                            size="sm"
                            variant={forcarErro ? 'danger' : 'outline'}
                            label={forcarErro ? 'Erro ativado' : 'Forçar erro'}
                            onClick={() => setForcarErro(!forcarErro)}
                          />
                        </div>
                        <ErrorBoundary
                          fallback={
                            <Card variant="flat">
                              <Stack gap={8}>
                                <Text size="sm" style={{ fontWeight: 'bold' }}>Algo quebrou dentro das Tabs.</Text>
                                <Text size="sm">Clique em "Tentar novamente" para recarregar o conteúdo.</Text>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  label="Tentar novamente"
                                  onClick={() => setForcarErro(false)}
                                />
                              </Stack>
                            </Card>
                          }
                          onReset={() => setForcarErro(false)}
                        >
                          {forcarErro ? (
                            (() => {
                              throw new Error('Erro de teste dentro do ErrorBoundary');
                            })()
                          ) : (
                            <Tabs value={tabAtiva} onChange={setTabAtiva}>
                              <TabList>
                                <Tab index={0}>Detalhes</Tab>
                                <Tab index={1}>Configurações</Tab>
                                <Tab index={2}>Atividade</Tab>
                              </TabList>
                              <TabPanel index={0}>
                                <Text size="sm">Conteúdo da aba de detalhes.</Text>
                              </TabPanel>
                              <TabPanel index={1}>
                                <Text size="sm">Conteúdo da aba de configurações.</Text>
                              </TabPanel>
                              <TabPanel index={2}>
                                <Text size="sm">Conteúdo da aba de atividade.</Text>
                              </TabPanel>
                            </Tabs>
                          )}
                        </ErrorBoundary>
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

      <ConfirmModal
        isOpen={confirmModalAberto}
        title="Excluir registro"
        description="Tem certeza que deseja excluir este item? Essa ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onCancel={() => setConfirmModalAberto(false)}
        onConfirm={async () => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          addToast('success');
        }}
      />

    </div>
  );
};
