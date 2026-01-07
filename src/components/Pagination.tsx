import React from 'react';
import '../assets/Pagination.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast,
  className,
  ...props
}: PaginationProps) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrev = () => {
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (canGoPrev) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (canGoNext) {
      onPageChange(totalPages);
    }
  };

  const isDisabled = totalPages <= 0;

  return (
    <nav
      className={`pagination-root ${className || ''}`}
      aria-label="Paginação"
      {...props}
    >
      {showFirstLast && (
        <button
          type="button"
          className="pagination-button"
          onClick={handleFirst}
          disabled={!canGoPrev || isDisabled}
          aria-label="Primeira página"
        >
          Primeira
        </button>
      )}
      <button
        type="button"
        className="pagination-button"
        onClick={handlePrev}
        disabled={!canGoPrev || isDisabled}
        aria-label="Página anterior"
      >
        Anterior
      </button>
      <span className="pagination-info">
        Página {Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1))} de {Math.max(totalPages, 1)}
      </span>
      <button
        type="button"
        className="pagination-button"
        onClick={handleNext}
        disabled={!canGoNext || isDisabled}
        aria-label="Próxima página"
      >
        Próximo
      </button>
      {showFirstLast && (
        <button
          type="button"
          className="pagination-button"
          onClick={handleLast}
          disabled={!canGoNext || isDisabled}
          aria-label="Última página"
        >
          Última
        </button>
      )}
    </nav>
  );
};
