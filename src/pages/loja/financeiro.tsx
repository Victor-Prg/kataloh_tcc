import { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  ShoppingBag,
  BarChart3,
  Download,
  ChevronDown
} from 'lucide-react'
import { Button, Card } from '../../components'
import { filtrarPorPeriodo, type PeriodoFiltro } from '../../composables/periodoFiltro'

type Venda = {
  id: string
  data: string
  hora: string
  valor: number
  formaPagamento: string
  pedidoId: string
  status: 'concluido' | 'cancelado'
}

type RepasseSolicitacao = {
  id: string
  valor: number
  dataSolicitacao: string
  status: 'pendente' | 'processando' | 'concluido' | 'recusado'
  previsaoRecebimento: string
}

// Função helper para gerar data dinâmica
const getDateString = (daysAgo: number = 0): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// --- DADOS MOCK ---
const vendasMock: Venda[] = [
  // Hoje
  { id: '1', data: getDateString(0), hora: '20:15', valor: 234.50, formaPagamento: 'Pix', pedidoId: '#1245', status: 'concluido' },
  { id: '2', data: getDateString(0), hora: '19:45', valor: 156.80, formaPagamento: 'Cartão Crédito', pedidoId: '#1244', status: 'concluido' },
  { id: '3', data: getDateString(0), hora: '18:30', valor: 89.90, formaPagamento: 'Cartão Débito', pedidoId: '#1243', status: 'concluido' },
  { id: '4', data: getDateString(0), hora: '17:20', valor: 324.00, formaPagamento: 'Pix', pedidoId: '#1242', status: 'concluido' },
  { id: '5', data: getDateString(0), hora: '16:10', valor: 198.50, formaPagamento: 'Cartão Crédito', pedidoId: '#1241', status: 'concluido' },
  { id: '6', data: getDateString(0), hora: '15:05', valor: 145.90, formaPagamento: 'Pix', pedidoId: '#1240', status: 'concluido' },
  { id: '7', data: getDateString(0), hora: '14:30', valor: 267.30, formaPagamento: 'Cartão Débito', pedidoId: '#1239', status: 'concluido' },
  { id: '8', data: getDateString(0), hora: '13:15', valor: 89.50, formaPagamento: 'Dinheiro', pedidoId: '#1238', status: 'concluido' },
  { id: '9', data: getDateString(0), hora: '12:45', valor: 178.20, formaPagamento: 'Pix', pedidoId: '#1237', status: 'concluido' },
  { id: '10', data: getDateString(0), hora: '11:20', valor: 67.80, formaPagamento: 'Cartão Crédito', pedidoId: '#1236', status: 'concluido' },
  { id: '11', data: getDateString(0), hora: '10:30', valor: 423.90, formaPagamento: 'Pix', pedidoId: '#1235', status: 'concluido' },
  { id: '12', data: getDateString(0), hora: '09:15', valor: 156.40, formaPagamento: 'Cartão Débito', pedidoId: '#1234', status: 'concluido' },
  
  // Ontem (1 dia atrás)
  { id: '13', data: getDateString(1), hora: '21:00', valor: 289.90, formaPagamento: 'Pix', pedidoId: '#1233', status: 'concluido' },
  { id: '14', data: getDateString(1), hora: '20:30', valor: 134.50, formaPagamento: 'Cartão Crédito', pedidoId: '#1232', status: 'concluido' },
  { id: '15', data: getDateString(1), hora: '19:30', valor: 178.90, formaPagamento: 'Pix', pedidoId: '#1231', status: 'concluido' },
  { id: '16', data: getDateString(1), hora: '18:15', valor: 112.40, formaPagamento: 'Cartão Débito', pedidoId: '#1230', status: 'concluido' },
  { id: '17', data: getDateString(1), hora: '17:00', valor: 95.60, formaPagamento: 'Dinheiro', pedidoId: '#1229', status: 'concluido' },
  { id: '18', data: getDateString(1), hora: '15:45', valor: 256.80, formaPagamento: 'Pix', pedidoId: '#1228', status: 'concluido' },
  { id: '19', data: getDateString(1), hora: '14:20', valor: 187.30, formaPagamento: 'Cartão Crédito', pedidoId: '#1227', status: 'concluido' },
  { id: '20', data: getDateString(1), hora: '13:10', valor: 345.90, formaPagamento: 'Pix', pedidoId: '#1226', status: 'concluido' },
  { id: '21', data: getDateString(1), hora: '12:00', valor: 123.50, formaPagamento: 'Cartão Débito', pedidoId: '#1225', status: 'concluido' },
  { id: '22', data: getDateString(1), hora: '11:30', valor: 98.70, formaPagamento: 'Dinheiro', pedidoId: '#1224', status: 'concluido' },
  
  // Anteontem (2 dias atrás)
  { id: '23', data: getDateString(2), hora: '21:15', valor: 412.30, formaPagamento: 'Pix', pedidoId: '#1223', status: 'concluido' },
  { id: '24', data: getDateString(2), hora: '20:45', valor: 203.50, formaPagamento: 'Cartão Crédito', pedidoId: '#1222', status: 'concluido' },
  { id: '25', data: getDateString(2), hora: '19:30', valor: 167.80, formaPagamento: 'Pix', pedidoId: '#1221', status: 'concluido' },
  { id: '26', data: getDateString(2), hora: '18:00', valor: 234.90, formaPagamento: 'Cartão Débito', pedidoId: '#1220', status: 'concluido' },
  { id: '27', data: getDateString(2), hora: '16:45', valor: 89.20, formaPagamento: 'Dinheiro', pedidoId: '#1219', status: 'concluido' },
  { id: '28', data: getDateString(2), hora: '15:20', valor: 298.50, formaPagamento: 'Pix', pedidoId: '#1218', status: 'concluido' },
  { id: '29', data: getDateString(2), hora: '14:10', valor: 156.70, formaPagamento: 'Cartão Crédito', pedidoId: '#1217', status: 'concluido' },
  { id: '30', data: getDateString(2), hora: '13:00', valor: 378.90, formaPagamento: 'Pix', pedidoId: '#1216', status: 'concluido' },
  
  // Semana passada (3-7 dias atrás)
  { id: '31', data: getDateString(3), hora: '20:00', valor: 445.30, formaPagamento: 'Pix', pedidoId: '#1215', status: 'concluido' },
  { id: '32', data: getDateString(3), hora: '18:30', valor: 267.80, formaPagamento: 'Cartão Crédito', pedidoId: '#1214', status: 'concluido' },
  { id: '33', data: getDateString(4), hora: '21:00', valor: 189.50, formaPagamento: 'Pix', pedidoId: '#1213', status: 'concluido' },
  { id: '34', data: getDateString(4), hora: '19:15', valor: 312.40, formaPagamento: 'Cartão Débito', pedidoId: '#1212', status: 'concluido' },
  { id: '35', data: getDateString(5), hora: '20:30', valor: 234.60, formaPagamento: 'Pix', pedidoId: '#1211', status: 'concluido' },
  { id: '36', data: getDateString(5), hora: '17:45', valor: 156.90, formaPagamento: 'Dinheiro', pedidoId: '#1210', status: 'concluido' },
  { id: '37', data: getDateString(6), hora: '19:00', valor: 389.20, formaPagamento: 'Pix', pedidoId: '#1209', status: 'concluido' },
  { id: '38', data: getDateString(6), hora: '16:20', valor: 278.50, formaPagamento: 'Cartão Crédito', pedidoId: '#1208', status: 'concluido' },
]

const repassesMock: RepasseSolicitacao[] = [
  { id: '1', valor: 2845.60, dataSolicitacao: '2024-01-13', status: 'concluido', previsaoRecebimento: '2024-01-14' },
  { id: '2', valor: 1567.80, dataSolicitacao: '2024-01-12', status: 'concluido', previsaoRecebimento: '2024-01-13' },
  { id: '3', valor: 3234.50, dataSolicitacao: '2024-01-11', status: 'processando', previsaoRecebimento: '2024-01-15' },
  { id: '4', valor: 890.20, dataSolicitacao: '2024-01-10', status: 'concluido', previsaoRecebimento: '2024-01-11' },
  { id: '5', valor: 2456.90, dataSolicitacao: '2024-01-09', status: 'concluido', previsaoRecebimento: '2024-01-10' },
  { id: '6', valor: 4123.40, dataSolicitacao: '2024-01-08', status: 'concluido', previsaoRecebimento: '2024-01-09' },
  { id: '7', valor: 1678.30, dataSolicitacao: '2024-01-05', status: 'concluido', previsaoRecebimento: '2024-01-06' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export default function LojaFinanceiro() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('tudo')
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'concluido' | 'cancelado'>('todos')
  const [mostrarModalRepasse, setMostrarModalRepasse] = useState(false)
  const [valorSolicitacao, setValorSolicitacao] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [mostrarMenuPeriodo, setMostrarMenuPeriodo] = useState(false)
  const [mostrarMenuStatus, setMostrarMenuStatus] = useState(false)
  const itensPorPagina = 10

  const vendasFiltradas = useMemo(() => {
    const porPeriodo = filtrarPorPeriodo(vendasMock, venda => new Date(venda.data), periodo)

    if (statusFiltro === 'todos') {
      return porPeriodo
    }

    return porPeriodo.filter(venda => venda.status === statusFiltro)
  }, [periodo, statusFiltro])

  // Calcular métricas
  const metricas = useMemo(() => {
    const totalVendas = vendasFiltradas.reduce((acc, v) => acc + v.valor, 0)
    const quantidadeVendas = vendasFiltradas.length
    const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0

    // Simular comparação com período anterior
    const variacaoPercentual = 12.5 // Mock

    return {
      totalVendas,
      quantidadeVendas,
      ticketMedio,
      variacaoPercentual,
      saldoDisponivel: totalVendas * 0.95, // 95% disponível após taxas
    }
  }, [vendasFiltradas])

  const getPeriodoLabel = () => {
    if (periodo === 'hoje') return 'Hoje'
    if (periodo === 'semana') return 'Últimos 7 dias'
    if (periodo === 'mes') return 'Últimos 30 dias'
    return 'Tudo'
  }

  const getStatusLabel = () => {
    if (statusFiltro === 'concluido') return 'Concluídos'
    if (statusFiltro === 'cancelado') return 'Cancelados'
    return 'Todos os status'
  }

  const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina)
  const indexInicio = (paginaAtual - 1) * itensPorPagina
  const vendasPaginadas = vendasFiltradas.slice(indexInicio, indexInicio + itensPorPagina)

  const handleExportarCsv = () => {
    if (vendasFiltradas.length === 0) return

    const headers = ['Data', 'Hora', 'Pedido', 'Forma de pagamento', 'Valor', 'Status']
    const linhas = vendasFiltradas.map((venda) => [
      formatDate(venda.data),
      venda.hora,
      venda.pedidoId,
      venda.formaPagamento,
      venda.valor.toFixed(2).replace('.', ','),
      venda.status === 'concluido' ? 'Concluído' : 'Cancelado',
    ])

    const todasLinhas = [headers, ...linhas]
    const csv = todasLinhas
      .map((linha) =>
        linha
          .map((campo) => {
            const valor = String(campo ?? '')
            const precisaAspas = valor.includes(';') || valor.includes('"') || valor.includes('\n')
            const valorEscapado = valor.replace(/"/g, '""')
            return precisaAspas ? `"${valorEscapado}"` : valorEscapado
          })
          .join(';')
      )
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'financeiro-loja.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSolicitarRepasse = () => {
    const valor = parseFloat(valorSolicitacao.replace(',', '.'))
    if (valor > 0 && valor <= metricas.saldoDisponivel) {
      alert(`Solicitação de repasse de ${formatCurrency(valor)} enviada com sucesso!\n\nPrevisão de recebimento: 24 horas`)
      setMostrarModalRepasse(false)
      setValorSolicitacao('')
    } else {
      alert('Valor inválido ou superior ao saldo disponível')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Financeiro
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Acompanhe suas vendas e gerencie repasses
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap justify-end gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarMenuPeriodo(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <Calendar size={16} />
                <span>{getPeriodoLabel()}</span>
                <ChevronDown size={14} />
              </button>

              {mostrarMenuPeriodo && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg z-20 py-2">
                  {([
                    { value: 'tudo' as PeriodoFiltro, label: 'Tudo' },
                    { value: 'hoje' as PeriodoFiltro, label: 'Hoje' },
                    { value: 'semana' as PeriodoFiltro, label: 'Últimos 7 dias' },
                    { value: 'mes' as PeriodoFiltro, label: 'Últimos 30 dias' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setPeriodo(opt.value)
                        setPaginaAtual(1)
                        setMostrarMenuPeriodo(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-xs ${
                        periodo === opt.value
                          ? 'bg-[var(--primary-100)] text-white'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarMenuStatus(prev => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <span>{getStatusLabel()}</span>
                <ChevronDown size={14} />
              </button>

              {mostrarMenuStatus && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg z-20 py-2">
                  {([
                    { value: 'todos' as const, label: 'Todos os status' },
                    { value: 'concluido' as const, label: 'Concluídos' },
                    { value: 'cancelado' as const, label: 'Cancelados' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setStatusFiltro(opt.value)
                        setPaginaAtual(1)
                        setMostrarMenuStatus(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-xs ${
                        statusFiltro === opt.value
                          ? 'bg-[var(--primary-100)] text-white'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setPeriodo('tudo')
                setStatusFiltro('todos')
                setPaginaAtual(1)
                setMostrarMenuPeriodo(false)
                setMostrarMenuStatus(false)
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            >
              Limpar filtros
            </button>

            <button
              type="button"
              onClick={handleExportarCsv}
              disabled={vendasFiltradas.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <span>Exportar CSV</span>
            </button>
          </div>
          <Button
            variant="primary"
            onClick={() => setMostrarModalRepasse(true)}
            icon={<CreditCard size={18} />}
            label="Solicitar Repasse"
          />
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Vendas */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              metricas.variacaoPercentual >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metricas.variacaoPercentual >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(metricas.variacaoPercentual)}%
            </div>
          </div>
          <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
            Total de Vendas
          </h3>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(metricas.totalVendas)}
          </p>
        </Card>

        {/* Quantidade de Vendas */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingBag size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
            Quantidade de Vendas
          </h3>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {metricas.quantidadeVendas}
          </p>
        </Card>

        {/* Ticket Médio */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
            Ticket Médio
          </h3>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(metricas.ticketMedio)}
          </p>
        </Card>

        {/* Saldo Disponível */}
        <Card className="p-5 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CreditCard size={20} className="text-white" />
            </div>
            <ArrowUpRight size={20} className="text-white/80" />
          </div>
          <h3 className="text-xs font-medium text-white/80 mb-1">
            Saldo Disponível
          </h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(metricas.saldoDisponivel)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABELA DE VENDAS */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShoppingBag size={20} />
                Vendas Recentes
              </h2>
              <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-body)] px-3 py-1 rounded-full">
                {vendasFiltradas.length} vendas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">Data/Hora</th>
                    <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">Pedido</th>
                    <th className="text-left text-xs font-medium text-[var(--text-secondary)] pb-3">Pagamento</th>
                    <th className="text-right text-xs font-medium text-[var(--text-secondary)] pb-3">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {vendasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <ShoppingBag size={48} className="text-[var(--text-muted)] opacity-30" />
                          <p className="text-[var(--text-muted)] text-sm">
                            Nenhuma venda no período selecionado
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    vendasPaginadas.map((venda) => (
                      <tr key={venda.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors">
                        <td className="py-3">
                          <div className="text-sm text-[var(--text-primary)]">{formatDate(venda.data)}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{venda.hora}</div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {venda.pedidoId}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-body)] px-2 py-1 rounded">
                            {venda.formaPagamento}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(venda.valor)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {vendasFiltradas.length > 0 && totalPaginas > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-secondary)]">
                  Mostrando {indexInicio + 1}-{Math.min(indexInicio + itensPorPagina, vendasFiltradas.length)} de {vendasFiltradas.length} vendas
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                    disabled={paginaAtual === 1}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* HISTÓRICO DE REPASSES */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Clock size={20} />
              Repasses Recentes
            </h2>

            <div className="space-y-3">
              {repassesMock.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard size={48} className="text-[var(--text-muted)] opacity-30 mx-auto mb-2" />
                  <p className="text-[var(--text-muted)] text-sm">
                    Nenhum repasse solicitado
                  </p>
                </div>
              ) : (
                repassesMock.map((repasse) => (
                  <div
                    key={repasse.id}
                    className="p-4 bg-[var(--bg-body)] border border-[var(--border)] rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-[var(--text-primary)]">
                        {formatCurrency(repasse.valor)}
                      </span>
                      {repasse.status === 'concluido' && (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                      {repasse.status === 'processando' && (
                        <Clock size={18} className="text-yellow-500" />
                      )}
                      {repasse.status === 'pendente' && (
                        <AlertCircle size={18} className="text-blue-500" />
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        Solicitado: {formatDate(repasse.dataSolicitacao)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        Previsão: {formatDate(repasse.previsaoRecebimento)}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        repasse.status === 'concluido'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : repasse.status === 'processando'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {repasse.status === 'concluido' && 'Concluído'}
                        {repasse.status === 'processando' && 'Processando'}
                        {repasse.status === 'pendente' && 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL DE SOLICITAÇÃO DE REPASSE */}
      {mostrarModalRepasse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-xl max-w-md w-full p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                Solicitar Repasse
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                O valor será creditado em até 24 horas
              </p>
            </div>

            <div className="bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--text-secondary)]">Saldo Disponível</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(metricas.saldoDisponivel)}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Taxa de processamento: 5% já descontada
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Valor do Repasse
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  R$
                </span>
                <input
                  type="text"
                  value={valorSolicitacao}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,]/g, '')
                    setValorSolicitacao(value)
                  }}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg-body)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] text-lg font-bold"
                />
              </div>
              
              {/* Valores Rápidos */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setValorSolicitacao('500,00')}
                  className="flex-1 px-3 py-2 text-xs font-medium bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                >
                  R$ 500
                </button>
                <button
                  type="button"
                  onClick={() => setValorSolicitacao('1000,00')}
                  className="flex-1 px-3 py-2 text-xs font-medium bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                >
                  R$ 1.000
                </button>
                <button
                  type="button"
                  onClick={() => setValorSolicitacao('2000,00')}
                  className="flex-1 px-3 py-2 text-xs font-medium bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-primary)] transition-colors"
                >
                  R$ 2.000
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const valorTotal = metricas.saldoDisponivel.toFixed(2).replace('.', ',')
                    setValorSolicitacao(valorTotal)
                  }}
                  className="flex-1 px-3 py-2 text-xs font-medium bg-[var(--primary-100)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tudo
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  O repasse será processado e creditado em sua conta em até 24 horas úteis
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarModalRepasse(false)
                  setValorSolicitacao('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSolicitarRepasse}
                className="flex-1"
                disabled={!valorSolicitacao || parseFloat(valorSolicitacao.replace(',', '.')) <= 0}
              >
                Solicitar Repasse
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
