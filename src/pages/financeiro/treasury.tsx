import { useEffect, useMemo, useState } from 'react'
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

  const handleClear = () => {
    if (onChange) {
      onChange(undefined, undefined)
    }
  }

  const hasValue = Boolean(startDate || endDate)
  const inputId = 'daterange-input'

  return (
    <div className="datepicker-container">
      <div className="datepicker-input-wrapper">
        <Input
          id={inputId}
          label={label}
          placeholder={placeholder}
          value={formattedValue}
          readOnly
          onClick={handleToggle}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
        />
        {hasValue && (
          <button
            type="button"
            className="datepicker-clear"
            onClick={event => {
              event.stopPropagation()
              handleClear()
            }}
            aria-label="Limpar período"
          >
            ×
          </button>
        )}
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
      <div className="flex flex-col gap-2">
        <Text as="h1" size="heading" style={{ fontWeight: 'bold' }}>
          Tesouraria
        </Text>
        <Text color="var(--text-secondary)">
          Visualize os recebimentos por loja e tipo de pagamento.
        </Text>
      </div>

      <section className="grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:grid-cols-3 sm:items-end">
        <div className="sm:col-span-1">
          <Input
            label="Buscar loja"
            placeholder="Digite o nome da loja"
            value={storeSearch}
            onChange={event => setStoreSearch(event.target.value)}
          />
        </div>

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
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:col-span-1">
          <p className="text-sm text-[color:var(--text-muted)]">Total recebido</p>
          <p className="mt-2 text-2xl font-semibold">
            {currencyFormatter.format(totalAmount)}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <Table
          columns={columns}
          data={paginatedReceipts}
          rowKey={row => row.id}
          emptyTitle="Nenhum recebimento encontrado"
          emptyDescription="Ajuste os filtros ou aguarde novos recebimentos."
        />
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

