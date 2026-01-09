import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type MetodoRepasse = 'pix' | 'dinheiro' | 'cartao'

type StatusRepasse = 'solicitado' | 'confirmado' | 'pago' | 'cancelado'

type DateFilter = 'hoje' | 'ontem' | 'periodo'

type SortKey = 'loja' | 'cliente' | 'valor' | 'data' | 'status'

type SortDirection = 'asc' | 'desc'

interface Repasse {
  id: string
  loja: string
  cliente: string
  valor: number
  metodo: MetodoRepasse
  data: string
  hora: string
  status: StatusRepasse
  lojaCodigo?: string
}

const REPASSES_MOCK: Repasse[] = [
  {
    id: 'R-2026-0001',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'João Silva',
    valor: 320.5,
    metodo: 'pix',
    data: '2026-01-09',
    hora: '10:15',
    status: 'solicitado',
  },
  {
    id: 'R-2026-0002',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'Maria Souza',
    valor: 189.9,
    metodo: 'cartao',
    data: '2026-01-09',
    hora: '11:40',
    status: 'confirmado',
  },
  {
    id: 'R-2026-0003',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Carlos Andrade',
    valor: 540.0,
    metodo: 'dinheiro',
    data: '2026-01-09',
    hora: '09:05',
    status: 'pago',
  },
  {
    id: 'R-2026-0004',
    loja: 'Loja Sul',
    lojaCodigo: 'LS-03',
    cliente: 'Ana Paula',
    valor: 75.25,
    metodo: 'pix',
    data: '2026-01-08',
    hora: '18:22',
    status: 'solicitado',
  },
  {
    id: 'R-2026-0005',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Pedro Martins',
    valor: 998.75,
    metodo: 'cartao',
    data: '2026-01-08',
    hora: '16:10',
    status: 'confirmado',
  },
  {
    id: 'R-2026-0006',
    loja: 'Loja Leste',
    lojaCodigo: 'LL-04',
    cliente: 'Beatriz Lima',
    valor: 210.0,
    metodo: 'pix',
    data: '2026-01-07',
    hora: '14:45',
    status: 'pago',
  },
]

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

const getStatusConfig = (status: StatusRepasse) => {
  switch (status) {
    case 'solicitado':
      return {
        label: 'Solicitado',
        className:
          'bg-amber-500/10 text-amber-300 border border-amber-500/30',
      }
    case 'confirmado':
      return {
        label: 'Confirmado',
        className:
          'bg-sky-500/10 text-sky-300 border border-sky-500/30',
      }
    case 'pago':
      return {
        label: 'Pago',
        className:
          'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
      }
    case 'cancelado':
      return {
        label: 'Cancelado',
        className:
          'bg-rose-500/10 text-rose-300 border border-rose-500/30',
      }
    default:
      return {
        label: status,
        className:
          'bg-zinc-700/40 text-zinc-100 border border-zinc-500/40',
      }
  }
}

const metodoConfig: Record<
  MetodoRepasse,
  { label: string; icon: string; className: string }
> = {
  pix: {
    label: 'PIX',
    icon: '⇄',
    className:
      'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
  },
  dinheiro: {
    label: 'Dinheiro',
    icon: 'R$',
    className:
      'bg-lime-500/10 text-lime-200 border border-lime-500/30',
  },
  cartao: {
    label: 'Cartão',
    icon: '💳',
    className:
      'bg-sky-500/10 text-sky-200 border border-sky-500/30',
  },
}

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate()

const parseIsoToDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function matchesDateFilter(
  repasse: Repasse,
  dateFilter: DateFilter,
  customStart?: string,
  customEnd?: string
) {
  const baseDate = parseIsoToDate(repasse.data)
  if (!baseDate) return false

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (dateFilter === 'hoje') {
    return isSameDay(baseDate, today)
  }

  if (dateFilter === 'ontem') {
    return isSameDay(baseDate, yesterday)
  }

  if (dateFilter === 'periodo') {
    if (!customStart || !customEnd) return true
    const start = parseIsoToDate(customStart)
    const end = parseIsoToDate(customEnd)
    if (!start || !end) return true

    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    const time = baseDate.getTime()

    return time >= start.getTime() && time <= end.getTime()
  }

  return true
}

function FinanceiroRepasses() {
  const [searchParams, setSearchParams] = useSearchParams()

  const getInitialDateFilter = (): DateFilter => {
    const value = searchParams.get('date')
    if (value === 'hoje' || value === 'ontem' || value === 'periodo') {
      return value
    }
    return 'hoje'
  }

  const getInitialCustomStartDate = () => {
    const value = searchParams.get('startDate')
    return value ?? ''
  }

  const getInitialCustomEndDate = () => {
    const value = searchParams.get('endDate')
    return value ?? ''
  }

  const getInitialStoreFilter = () => {
    const value = searchParams.get('store')
    return value ?? 'todas'
  }

  const getInitialStatusFilter = (): 'todos' | StatusRepasse => {
    const value = searchParams.get('status')
    if (value === 'todos') return 'todos'
    if (
      value === 'solicitado' ||
      value === 'confirmado' ||
      value === 'pago' ||
      value === 'cancelado'
    ) {
      return value
    }
    return 'todos'
  }

  const getInitialPage = () => {
    const value = Number(searchParams.get('page'))
    if (!Number.isFinite(value) || value < 1) return 1
    return Math.floor(value)
  }

  const getInitialPageSize = () => {
    const value = Number(searchParams.get('pageSize'))
    if (value === 5 || value === 10 || value === 20) {
      return value
    }
    return 5
  }

  const [dateFilter, setDateFilter] = useState<DateFilter>(getInitialDateFilter)
  const [customStartDate, setCustomStartDate] = useState<string>(
    getInitialCustomStartDate
  )
  const [customEndDate, setCustomEndDate] = useState<string>(
    getInitialCustomEndDate
  )
  const [storeFilter, setStoreFilter] = useState<string>(getInitialStoreFilter)
  const [statusFilter, setStatusFilter] = useState<'todos' | StatusRepasse>(
    getInitialStatusFilter
  )
  const [repasses, setRepasses] = useState<Repasse[]>(REPASSES_MOCK)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('data')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedRepasse, setSelectedRepasse] = useState<Repasse | null>(null)
  const [showDetalhes, setShowDetalhes] = useState(false)
  const [page, setPage] = useState(getInitialPage)
  const [pageSize, setPageSize] = useState(getInitialPageSize)

  const lojas = useMemo(
    () =>
      Array.from(new Set(repasses.map((repasse) => repasse.loja))).sort(),
    [repasses]
  )

  const repassesFiltrados = useMemo(
    () =>
      repasses.filter((repasse) => {
        if (
          !matchesDateFilter(
            repasse,
            dateFilter,
            customStartDate,
            customEndDate
          )
        ) {
          return false
        }

        if (storeFilter !== 'todas' && repasse.loja !== storeFilter) {
          return false
        }

        if (statusFilter !== 'todos' && repasse.status !== statusFilter) {
          return false
        }

        return true
      }),
    [repasses, dateFilter, customStartDate, customEndDate, storeFilter, statusFilter]
  )

  const resumo = useMemo(() => {
    const totalSolicitado = repassesFiltrados.reduce(
      (acc, repasse) => acc + repasse.valor,
      0
    )

    const totalPago = repassesFiltrados.reduce(
      (acc, repasse) =>
        repasse.status === 'pago' ? acc + repasse.valor : acc,
      0
    )

    const totalPendente = repassesFiltrados.reduce(
      (acc, repasse) =>
        repasse.status === 'solicitado' ||
        repasse.status === 'confirmado'
          ? acc + repasse.valor
          : acc,
      0
    )

    const quantidade = repassesFiltrados.length

    return {
      totalSolicitado,
      totalPago,
      totalPendente,
      quantidade,
    }
  }, [repassesFiltrados])

  const repassesOrdenados = useMemo(() => {
    const statusOrder: Record<StatusRepasse, number> = {
      solicitado: 1,
      confirmado: 2,
      pago: 3,
      cancelado: 4,
    }

    const copia = [...repassesFiltrados]

    copia.sort((a, b) => {
      let resultado = 0

      if (sortKey === 'loja') {
        resultado = a.loja.localeCompare(b.loja, 'pt-BR', {
          sensitivity: 'base',
        })
      } else if (sortKey === 'cliente') {
        resultado = a.cliente.localeCompare(b.cliente, 'pt-BR', {
          sensitivity: 'base',
        })
      } else if (sortKey === 'valor') {
        resultado = a.valor - b.valor
      } else if (sortKey === 'data') {
        const dataA = parseIsoToDate(a.data)
        const dataB = parseIsoToDate(b.data)
        const timeA = dataA ? dataA.getTime() : 0
        const timeB = dataB ? dataB.getTime() : 0
        resultado = timeA - timeB
      } else if (sortKey === 'status') {
        resultado = statusOrder[a.status] - statusOrder[b.status]
      }

      return sortDirection === 'asc' ? resultado : -resultado
    })

    return copia
  }, [repassesFiltrados, sortKey, sortDirection])

  const totalRegistros = repassesOrdenados.length
  const totalPaginas = totalRegistros === 0 ? 1 : Math.ceil(totalRegistros / pageSize)

  const paginaAtualCorrigida =
    page < 1 ? 1 : page > totalPaginas ? totalPaginas : page

  const startIndex = (paginaAtualCorrigida - 1) * pageSize
  const repassesPaginados = repassesOrdenados.slice(
    startIndex,
    startIndex + pageSize
  )

  useEffect(() => {
    const params = new URLSearchParams()

    if (dateFilter !== 'hoje') {
      params.set('date', dateFilter)
    }

    if (customStartDate) {
      params.set('startDate', customStartDate)
    }

    if (customEndDate) {
      params.set('endDate', customEndDate)
    }

    if (storeFilter !== 'todas') {
      params.set('store', storeFilter)
    }

    if (statusFilter !== 'todos') {
      params.set('status', statusFilter)
    }

    if (paginaAtualCorrigida !== 1) {
      params.set('page', String(paginaAtualCorrigida))
    }

    if (pageSize !== 5) {
      params.set('pageSize', String(pageSize))
    }

    setSearchParams(params)
  }, [
    dateFilter,
    customStartDate,
    customEndDate,
    storeFilter,
    statusFilter,
    paginaAtualCorrigida,
    pageSize,
    setSearchParams,
  ])

  const handleChangeSort = (key: SortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDirection((prevDirection) =>
          prevDirection === 'asc' ? 'desc' : 'asc'
        )
        return prevKey
      }

      setSortDirection('asc')
      return key
    })
  }

  const handleResetarFiltros = () => {
    setDateFilter('hoje')
    setCustomStartDate('')
    setCustomEndDate('')
    setStoreFilter('todas')
    setStatusFilter('todos')
  }

  const handleAtualizarDados = () => {
    setErrorMessage(null)
    setIsLoading(true)
    setIsRefreshing(true)
    setTimeout(() => {
      const hasError = Math.random() < 0.3
      if (hasError) {
        setErrorMessage('Não foi possível carregar os repasses. Tente novamente.')
      } else {
        setRepasses(REPASSES_MOCK)
      }
      setIsLoading(false)
      setIsRefreshing(false)
    }, 800)
  }

  const handleExportarCsv = () => {
    if (totalRegistros === 0) {
      return
    }

    const headers = [
      'Loja',
      'Código da loja',
      'Cliente',
      'ID do repasse',
      'Valor',
      'Método',
      'Data',
      'Hora',
      'Status',
    ]

    const linhas = repassesOrdenados.map((repasse) => [
      repasse.loja,
      repasse.lojaCodigo ?? '',
      repasse.cliente,
      repasse.id,
      repasse.valor.toFixed(2).replace('.', ','),
      repasse.metodo,
      formatDate(repasse.data),
      repasse.hora,
      getStatusConfig(repasse.status).label,
    ])

    const todasLinhas = [headers, ...linhas]

    const csv = todasLinhas
      .map((linha) =>
        linha
          .map((campo) => {
            const valor = String(campo ?? '')
            const precisaAspas =
              valor.includes(';') ||
              valor.includes('"') ||
              valor.includes('\n')
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
    link.download = 'repasses.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleConfirmarRepasse = (id: string) => {
    const confirmed = window.confirm(
      'Deseja realmente confirmar este repasse?'
    )
    if (!confirmed) return

    setRepasses((prev) =>
      prev.map((repasse) =>
        repasse.id === id && repasse.status === 'solicitado'
          ? { ...repasse, status: 'confirmado' }
          : repasse
      )
    )
  }

  const handleMarcarComoPago = (id: string) => {
    const confirmed = window.confirm(
      'Deseja marcar este repasse como pago?'
    )
    if (!confirmed) return

    setRepasses((prev) =>
      prev.map((repasse) =>
        repasse.id === id && repasse.status === 'confirmado'
          ? { ...repasse, status: 'pago' }
          : repasse
      )
    )
  }

  const handleVerDetalhes = (repasse: Repasse) => {
    setSelectedRepasse(repasse)
    setShowDetalhes(true)
  }

  const handleFecharDetalhes = () => {
    setShowDetalhes(false)
    setSelectedRepasse(null)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
            Financeiro – Repasses Diários
          </h1>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Controle de repasses solicitados pelas lojas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          <div className="inline-flex rounded-md bg-[color:var(--surface-nav)] p-1 text-xs font-medium text-[color:var(--text-muted)] border border-[color:var(--border)]">
            <button
              type="button"
              onClick={() => setDateFilter('hoje')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'hoje'
                  ? 'bg-[color:var(--primary-100)] text-white'
                  : 'hover:bg-[color:var(--bg-hover)]'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('ontem')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'ontem'
                  ? 'bg-[color:var(--primary-100)] text-white'
                  : 'hover:bg-[color:var(--bg-hover)]'
              }`}
            >
              Ontem
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('periodo')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateFilter === 'periodo'
                  ? 'bg-[color:var(--primary-100)] text-white'
                  : 'hover:bg-[color:var(--bg-hover)]'
              }`}
            >
              Período
            </button>
          </div>

          {dateFilter === 'periodo' && (
            <div className="flex items-center gap-2 text-xs">
              <input
                type="date"
                value={customStartDate}
                onChange={(event) => setCustomStartDate(event.target.value)}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2 py-1 text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
              />
              <span className="text-[color:var(--text-muted)]">até</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2 py-1 text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
              />
            </div>
          )}

          <select
            value={storeFilter}
            onChange={(event) => setStoreFilter(event.target.value)}
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            <option value="todas">Todas as lojas</option>
            {lojas.map((loja) => (
              <option key={loja} value={loja}>
                {loja}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as 'todos' | StatusRepasse)
            }
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            <option value="todos">Todos os status</option>
            <option value="solicitado">Solicitado</option>
            <option value="confirmado">Confirmado</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <button
            type="button"
            onClick={handleResetarFiltros}
            className="hidden sm:inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            Limpar filtros
          </button>

          <button
            type="button"
            onClick={handleAtualizarDados}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 rounded-md bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-semibold text-[color:var(--text-primary)] border border-[color:var(--border)] hover:bg-[color:var(--bg-hover)] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
          </button>

          <button
            type="button"
            onClick={handleExportarCsv}
            className="inline-flex items-center gap-1 rounded-md bg-[color:var(--primary-100)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[color:var(--primary-90)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            Exportar
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Total solicitado (período)
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {formatCurrency(resumo.totalSolicitado)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-soft)]">
            Soma de todos os repasses filtrados
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Total pago
          </p>
          <p className="mt-2 text-xl font-semibold text-emerald-300">
            {formatCurrency(resumo.totalPago)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-soft)]">
            Repasses com status Pago
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Total pendente
          </p>
          <p className="mt-2 text-xl font-semibold text-amber-300">
            {formatCurrency(resumo.totalPendente)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-soft)]">
            Status Solicitado ou Confirmado
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            Quantidade de repasses
          </p>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {resumo.quantidade}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-soft)]">
            Registros exibidos na tabela
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
        {errorMessage && (
          <div className="border-b border-[color:var(--border)] bg-[color:var(--surface-nav)] px-4 py-3 text-xs font-medium text-[color:var(--danger)]">
            {errorMessage}
          </div>
        )}
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-muted)]">
          <p>
            {totalRegistros === 0
              ? 'Nenhum repasse encontrado para os filtros selecionados'
              : totalRegistros === 1
              ? 'Mostrando 1 de 1 repasse'
              : `Mostrando ${startIndex + 1}–${startIndex + repassesPaginados.length} de ${totalRegistros} repasses`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[color:var(--border)] text-sm">
            <thead className="bg-[color:var(--surface-nav)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  <button
                    type="button"
                    onClick={() => handleChangeSort('loja')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Loja</span>
                    {sortKey === 'loja' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  <button
                    type="button"
                    onClick={() => handleChangeSort('cliente')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Cliente</span>
                    {sortKey === 'cliente' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  <button
                    type="button"
                    onClick={() => handleChangeSort('valor')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Valor</span>
                    {sortKey === 'valor' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  Método de repasse
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  <button
                    type="button"
                    onClick={() => handleChangeSort('data')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Data</span>
                    {sortKey === 'data' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  <button
                    type="button"
                    onClick={() => handleChangeSort('status')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Status</span>
                    {sortKey === 'status' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-muted)]"
                  >
                    Carregando repasses...
                  </td>
                </tr>
              ) : totalRegistros === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-muted)]"
                  >
                    Nenhum repasse encontrado para os filtros selecionados
                  </td>
                </tr>
              ) : (
                repassesPaginados.map((repasse) => {
                  const statusCfg = getStatusConfig(repasse.status)
                  const metodoCfg = metodoConfig[repasse.metodo]
                  const podeConfirmar = repasse.status === 'solicitado'
                  const podeMarcarPago = repasse.status === 'confirmado'

                  return (
                    <tr
                      key={repasse.id}
                      className="hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm font-medium text-[color:var(--text-primary)]">
                          {repasse.loja}
                        </div>
                        <div className="text-xs text-[color:var(--text-soft)]">
                          {repasse.lojaCodigo ?? repasse.id}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm text-[color:var(--text-primary)]">
                          {repasse.cliente}
                        </div>
                        <div className="text-xs text-[color:var(--text-soft)]">
                          {repasse.id}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                        <div className="text-sm font-semibold text-emerald-300">
                          {formatCurrency(repasse.valor)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${metodoCfg.className}`}
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                            {metodoCfg.icon}
                          </span>
                          <span>{metodoCfg.label}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                        {formatDate(repasse.data)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                        {repasse.hora}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerDetalhes(repasse)}
                            className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                          >
                            Ver detalhes
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmarRepasse(repasse.id)}
                            disabled={!podeConfirmar}
                            className="inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarcarComoPago(repasse.id)}
                            disabled={!podeMarcarPago}
                            className="inline-flex items-center rounded-md border border-emerald-500/50 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
                          >
                            Marcar como pago
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          {totalRegistros > 0 && (
            <div className="flex flex-col gap-2 border-t border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span>Itens por página:</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    setPageSize(value)
                    setPage(1)
                  }}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2 py-1 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p>
                  Página {paginaAtualCorrigida} de {totalPaginas}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={paginaAtualCorrigida === 1}
                    className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPaginas, prev + 1))
                    }
                    disabled={paginaAtualCorrigida === totalPaginas}
                    className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showDetalhes && selectedRepasse && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  Detalhes do repasse
                </p>
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {selectedRepasse.id}
                </p>
              </div>
              <button
                type="button"
                onClick={handleFecharDetalhes}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--surface-nav)] text-[color:var(--text-muted)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
              >
                ×
              </button>
            </div>
            <div className="space-y-4 px-4 py-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Loja
                  </p>
                  <p className="mt-1 font-medium text-[color:var(--text-primary)]">
                    {selectedRepasse.loja}
                  </p>
                  <p className="text-xs text-[color:var(--text-soft)]">
                    {selectedRepasse.lojaCodigo ?? selectedRepasse.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Valor
                  </p>
                  <p className="mt-1 text-base font-semibold text-emerald-300">
                    {formatCurrency(selectedRepasse.valor)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Cliente
                  </p>
                  <p className="mt-1 font-medium text-[color:var(--text-primary)]">
                    {selectedRepasse.cliente}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Data e hora
                  </p>
                  <p className="mt-1 text-[color:var(--text-primary)]">
                    {formatDate(selectedRepasse.data)} às {selectedRepasse.hora}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Método de repasse
                  </p>
                  {(() => {
                    const metodoCfg = metodoConfig[selectedRepasse.metodo]
                    return (
                      <div
                        className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${metodoCfg.className}`}
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                          {metodoCfg.icon}
                        </span>
                        <span>{metodoCfg.label}</span>
                      </div>
                    )
                  })()}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
                    Status atual
                  </p>
                  {(() => {
                    const statusCfg = getStatusConfig(selectedRepasse.status)
                    return (
                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
                    )
                  })()}
                </div>
              </div>
              <div className="mt-2 rounded-lg bg-[color:var(--surface-nav)] px-3 py-2 text-xs text-[color:var(--text-soft)]">
                <p className="font-medium text-[color:var(--text-muted)]">
                  Linha do tempo do status
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <span>
                    • Solicitado
                    {selectedRepasse.status === 'solicitado' && ' (atual)'}
                  </span>
                  <span>
                    • Confirmado
                    {selectedRepasse.status === 'confirmado' && ' (atual)'}
                    {selectedRepasse.status === 'pago' && ' (já passou)'}
                  </span>
                  <span>
                    • Pago
                    {selectedRepasse.status === 'pago' && ' (atual)'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[color:var(--border)] px-4 py-3">
              <button
                type="button"
                onClick={handleFecharDetalhes}
                className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinanceiroRepasses

