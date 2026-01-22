import { useState, useMemo, useEffect, useRef, type CSSProperties } from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { CalendarBlank, CaretDown } from 'phosphor-react';
import { Card } from '../../components';

type DateFilter = 'hoje' | 'ontem' | 'periodo';

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const parseIsoToDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

function matchesDateFilter(
  isoDate: string,
  dateFilter: DateFilter,
  customStart?: string,
  customEnd?: string,
) {
  const baseDate = parseIsoToDate(isoDate);
  if (!baseDate) return false;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dateFilter === 'hoje') {
    return isSameDay(baseDate, today);
  }

  if (dateFilter === 'ontem') {
    return isSameDay(baseDate, yesterday);
  }

  if (dateFilter === 'periodo') {
    if (!customStart || !customEnd) return true;
    const start = parseIsoToDate(customStart);
    const end = parseIsoToDate(customEnd);
    if (!start || !end) return true;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const time = baseDate.getTime();

    return time >= start.getTime() && time <= end.getTime();
  }

  return true;
}

interface Entrega {
  id: string;
  entregador: string;
  loja: string;
  valor: number;
  data: string;
  hora: string;
  endereco: string;
  distancia: string;
}

export default function DeliveryHistorico() {
  const [entregadorFiltro, setEntregadorFiltro] = useState<string>('todos');
  const [buscaFiltro, setBuscaFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<'entregador' | 'loja' | 'distancia' | 'data' | 'valor'>(
    'data',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [dateFilter, setDateFilter] = useState<DateFilter>('periodo');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null);
  const [datePickerStyle, setDatePickerStyle] = useState<CSSProperties>();

  const [entregas] = useState<Entrega[]>([
    { id: '1', entregador: 'Carlos Mendes', loja: 'Burger King', valor: 54.90, data: '2026-01-14', hora: '12:30', endereco: 'Rua das Flores, 123', distancia: '2.5 km' },
    { id: '2', entregador: 'Ana Souza', loja: 'Pizza Hut', valor: 89.50, data: '2026-01-14', hora: '13:15', endereco: 'Av. Principal, 456', distancia: '1.8 km' },
    { id: '3', entregador: 'Roberto Lima', loja: "McDonald's", valor: 125.00, data: '2026-01-14', hora: '14:20', endereco: 'Rua do Comércio, 789', distancia: '3.2 km' },
    { id: '4', entregador: 'Carlos Mendes', loja: 'Subway', valor: 78.00, data: '2026-01-13', hora: '11:45', endereco: 'Praça Central, 321', distancia: '1.5 km' },
    { id: '5', entregador: 'Ana Souza', loja: 'KFC', valor: 95.80, data: '2026-01-13', hora: '15:30', endereco: 'Rua das Palmeiras, 654', distancia: '4.1 km' },
    { id: '6', entregador: 'Roberto Lima', loja: 'Burger King', valor: 67.40, data: '2026-01-13', hora: '16:10', endereco: 'Av. Paulista, 1000', distancia: '2.8 km' },
    { id: '7', entregador: 'Carlos Mendes', loja: 'Pizza Hut', valor: 112.30, data: '2026-01-12', hora: '12:00', endereco: 'Rua Augusta, 500', distancia: '3.5 km' },
    { id: '8', entregador: 'Ana Souza', loja: "McDonald's", valor: 58.90, data: '2026-01-12', hora: '13:25', endereco: 'Av. Ipiranga, 200', distancia: '2.1 km' },
    { id: '9', entregador: 'Roberto Lima', loja: 'Subway', valor: 82.50, data: '2026-01-12', hora: '14:40', endereco: 'Rua da Consolação, 850', distancia: '3.7 km' },
    { id: '10', entregador: 'Carlos Mendes', loja: 'KFC', valor: 145.60, data: '2026-01-11', hora: '18:20', endereco: 'Av. Rebouças, 300', distancia: '5.2 km' },
    { id: '11', entregador: 'Ana Souza', loja: 'Burger King', valor: 73.20, data: '2026-01-11', hora: '19:15', endereco: 'Rua Haddock Lobo, 450', distancia: '2.9 km' },
    { id: '12', entregador: 'Roberto Lima', loja: 'Pizza Hut', valor: 98.70, data: '2026-01-11', hora: '20:05', endereco: 'Av. Faria Lima, 1500', distancia: '4.3 km' },
    { id: '13', entregador: 'Carlos Mendes', loja: "McDonald's", valor: 56.80, data: '2026-01-10', hora: '12:35', endereco: 'Rua Oscar Freire, 120', distancia: '1.6 km' },
    { id: '14', entregador: 'Ana Souza', loja: 'Subway', valor: 91.40, data: '2026-01-10', hora: '13:50', endereco: 'Av. Brigadeiro, 780', distancia: '3.0 km' },
    { id: '15', entregador: 'Roberto Lima', loja: 'KFC', valor: 105.30, data: '2026-01-10', hora: '15:25', endereco: 'Rua Pamplona, 560', distancia: '2.4 km' },
  ]);

  const entregadores = ['Carlos Mendes', 'Ana Souza', 'Roberto Lima'];

  const entregasFiltradas = useMemo(() => {
    let filtered = entregas.filter((entrega) =>
      matchesDateFilter(entrega.data, dateFilter, customStartDate, customEndDate),
    );

    if (entregadorFiltro !== 'todos') {
      filtered = filtered.filter((entrega) => entrega.entregador === entregadorFiltro);
    }

    if (buscaFiltro.trim()) {
      const busca = buscaFiltro.toLowerCase();
      filtered = filtered.filter(
        (entrega) =>
          entrega.loja.toLowerCase().includes(busca) ||
          entrega.endereco.toLowerCase().includes(busca),
      );
    }

    return filtered;
  }, [entregas, dateFilter, customStartDate, customEndDate, entregadorFiltro, buscaFiltro]);

  const handleChangeSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const entregasOrdenadas = useMemo(() => {
    const parseDistanciaKm = (value: string) => Number(value.replace('km', '').trim());
    const parseTimeMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const valueForSort = (row: Entrega) => {
      switch (sortKey) {
        case 'entregador':
          return row.entregador;
        case 'loja':
          return row.loja;
        case 'distancia':
          return parseDistanciaKm(row.distancia);
        case 'valor':
          return row.valor;
        case 'data':
          return new Date(`${row.data}T00:00:00`).getTime() + parseTimeMinutes(row.hora);
      }
    };

    const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

    return [...entregasFiltradas].sort((a, b) => {
      const av = valueForSort(a);
      const bv = valueForSort(b);
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * direction;
      }

      return collator.compare(String(av), String(bv)) * direction;
    });
  }, [entregasFiltradas, sortDirection, sortKey]);

  const totalRegistros = entregasOrdenadas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / pageSize));
  const paginaAtualCorrigida = Math.min(Math.max(page, 1), totalPaginas);
  const startIndex = (paginaAtualCorrigida - 1) * pageSize;
  const entregasPaginadas = entregasOrdenadas.slice(startIndex, startIndex + pageSize);

  const handleQuickFilter = (type: 'hoje' | 'semana' | 'mes' | 'tudo') => {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    switch (type) {
      case 'hoje':
        setCustomStartDate(toIsoDate(startOfDay));
        setCustomEndDate(toIsoDate(now));
        setDateFilter('periodo');
        setTempStartDate(toIsoDate(startOfDay));
        setTempEndDate(toIsoDate(now));
        break;
      case 'semana': {
        const weekAgo = new Date(startOfDay);
        weekAgo.setDate(weekAgo.getDate() - 7);
        setCustomStartDate(toIsoDate(weekAgo));
        setCustomEndDate(toIsoDate(now));
        setDateFilter('periodo');
        setTempStartDate(toIsoDate(weekAgo));
        setTempEndDate(toIsoDate(now));
        break;
      }
      case 'mes': {
        const monthAgo = new Date(startOfDay);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        setCustomStartDate(toIsoDate(monthAgo));
        setCustomEndDate(toIsoDate(now));
        setDateFilter('periodo');
        setTempStartDate(toIsoDate(monthAgo));
        setTempEndDate(toIsoDate(now));
        break;
      }
      case 'tudo':
        setCustomStartDate('');
        setCustomEndDate('');
        setDateFilter('periodo');
        setTempStartDate('');
        setTempEndDate('');
        break;
    }
    setShowDatePicker(false);
  };

  const getDateLabel = () => {
    if (!customStartDate && !customEndDate) {
      return 'Tudo';
    }
    if (customStartDate && customEndDate) {
      return `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
    }
    if (customStartDate) {
      return `A partir de ${formatDate(customStartDate)}`;
    }
    if (customEndDate) {
      return `Até ${formatDate(customEndDate)}`;
    }
    return 'Selecionar período';
  };

  const handleDateClick = (date: Date) => {
    const isoDate = toIsoDate(date);

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(isoDate);
      setTempEndDate('');
    } else {
      const start = parseIsoToDate(tempStartDate);
      const end = date;

      if (start && end < start) {
        setTempStartDate(isoDate);
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(isoDate);
      }
    }
  };

  const applyDateFilter = () => {
    setCustomStartDate(tempStartDate);
    setCustomEndDate(tempEndDate);
    setDateFilter('periodo');
    setShowDatePicker(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    const start = parseIsoToDate(tempStartDate);
    const end = parseIsoToDate(tempEndDate);
    if (!start || !end) return false;
    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    const isoDate = toIsoDate(date);
    return isoDate === tempStartDate || isoDate === tempEndDate;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const metricasHistorico = useMemo(() => {
    const total = entregasFiltradas.reduce((sum, e) => sum + e.valor, 0);
    const quantidade = entregasFiltradas.length;
    const ticketMedio = quantidade > 0 ? total / quantidade : 0;
    
    return {
      totalEntregas: quantidade,
      valorTotal: total,
      ticketMedio,
    };
  }, [entregasFiltradas]);

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header com Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
              Histórico de Entregas
            </h1>
            <p className="mt-1 text-[20px] leading-[24px] text-[var(--text-primary)]">
              Acompanhe todas as entregas realizadas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            {/* Filtro de Período */}
            <div className="relative" ref={datePickerRef}>
              <button
                type="button"
                ref={datePickerButtonRef}
                onClick={() => {
                  const willOpen = !showDatePicker;
                  if (willOpen) {
                    setTempStartDate(customStartDate);
                    setTempEndDate(customEndDate);

                    if (datePickerButtonRef.current) {
                      const rect = datePickerButtonRef.current.getBoundingClientRect();
                      const viewportWidth = window.innerWidth;
                      const viewportHeight = window.innerHeight;

                      const pickerWidth = Math.min(320, viewportWidth - 32);
                      const centerX = rect.left + rect.width / 2;
                      const minLeft = 16;
                      const maxLeft = viewportWidth - pickerWidth - 16;
                      const left = Math.min(Math.max(centerX - pickerWidth / 2, minLeft), maxLeft);

                      const estimatedHeight = 420;
                      const spaceBelow = viewportHeight - rect.bottom - 16;
                      const top =
                        spaceBelow >= estimatedHeight
                          ? rect.bottom + 8
                          : Math.max(16, viewportHeight - estimatedHeight - 16);

                      setDatePickerStyle({
                        position: 'fixed',
                        top,
                        left,
                        width: pickerWidth,
                        zIndex: 50,
                      });
                    }
                  } else {
                    setDatePickerStyle(undefined);
                  }
                  setShowDatePicker(willOpen);
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
                        } = getDaysInMonth(currentMonth);
                        const days = [];

                        for (let i = 0; i < startingDayOfWeek; i++) {
                          days.push(<div key={`empty-${i}`} />);
                        }

                        for (let day = 1; day <= daysInMonth; day++) {
                          const date = new Date(year, month, day);
                          const selected = isDateSelected(date);
                          const inRange = isDateInRange(date);
                          const today = isSameDay(date, new Date());

                          const baseClasses =
                            'aspect-square text-xs rounded-lg transition-colors';
                          const selectedClasses = selected
                            ? 'bg-[color:var(--primary-100)] text-white font-bold'
                            : inRange
                            ? 'bg-[color:var(--primary-100)]/20 text-[color:var(--text-primary)]'
                            : 'hover:bg-[color:var(--bg-hover)] text-[color:var(--text-primary)]';
                          const todayClasses =
                            today && !selected ? 'ring-1 ring-[color:var(--primary-100)]' : '';

                          days.push(
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDateClick(date)}
                              className={`${baseClasses} ${selectedClasses} ${todayClasses}`}
                            >
                              {day}
                            </button>,
                          );
                        }

                        return days;
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
                        setTempStartDate('');
                        setTempEndDate('');
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

            {/* Filtro de Entregador */}
            <div className="relative">
              <select
                value={entregadorFiltro}
                onChange={(e) => setEntregadorFiltro(e.target.value)}
                className="appearance-none rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <option value="todos">Todos os entregadores</option>
                {entregadores.map((ent) => (
                  <option key={ent} value={ent}>
                    {ent}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[var(--text-primary)]">
                ▼
              </span>
            </div>

            {/* Busca */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar loja ou endereço..."
                value={buscaFiltro}
                onChange={(e) => setBuscaFiltro(e.target.value)}
                className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              />
            </div>
          </div>
        </div>

        {/* Métricas do Histórico */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Total de Entregas</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {metricasHistorico.totalEntregas}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Valor Total</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {metricasHistorico.valorTotal.toFixed(2)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Ticket Médio</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              R$ {metricasHistorico.ticketMedio.toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Tabela de Entregas */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)]">
            <p>
              {totalRegistros === 0
                ? 'Nenhuma entrega encontrada para os filtros selecionados'
                : totalRegistros === 1
                  ? 'Mostrando 1 de 1 entrega'
                  : `Mostrando ${startIndex + 1}–${
                      startIndex + entregasPaginadas.length
                    } de ${totalRegistros} entregas`}
            </p>
          </div>

          <div className="block sm:hidden">
            {entregasPaginadas.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]">
                Nenhuma entrega encontrada para os filtros selecionados
              </div>
            ) : (
              <div className="space-y-3 px-4 py-3">
                {entregasPaginadas.map((entrega) => (
                  <div
                    key={entrega.id}
                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-nav)] p-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {entrega.entregador.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                            {entrega.entregador}
                          </p>
                          <p className="text-[0.7rem] text-[color:var(--text-primary)]">
                            {entrega.loja}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          R$ {entrega.valor.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 text-[0.7rem] text-[color:var(--text-primary)]">
                      <span>
                        {formatDate(entrega.data)} • {entrega.hora} • {entrega.distancia}
                      </span>
                      <span>{entrega.endereco}</span>
                    </div>
                  </div>
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
                      onClick={() => handleChangeSort('entregador')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Entregador</span>
                      {sortKey === 'entregador' && (
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
                      {sortKey === 'loja' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    Endereço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    <button
                      type="button"
                      onClick={() => handleChangeSort('distancia')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Distância</span>
                      {sortKey === 'distancia' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    <button
                      type="button"
                      onClick={() => handleChangeSort('data')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Data/Hora</span>
                      {sortKey === 'data' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    <button
                      type="button"
                      onClick={() => handleChangeSort('valor')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Valor</span>
                      {sortKey === 'valor' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--border)]">
                {totalRegistros === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                    >
                      Nenhuma entrega encontrada para os filtros selecionados
                    </td>
                  </tr>
                ) : (
                  entregasPaginadas.map((entrega) => (
                    <tr
                      key={entrega.id}
                      className="hover:bg-[color:var(--bg-hover)] transition-colors"
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {entrega.entregador.charAt(0)}
                          </div>
                          <div className="text-sm font-medium text-[color:var(--text-primary)]">
                            {entrega.entregador}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm font-medium text-[color:var(--text-primary)]">
                          {entrega.loja}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                        {entrega.endereco}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {entrega.distancia}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-top">
                        <div className="text-sm text-[color:var(--text-primary)]">
                          {formatDate(entrega.data)}
                        </div>
                        <div className="text-xs text-[color:var(--text-primary)]">{entrega.hora}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                        <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          R$ {entrega.valor.toFixed(2)}
                        </div>
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
                        const value = Number(event.target.value);
                        setPageSize(value);
                        setPage(1);
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
                      onClick={() => setPage((prev) => Math.min(totalPaginas, prev + 1))}
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
        </Card>
      </div>
    </div>
  );
}
