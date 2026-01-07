import { useMemo, useState } from 'react';
import '../assets/Calendar.css';

export interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  initialMonth?: Date;
  className?: string;
}

export const Calendar = ({
  value,
  defaultValue,
  onChange,
  initialMonth,
  className,
}: CalendarProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);

  const selectedDate = isControlled ? value : internalValue;

  const today = useMemo(() => new Date(), []);

  const initialVisible = useMemo(() => {
    if (initialMonth) {
      return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
    }
    if (selectedDate) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [initialMonth, selectedDate, today]);

  const [visibleMonth, setVisibleMonth] = useState(initialVisible);

  const handleSelectDate = (day: number) => {
    const nextDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);

    if (!isControlled) {
      setInternalValue(nextDate);
    }

    if (onChange) {
      onChange(nextDate);
    }
  };

  const goToMonth = (offset: number) => {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const goToYear = (offset: number) => {
    setVisibleMonth(current => new Date(current.getFullYear() + offset, current.getMonth(), 1));
  };

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<number | null> = [];

  for (let i = 0; i < startWeekday; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const isSameDay = (a: Date | undefined, b: Date) => {
    if (!a) {
      return false;
    }

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  return (
    <div
      className={`calendar-root ${className || ''}`}
    >
      <div className="calendar-header">
        <div className="calendar-nav-group">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => goToYear(-1)}
            aria-label="Ano anterior"
          >
            «
          </button>
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => goToMonth(-1)}
            aria-label="Mês anterior"
          >
            ‹
          </button>
        </div>

        <div className="calendar-current">
          {monthNames[month]} {year}
        </div>

        <div className="calendar-nav-group">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => goToMonth(1)}
            aria-label="Próximo mês"
          >
            ›
          </button>
          <button
            type="button"
            className="calendar-nav-button"
            onClick={() => goToYear(1)}
            aria-label="Próximo ano"
          >
            »
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {weekdayLabels.map(weekday => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>

      <div className="calendar-grid" role="grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-cell-empty" />;
          }

          const date = new Date(year, month, day);
          const isSelected = isSameDay(selectedDate, date);
          const isToday = isSameDay(today, date);

          return (
            <button
              key={day}
              type="button"
              className={`calendar-cell ${isToday ? 'calendar-cell-today' : ''} ${
                isSelected ? 'calendar-cell-selected' : ''
              }`}
              onClick={() => handleSelectDate(day)}
              aria-pressed={isSelected}
              aria-label={date.toLocaleDateString('pt-BR')}
              role="gridcell"
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
