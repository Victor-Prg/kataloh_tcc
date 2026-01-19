import { useEffect, useRef, useState } from 'react'
import { CalendarBlank, CaretDown, FileCsv } from 'phosphor-react'

type WeeklyStat = {
  label: string
  value: string
  helper: string
  detail: string
}

const weeklyStats: WeeklyStat[] = [
  {
    label: 'Total de pedidos da semana',
    value: '328',
    helper: 'Semana atual',
    detail: '+18% vs última semana',
  },
  {
    label: 'Total faturado na semana',
    value: 'R$ 24.870,00',
    helper: 'Receita bruta',
    detail: '+R$ 3.780,00 vs última semana',
  },
  {
    label: 'Ticket médio',
    value: 'R$ 75,80',
    helper: 'Por pedido concluído',
    detail: '+R$ 6,40 vs última semana',
  },
  {
    label: 'Pedidos finalizados',
    value: '291',
    helper: 'Com pagamento aprovado',
    detail: 'Taxa de conclusão de 88,7%',
  },
]

type WeeklyOrdersPoint = {
  day: string
  value: number
}

const weeklyOrdersData: WeeklyOrdersPoint[] = [
  { day: 'Seg', value: 42 },
  { day: 'Ter', value: 51 },
  { day: 'Qua', value: 63 },
  { day: 'Qui', value: 71 },
  { day: 'Sex', value: 84 },
  { day: 'Sáb', value: 68 },
  { day: 'Dom', value: 49 },
]

const monthlyCurrentRevenue: number = 98240
const monthlyPreviousRevenue: number = 91480

const topDishes = [
  { name: 'Hambúrguer Clássico da Casa', orders: 142 },
  { name: 'Combo Família 4 Pessoas', orders: 118 },
  { name: 'X-Salada Especial', orders: 103 },
  { name: 'Batata Rústica Temperada', orders: 97 },
  { name: 'Milk-shake de Chocolate', orders: 86 },
] as const

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

const parseIsoToDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate()

type QuickFilterType = 'hoje' | 'semana' | 'mes' | 'tudo'

type DashboardStatusFilter = 'todos' | 'solicitado' | 'confirmado' | 'pago' | 'cancelado'

export default function LojaDashboard() {
  const maxWeeklyOrders = Math.max(...weeklyOrdersData.map(point => point.value))
  const weeklyHighlight = weeklyOrdersData.reduce((highest, point) =>
    point.value > highest.value ? point : highest
  )

  const monthlyIsGrowing = monthlyCurrentRevenue >= monthlyPreviousRevenue
  const monthlyGrowthDiff = monthlyCurrentRevenue - monthlyPreviousRevenue
  const monthlyGrowthPercent =
    monthlyPreviousRevenue === 0
      ? 0
      : Math.round((monthlyGrowthDiff / monthlyPreviousRevenue) * 100)

  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [tempStartDate, setTempStartDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [statusFilter, setStatusFilter] = useState<DashboardStatusFilter>('todos')
  const datePickerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResetarFiltros = () => {
    setCustomStartDate('')
    setCustomEndDate('')
    setTempStartDate('')
    setTempEndDate('')
    setStatusFilter('todos')
  }

  const handleQuickFilter = (type: QuickFilterType) => {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    switch (type) {
      case 'hoje':
        setCustomStartDate(toIsoDate(startOfDay))
        setCustomEndDate(toIsoDate(now))
        setTempStartDate(toIsoDate(startOfDay))
        setTempEndDate(toIsoDate(now))
        break
      case 'semana': {
        const weekAgo = new Date(startOfDay)
        weekAgo.setDate(weekAgo.getDate() - 7)
        setCustomStartDate(toIsoDate(weekAgo))
        setCustomEndDate(toIsoDate(now))
        setTempStartDate(toIsoDate(weekAgo))
        setTempEndDate(toIsoDate(now))
        break
      }
      case 'mes': {
        const monthAgo = new Date(startOfDay)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        setCustomStartDate(toIsoDate(monthAgo))
        setCustomEndDate(toIsoDate(now))
        setTempStartDate(toIsoDate(monthAgo))
        setTempEndDate(toIsoDate(now))
        break
      }
      case 'tudo':
        setCustomStartDate('')
        setCustomEndDate('')
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    )
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
    setShowDatePicker(false)
  }

  const handleExportarCsv = () => {
    if (weeklyStats.length === 0) {
      return
    }

    const headers = ['Métrica', 'Valor', 'Descrição']

    const linhas = weeklyStats.map(stat => [
      stat.label,
      stat.value,
      stat.detail,
    ])

    const todasLinhas = [headers, ...linhas]

    const csv = todasLinhas
      .map(linha =>
        linha
          .map(campo => {
            const valor = String(campo ?? '')
            const precisaAspas =
              valor.includes(';') || valor.includes('"') || valor.includes('\n')
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
    link.download = 'dashboard-loja.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[color:var(--text-primary)]">
            Dashboard
          </h1>
          <p className="mt-1 text-[15px] leading-[22px] text-[color:var(--text-soft)]">
            Acompanhe as métricas e o desempenho do seu negócio em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
          <div className="relative" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowDatePicker(!showDatePicker)
                if (!showDatePicker) {
                  setTempStartDate(customStartDate)
                  setTempEndDate(customEndDate)
                }
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
              <div className="absolute top-full right-0 mt-2 w-80 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-xl z-50 p-4">
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
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
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
                      const { daysInMonth, startingDayOfWeek, year, month } =
                        getDaysInMonth(currentMonth)
                      const days = []

                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(<div key={`empty-${i}`} />)
                      }

                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day)
                        const selected = isDateSelected(date)
                        const inRange = isDateInRange(date)
                        const today = isSameDay(date, new Date())

                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            className={`
                              aspect-square text-xs rounded-lg transition-colors
                              ${
                                selected
                                  ? 'bg-[color:var(--primary-100)] text-white font-bold'
                                  : inRange
                                  ? 'bg-[color:var(--primary-100)]/20 text-[color:var(--text-primary)]'
                                  : 'hover:bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]'
                              }
                              ${
                                today && !selected
                                  ? 'ring-1 ring-[color:var(--primary-100)]'
                                  : ''
                              }
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

          <div className="relative">
            <select
              value={statusFilter}
              onChange={event =>
                setStatusFilter(
                  event.target.value as DashboardStatusFilter
                )
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {weeklyStats.map(stat => (
          <article
            key={stat.label}
            className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-soft)]">
                  {stat.helper}
                </span>
                <h2 className="text-[13px] font-medium text-[color:var(--text-primary)]">
                  {stat.label}
                </h2>
              </div>
            </div>
            <p className="mt-3 text-[26px] leading-none font-semibold text-[color:var(--text-primary)]">
              {stat.value}
            </p>
            <p className="mt-2 text-[12px] text-emerald-400">
              {stat.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                Pedidos por dia da semana
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
                Identifique quais dias concentram maior volume de pedidos.
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-500/30">
              Pico em {weeklyHighlight.day}
            </div>
          </div>

          <div className="mt-6 flex-1">
            <div className="flex h-56 items-end gap-3 border-b border-[color:var(--border)] pb-4">
              {weeklyOrdersData.map(point => {
                const heightPercent = (point.value / maxWeeklyOrders) * 100
                return (
                  <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-6 rounded-md bg-gradient-to-t from-sky-500 to-indigo-400 shadow-[0_0_0_1px_rgba(15,23,42,0.6)]"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[color:var(--text-soft)]">
                      {point.day}
                    </span>
                    <span className="text-[11px] text-[color:var(--text-primary)]">
                      {point.value}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-[color:var(--text-soft)]">
              <span>
                Eixo X: Dias da semana
              </span>
              <span>
                Eixo Y: Quantidade de pedidos
              </span>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
              Comparativo mensal
            </h2>
            <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
              Compare o desempenho do mês atual com o mês anterior.
            </p>
          </div>

          <div className="mt-6 flex h-40 items-end gap-4">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div className="w-8 rounded-md bg-gradient-to-t from-emerald-500 to-emerald-300 shadow-[0_0_0_1px_rgba(15,23,42,0.6)]" />
              </div>
              <span className="text-[11px] font-medium text-[color:var(--text-soft)]">
                Mês anterior
              </span>
              <span className="text-[11px] text-[color:var(--text-primary)]">
                R$ {monthlyPreviousRevenue.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className={`w-8 rounded-md shadow-[0_0_0_1px_rgba(15,23,42,0.6)] ${
                    monthlyIsGrowing
                      ? 'bg-gradient-to-t from-indigo-500 to-sky-400'
                      : 'bg-gradient-to-t from-rose-500 to-orange-400'
                  }`}
                  style={{
                    height:
                      monthlyPreviousRevenue === 0
                        ? '100%'
                        : `${Math.min(
                            130,
                            100 + (monthlyGrowthDiff / monthlyPreviousRevenue) * 100
                          )}%`,
                  }}
                />
              </div>
              <span className="text-[11px] font-medium text-[color:var(--text-soft)]">
                Mês atual
              </span>
              <span className="text-[11px] text-[color:var(--text-primary)]">
                R$ {monthlyCurrentRevenue.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2 text-[12px] flex flex-col gap-1">
            <span
              className={`font-medium ${
                monthlyIsGrowing ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {monthlyIsGrowing
                ? 'Mês atual mais lucrativo'
                : 'Mês atual abaixo do anterior'}
            </span>
            <span className="text-[11px] text-[color:var(--text-soft)]">
              Variação de{' '}
              <strong className={monthlyIsGrowing ? 'text-emerald-300' : 'text-rose-300'}>
                {monthlyGrowthPercent > 0 ? `+${monthlyGrowthPercent}%` : `${monthlyGrowthPercent}%`}
              </strong>{' '}
              em relação ao mês anterior.
            </span>
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="lg:col-span-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                Top 5 pratos mais pedidos
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
                Lista ordenada do mais pedido para o menos pedido.
              </p>
            </div>
          </div>

          <ol className="mt-5 divide-y divide-[color:var(--border)]">
            {topDishes.map((dish, index) => (
              <li
                key={dish.name}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--surface-nav)] text-[11px] font-semibold text-[color:var(--text-primary)]">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-[color:var(--text-primary)]">
                      {dish.name}
                    </span>
                    <span className="text-[12px] text-[color:var(--text-soft)]">
                      Prato mais pedido pelos clientes da semana.
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[14px] font-semibold text-[color:var(--text-primary)]">
                    {dish.orders}
                  </span>
                  <span className="text-[11px] text-[color:var(--text-soft)]">
                    pedidos
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col gap-4">
          <div>
            <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
              Visão geral rápida
            </h2>
            <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
              Resumo das principais métricas semanais da sua loja.
            </p>
          </div>

          <div className="space-y-3 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--text-soft)]">
                Dia com mais pedidos
              </span>
              <span className="font-medium text-[color:var(--text-primary)]">
                {weeklyHighlight.day}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--text-soft)]">
                Pedidos no pico da semana
              </span>
              <span className="font-medium text-[color:var(--text-primary)]">
                {weeklyHighlight.value}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--text-soft)]">
                Faturamento estimado mensal
              </span>
              <span className="font-medium text-[color:var(--text-primary)]">
                R$ {monthlyCurrentRevenue.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[color:var(--text-soft)]">
                Tendência do mês
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${
                  monthlyIsGrowing
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}
              >
                {monthlyIsGrowing ? 'Em crescimento' : 'Em queda'}
              </span>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
