import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Wallet, TrendingUp, Clock, CreditCard, DollarSign, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { CalendarBlank, CaretDown } from 'phosphor-react'
import { Button, Card, Tooltip, EmptyState } from '../../components'

type MetodoRecebimento = 'pix' | 'dinheiro' | 'cartao'

type RepasseStatus = 'disponivel' | 'solicitado' | 'processando' | 'pago' | 'bloqueado'

type RepasseHistorico = {
  id: string
  data: string
  metodo: MetodoRecebimento
  valor: number
  status: RepasseStatus
}

type EstadoTela = 'default' | 'carregando' | 'erro' | 'sem_historico' | 'bloqueado'

type DateFilter = 'hoje' | 'ontem' | 'periodo'

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
  isoDate: string,
  dateFilter: DateFilter,
  customStart?: string,
  customEnd?: string,
) {
  const baseDate = parseIsoToDate(isoDate)
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

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const todayIso = () => new Date().toISOString().split('T')[0]

const mockRepasses: RepasseHistorico[] = [
  { id: '1', data: todayIso(), metodo: 'pix', valor: 245.8, status: 'pago' },
  { id: '2', data: todayIso(), metodo: 'cartao', valor: 180.35, status: 'processando' },
  { id: '3', data: todayIso(), metodo: 'dinheiro', valor: 96.4, status: 'solicitado' },
  { id: '4', data: todayIso(), metodo: 'pix', valor: 320.0, status: 'disponivel' },
]

const statusLabel: Record<RepasseStatus, string> = {
  disponivel: 'Disponível',
  solicitado: 'Solicitado',
  processando: 'Em processamento',
  pago: 'Pago',
  bloqueado: 'Bloqueado',
}

const statusColor: Record<RepasseStatus, string> = {
  disponivel: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  solicitado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  processando: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
  pago: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  bloqueado: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

const statusOrder: Record<RepasseStatus, number> = {
  disponivel: 1,
  solicitado: 2,
  processando: 3,
  pago: 4,
  bloqueado: 5,
}

const metodoConfig: Record<
  MetodoRecebimento,
  { label: string; icon: ReactNode; className: string }
> = {
  pix: {
    label: 'PIX',
    icon: <CreditCard size={12} />,
    className:
      'bg-emerald-500/10 text-[color:var(--chip-text)] border border-emerald-500/30',
  },
  dinheiro: {
    label: 'Dinheiro',
    icon: <DollarSign size={12} />,
    className:
      'bg-amber-500/10 text-[color:var(--chip-text)] border border-amber-500/30',
  },
  cartao: {
    label: 'Cartão',
    icon: <CreditCard size={12} />,
    className:
      'bg-sky-500/10 text-[color:var(--chip-text)] border border-sky-500/30',
  },
}

export default function DeliveryFinanceiro() {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [valorSolicitacao, setValorSolicitacao] = useState('')
  const [metodo, setMetodo] = useState<MetodoRecebimento>('pix')
  const [observacao, setObservacao] = useState('')
  const [estadoTela, setEstadoTela] = useState<EstadoTela>('default')
  const [carregandoAcao, setCarregandoAcao] = useState(false)
  const [repasseSelecionado, setRepasseSelecionado] = useState<RepasseHistorico | null>(null)

  const [dateFilter, setDateFilter] = useState<DateFilter>('periodo')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const datePickerRef = useRef<HTMLDivElement>(null)
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null)
  const [datePickerStyle, setDatePickerStyle] = useState<CSSProperties>()

  const [sortKey, setSortKey] = useState<'data' | 'tipo' | 'valor' | 'status'>('data')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [pageSize, setPageSize] = useState(8)

  const saldoDisponivel = 1245.7
  const saldoPendente = 320.0
  const totalRecebido = 8420.5
  const repassesSolicitados = 6

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mockRepasses.length === 0) {
        setEstadoTela('sem_historico')
      } else {
        setEstadoTela('default')
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  const repassesFiltrados = useMemo(
    () =>
      mockRepasses.filter((repasse) =>
        matchesDateFilter(repasse.data, dateFilter, customStartDate, customEndDate),
      ),
    [dateFilter, customStartDate, customEndDate],
  )

  const handleChangeSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection('asc')
  }

  const repassesOrdenados = useMemo(() => {
    const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' })
    const direction = sortDirection === 'asc' ? 1 : -1

    return [...repassesFiltrados].sort((a, b) => {
      if (sortKey === 'data') {
        return (new Date(a.data).getTime() - new Date(b.data).getTime()) * direction
      }
      if (sortKey === 'valor') {
        return (a.valor - b.valor) * direction
      }
      if (sortKey === 'tipo') {
        return collator.compare(a.metodo, b.metodo) * direction
      }
      return (statusOrder[a.status] - statusOrder[b.status]) * direction
    })
  }, [repassesFiltrados, sortDirection, sortKey])

  const totalRegistros = repassesOrdenados.length
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / pageSize))
  const paginaAtualCorrigida = Math.min(Math.max(paginaAtual, 1), totalPaginas)
  const indexInicio = (paginaAtualCorrigida - 1) * pageSize
  const repassesPaginados = repassesOrdenados.slice(indexInicio, indexInicio + pageSize)

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

  const handleQuickFilter = (type: 'hoje' | 'semana' | 'mes' | 'tudo') => {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    switch (type) {
      case 'hoje': {
        const inicio = toIsoDate(startOfDay)
        const fim = toIsoDate(now)
        setCustomStartDate(inicio)
        setCustomEndDate(fim)
        setDateFilter('periodo')
        setTempStartDate(inicio)
        setTempEndDate(fim)
        break
      }
      case 'semana': {
        const weekAgo = new Date(startOfDay)
        weekAgo.setDate(weekAgo.getDate() - 7)
        const inicio = toIsoDate(weekAgo)
        const fim = toIsoDate(now)
        setCustomStartDate(inicio)
        setCustomEndDate(fim)
        setDateFilter('periodo')
        setTempStartDate(inicio)
        setTempEndDate(fim)
        break
      }
      case 'mes': {
        const monthAgo = new Date(startOfDay)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        const inicio = toIsoDate(monthAgo)
        const fim = toIsoDate(now)
        setCustomStartDate(inicio)
        setCustomEndDate(fim)
        setDateFilter('periodo')
        setTempStartDate(inicio)
        setTempEndDate(fim)
        break
      }
      case 'tudo': {
        setCustomStartDate('')
        setCustomEndDate('')
        setDateFilter('periodo')
        setTempStartDate('')
        setTempEndDate('')
        break
      }
    }

    setPaginaAtual(1)
    setShowDatePicker(false)
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
    setPaginaAtual(1)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSolicitarRepasse = () => {
    const valor = parseFloat(valorSolicitacao.replace(',', '.'))
    if (!valor || valor <= 0) {
      alert('Informe um valor válido para o repasse.')
      return
    }
    if (valor > saldoDisponivel) {
      alert('Valor superior ao saldo disponível.')
      return
    }

    setCarregandoAcao(true)
    setTimeout(() => {
      setCarregandoAcao(false)
      setModalAberto(false)
      setValorSolicitacao('')
      setObservacao('')
      alert('Solicitação de repasse enviada com sucesso!')
    }, 800)
  }

  const bloqueado = estadoTela === 'bloqueado' || saldoDisponivel <= 0
  const loading = estadoTela === 'carregando'

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[var(--text-primary)]">
              Financeiro
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Controle de ganhos e repasses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Info size={14} />
              <span>
                Saldo disponível é atualizado após cada entrega concluída
              </span>
            </div>
            <Button
              variant="primary"
              disabled={bloqueado}
              onClick={() => setModalAberto(true)}
              className="disabled:opacity-40 disabled:cursor-not-allowed"
              icon={<Wallet size={18} />}
              label="Solicitar Repasse"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
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
              <CaretDown
                size={12}
                weight="bold"
                className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`}
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
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-[0.65rem] font-medium text-[color:var(--text-secondary)] py-1"
                      >
                        {day}
                      </div>
                    ))}
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
                        const selected = isDateSelected(date)
                        const inRange = isDateInRange(date)
                        const today = isSameDay(date, new Date())

                        const baseClasses =
                          'aspect-square text-xs rounded-lg transition-colors'
                        const selectedClasses = selected
                          ? 'bg-[color:var(--primary-100)] text-white font-bold'
                          : inRange
                          ? 'bg-[color:var(--primary-100)]/20 text-[color:var(--text-primary)]'
                          : 'hover:bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]'
                        const todayClasses =
                          today && !selected ? 'ring-1 ring-[color:var(--primary-100)]' : ''

                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            className={`${baseClasses} ${selectedClasses} ${todayClasses}`}
                          >
                            {day}
                          </button>,
                        )
                      }

                      return days
                    })()}
                  </div>

                  {tempStartDate && (
                    <div className="mt-3 text-xs text-[color:var(--text-secondary)] text-center">
                      {tempStartDate && !tempEndDate && 'Selecione a data final'}
                      {tempStartDate &&
                        tempEndDate &&
                        `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`}
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <Wallet size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <Tooltip content="Valor disponível para solicitar repasse">
                <Info size={16} className="text-[var(--text-secondary)]" />
              </Tooltip>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Saldo Disponível
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(saldoDisponivel)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Total Recebido
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(totalRecebido)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Saldo Pendente
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(saldoPendente)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                <CreditCard size={20} className="text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Últimos 30 dias
              </span>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Repasses Solicitados
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {repassesSolicitados}
            </p>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Histórico de Repasses
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Acompanhe todos os repasses solicitados e pagos
              </p>
            </div>
          </div>

          {estadoTela === 'erro' && (
            <AlertCircle className="text-red-500" />
          )}

          {estadoTela === 'sem_historico' && (
            <EmptyState
              title="Nenhum repasse encontrado"
              description="Quando você solicitar repasses, eles aparecerão aqui."
            />
          )}

          {estadoTela !== 'sem_historico' && (
            <>
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)]">
                <p>
                  {totalRegistros === 0
                    ? 'Nenhum repasse encontrado para os filtros selecionados'
                    : totalRegistros === 1
                      ? 'Mostrando 1 de 1 repasse'
                      : `Mostrando ${indexInicio + 1}–${
                          indexInicio + repassesPaginados.length
                        } de ${totalRegistros} repasses`}
                </p>
              </div>

              <div className="block sm:hidden">
                {loading ? (
                  <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
                    Carregando repasses...
                  </div>
                ) : totalRegistros === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
                    Nenhum repasse encontrado para os filtros selecionados
                  </div>
                ) : (
                  <div className="space-y-3 px-4 py-3">
                    {repassesPaginados.map((repasse) => (
                      <button
                        key={repasse.id}
                        type="button"
                        onClick={() => setRepasseSelecionado(repasse)}
                        className="w-full text-left rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                              {formatDate(repasse.data)}
                            </p>
                            <p className="text-[0.7rem] text-[color:var(--text-primary)]">
                              {repasse.metodo === 'pix' && 'PIX'}
                              {repasse.metodo === 'dinheiro' && 'Dinheiro'}
                              {repasse.metodo === 'cartao' && 'Cartão'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              {formatCurrency(repasse.valor)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor[repasse.status]}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusLabel[repasse.status]}
                          </span>
                          <span className="text-xs font-medium text-[color:var(--primary-100)]">
                            Ver detalhes
                          </span>
                        </div>
                      </button>
                    ))}
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
                          <span>Valor</span>
                          {sortKey === 'valor' && (
                            <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
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
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                        >
                          Carregando repasses...
                        </td>
                      </tr>
                    ) : totalRegistros === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                        >
                          Nenhum repasse encontrado para os filtros selecionados
                        </td>
                      </tr>
                    ) : (
                      repassesPaginados.map((repasse) => (
                        <tr
                          key={repasse.id}
                          className="hover:bg-[color:var(--bg-hover)] transition-colors"
                        >
                          <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                            {formatDate(repasse.data)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top">
                            {(() => {
                              const cfg = metodoConfig[repasse.metodo]
                              return (
                                <div
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}
                                >
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/30 text-[0.65rem]">
                                    {cfg.icon}
                                  </span>
                                  <span>{cfg.label}</span>
                                </div>
                              )
                            })()}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              {formatCurrency(repasse.valor)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top">
                            <Tooltip content={statusLabel[repasse.status]}>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor[repasse.status]}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {statusLabel[repasse.status]}
                              </span>
                            </Tooltip>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 align-top">
                            <button
                              type="button"
                              onClick={() => setRepasseSelecionado(repasse)}
                              className="text-xs font-medium text-[color:var(--primary-100)] hover:underline"
                            >
                              Ver detalhes
                            </button>
                          </td>
                        </tr>
                      ))
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
                            setPaginaAtual(1)
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
                          onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))}
                          disabled={paginaAtualCorrigida === 1}
                          className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))
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
            </>
          )}
        </Card>
      </div>

      {repasseSelecionado && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setRepasseSelecionado(null)}
        >
          <div
            className="bg-[var(--surface)] rounded-[12px] max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[28px] font-bold text-[var(--text-primary)]">
                  Detalhes do repasse
                </h3>
                <p className="text-[20px] font-medium text-[var(--text-secondary)]">
                  Veja as informações completas deste repasse
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRepasseSelecionado(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--bg-body)] border border-[var(--border)] rounded-[12px] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Valor do repasse
                  </span>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(repasseSelecionado.valor)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor[repasseSelecionado.status]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {statusLabel[repasseSelecionado.status]}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Data do repasse</span>
                  <span className="text-[var(--text-primary)]">
                    {formatDate(repasseSelecionado.data)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Método</span>
                  <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                    {repasseSelecionado.metodo === 'pix' && <CreditCard size={14} />}
                    {repasseSelecionado.metodo === 'dinheiro' && <DollarSign size={14} />}
                    {repasseSelecionado.metodo === 'cartao' && <CreditCard size={14} />}
                    {repasseSelecionado.metodo === 'pix' && 'PIX'}
                    {repasseSelecionado.metodo === 'dinheiro' && 'Dinheiro'}
                    {repasseSelecionado.metodo === 'cartao' && 'Cartão'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Identificador</span>
                  <span className="text-[var(--text-secondary)]">#{repasseSelecionado.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Os repasses podem levar até 24 horas úteis para serem compensados,
                dependendo do método selecionado.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRepasseSelecionado(null)}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => {
            setModalAberto(false)
            setValorSolicitacao('')
            setObservacao('')
          }}
        >
          <div
            className="bg-[var(--surface)] rounded-t-[12px] sm:rounded-[12px] max-w-md w-full max-h-[90vh] overflow-y-auto p-6 space-y-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[28px] font-bold text-[var(--text-primary)]">
                  Solicitar Repasse
                </h3>
                <p className="text-[20px] font-medium text-[var(--text-secondary)]">
                  Confirme o valor e a forma de recebimento
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--bg-body)] border border-[var(--border)] rounded-[12px] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Saldo disponível
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(saldoDisponivel)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Taxa estimada</span>
                <span>0%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Valor líquido estimado</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {valorSolicitacao
                    ? formatCurrency(parseFloat(valorSolicitacao.replace(',', '.')) || 0)
                    : formatCurrency(0)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Valor do repasse
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                    R$
                  </span>
                  <input
                    type="text"
                    value={valorSolicitacao}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^\d,]/g, '')
                      setValorSolicitacao(value)
                    }}
                    placeholder="0,00"
                        className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-[12px] bg-[var(--bg-body)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Método de recebimento
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'pix', label: 'PIX' },
                    { value: 'dinheiro', label: 'Dinheiro' },
                    { value: 'cartao', label: 'Cartão' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMetodo(opt.value)}
                      className={`px-3 py-2 text-xs font-medium rounded-[12px] border ${
                        metodo === opt.value
                          ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Observação (opcional)
                </label>
                <textarea
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  rows={3}
                  className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] resize-none"
                  placeholder="Ex: repasse referente às entregas do final de semana"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[12px] p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  O repasse será analisado e, após aprovação, será depositado no método
                  selecionado em até 24 horas úteis.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setModalAberto(false)
                  setValorSolicitacao('')
                  setObservacao('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                disabled={carregandoAcao}
                onClick={handleSolicitarRepasse}
                className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={carregandoAcao}
                icon={!carregandoAcao ? <CheckCircle2 size={16} /> : undefined}
              >
                Confirmar Solicitação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
