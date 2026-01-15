import { useEffect, useMemo, useState, useRef, type ReactNode, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  FileCsv,
  ArrowsLeftRight,
  CurrencyDollarSimple,
  CreditCard,
  Clock,
  ClipboardText,
  CheckCircle,
  CalendarBlank,
  CaretDown,
} from 'phosphor-react'

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
  idTransacaoPix?: string
}

const today = new Date()
const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)
const twoDaysAgo = new Date()
twoDaysAgo.setDate(today.getDate() - 2)
const threeDaysAgo = new Date()
threeDaysAgo.setDate(today.getDate() - 3)

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const REPASSES_HISTORICO_MOCK: Repasse[] = [
  {
    id: 'R-2026-0020',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'Roberto Santos',
    valor: 450.0,
    metodo: 'pix',
    data: toIsoDate(threeDaysAgo),
    hora: '14:30',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200020',
  },
  {
    id: 'R-2026-0019',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Fernanda Costa',
    valor: 680.25,
    metodo: 'cartao',
    data: toIsoDate(threeDaysAgo),
    hora: '11:15',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200019',
  },
  {
    id: 'R-2026-0018',
    loja: 'Loja Sul',
    lojaCodigo: 'LS-03',
    cliente: 'Marcos Lima',
    valor: 120.5,
    metodo: 'dinheiro',
    data: toIsoDate(threeDaysAgo),
    hora: '16:45',
    status: 'cancelado',
    idTransacaoPix: 'E12345678202601200018',
  },
  {
    id: 'R-2026-0017',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'Julia Oliveira',
    valor: 890.0,
    metodo: 'pix',
    data: toIsoDate(twoDaysAgo),
    hora: '09:20',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200017',
  },
  {
    id: 'R-2026-0016',
    loja: 'Loja Leste',
    lojaCodigo: 'LL-04',
    cliente: 'Ricardo Alves',
    valor: 340.75,
    metodo: 'cartao',
    data: toIsoDate(twoDaysAgo),
    hora: '13:50',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200016',
  },
  {
    id: 'R-2026-0015',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Amanda Silva',
    valor: 550.0,
    metodo: 'pix',
    data: toIsoDate(twoDaysAgo),
    hora: '10:30',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200015',
  },
  {
    id: 'R-2026-0014',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'Paulo Santos',
    valor: 220.0,
    metodo: 'dinheiro',
    data: toIsoDate(twoDaysAgo),
    hora: '15:10',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200014',
  },
  {
    id: 'R-2026-0013',
    loja: 'Loja Sul',
    lojaCodigo: 'LS-03',
    cliente: 'Luciana Ferreira',
    valor: 780.5,
    metodo: 'pix',
    data: toIsoDate(yesterday),
    hora: '08:45',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200013',
  },
  {
    id: 'R-2026-0012',
    loja: 'Loja Leste',
    lojaCodigo: 'LL-04',
    cliente: 'Eduardo Costa',
    valor: 490.0,
    metodo: 'cartao',
    data: toIsoDate(yesterday),
    hora: '12:20',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200012',
  },
  {
    id: 'R-2026-0011',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Camila Rodrigues',
    valor: 160.25,
    metodo: 'dinheiro',
    data: toIsoDate(yesterday),
    hora: '17:30',
    status: 'cancelado',
    idTransacaoPix: 'E12345678202601200011',
  },
  {
    id: 'R-2026-0010',
    loja: 'Loja Central',
    lojaCodigo: 'LC-01',
    cliente: 'Diego Martins',
    valor: 920.0,
    metodo: 'pix',
    data: toIsoDate(yesterday),
    hora: '11:00',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200010',
  },
  {
    id: 'R-2026-0009',
    loja: 'Loja Sul',
    lojaCodigo: 'LS-03',
    cliente: 'Tatiana Souza',
    valor: 380.5,
    metodo: 'cartao',
    data: toIsoDate(yesterday),
    hora: '14:15',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200009',
  },
  {
    id: 'R-2026-0008',
    loja: 'Loja Leste',
    lojaCodigo: 'LL-04',
    cliente: 'Gustavo Lima',
    valor: 670.0,
    metodo: 'pix',
    data: toIsoDate(today),
    hora: '09:50',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200008',
  },
  {
    id: 'R-2026-0007',
    loja: 'Loja Norte',
    lojaCodigo: 'LN-02',
    cliente: 'Vanessa Santos',
    valor: 290.75,
    metodo: 'dinheiro',
    data: toIsoDate(today),
    hora: '13:25',
    status: 'pago',
    idTransacaoPix: 'E12345678202601200007',
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
          'bg-amber-500/10 text-[color:var(--chip-text)] border border-amber-500/30',
      }
    case 'confirmado':
      return {
        label: 'Confirmado',
        className:
          'bg-sky-500/10 text-[color:var(--chip-text)] border border-sky-500/30',
      }
    case 'pago':
      return {
        label: 'Pago',
        className:
          'bg-emerald-500/15 text-[color:var(--chip-text)] border border-emerald-500/40',
      }
    case 'cancelado':
      return {
        label: 'Cancelado',
        className:
          'bg-rose-500/10 text-[color:var(--chip-text)] border border-rose-500/30',
      }
    default:
      return {
        label: status,
        className:
          'bg-zinc-500/10 text-[color:var(--chip-text)] border border-zinc-500/30',
      }
  }
}

const metodoConfig: Record<
  MetodoRepasse,
  { label: string; icon: ReactNode; className: string }
> = {
  pix: {
    label: 'PIX',
    icon: <ArrowsLeftRight size={12} weight="bold" />,
    className:
      'bg-emerald-500/10 text-[color:var(--chip-text)] border border-emerald-500/30',
  },
  dinheiro: {
    label: 'Dinheiro',
    icon: <CurrencyDollarSimple size={12} weight="bold" />,
    className:
      'bg-lime-500/10 text-[color:var(--chip-text)] border border-lime-500/30',
  },
  cartao: {
    label: 'Cartão',
    icon: <CreditCard size={12} weight="bold" />,
    className:
      'bg-sky-500/10 text-[color:var(--chip-text)] border border-sky-500/30',
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

function HistoricoRepasses() {
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
  const [repasses] = useState<Repasse[]>(REPASSES_HISTORICO_MOCK)
  const [isLoading] = useState(false)
  const [errorMessage] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('data')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [page, setPage] = useState(getInitialPage)
  const [pageSize, setPageSize] = useState(getInitialPageSize)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<string>('')
  const [tempEndDate, setTempEndDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null)
  const [datePickerStyle, setDatePickerStyle] = useState<CSSProperties>()

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

    const totalCancelado = repassesFiltrados.reduce(
      (acc, repasse) =>
        repasse.status === 'cancelado' ? acc + repasse.valor : acc,
      0
    )

    const quantidade = repassesFiltrados.length

    return {
      totalSolicitado,
      totalPago,
      totalCancelado,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleQuickFilter = (type: 'hoje' | 'semana' | 'mes' | 'tudo') => {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    switch (type) {
      case 'hoje':
        setCustomStartDate(toIsoDate(startOfDay))
        setCustomEndDate(toIsoDate(now))
        setDateFilter('periodo')
        setTempStartDate(toIsoDate(startOfDay))
        setTempEndDate(toIsoDate(now))
        break
      case 'semana': {
        const weekAgo = new Date(startOfDay)
        weekAgo.setDate(weekAgo.getDate() - 7)
        setCustomStartDate(toIsoDate(weekAgo))
        setCustomEndDate(toIsoDate(now))
        setDateFilter('periodo')
        setTempStartDate(toIsoDate(weekAgo))
        setTempEndDate(toIsoDate(now))
        break
      }
      case 'mes': {
        const monthAgo = new Date(startOfDay)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        setCustomStartDate(toIsoDate(monthAgo))
        setCustomEndDate(toIsoDate(now))
        setDateFilter('periodo')
        setTempStartDate(toIsoDate(monthAgo))
        setTempEndDate(toIsoDate(now))
        break
      }
      case 'tudo':
        setCustomStartDate('')
        setCustomEndDate('')
        setDateFilter('periodo')
        setTempStartDate('')
        setTempEndDate('')
        break
    }
    setShowDatePicker(false)
  }

  const getDateLabel = () => {
    if (!customStartDate && !customEndDate) {
      return 'Tudo'
    }
    if (customStartDate && customEndDate) {
      return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`
    }
    if (customStartDate) {
      return `A partir de ${formatDate(customStartDate)}`
    }
    if (customEndDate) {
      return `Até ${formatDate(customEndDate)}`
    }
    return 'Selecionar período'
  }

  const handleDateClick = (date: Date) => {
    const isoDate = toIsoDate(date)
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Primeira data ou resetar seleção
      setTempStartDate(isoDate)
      setTempEndDate('')
    } else {
      // Segunda data
      const start = parseIsoToDate(tempStartDate)
      const end = date
      
      if (start && end < start) {
        // Se a segunda data for antes da primeira, inverte
        setTempStartDate(isoDate)
        setTempEndDate(tempStartDate)
      } else {
        setTempEndDate(isoDate)
      }
    }
  }

  const applyDateFilter = () => {
    setCustomStartDate(tempStartDate)
    setCustomEndDate(tempEndDate)
    setDateFilter('periodo')
    setShowDatePicker(false)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false
    const start = parseIsoToDate(tempStartDate)
    const end = parseIsoToDate(tempEndDate)
    if (!start || !end) return false
    return date >= start && date <= end
  }

  const isDateSelected = (date: Date) => {
    const isoDate = toIsoDate(date)
    return isoDate === tempStartDate || isoDate === tempEndDate
  }

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1))
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
      'ID Transação PIX',
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
      repasse.idTransacaoPix ?? '',
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
    link.download = 'historico-repasses.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[color:var(--text-primary)]">
            Financeiro – Histórico de Repasses
          </h1>
          <p className="mt-1 text-[20px] leading-[24px] text-[color:var(--text-primary)]">
            Histórico completo de todos os repasses realizados
          </p>
          </div>
          
        <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
          <div className="relative" ref={datePickerRef}>
            <button
              type="button"
              ref={datePickerButtonRef}
              onClick={() => {
                const willOpen = !showDatePicker
                if (willOpen) {
                  setTempStartDate(customStartDate)
                  setTempEndDate(customEndDate)

                  if (datePickerButtonRef.current) {
                    const rect = datePickerButtonRef.current.getBoundingClientRect()
                    const viewportWidth = window.innerWidth
                    const viewportHeight = window.innerHeight

                    const pickerWidth = Math.min(320, viewportWidth - 32)
                    const centerX = rect.left + rect.width / 2
                    const minLeft = 16
                    const maxLeft = viewportWidth - pickerWidth - 16
                    const left = Math.min(Math.max(centerX - pickerWidth / 2, minLeft), maxLeft)

                    const estimatedHeight = 420
                    const spaceBelow = viewportHeight - rect.bottom - 16
                    const top =
                      spaceBelow >= estimatedHeight
                        ? rect.bottom + 8
                        : Math.max(16, viewportHeight - estimatedHeight - 16)

                    setDatePickerStyle({
                      position: 'fixed',
                      top,
                      left,
                      width: pickerWidth,
                      zIndex: 50,
                    })
                  }
                } else {
                  setDatePickerStyle(undefined)
                }
                setShowDatePicker(willOpen)
              }}
              className="inline-flex items-center gap-2 rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
            >
              <CalendarBlank size={16} weight="bold" />
              <span>{getDateLabel()}</span>
              <CaretDown size={12} weight="bold" className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
            </button>

            {showDatePicker && (
              <div
                className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-xl z-50 p-4"
                style={datePickerStyle}
              >
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-secondary)] mb-3">
                    Filtros Rápidos
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('hoje')}
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      Hoje
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('semana')}
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      Última semana
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('mes')}
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      Último mês
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter('tudo')}
                      className="px-3 py-2 text-xs font-medium rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      Tudo
                    </button>
                  </div>
        </div>
        
                <div className="border-t border-[color:var(--border)] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      className="p-1 hover:bg-[color:var(--bg-hover)] rounded"
                    >
                      ←
                    </button>
                    <p className="text-xs font-semibold text-[color:var(--text-primary)]">
                      {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="p-1 hover:bg-[color:var(--bg-hover)] rounded"
                    >
                      →
                    </button>
          </div>
          
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div key={day} className="text-center text-[0.65rem] font-medium text-[color:var(--text-secondary)] py-1">
                        {day}
                </div>
                    ))}
             </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
                      const days = []
                      
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(<div key={`empty-${i}`} />)
                      }
                      
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day)
                        const isSelected = isDateSelected(date)
                        const isInRange = isDateInRange(date)
                        const isToday = isSameDay(date, new Date())
                        
                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            className={`
                              aspect-square text-xs rounded-lg transition-colors
                              ${isSelected 
                                ? 'bg-[color:var(--primary-100)] text-white font-bold' 
                                : isInRange 
                                ? 'bg-[color:var(--primary-100)]/20 text-[color:var(--text-primary)]'
                                : 'hover:bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]'
                              }
                              ${isToday && !isSelected ? 'ring-1 ring-[color:var(--primary-100)]' : ''}
                            `}
                          >
                            {day}
                          </button>
                        )
                      }
                      
                      return days
                    })()}
          </div>
          
                  {tempStartDate && (
                    <div className="mt-3 text-xs text-[color:var(--text-secondary)] text-center">
                      {tempStartDate && !tempEndDate && 'Selecione a data final'}
                      {tempStartDate && tempEndDate && `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`}
                    </div>
                  )}
                </div>

                <div className="border-t border-[color:var(--border)] mt-4 pt-3 flex justify-between gap-2">
            <button 
              type="button"
                    onClick={() => {
                      setTempStartDate('')
                      setTempEndDate('')
                    }}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-[color:var(--border)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={applyDateFilter}
                    className="px-4 py-2 text-xs font-medium rounded-lg bg-[color:var(--primary-100)] text-white hover:opacity-90 transition-opacity"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={storeFilter}
              onChange={(event) => setStoreFilter(event.target.value)}
              className="appearance-none rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
            >
              <option value="todas">Todas as lojas</option>
              {lojas.map((loja) => (
                <option key={loja} value={loja}>
                  {loja}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[color:var(--text-primary)]">
              ▼
                 </span>
               </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as 'todos' | StatusRepasse)
              }
              className="appearance-none rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
            >
              <option value="todos">Todos os status</option>
              <option value="solicitado">Solicitado</option>
              <option value="confirmado">Confirmado</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
             </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[color:var(--text-primary)]">
              ▼
            </span>
      </div>

            <button 
              type="button"
            onClick={handleResetarFiltros}
            className="hidden sm:inline-flex items-center rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            Limpar filtros
            </button>
          <button
            type="button"
            onClick={handleExportarCsv}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--surface-nav)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            <FileCsv size={16} className="text-[color:var(--text-primary)]" />
            <span>Exportar</span>
                   </button>
                </div>
              </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <CurrencyDollarSimple
                size={16}
                className="text-[color:var(--text-primary)]"
              />
            </span>
            <span>Total (período)</span>
                </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {formatCurrency(resumo.totalSolicitado)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Soma de todos os repasses filtrados
          </p>
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <CheckCircle
                size={16}
                weight="bold"
                className="text-emerald-500"
              />
            </span>
            <span>Total pago</span>
                </div>
          <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(resumo.totalPago)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Repasses com status Pago
          </p>
                </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <Clock
                size={16}
                weight="bold"
                className="text-rose-500"
              />
            </span>
            <span>Total cancelado</span>
              </div>
          <p className="mt-2 text-xl font-semibold text-rose-700 dark:text-rose-300">
            {formatCurrency(resumo.totalCancelado)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Status Cancelado
          </p>
          </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <ClipboardText
                size={16}
                weight="bold"
                className="text-[color:var(--text-primary)]"
              />
            </span>
            <span>Quantidade de repasses</span>
        </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {resumo.quantidade}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
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
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)]">
          <p>
            {totalRegistros === 0
              ? 'Nenhum repasse encontrado para os filtros selecionados'
              : totalRegistros === 1
              ? 'Mostrando 1 de 1 repasse'
              : `Mostrando ${startIndex + 1}–${startIndex + repassesPaginados.length} de ${totalRegistros} repasses`}
          </p>
        </div>

        <div className="block sm:hidden">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
              Carregando repasses...
                  </div>
          ) : totalRegistros === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
              Nenhum repasse encontrado para os filtros selecionados
                </div>
          ) : (
            <div className="space-y-3 px-4 py-3">
              {repassesPaginados.map((repasse) => {
                const statusCfg = getStatusConfig(repasse.status)
                const metodoCfg = metodoConfig[repasse.metodo]

                return (
                  <div
                    key={repasse.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-3 text-xs"
                  >
                    <div className="mb-2 pb-2 border-b border-[color:var(--border)]">
                      <p className="text-[0.65rem] uppercase tracking-wide text-[color:var(--text-secondary)] mb-1">
                        ID Transação
                      </p>
                      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                        {repasse.id}
                      </p>
                      {repasse.idTransacaoPix && (
                        <p className="text-[0.6rem] text-[color:var(--text-secondary)] mt-0.5">
                          PIX: {repasse.idTransacaoPix}
                        </p>
                      )}
                   </div>
                   
                    <div className="flex items-start justify-between gap-2">
                       <div>
                        <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                          {repasse.loja}
                        </p>
                        <p className="text-[0.7rem] text-[color:var(--text-primary)]">
                          {repasse.cliente}
                        </p>
                          </div>
                       <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(repasse.valor)}
                        </p>
                        <p className="text-[0.7rem] text-[color:var(--text-primary)]">
                          {formatDate(repasse.data)} • {repasse.hora}
                        </p>
                       </div>
                   </div>
                       
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-medium ${metodoCfg.className}`}
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                          {metodoCfg.icon}
                        </span>
                        <span>{metodoCfg.label}</span>
                </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-semibold ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
              </div>
                </div>
                )
              })}
             </div>
          )}
        </div>
        
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-[color:var(--border)] text-sm">
            <thead className="bg-[color:var(--surface-nav)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                  ID Transação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                  Método de repasse
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                  >
                    Carregando repasses...
                  </td>
                </tr>
              ) : totalRegistros === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                  >
                    Nenhum repasse encontrado para os filtros selecionados
                  </td>
                </tr>
              ) : (
                repassesPaginados.map((repasse) => {
                  const statusCfg = getStatusConfig(repasse.status)
                  const metodoCfg = metodoConfig[repasse.metodo]

                  return (
                    <tr
                      key={repasse.id}
                      className="hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm font-semibold text-[color:var(--text-primary)]">
                          {repasse.id}
                        </div>
                        {repasse.idTransacaoPix && (
                          <div className="text-[0.65rem] text-[color:var(--text-secondary)] mt-0.5">
                            PIX: {repasse.idTransacaoPix}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm font-medium text-[color:var(--text-primary)]">
                          {repasse.loja}
                        </div>
                        <div className="text-xs text-[color:var(--text-primary)]">
                          {repasse.lojaCodigo}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm text-[color:var(--text-primary)]">
                          {repasse.cliente}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                        <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
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
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          {totalRegistros > 0 && (
            <div className="flex flex-col gap-2 border-t border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span>Itens por página:</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      setPageSize(value)
                      setPage(1)
                    }}
                    className="appearance-none rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] pr-7 pl-2 py-1 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[color:var(--text-primary)]">
                    ▼
                   </span>
                </div>
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
    </div>
  )
}

export default HistoricoRepasses
