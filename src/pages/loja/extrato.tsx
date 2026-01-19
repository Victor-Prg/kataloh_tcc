import { useState, useMemo } from 'react'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react'
import { Card } from '../../components'
import { filtrarPorPeriodo, type PeriodoFiltro } from '../../composables/periodoFiltro'

// --- TIPOS ---
type TipoMovimentacao = 'entrada' | 'saida' | 'todos'

type Movimentacao = {
  id: string
  data: string
  hora: string
  tipo: 'entrada' | 'saida'
  descricao: string
  categoria: string
  valor: number
  saldo: number
}

// Função helper para gerar data dinâmica
const getDateString = (daysAgo: number = 0): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// --- DADOS MOCK ---
const movimentacoesMock: Movimentacao[] = [
  // Hoje - Entradas
  { id: '1', data: getDateString(0), hora: '20:15', tipo: 'entrada', descricao: 'Venda #1245', categoria: 'Pix', valor: 234.50, saldo: 5840.20 },
  { id: '2', data: getDateString(0), hora: '19:45', tipo: 'entrada', descricao: 'Venda #1244', categoria: 'Cartão Crédito', valor: 156.80, saldo: 5605.70 },
  { id: '3', data: getDateString(0), hora: '18:30', tipo: 'entrada', descricao: 'Venda #1243', categoria: 'Cartão Débito', valor: 89.90, saldo: 5448.90 },
  { id: '4', data: getDateString(0), hora: '17:20', tipo: 'entrada', descricao: 'Venda #1242', categoria: 'Pix', valor: 324.00, saldo: 5359.00 },
  
  // Hoje - Saídas
  { id: '5', data: getDateString(0), hora: '16:30', tipo: 'saida', descricao: 'Repasse solicitado', categoria: 'Transferência', valor: -500.00, saldo: 5035.00 },
  { id: '6', data: getDateString(0), hora: '14:20', tipo: 'saida', descricao: 'Taxa de serviço', categoria: 'Taxa', valor: -15.50, saldo: 5535.00 },
  
  { id: '7', data: getDateString(0), hora: '16:10', tipo: 'entrada', descricao: 'Venda #1241', categoria: 'Cartão Crédito', valor: 198.50, saldo: 5550.50 },
  { id: '8', data: getDateString(0), hora: '15:05', tipo: 'entrada', descricao: 'Venda #1240', categoria: 'Pix', valor: 145.90, saldo: 5352.00 },
  { id: '9', data: getDateString(0), hora: '14:30', tipo: 'entrada', descricao: 'Venda #1239', categoria: 'Cartão Débito', valor: 267.30, saldo: 5206.10 },
  { id: '10', data: getDateString(0), hora: '13:15', tipo: 'entrada', descricao: 'Venda #1238', categoria: 'Dinheiro', valor: 89.50, saldo: 4938.80 },
  { id: '11', data: getDateString(0), hora: '12:45', tipo: 'entrada', descricao: 'Venda #1237', categoria: 'Pix', valor: 178.20, saldo: 4849.30 },
  
  // Ontem
  { id: '12', data: getDateString(1), hora: '21:00', tipo: 'entrada', descricao: 'Venda #1233', categoria: 'Pix', valor: 289.90, saldo: 4671.10 },
  { id: '13', data: getDateString(1), hora: '20:30', tipo: 'entrada', descricao: 'Venda #1232', categoria: 'Cartão Crédito', valor: 134.50, saldo: 4381.20 },
  { id: '14', data: getDateString(1), hora: '19:30', tipo: 'entrada', descricao: 'Venda #1231', categoria: 'Pix', valor: 178.90, saldo: 4246.70 },
  
  { id: '15', data: getDateString(1), hora: '18:00', tipo: 'saida', descricao: 'Repasse solicitado', categoria: 'Transferência', valor: -1000.00, saldo: 4067.80 },
  { id: '16', data: getDateString(1), hora: '17:30', tipo: 'saida', descricao: 'Taxa de serviço', categoria: 'Taxa', valor: -25.80, saldo: 5067.80 },
  
  { id: '17', data: getDateString(1), hora: '18:15', tipo: 'entrada', descricao: 'Venda #1230', categoria: 'Cartão Débito', valor: 112.40, saldo: 5093.60 },
  { id: '18', data: getDateString(1), hora: '17:00', tipo: 'entrada', descricao: 'Venda #1229', categoria: 'Dinheiro', valor: 95.60, saldo: 4981.20 },
  { id: '19', data: getDateString(1), hora: '15:45', tipo: 'entrada', descricao: 'Venda #1228', categoria: 'Pix', valor: 256.80, saldo: 4885.60 },
  { id: '20', data: getDateString(1), hora: '14:20', tipo: 'entrada', descricao: 'Venda #1227', categoria: 'Cartão Crédito', valor: 187.30, saldo: 4628.80 },
  
  // 2 dias atrás
  { id: '21', data: getDateString(2), hora: '21:15', tipo: 'entrada', descricao: 'Venda #1223', categoria: 'Pix', valor: 412.30, saldo: 4441.50 },
  { id: '22', data: getDateString(2), hora: '20:45', tipo: 'entrada', descricao: 'Venda #1222', categoria: 'Cartão Crédito', valor: 203.50, saldo: 4029.20 },
  { id: '23', data: getDateString(2), hora: '19:30', tipo: 'entrada', descricao: 'Venda #1221', categoria: 'Pix', valor: 167.80, saldo: 3825.70 },
  
  { id: '24', data: getDateString(2), hora: '16:00', tipo: 'saida', descricao: 'Taxa de serviço', categoria: 'Taxa', valor: -18.40, saldo: 3657.90 },
  
  { id: '25', data: getDateString(2), hora: '18:00', tipo: 'entrada', descricao: 'Venda #1220', categoria: 'Cartão Débito', valor: 234.90, saldo: 3676.30 },
  { id: '26', data: getDateString(2), hora: '16:45', tipo: 'entrada', descricao: 'Venda #1219', categoria: 'Dinheiro', valor: 89.20, saldo: 3441.40 },
  
  // 3 dias atrás
  { id: '27', data: getDateString(3), hora: '20:00', tipo: 'entrada', descricao: 'Venda #1215', categoria: 'Pix', valor: 445.30, saldo: 3352.20 },
  { id: '28', data: getDateString(3), hora: '18:30', tipo: 'entrada', descricao: 'Venda #1214', categoria: 'Cartão Crédito', valor: 267.80, saldo: 2906.90 },
  
  { id: '29', data: getDateString(3), hora: '15:00', tipo: 'saida', descricao: 'Repasse solicitado', categoria: 'Transferência', valor: -800.00, saldo: 2639.10 },
  { id: '30', data: getDateString(3), hora: '14:30', tipo: 'saida', descricao: 'Taxa de serviço', categoria: 'Taxa', valor: -22.60, saldo: 3439.10 },
  
  // 4-7 dias atrás
  { id: '31', data: getDateString(4), hora: '21:00', tipo: 'entrada', descricao: 'Venda #1213', categoria: 'Pix', valor: 189.50, saldo: 3461.70 },
  { id: '32', data: getDateString(4), hora: '19:15', tipo: 'entrada', descricao: 'Venda #1212', categoria: 'Cartão Débito', valor: 312.40, saldo: 3272.20 },
  { id: '33', data: getDateString(5), hora: '20:30', tipo: 'entrada', descricao: 'Venda #1211', categoria: 'Pix', valor: 234.60, saldo: 2959.80 },
  { id: '34', data: getDateString(5), hora: '17:45', tipo: 'entrada', descricao: 'Venda #1210', categoria: 'Dinheiro', valor: 156.90, saldo: 2725.20 },
  { id: '35', data: getDateString(6), hora: '19:00', tipo: 'entrada', descricao: 'Venda #1209', categoria: 'Pix', valor: 389.20, saldo: 2568.30 },
  { id: '36', data: getDateString(6), hora: '16:20', tipo: 'entrada', descricao: 'Venda #1208', categoria: 'Cartão Crédito', valor: 278.50, saldo: 2179.10 },
  
  { id: '37', data: getDateString(7), hora: '14:00', tipo: 'saida', descricao: 'Taxa de serviço', categoria: 'Taxa', valor: -12.30, saldo: 1900.60 },
  { id: '38', data: getDateString(7), hora: '13:00', tipo: 'saida', descricao: 'Repasse solicitado', categoria: 'Transferência', valor: -600.00, saldo: 1912.90 },
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

export default function ExtratoLoja() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('tudo')
  const [tipoMovimentacao, setTipoMovimentacao] = useState<TipoMovimentacao>('todos')
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [mostrarMenuPeriodo, setMostrarMenuPeriodo] = useState(false)
  const [mostrarMenuTipo, setMostrarMenuTipo] = useState(false)
  const itensPorPagina = 15

  // Filtrar movimentações
  const movimentacoesFiltradas = useMemo(() => {
    const filtradasPorPeriodo = filtrarPorPeriodo(
      movimentacoesMock,
      mov => new Date(mov.data),
      periodo,
    )

    const filtradasPorTipo = filtradasPorPeriodo.filter(mov => {
      if (tipoMovimentacao !== 'todos' && mov.tipo !== tipoMovimentacao) {
        return false
      }

      if (busca) {
        const buscaLower = busca.toLowerCase()
        return (
          mov.descricao.toLowerCase().includes(buscaLower) ||
          mov.categoria.toLowerCase().includes(buscaLower)
        )
      }

      return true
    })

    return filtradasPorTipo
  }, [periodo, tipoMovimentacao, busca])

  // Calcular métricas
  const metricas = useMemo(() => {
    const totalEntradas = movimentacoesFiltradas
      .filter(m => m.tipo === 'entrada')
      .reduce((acc, m) => acc + m.valor, 0)
    
    const totalSaidas = Math.abs(
      movimentacoesFiltradas
        .filter(m => m.tipo === 'saida')
        .reduce((acc, m) => acc + m.valor, 0)
    )

    const saldoPeriodo = totalEntradas - totalSaidas

    return {
      totalEntradas,
      totalSaidas,
      saldoPeriodo,
      quantidadeMovimentacoes: movimentacoesFiltradas.length,
    }
  }, [movimentacoesFiltradas])

  // Paginação
  const totalPaginas = Math.ceil(movimentacoesFiltradas.length / itensPorPagina)
  const indexInicio = (paginaAtual - 1) * itensPorPagina
  const movimentacoesPaginadas = movimentacoesFiltradas.slice(indexInicio, indexInicio + itensPorPagina)

  const getPeriodoLabel = () => {
    if (periodo === 'hoje') return 'Hoje'
    if (periodo === 'semana') return 'Últimos 7 dias'
    if (periodo === 'mes') return 'Últimos 30 dias'
    return 'Tudo'
  }

  const getTipoLabel = () => {
    if (tipoMovimentacao === 'entrada') return 'Entradas'
    if (tipoMovimentacao === 'saida') return 'Saídas'
    return 'Todos os status'
  }

  const handleExportarCsv = () => {
    if (movimentacoesFiltradas.length === 0) return

    const headers = ['Data', 'Hora', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Saldo']
    const linhas = movimentacoesFiltradas.map((mov) => [
      formatDate(mov.data),
      mov.hora,
      mov.tipo === 'entrada' ? 'Entrada' : 'Saída',
      mov.descricao,
      mov.categoria,
      mov.valor.toFixed(2).replace('.', ','),
      mov.saldo.toFixed(2).replace('.', ','),
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
    link.download = 'extrato.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)]">
            Extrato Financeiro
          </h1>
          <p className="text-[20px] font-medium text-[var(--text-secondary)] mt-1">
            Visualize todas as movimentações financeiras da sua loja
          </p>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap justify-end gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarMenuPeriodo(prev => !prev)}
                className="inline-flex w-full sm:w-auto items-center justify-between gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
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
                onClick={() => setMostrarMenuTipo(prev => !prev)}
                className="inline-flex w-full sm:w-auto items-center justify-between gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <span>{getTipoLabel()}</span>
                <ChevronDown size={14} />
              </button>

              {mostrarMenuTipo && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg z-20 py-2">
                  {([
                    { value: 'todos' as TipoMovimentacao, label: 'Todos os status' },
                    { value: 'entrada' as TipoMovimentacao, label: 'Entradas' },
                    { value: 'saida' as TipoMovimentacao, label: 'Saídas' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setTipoMovimentacao(opt.value)
                        setPaginaAtual(1)
                        setMostrarMenuTipo(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2 text-xs ${
                        tipoMovimentacao === opt.value
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
                setTipoMovimentacao('todos')
                setBusca('')
                setPaginaAtual(1)
                setMostrarMenuPeriodo(false)
                setMostrarMenuTipo(false)
              }}
              className="w-full sm:w-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            >
              Limpar filtros
            </button>

            <button
              type="button"
              onClick={handleExportarCsv}
              disabled={movimentacoesFiltradas.length === 0}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <span>Exportar CSV</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setPaginaAtual(1)
              }}
              placeholder="Buscar por descrição..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-[12px] bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] text-sm"
            />
          </div>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entradas */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ArrowUpCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">
              Total Entradas
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(metricas.totalEntradas)}
          </p>
        </Card>

        {/* Total Saídas */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ArrowDownCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">
              Total Saídas
            </h3>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(metricas.totalSaidas)}
          </p>
        </Card>

        {/* Saldo do Período */}
        <Card className="p-5 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <h3 className="text-xs font-medium text-white/80">
              Saldo do Período
            </h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(metricas.saldoPeriodo)}
          </p>
        </Card>

        {/* Quantidade de Movimentações */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Filter size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)]">
              Movimentações
            </h3>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {metricas.quantidadeMovimentacoes}
          </p>
        </Card>
      </div>

      {/* TABELA DE MOVIMENTAÇÕES */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--surface-nav)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] px-4 py-3">Data/Hora</th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] px-4 py-3">Descrição</th>
                <th className="text-left text-xs font-medium text-[var(--text-secondary)] px-4 py-3">Categoria</th>
                <th className="text-right text-xs font-medium text-[var(--text-secondary)] px-4 py-3">Valor</th>
                <th className="text-right text-xs font-medium text-[var(--text-secondary)] px-4 py-3">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={48} className="text-[var(--text-muted)] opacity-30" />
                      <p className="text-[var(--text-muted)] text-sm">
                        Nenhuma movimentação encontrada no período selecionado
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                movimentacoesPaginadas.map((mov) => (
                  <tr key={mov.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm text-[var(--text-primary)]">{formatDate(mov.data)}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{mov.hora}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {mov.tipo === 'entrada' ? (
                          <ArrowUpCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <ArrowDownCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {mov.descricao}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-body)] px-2 py-1 rounded">
                        {mov.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${
                        mov.tipo === 'entrada' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {mov.tipo === 'entrada' ? '+' : ''}{formatCurrency(mov.valor)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-[var(--text-primary)] font-medium">
                        {formatCurrency(mov.saldo)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {movimentacoesFiltradas.length > 0 && totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-secondary)]">
              Mostrando {indexInicio + 1}-{Math.min(indexInicio + itensPorPagina, movimentacoesFiltradas.length)} de {movimentacoesFiltradas.length} movimentações
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
  )
}
