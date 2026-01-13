import { useEffect, useMemo, useRef, useState } from 'react'
import { Calendar } from '../../components/Calendar'
import { Select } from '../../components/Select'
import { Input } from '../../components/Input'
import { Table, type TableColumn } from '../../components/Table'
import { Pagination } from '../../components/Pagination'
import { Text } from '../../components'
import { usePagination } from '../../composables/usePagination'
import '../../assets/DatePicker.css'

type PaymentKind = 'cartao_credito' | 'cartao_debito' | 'pix'

type Receipt = {
  id: string
  date: Date
  store: string
  kind: PaymentKind
  amount: number
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const paymentKindLabel: Record<PaymentKind, string> = {
  cartao_credito: 'Cartão de crédito',
  cartao_debito: 'Cartão de débito',
  pix: 'Pix',
}

type DateRangePickerProps = {
  startDate?: Date
  endDate?: Date
  onChange?: (start?: Date, end?: Date) => void
  label?: string
  placeholder?: string
}

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  label,
  placeholder,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const formatDate = (date?: Date) => {
    if (!date) {
      return ''
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formattedValue = useMemo(() => {
    if (!startDate && !endDate) {
      return ''
    }
    if (startDate && !endDate) {
      return `${formatDate(startDate)} -`
    }
    if (!startDate && endDate) {
      return `- ${formatDate(endDate)}`
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }, [startDate, endDate])

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  const handleDateClick = (date: Date) => {
    if (!onChange) {
      return
    }

    if (!startDate || (startDate && endDate)) {
      onChange(date, undefined)
      return
    }

    if (date < startDate) {
      onChange(date, startDate)
    } else {
      onChange(startDate, date)
    }

    setOpen(false)
  }

  const hasValue = Boolean(startDate || endDate)
  const inputId = 'daterange-input'

  useEffect(() => {
    if (!open) {
      return
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) {
        return
      }

      const target = event.target

      if (target instanceof Node && !containerRef.current.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  return (
    <div className="input-group" ref={containerRef}>
      {label && <span className="input-label">{label}</span>}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          className="input-modern cursor-pointer pr-12"
          placeholder={placeholder ?? 'Selecione o período'}
          value={formattedValue}
          readOnly
          onClick={handleToggle}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
        />

        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pr-3 text-[color:var(--text-secondary)]">
          <svg
            className="h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div
          className="datepicker-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={inputId}
        >
          <Calendar
            value={endDate ?? startDate}
            onChange={handleDateClick}
            rangeStart={startDate}
            rangeEnd={endDate}
          />
        </div>
      )}
    </div>
  )
}

const mockReceipts: Receipt[] = [
  {
    id: '1',
    date: new Date(2026, 0, 5),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 320.5,
  },
  {
    id: '2',
    date: new Date(2026, 0, 5),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 189.9,
  },
  {
    id: '3',
    date: new Date(2026, 0, 5),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 210.0,
  },
  {
    id: '4',
    date: new Date(2026, 0, 6),
    store: 'Loja Centro',
    kind: 'cartao_debito',
    amount: 75.0,
  },
  {
    id: '5',
    date: new Date(2026, 0, 6),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 654.35,
  },
  {
    id: '6',
    date: new Date(2026, 0, 6),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 450.0,
  },
  {
    id: '7',
    date: new Date(2026, 0, 7),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 980.3,
  },
  {
    id: '8',
    date: new Date(2026, 0, 7),
    store: 'Loja Shopping',
    kind: 'cartao_debito',
    amount: 120.75,
  },
  {
    id: '9',
    date: new Date(2026, 0, 8),
    store: 'Loja Bairro',
    kind: 'cartao_credito',
    amount: 890.0,
  },
  {
    id: '10',
    date: new Date(2026, 0, 8),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 1500.9,
  },
  {
    id: '11',
    date: new Date(2026, 0, 8),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 310.2,
  },
  {
    id: '12',
    date: new Date(2026, 0, 9),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 432.75,
  },
  {
    id: '13',
    date: new Date(2026, 0, 9),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 220.0,
  },
  {
    id: '14',
    date: new Date(2026, 0, 9),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 95.5,
  },
  {
    id: '15',
    date: new Date(2026, 0, 10),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 780.0,
  },
  {
    id: '16',
    date: new Date(2026, 0, 10),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 1290.9,
  },
  {
    id: '17',
    date: new Date(2026, 0, 10),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 340.45,
  },
  {
    id: '18',
    date: new Date(2026, 0, 11),
    store: 'Loja Centro',
    kind: 'cartao_debito',
    amount: 180.0,
  },
  {
    id: '19',
    date: new Date(2026, 0, 11),
    store: 'Loja Shopping',
    kind: 'pix',
    amount: 560.2,
  },
  {
    id: '20',
    date: new Date(2026, 0, 11),
    store: 'Loja Bairro',
    kind: 'cartao_credito',
    amount: 910.0,
  },
  {
    id: '21',
    date: new Date(2026, 0, 12),
    store: 'Loja Centro',
    kind: 'cartao_credito',
    amount: 150.0,
  },
  {
    id: '22',
    date: new Date(2026, 0, 12),
    store: 'Loja Shopping',
    kind: 'cartao_debito',
    amount: 210.3,
  },
  {
    id: '23',
    date: new Date(2026, 0, 12),
    store: 'Loja Bairro',
    kind: 'pix',
    amount: 640.0,
  },
  {
    id: '24',
    date: new Date(2026, 0, 13),
    store: 'Loja Centro',
    kind: 'pix',
    amount: 305.8,
  },
  {
    id: '25',
    date: new Date(2026, 0, 13),
    store: 'Loja Shopping',
    kind: 'cartao_credito',
    amount: 1120.0,
  },
  {
    id: '26',
    date: new Date(2026, 0, 13),
    store: 'Loja Bairro',
    kind: 'cartao_debito',
    amount: 260.4,
  },
]

function Treasury() {
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [storeSearch, setStoreSearch] = useState<string>('')

  const filteredReceipts = useMemo(
    () =>
      mockReceipts.filter(receipt => {
        if (startDate && receipt.date < startDate) {
          return false
        }

        if (endDate && receipt.date > endDate) {
          return false
        }

        if (paymentFilter !== 'all' && receipt.kind !== paymentFilter) {
          return false
        }

        if (storeSearch.trim()) {
          const search = storeSearch.trim().toLowerCase()
          if (!receipt.store.toLowerCase().includes(search)) {
            return false
          }
        }

        return true
      }),
    [startDate, endDate, paymentFilter, storeSearch],
  )

  const {
    page,
    pageSize,
    totalPages,
    goToPage,
  } = usePagination({
    totalItems: filteredReceipts.length,
    pageSize: 10,
  })

  useEffect(() => {
    if (page > totalPages) {
      goToPage(totalPages)
    }
  }, [page, totalPages, goToPage])

  const paginatedReceipts = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredReceipts.slice(startIndex, endIndex)
  }, [filteredReceipts, page, pageSize])

  const handleResetarFiltros = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setPaymentFilter('all')
    setStoreSearch('')
  }

  const columns: TableColumn<Receipt>[] = [
    {
      key: 'date',
      header: 'Data',
      renderCell: receipt => formatDate(receipt.date),
    },
    {
      key: 'store',
      header: 'Loja',
      renderCell: receipt => receipt.store,
    },
    {
      key: 'kind',
      header: 'Tipo de pagamento',
      renderCell: receipt => paymentKindLabel[receipt.kind],
    },
    {
      key: 'amount',
      header: 'Valor recebido',
      renderCell: receipt => currencyFormatter.format(receipt.amount),
    },
  ]

  const totalAmount = useMemo(
    () =>
      filteredReceipts.reduce((accumulator, receipt) => accumulator + receipt.amount, 0),
    [filteredReceipts],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Text as="h1" size="heading" style={{ fontWeight: 'bold', fontSize: 28 }}>
            Tesouraria
          </Text>
          <Text color="var(--text-secondary)" style={{ fontSize: 20 }}>
            Visualize os recebimentos por loja e tipo de pagamento.
          </Text>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="w-full sm:w-56">
            <Input
              label="Buscar loja"
              placeholder="Digite o nome da loja"
              value={storeSearch}
              onChange={event => setStoreSearch(event.target.value)}
            />
          </div>

          <div className="w-full sm:w-52">
            <Select
              label="Tipo de pagamento"
              value={paymentFilter}
              onChange={event => setPaymentFilter(event.target.value)}
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Cartão de crédito', value: 'cartao_credito' },
                { label: 'Cartão de débito', value: 'cartao_debito' },
                { label: 'Pix', value: 'pix' },
              ]}
            />
          </div>

          <div className="w-full sm:w-64">
            <DateRangePicker
              label="Período"
              placeholder="Selecione o período"
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleResetarFiltros}
            className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:col-span-1">
          <p className="text-sm text-[color:var(--text-muted)]">Total recebido</p>
          <p className="mt-2 text-2xl font-semibold">
            {currencyFormatter.format(totalAmount)}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <div className="hidden sm:block">
          <Table
            columns={columns}
            data={paginatedReceipts}
            rowKey={row => row.id}
            emptyTitle="Nenhum recebimento encontrado"
            emptyDescription="Ajuste os filtros ou aguarde novos recebimentos."
          />
        </div>

        <div className="space-y-3 sm:hidden">
          {paginatedReceipts.length === 0 && (
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-4 text-sm text-[color:var(--text-muted)]">
              <p className="font-medium">Nenhum recebimento encontrado</p>
              <p className="mt-1 text-xs">
                Ajuste os filtros ou aguarde novos recebimentos.
              </p>
            </div>
          )}

          {paginatedReceipts.map(receipt => (
            <div
              key={receipt.id}
              className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {receipt.store}
                </p>
                <p className="text-xs text-[color:var(--text-muted)]">
                  {formatDate(receipt.date)}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-[color:var(--text-secondary)]">
                  {paymentKindLabel[receipt.kind]}
                </p>
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {currencyFormatter.format(receipt.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
              showFirstLast
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default Treasury

