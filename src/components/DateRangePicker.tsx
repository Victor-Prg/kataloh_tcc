import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { Calendar } from './Calendar'; // Seu componente de calendário existente
import { Input } from './Input';       // Seu componente de input existente
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import '../assets/DatePicker.css';

export interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: { start?: Date; end?: Date }) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  label,
  placeholder = "DD/MM/AAAA - DD/MM/AAAA",
  disabled,
  error,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Formata o texto para exibir no Input
  const formattedValue = useMemo(() => {
    if (!startDate && !endDate) return '';
    
    const formatDate = (date?: Date) => {
      if (!date) return '___';
      return new Intl.DateTimeFormat('pt-BR').format(date);
    };

    if (startDate && !endDate) {
      return `${formatDate(startDate)} - Selecione o fim...`;
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }, [startDate, endDate]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onChange({ start: undefined, end: undefined });
  };

  // Lógica de seleção inteligente em 1 calendário
  const handleDateSelect = (date: Date) => {
    // 1. Começando do zero OU intervalo já completo -> Reinicia seleção
    if (!startDate || (startDate && endDate)) {
      onChange({ start: date, end: undefined });
      return;
    }

    // 2. Já tem início: verifica se a data clicada é anterior ou posterior
    if (date < startDate) {
      // Clicou antes do início atual -> Corrige o início
      onChange({ start: date, end: undefined });
    } else {
      // Clicou depois -> Define o fim e fecha
      onChange({ start: startDate, end: date });
      setOpen(false);
    }
  };

  const inputId = 'daterangepicker-input';
  
  // Define qual data mostrar ativa no calendário
  const calendarActiveDate = endDate || startDate;

  return (
    <div ref={containerRef} className="datepicker-container w-full relative">
      {/* Label Externo */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-[var(--text-primary)] mb-1"
        >
          {label}
        </label>
      )}

      {/* Wrapper do Input */}
      <div className="relative">
        <Input
          id={inputId}
          placeholder={placeholder}
          value={formattedValue}
          readOnly
          disabled={disabled}
          error={error}
          onClick={toggleOpen}
          className="pr-10 cursor-pointer" 
        />

        {/* Ícone de Calendário (Visível quando vazio) */}
        {!startDate && !endDate && (
           <div className="absolute right-3 bottom-3.5 text-gray-400 pointer-events-none">
             <CalendarDaysIcon className="h-5 w-5" />
           </div>
        )}
        
        {/* Botão Limpar (Visível quando tem data) */}
        {(startDate || endDate) && !disabled && (
          <button
            type="button"
            className="absolute right-2 bottom-2 h-9 w-9 flex items-center justify-center text-gray-400 hover:text-[var(--danger)] transition-colors z-20"
            onClick={handleClear}
            aria-label="Limpar datas"
          >
            <XMarkIcon className="h-5 w-5" strokeWidth={2} /> 
          </button>
        )}
      </div>

      {/* Popover com Tamanho Reduzido */}
      {open && !disabled && (
        <div 
          // --- AJUSTES DE TAMANHO AQUI ---
          // p-2: Menos espaçamento interno
          // w-fit: Largura ajustada ao conteúdo
          // scale-90: Reduz visualmente para 90% do tamanho
          // origin-top-left: Garante que encolha a partir do canto correto
          className="absolute z-50 mt-1 p-2 bg-[var(--bg-card)] shadow-xl rounded-lg border border-[var(--border-color)] w-fit origin-top-left scale-90"
        >
          
          {/* Título de Ajuda (Fonte menor) */}
          <div className="mb-2 text-center">
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {!startDate || (startDate && endDate) 
                ? "Selecione a Data Inicial" 
                : "Selecione a Data Final"}
            </span>
          </div>

          <Calendar
            value={calendarActiveDate}
            onChange={handleDateSelect}
          />
          
          {/* Feedback visual (Fonte menor) */}
          <div className="mt-2 flex justify-between text-[10px] text-[var(--text-muted)] border-t border-[var(--border-color)] pt-2">
            <span>Início: {startDate ? new Intl.DateTimeFormat('pt-BR').format(startDate) : '-'}</span>
            <span>Fim: {endDate ? new Intl.DateTimeFormat('pt-BR').format(endDate) : '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
};