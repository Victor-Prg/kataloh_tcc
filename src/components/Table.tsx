import React from 'react';
import '../assets/Table.css';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface TableColumn<T> {
  key: string;
  header: string;
  renderCell: (row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns,
  data,
  loading,
  emptyTitle = 'Nenhum dado encontrado',
  emptyDescription = 'Quando houver registros, eles aparecerão aqui.',
  className,
  rowKey,
  onRowClick,
  ...props
}: TableProps<T>) {
  const hasData = data.length > 0;

  return (
    <div className="table-wrapper">
      <table
        className={`table ${className || ''}`}
        aria-busy={loading || undefined}
        {...props}
      >
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} style={column.width ? { width: column.width } : undefined} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            !hasData &&
            Array.from({ length: 3 }).map((_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`}>
                {columns.map(column => (
                  <td key={column.key}>
                    <Skeleton variant="text" width="80%" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading &&
            hasData &&
            data.map((row, rowIndex) => {
              const key = rowKey ? rowKey(row, rowIndex) : rowIndex;
              const clickable = !!onRowClick;

              return (
                <tr
                  key={key}
                  className={clickable ? 'table-row-clickable' : undefined}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                >
                  {columns.map(column => (
                    <td key={column.key}>{column.renderCell(row)}</td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      {!loading && !hasData && (
        <div className="table-empty">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}
