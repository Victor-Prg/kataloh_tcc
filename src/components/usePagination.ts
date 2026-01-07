import { useMemo, useState } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  pageSize: number;
  initialPage?: number;
}

export const usePagination = ({ totalItems, pageSize, initialPage = 1 }: UsePaginationOptions) => {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(totalItems / pageSize), 1),
    [totalItems, pageSize],
  );

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  };

  const goNext = () => {
    goToPage(page + 1);
  };

  const goPrev = () => {
    goToPage(page - 1);
  };

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return {
    page,
    pageSize,
    totalPages,
    canGoPrev,
    canGoNext,
    goToPage,
    goNext,
    goPrev,
  };
};

