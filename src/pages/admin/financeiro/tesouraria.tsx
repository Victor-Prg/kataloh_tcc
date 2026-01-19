import { useEffect, useMemo, useState, useRef, type ReactNode, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FileCsv,
  CurrencyDollarSimple,
  CreditCard,
  CalendarBlank,
  CaretDown,
  Storefront,
} from 'phosphor-react'

type PaymentKind = 'cartao_credito' | 'cartao_debito' | 'pix' | 'todos'

type DateFilter = 'hoje' | 'ontem' | 'periodo'

type SortKey = 'data' | 'loja' | 'tipo' | 'valor'

type SortDirection = 'asc' | 'desc'

type Receipt = {
  id: string
  date: string
  store: string
  kind: Exclude<PaymentKind, 'todos'>
  amount: number
}

const today = new Date()
const yesterday = new Date()
yesterday.setDate(today.getDate() - 1)
const twoDaysAgo = new Date()
twoDaysAgo.setDate(today.getDate() - 2)

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

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

const paymentKindLabel: Record<Exclude<PaymentKind, 'todos'>, string> = {
  cartao_credito: 'Cartão de crédito',
  cartao_debito: 'Cartão de débito',
  pix: 'Pix',
}

const paymentKindConfig: Record<
  Exclude<PaymentKind, 'todos'>,
  { label: string; icon: ReactNode; className: string }
> = {
  pix: {
    label: 'PIX',
    icon: <CurrencyDollarSimple size={12} weight="bold" />,
    className:
      'bg-emerald-500/10 text-[color:var(--chip-text)] border border-emerald-500/30',
  },
  cartao_credito: {
    label: 'Cartão de crédito',
    icon: <CreditCard size={12} weight="bold" />,
    className:
      'bg-sky-500/10 text-[color:var(--chip-text)] border border-sky-500/30',
  },
  cartao_debito: {
    label: 'Cartão de débito',
    icon: <CreditCard size={12} weight="bold" />,
    className:
      'bg-purple-500/10 text-[color:var(--chip-text)] border border-purple-500/30',
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
  receipt: Receipt,
  dateFilter: DateFilter,
  customStart?: string,
  customEnd?: string
) {
  const baseDate = parseIsoToDate(receipt.date)
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

const mockReceipts: Receipt[] = [
  {
    id: '1',
    date: toIsoDate(today),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 320.5,
  },
  {
    id: '2',
    date: toIsoDate(today),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 189.9,
  },
  {
    id: '3',
    date: toIsoDate(today),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 210.0,
  },
  {
    id: '4',
    date: toIsoDate(yesterday),
    store: 'Loja Centro',
    kind: 'cartao_debito',
    amount: 75.0,
  },
  {
    id: '5',
    date: toIsoDate(yesterday),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 654.35,
  },
  {
    id: '6',
    date: toIsoDate(yesterday),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 450.0,
  },
  {
    id: '7',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 980.3,
  },
  {
    id: '8',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Shopping',
    kind: 'cartao_debito',
    amount: 120.75,
  },
  {
    id: '9',
    date: toIsoDate(today),
    store: 'Loja Bairro',
    kind: 'cartao_credito',
    amount: 890.0,
  },
  {
    id: '10',
    date: toIsoDate(today),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 1500.9,
  },
  {
    id: '11',
    date: toIsoDate(today),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 310.2,
  },
  {
    id: '12',
    date: toIsoDate(yesterday),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 432.75,
  },
  {
    id: '13',
    date: toIsoDate(yesterday),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 220.0,
  },
  {
    id: '14',
    date: toIsoDate(yesterday),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 95.5,
  },
  {
    id: '15',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 780.0,
  },
  {
    id: '16',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 1290.9,
  },
  {
    id: '17',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 340.45,
  },
  {
    id: '18',
    date: toIsoDate(today),
    store: 'Loja Centro',
    kind: 'cartao_debito',
    amount: 180.0,
  },
  {
    id: '19',
    date: toIsoDate(today),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 560.2,
  },
  {
    id: '20',
    date: toIsoDate(yesterday),
    store: 'Loja Bairro',
    kind: 'cartao_credito',
    amount: 910.0,
  },
  {
    id: '21',
    date: toIsoDate(yesterday),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 150.0,
  },
  {
    id: '22',
    date: toIsoDate(yesterday),
    store: 'Loja Shopping',
    kind: 'cartao_debito',
    amount: 210.3,
  },
  {
    id: '23',
    date: toIsoDate(twoDaysAgo),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 640.0,
  },
  {
    id: '24',
    date: toIsoDate(today),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 305.8,
  },
  {
    id: '25',
    date: toIsoDate(today),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 1120.0,
  },
  {
    id: '26',
    date: toIsoDate(today),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 260.4,
  },
]

function Treasury() {
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

  const getInitialPaymentFilter = (): PaymentKind => {
    const value = searchParams.get('payment')
    if (
      value === 'cartao_credito' ||
      value === 'cartao_debito' ||
      value === 'pix' ||
      value === 'todos'
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
  const [paymentFilter, setPaymentFilter] = useState<PaymentKind>(
    getInitialPaymentFilter
  )
  const [receipts] = useState<Receipt[]>(mockReceipts)
  const [isLoading] = useState(false)
  const [errorMessage] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('data')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [page, setPage] = useState(getInitialPage)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<string>('')
  const [tempEndDate, setTempEndDate] = useState<string>('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null)
  const [datePickerStyle, setDatePickerStyle] = useState<CSSProperties>()
  const [pageSize, setPageSize] = useState(getInitialPageSize)

  const lojas = useMemo(
    () =>
      Array.from(new Set(receipts.map((receipt) => receipt.store))).sort(),
    [receipts]
  )

  const receiptsFiltrados = useMemo(
    () =>
      receipts.filter((receipt) => {
        if (
          !matchesDateFilter(
            receipt,
            dateFilter,
            customStartDate,
            customEndDate
          )
        ) {
          return false
        }

        if (storeFilter !== 'todas' && receipt.store !== storeFilter) {
          return false
        }

        if (paymentFilter !== 'todos' && receipt.kind !== paymentFilter) {
          return false
        }

        return true
      }),
    [receipts, dateFilter, customStartDate, customEndDate, storeFilter, paymentFilter]
  )

  const totalAmount = useMemo(
    () =>
      receiptsFiltrados.reduce((acc, receipt) => acc + receipt.amount, 0),
    [receiptsFiltrados]
  )

  const recebimentoMaisFrequente = useMemo<Exclude<PaymentKind, 'todos'> | null>(
    () => {
      if (receiptsFiltrados.length === 0) return null

      const contagem: Record<Exclude<PaymentKind, 'todos'>, number> = {
        cartao_credito: 0,
        cartao_debito: 0,
        pix: 0,
      }

      receiptsFiltrados.forEach((receipt) => {
        contagem[receipt.kind] += 1
      })

      let tipoMaisFrequente: Exclude<PaymentKind, 'todos'> | null = null
      let quantidadeMaisFrequente = 0

      ;(Object.keys(contagem) as Array<Exclude<PaymentKind, 'todos'>>).forEach(
        (kind) => {
          if (contagem[kind] > quantidadeMaisFrequente) {
            quantidadeMaisFrequente = contagem[kind]
            tipoMaisFrequente = kind
          }
        }
      )

      return tipoMaisFrequente
    },
    [receiptsFiltrados]
  )

  const totalAmountDia = useMemo(() => {
    if (receiptsFiltrados.length === 0) return 0

    let ultimaData: Date | null = null

    receiptsFiltrados.forEach((receipt) => {
      const data = parseIsoToDate(receipt.date)
      if (!data) return
      if (!ultimaData || data > ultimaData) {
        ultimaData = data
      }
    })

    if (!ultimaData) return 0

    return receiptsFiltrados.reduce((acc, receipt) => {
      const data = parseIsoToDate(receipt.date)
      if (!data) return acc
      return isSameDay(data, ultimaData as Date) ? acc + receipt.amount : acc
    }, 0)
  }, [receiptsFiltrados])

  const totalLojasFiltradas = useMemo(
    () => new Set(receiptsFiltrados.map((receipt) => receipt.store)).size,
    [receiptsFiltrados]
  )

  const receiptsOrdenados = useMemo(() => {
    const copia = [...receiptsFiltrados]

    copia.sort((a, b) => {
      let resultado = 0

      if (sortKey === 'loja') {
        resultado = a.store.localeCompare(b.store, 'pt-BR', {
          sensitivity: 'base',
        })
      } else if (sortKey === 'tipo') {
        resultado = a.kind.localeCompare(b.kind, 'pt-BR', {
          sensitivity: 'base',
        })
      } else if (sortKey === 'valor') {
        resultado = a.amount - b.amount
      } else if (sortKey === 'data') {
        const dataA = parseIsoToDate(a.date)
        const dataB = parseIsoToDate(b.date)
        const timeA = dataA ? dataA.getTime() : 0
        const timeB = dataB ? dataB.getTime() : 0
        resultado = timeA - timeB
      }

      return sortDirection === 'asc' ? resultado : -resultado
    })

    return copia
  }, [receiptsFiltrados, sortKey, sortDirection])

  const totalRegistros = receiptsOrdenados.length
  const totalPaginas = totalRegistros === 0 ? 1 : Math.ceil(totalRegistros / pageSize)

  const paginaAtualCorrigida =
    page < 1 ? 1 : page > totalPaginas ? totalPaginas : page

  const startIndex = (paginaAtualCorrigida - 1) * pageSize
  const receiptsPaginados = receiptsOrdenados.slice(
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

    if (paymentFilter !== 'todos') {
      params.set('payment', paymentFilter)
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
    paymentFilter,
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
    setPaymentFilter('todos')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      setTempStartDate(isoDate)
      setTempEndDate('')
    } else {
      const start = parseIsoToDate(tempStartDate)
      const end = date
      
      if (start && end < start) {
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

    const headers = ['Data', 'Loja', 'Tipo de pagamento', 'Valor recebido']

    const linhas = receiptsOrdenados.map((receipt) => [
      formatDate(receipt.date),
      receipt.store,
      paymentKindLabel[receipt.kind],
      receipt.amount.toFixed(2).replace('.', ','),
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
    link.download = 'tesouraria.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[color:var(--text-primary)]">
            Financeiro – Tesouraria
          </h1>
          <p className="mt-1 text-[20px] leading-[24px] text-[color:var(--text-primary)]">
            Visualize os recebimentos por loja e tipo de pagamento
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
                    const rect =
                      datePickerButtonRef.current.getBoundingClientRect()
                    const viewportWidth = window.innerWidth
                    const viewportHeight = window.innerHeight

                    const pickerWidth = Math.min(320, viewportWidth - 32)
                    const centerX = rect.left + rect.width / 2
                    const minLeft = 16
                    const maxLeft = viewportWidth - pickerWidth - 16
                    const left = Math.min(
                      Math.max(centerX - pickerWidth / 2, minLeft),
                      maxLeft
                    )

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
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${
                  showDatePicker ? 'rotate-180' : ''
                }`}
              />
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
                      {currentMonth.toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                      })}
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
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-[0.65rem] font-medium text-[color:var(--text-secondary)] py-1"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const {
                        daysInMonth,
                        startingDayOfWeek,
                        year,
                        month,
                      } = getDaysInMonth(currentMonth)
                      const days = []

                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(<div key={`empty-${i}`} />)
                      }

                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day)
                        const isSelected = isDateSelected(date)
                        const isInRange = isDateInRange(date)
                        const isToday = isSameDay(date, new Date())

                        const baseClasses =
                          'aspect-square text-xs rounded-lg transition-colors'
                        const selectedClasses = isSelected
                          ? 'bg-[color:var(--primary-100)] text-white font-bold'
                          : isInRange
                          ? 'bg-[color:var(--primary-100)]/20 text-[color:var(--text-primary)]'
                          : 'hover:bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]'
                        const todayClasses =
                          isToday && !isSelected
                            ? 'ring-1 ring-[color:var(--primary-100)]'
                            : ''

                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            className={`${baseClasses} ${selectedClasses} ${todayClasses}`}
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
                      {tempStartDate &&
                        !tempEndDate &&
                        'Selecione a data final'}
                      {tempStartDate &&
                        tempEndDate &&
                        `${formatDate(tempStartDate)} - ${formatDate(
                          tempEndDate
                        )}`}
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
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(event.target.value as PaymentKind)
              }
              className="appearance-none rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
            >
              <option value="todos">Todos os tipos</option>
              <option value="pix">PIX</option>
              <option value="cartao_credito">Cartão de crédito</option>
              <option value="cartao_debito">Cartão de débito</option>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <CurrencyDollarSimple
                size={16}
                className="text-[color:var(--text-primary)]"
              />
            </span>
            <span>Total recebido (período)</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {formatCurrency(totalAmount)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Soma de todos os recebimentos filtrados
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <CreditCard size={16} className="text-[color:var(--text-primary)]" />
            </span>
            <span>Recebimento mais frequente</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {recebimentoMaisFrequente
              ? paymentKindConfig[recebimentoMaisFrequente].label
              : '—'}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Tipo de pagamento mais recorrente nos recebimentos filtrados
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <CalendarBlank
                size={16}
                weight="bold"
                className="text-[color:var(--text-primary)]"
              />
            </span>
            <span>Total recebido no dia</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {formatCurrency(totalAmountDia)}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Total do dia mais recente dentro do período filtrado
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)]">
              <Storefront
                size={16}
                weight="bold"
                className="text-[color:var(--text-primary)]"
              />
            </span>
            <span>Total de lojas</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-[color:var(--text-primary)]">
            {totalLojasFiltradas}
          </p>
          <p className="mt-1 text-[0.75rem] text-[color:var(--text-primary)]">
            Lojas com ao menos um recebimento no resultado filtrado
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm">
        {errorMessage && (
          <div className="border-b border-[color:var(--border)] bg-[color:var(--surface-nav)] px-4 py-3 text-xs font-medium text-[color:var(--danger)]">
            {errorMessage}
          </div>
        )}
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)]">
          <p>
            {totalRegistros === 0
              ? 'Nenhum recebimento encontrado para os filtros selecionados'
              : totalRegistros === 1
              ? 'Mostrando 1 de 1 recebimento'
              : `Mostrando ${startIndex + 1}–${
                  startIndex + receiptsPaginados.length
                } de ${totalRegistros} recebimentos`}
          </p>
        </div>

        <div className="block sm:hidden">
          {isLoading ? (
            <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
              Carregando recebimentos...
            </div>
          ) : totalRegistros === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
              Nenhum recebimento encontrado para os filtros selecionados
            </div>
          ) : (
            <div className="space-y-3 px-4 py-3">
              {receiptsPaginados.map((receipt) => {
                const tipoCfg = paymentKindConfig[receipt.kind]

                return (
                  <div
                    key={receipt.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                          {receipt.store}
                        </p>
                        <p className="text-[0.7rem] text-[color:var(--text-primary)]">
                          {formatDate(receipt.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(receipt.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.7rem] font-medium ${tipoCfg.className}`}
                      >
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                          {tipoCfg.icon}
                        </span>
                        <span>{tipoCfg.label}</span>
                      </div>
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
                    onClick={() => handleChangeSort('tipo')}
                    className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                  >
                    <span>Tipo de pagamento</span>
                    {sortKey === 'tipo' && (
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
                    <span>Valor recebido</span>
                    {sortKey === 'valor' && (
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
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                  >
                    Carregando recebimentos...
                  </td>
                </tr>
              ) : totalRegistros === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                  >
                    Nenhum recebimento encontrado para os filtros selecionados
                  </td>
                </tr>
              ) : (
                receiptsPaginados.map((receipt) => {
                  const tipoCfg = paymentKindConfig[receipt.kind]

                  return (
                    <tr
                      key={receipt.id}
                      className="hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                        {formatDate(receipt.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm font-medium text-[color:var(--text-primary)]">
                          {receipt.store}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tipoCfg.className}`}
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                            {tipoCfg.icon}
                          </span>
                          <span>{tipoCfg.label}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                        <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {formatCurrency(receipt.amount)}
                        </div>
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

export default Treasury
