import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { Calendar } from './Calendar';
import { Input } from './Input';
import '../assets/DatePicker.css';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Certifique-se que o import está correto

type DateFormat = 'DD/MM/YYYY' | 'YYYY-MM-DD';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  format?: DateFormat;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const DatePicker = ({
  value,
  defaultValue,
  onChange,
  format = 'DD/MM/YYYY',
  label,
  placeholder,
  disabled,
  error,
}: DatePickerProps) => {
  const isControlled = value !== undefined;
  const [internalDate, setInternalDate] = useState<Date | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedDate = isControlled ? value : internalDate;

  const formattedValue = useMemo(() => {
    if (!selectedDate) {
      return '';
    }
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();

    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    }
    return `${day}/${month}/${year}`;
  }, [selectedDate, format]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleDateChange = (date: Date) => {
    if (!isControlled) setInternalDate(date);
    if (onChange) onChange(date);
    setOpen(false);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isControlled) setInternalDate(undefined);
    if (onChange) onChange(undefined);
  };

  const inputId = 'datepicker-input';

  return (
    <div
      ref={containerRef}
      className="datepicker-container"
    >
      <div className="datepicker-input-wrapper relative">
        <Input
          id={inputId}
          label={label} // Mantivemos o label dentro do Input como você queria
          placeholder={placeholder}
          value={formattedValue}
          readOnly
          disabled={disabled}
          error={error}
          onClick={toggleOpen}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
          // Adicionei pr-10 para o texto da data não ficar embaixo do X
          className="pr-9 cursor-pointer" 
        />
        
        {selectedDate && !disabled && (
          <button
            type="button"
            // MUDANÇA AQUI:
            // 1. Usamos 'bottom-1.5' (ou bottom-2) para alinhar com a base do input
            // 2. Removemos 'top-1/2' e '-translate-y-1/2'
            // 3. Isso garante que o Label em cima não empurre o X para o lugar errado
            className="datepicker-clear absolute right-3 bottom-2 p-1 text-gray-400 hover:text-[var(--danger)] transition-colors z-10"
            onClick={handleClear}
            aria-label="Limpar data"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={3} /> 
          </button>
        )}
      </div>

      {open && !disabled && (
        <div
          className="datepicker-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={inputId}
        >
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      )}
    </div>
  );
};