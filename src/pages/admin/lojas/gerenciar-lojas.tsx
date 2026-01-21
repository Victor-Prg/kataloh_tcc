import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  Clock,
  ChefHat,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  Package,
  Plus,
  X,
  MapPin,
  User,
  Lock,
  Building,
  Image as ImageIcon,
  FileText
} from 'lucide-react'
import { 
  Button, 
  Input, 
  Select, 
  Card 
} from '../../../components'

// --- TIPAGENS ---

type LojaStatus = 'aberta' | 'fechada'
type RamoAtividade = 'alimenticio' | 'farmaceutico' | 'supermercado' | 'varejo'

interface LojaAtiva {
  id: string
  nome: string
  status: LojaStatus
  pedidosPendentes: number
  pedidosEmPreparo: number
  pedidosFinalizadosHoje: number
  totalPedidosHoje: number
  // Novos campos opcionais
  ramo?: RamoAtividade
  razaoSocial?: string
  cnpj?: string
  // Endereço Separado
  cep?: string
  rua?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  localizacao?: string
  // Visual & Acesso
  logo?: string
  banner?: string
  usuario?: string
  senha?: string
  endereco?: string
}

const LOJAS_ATIVAS_MOCK: LojaAtiva[] = [
  {
    id: 'loja-central',
    nome: 'Loja Central',
    status: 'aberta',
    pedidosPendentes: 8,
    pedidosEmPreparo: 3,
    pedidosFinalizadosHoje: 12,
    totalPedidosHoje: 23,
    endereco: 'Av. Paulista, 1000',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop'
  },
  {
    id: 'loja-shopping',
    nome: 'Loja Shopping',
    status: 'aberta',
    pedidosPendentes: 3,
    pedidosEmPreparo: 2,
    pedidosFinalizadosHoje: 7,
    totalPedidosHoje: 12,
    endereco: 'Shopping Center, Piso 2',
    logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=300&fit=crop'
  },
]

const RAMOS_OPTIONS = [
  { label: 'Alimentício', value: 'alimenticio' },
  { label: 'Farmacêutico', value: 'farmaceutico' },
  { label: 'Supermercado', value: 'supermercado' },
  { label: 'Varejo', value: 'varejo' },
]

const ESTADOS_OPTIONS = [
  { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' }, { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' }, { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' }, { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' }, { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' }
]

// Função auxiliar para gerar iniciais
const getLojaAvatarLabel = (nome: string) => {
  const partes = nome.trim().split(' ').filter(Boolean)
  if (partes.length === 0) return ''
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase()
  }
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase()
}

// Função para formatar endereço no card
const formatAddress = (loja: LojaAtiva) => {
  if (loja.endereco) return loja.endereco;
  if (!loja.rua) return 'Endereço não cadastrado';
  return `${loja.rua}, ${loja.numero || 'S/N'} - ${loja.bairro || ''}`;
}

// Função segura para gerar ID
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export default function AdminGerenciarLojas() {
  const navigate = useNavigate()
  
  // --- ESTADOS ---
  const [lojas, setLojas] = useState<LojaAtiva[]>(LOJAS_ATIVAS_MOCK)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Estado do Formulário
  const [form, setForm] = useState<Partial<LojaAtiva>>({
    nome: '',
    razaoSocial: '',
    cnpj: '',
    ramo: 'alimenticio',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    localizacao: '',
    usuario: '',
    senha: '',
    status: 'fechada',
    logo: '',
    banner: ''
  })

  // --- LÓGICA DO DASHBOARD ---

  const handleIrParaPedidosLoja = (loja: LojaAtiva) => {
    navigate(`/admin/pedidos-loja/${encodeURIComponent(loja.id)}`)
  }

  const handleKeyDownCard = (event: KeyboardEvent<HTMLDivElement>, loja: LojaAtiva) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleIrParaPedidosLoja(loja)
    }
  }

  // Ordenação
  const lojasOrdenadas = [...lojas].sort((a, b) => {
    const getPriority = (loja: LojaAtiva) => {
      if (loja.pedidosPendentes >= 8) return 0
      if (loja.pedidosPendentes >= 5 || loja.pedidosEmPreparo >= 5) return 1
      if (loja.status === 'fechada') return 2
      return 3
    }
    const prioridadeA = getPriority(a)
    const prioridadeB = getPriority(b)
    if (prioridadeA !== prioridadeB) return prioridadeA - prioridadeB
    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  const hasLojasAltaDemanda = lojasOrdenadas.some(
    (loja) => loja.pedidosPendentes >= 8 || loja.pedidosEmPreparo >= 5
  )

  const totalLojas = lojasOrdenadas.length
  const lojasAbertas = lojasOrdenadas.filter(l => l.status === 'aberta').length
  const totalPedidosPendentes = lojasOrdenadas.reduce((acc, l) => acc + l.pedidosPendentes, 0)
  const totalPedidosHoje = lojasOrdenadas.reduce((acc, l) => acc + l.totalPedidosHoje, 0)

  // --- LÓGICA DO FORMULÁRIO ---

  const handleSave = () => {
    if (!form.nome || !form.razaoSocial || !form.cnpj || !form.usuario) {
      return alert('Preencha os campos obrigatórios (*)')
    }

    const novaLoja: LojaAtiva = {
      ...(form as LojaAtiva),
      id: generateId(),
      pedidosPendentes: 0,
      pedidosEmPreparo: 0,
      pedidosFinalizadosHoje: 0,
      totalPedidosHoje: 0,
      status: 'fechada',
      endereco: form.rua ? `${form.rua}, ${form.numero} - ${form.bairro}` : ''
    }

    setLojas(prev => [...prev, novaLoja])
    resetForm()
  }

  const resetForm = () => {
    setIsFormOpen(false)
    setShowPassword(false)
    setForm({
      nome: '',
      razaoSocial: '',
      cnpj: '',
      ramo: 'alimenticio',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      localizacao: '',
      usuario: '',
      senha: '',
      status: 'fechada',
      logo: '',
      banner: ''
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
            Gerenciar Lojas
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {isFormOpen 
              ? "Cadastre uma nova filial ou parceiro" 
              : "Visualize e monitore todas as lojas em tempo real"
            }
          </p>
        </div>
        
        {!isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            icon={<Plus size={20} />}
            label="Adicionar Nova Loja"
          />
        )}
      </div>

      {/* --- MODO FORMULÁRIO --- */}
      {isFormOpen ? (
        <Card className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
            <h2 className="text-[20px] font-medium text-[var(--text-primary)]">Cadastrar Nova Loja</h2>
            <button onClick={resetForm} className="text-[var(--text-secondary)] hover:text-[var(--danger)]">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUNA 1: Identidade e Dados Empresariais */}
            <div className="space-y-6">
              
              {/* Identidade Visual */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-2">
                  <ImageIcon size={16} /> Identidade Visual
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-[var(--text-primary)]">Logo (Quadrada)</span>
                    <div className="aspect-square border-2 border-dashed border-[var(--border-color)] rounded-[12px] flex flex-col items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors bg-[var(--bg-body)]">
                      {form.logo ? <img src={form.logo} className="w-full h-full object-cover rounded-[12px]" /> : <ImageIcon size={24} className="opacity-50" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-[var(--text-primary)]">Banner (Capa)</span>
                    <div className="aspect-video border-2 border-dashed border-[var(--border-color)] rounded-[12px] flex flex-col items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors bg-[var(--bg-body)]">
                       {form.banner ? <img src={form.banner} className="w-full h-full object-cover rounded-[12px]" /> : <ImageIcon size={24} className="opacity-50" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[var(--border-color)]" />

              {/* Dados Empresariais */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-2">
                  <FileText size={16} /> Dados Empresariais
                </h3>
                
                <Input 
                  label="Nome Fantasia *"
                  placeholder="Ex: Pizzaria do João"
                  value={form.nome}
                  className="w-full"
                  maxLength={40} // Limite de 40 caracteres
                  onChange={e => setForm(prev => ({...prev, nome: e.target.value}))}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Razão Social *"
                    placeholder="João Silva ME"
                    value={form.razaoSocial}
                    className="w-full"
                    maxLength={150} // Limite de 150 caracteres
                    onChange={e => setForm(prev => ({...prev, razaoSocial: e.target.value}))}
                  />
                  <Input 
                    label="CNPJ *"
                    placeholder="00.000.000/0001-00"
                    value={form.cnpj}
                    className="w-full"
                    maxLength={18}
                    onChange={e => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length > 14) value = value.slice(0, 14)
                      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
                      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
                      value = value.replace(/(\d{4})(\d)/, '$1-$2')
                      setForm(prev => ({...prev, cnpj: value}))
                    }}
                  />
                </div>

                <Select 
                  label="Ramo de Atividade *"
                  options={RAMOS_OPTIONS}
                  value={form.ramo}
                  className="w-full"
                  onChange={e => setForm(prev => ({...prev, ramo: e.target.value as RamoAtividade}))}
                />
              </div>
            </div>

            {/* COLUNA 2: Endereço Detalhado e Acesso */}
            <div className="space-y-6">
              
              {/* Localização (Grid 12 colunas) */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-2">
                  <MapPin size={16} /> Localização
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                  {/* Linha 1 */}
                  <div className="sm:col-span-3">
                    <Input 
                      label="CEP"
                      placeholder="00000-000"
                      value={form.cep}
                      className="w-full"
                      maxLength={9} // 8 números + 1 hífen
                      onChange={e => {
                        // Remove não dígitos e limita a 8 caracteres
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length > 8) value = value.slice(0, 8)
                        
                        // Aplica máscara
                        value = value.replace(/^(\d{5})(\d)/, '$1-$2')
                        
                        setForm(prev => ({...prev, cep: value}))
                      }}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <Input 
                      label="Cidade"
                      placeholder="Ex: São Paulo"
                      value={form.cidade}
                      className="w-full"
                      onChange={e => setForm(prev => ({...prev, cidade: e.target.value}))}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Select 
                      label="Estado"
                      options={ESTADOS_OPTIONS}
                      value={form.estado}
                      className="w-full"
                      onChange={e => setForm(prev => ({...prev, estado: e.target.value}))}
                      placeholder="UF"
                    />
                  </div>

                  {/* Linha 2 */}
                  <div className="sm:col-span-9">
                    <Input 
                      label="Rua / Logradouro *"
                      placeholder="Ex: Av. Paulista"
                      value={form.rua}
                      className="w-full"
                      onChange={e => setForm(prev => ({...prev, rua: e.target.value}))}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input 
                      label="Número *"
                      placeholder="100 ou S/N"
                      value={form.numero}
                      className="w-full"
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '') {
                          setForm(prev => ({...prev, numero: val}));
                          return;
                        }
                        if (/^\d+$/.test(val)) {
                          if (val.length <= 10) setForm(prev => ({...prev, numero: val}));
                          return;
                        }
                        if (/^(s|S)(\/(n|N)?)?$/.test(val)) {
                          setForm(prev => ({...prev, numero: val}));
                        }
                      }}
                    />
                  </div>

                  {/* Linha 3 */}
                  <div className="sm:col-span-5">
                     <Input 
                      label="Bairro"
                      placeholder="Centro"
                      value={form.bairro}
                      className="w-full"
                      onChange={e => setForm(prev => ({...prev, bairro: e.target.value}))}
                    />
                  </div>
                  <div className="sm:col-span-7">
                    <Input 
                      label="Coordenadas (Opcional)"
                      placeholder="-23.561, -46.655"
                      icon={<Building size={18} />}
                      value={form.localizacao}
                      className="w-full"
                      // Permite números, sinal negativo, ponto, vírgula e espaço
                      onChange={e => {
                        const value = e.target.value.replace(/[^0-9.,\-\s]/g, '')
                        setForm(prev => ({...prev, localizacao: value}))
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-[var(--border-color)]" />
              
              {/* Credenciais */}
              <div className="bg-[var(--surface-nav)] p-5 rounded-[12px] border border-[var(--border-color)] shadow-sm">
                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                  <User size={16} /> Credenciais de Admin
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Usuário / Login *"
                    placeholder="admin_loja"
                    value={form.usuario}
                    className="w-full"
                    onChange={e => setForm(prev => ({...prev, usuario: e.target.value}))}
                  />
                  
                  {/* SENHA */}
                  <div className="w-full">
                    <span className="text-xs font-medium text-[var(--text-primary)] mb-1.5 block">
                      Senha Inicial
                    </span>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha forte"
                        icon={<Lock size={18} />}
                        value={form.senha}
                        className="w-full pr-10"
                        onChange={e => setForm(prev => ({...prev, senha: e.target.value}))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--primary-100)] transition-colors z-10 flex items-center justify-center"
                        title={showPassword ? "Ocultar senha" : "Ver senha"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" label="Cancelar" onClick={resetForm} />
                <Button label="Salvar Loja" onClick={handleSave} />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* --- MODO DASHBOARD --- */
        <div className="space-y-6 animate-fade-in">
          
          {/* CARDS DE ESTATÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Store size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                  Total de Lojas
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalLojas}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{lojasAbertas} abertas agora</p>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Clock size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                  Pendentes
                </h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {totalPedidosPendentes}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Todas as lojas</p>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <ChefHat size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                  Em Preparo
                </h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {lojasOrdenadas.reduce((acc, l) => acc + l.pedidosEmPreparo, 0)}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Todas as lojas</p>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Package size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                  Hoje
                </h3>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalPedidosHoje}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Total do dia</p>
            </div>
          </div>

          {/* ALERTA DE ALTA DEMANDA */}
          {hasLojasAltaDemanda && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-[12px] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <AlertTriangle size={24} className="text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    Atenção: Alta Demanda Detectada
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Algumas lojas estão com alta demanda ou fila elevada. Monitore os pedidos com atenção.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GRID DE LOJAS */}
          <div className="mt-6">
            {lojasOrdenadas.length === 0 ? (
              <div className="flex items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-6 py-20">
                <div className="text-center">
                  <Store size={64} className="mx-auto text-[var(--text-muted)] opacity-30 mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    Nenhuma loja cadastrada
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                    Cadastre lojas para começar a monitorar pedidos e status em tempo real
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {lojasOrdenadas.map((loja) => {
                  const getDemandaStatus = () => {
                    if (loja.pedidosPendentes >= 8) {
                      return {
                        label: 'ALTA DEMANDA',
                        bgColor: 'bg-red-500/20',
                        textColor: 'text-red-700 dark:text-red-400',
                        icon: AlertTriangle
                      }
                    } else if (loja.pedidosPendentes >= 5) {
                      return {
                        label: 'DEMANDA NORMAL',
                        bgColor: 'bg-yellow-500/20',
                        textColor: 'text-yellow-700 dark:text-yellow-400',
                        icon: Clock
                      }
                    } else if (loja.pedidosPendentes >= 3) {
                      return {
                        label: 'POUCA DEMANDA',
                        bgColor: 'bg-blue-500/20',
                        textColor: 'text-blue-700 dark:text-blue-400',
                        icon: TrendingUp
                      }
                    }
                    return null
                  }

                  const demandaStatus = getDemandaStatus()
                  const temFilaElevada = loja.pedidosEmPreparo >= 5
                  
                  return (
                  <div
                    key={loja.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleIrParaPedidosLoja(loja)}
                    onKeyDown={(event) => handleKeyDownCard(event, loja)}
                    className="group relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-100)] focus-visible:outline-none flex flex-col"
                  >
                    <div className="relative p-4 bg-[var(--primary-100)]">
                      {loja.banner && (
                        <img
                          src={loja.banner}
                          alt={loja.nome}
                          className="absolute inset-0 h-full w-full object-cover opacity-70"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                      <div className="relative">
                        <div className="absolute top-2 right-2">
                        {loja.status === 'aberta' ? (
                          <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Aberta
                            Aberta
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 bg-[color:var(--secondary-100)] text-[color:var(--text-primary)] text-xs font-bold px-2.5 py-1 rounded-full">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                            Fechada
                          </span>
                        )}
                      </div>
                        <div className="flex items-center gap-3 pt-8">
                          <div className="flex size-14 items-center justify-center rounded-[12px] bg-white/20 backdrop-blur-sm text-lg font-bold text-white border-2 border-white/30 overflow-hidden">
                            {loja.logo ? (
                              <img src={loja.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              getLojaAvatarLabel(loja.nome)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">
                              {loja.nome}
                            </h3>
                            <div className="flex items-center gap-1 text-white/80">
                              <MapPin size={10} />
                              <p className="text-xs font-medium truncate">
                                {formatAddress(loja)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BADGES DE STATUS */}
                    <div
                      className={`px-4 py-2 border-b flex flex-wrap items-center gap-1.5 min-h-[40px] ${
                        demandaStatus
                          ? demandaStatus.bgColor.replace('/20', '/10') +
                            ' border-' +
                            demandaStatus.bgColor.split('-')[1] +
                            '-500/30'
                          : 'bg-[color:var(--surface-nav)] border-[color:var(--border)]'
                      }`}
                    >
                      {demandaStatus ? (
                        <>
                          <span className={`inline-flex items-center gap-1.5 ${demandaStatus.bgColor} ${demandaStatus.textColor} text-[10px] font-bold px-2 py-1 rounded`}>
                            {demandaStatus.icon && <demandaStatus.icon size={12} />}
                            {demandaStatus.label}
                          </span>
                          {temFilaElevada && (
                            <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded">
                              <ChefHat size={12} />
                              FILA ELEVADA
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] italic">Sem pedidos pendentes</span>
                      )}
                    </div>

                    {/* CONTEÚDO */}
                    <div className="p-4 space-y-4 flex-1 flex flex-col">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-[12px] bg-orange-500/10">
                            <Clock size={20} className="text-orange-600 dark:text-orange-400" />
                          </div>
                          <p className="text-2xl font-bold text-[var(--text-primary)]">
                            {loja.pedidosPendentes}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            Pendentes
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-[12px] bg-blue-500/10">
                            <ChefHat size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-2xl font-bold text-[var(--text-primary)]">
                            {loja.pedidosEmPreparo}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            Preparo
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-[12px] bg-green-500/10">
                            <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-2xl font-bold text-[var(--text-primary)]">
                            {loja.pedidosFinalizadosHoje}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                            Finalizados
                          </p>
                        </div>
                      </div>

                      <div className="bg-[var(--bg-body)] rounded-[12px] p-3 border border-[var(--border)] mt-auto">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[var(--text-secondary)]" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                              Total do Dia
                            </span>
                          </div>
                          <span className="text-xl font-bold text-[var(--primary-100)]">
                            {loja.totalPedidosHoje}
                          </span>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 bg-[var(--primary-100)] hover:opacity-90 text-white font-semibold py-2.5 rounded-[12px] transition-all group-hover:gap-3 mt-4">
                        <Eye size={18} />
                        <span>Ver Pedidos</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
