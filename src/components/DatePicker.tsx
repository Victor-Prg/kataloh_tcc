import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { Calendar } from './Calendar';
import { Input } from './Input';
import '../assets/DatePicker.css';

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
    if (disabled) {
      return;
    }
    setOpen(prev => !prev);
  };

  const handleDateChange = (date: Date) => {
    if (!isControlled) {
      setInternalDate(date);
    }

    if (onChange) {
      onChange(date);
    }

    setOpen(false);
  };

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isControlled) {
      setInternalDate(undefined);
    }

    if (onChange) {
      onChange(undefined);
    }
  };

  const inputId = 'datepicker-input';

  return (
    <div
      ref={containerRef}
      className="datepicker-container"
    >
      <div className="datepicker-input-wrapper">
        <Input
          id={inputId}
          label={label}
          placeholder={placeholder}
          value={formattedValue}
          readOnly
          disabled={disabled}
          error={error}
          onClick={toggleOpen}
          aria-haspopup="dialog"
          aria-expanded={open || undefined}
        />
        {selectedDate && !disabled && (
          <button
            type="button"
            className="datepicker-clear"
            onClick={handleClear}
            aria-label="Limpar data"
          >
            ×
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
