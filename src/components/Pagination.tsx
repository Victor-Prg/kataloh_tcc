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
  const isDisabled = totalPages <= 0;

  const visiblePages = React.useMemo(() => {
    if (totalPages <= 0) {
      return [];
    }

    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages: number[] = [];

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

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
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-button${page === currentPage ? ' is-active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          disabled={isDisabled}
        >
          {page}
        </button>
      ))}
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
