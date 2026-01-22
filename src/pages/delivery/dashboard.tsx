import { useMemo, useState } from 'react';
import { Store, Users, Package, TrendingUp } from 'lucide-react';
import { Card } from '../../components';

interface Pedido {
  id: string;
  loja: string;
  entregador?: string;
  valor: number;
  status: 'disponivel' | 'em_entrega' | 'entregue';
  data: string;
}

const statusOrder: Record<Pedido['status'], number> = {
  disponivel: 1,
  em_entrega: 2,
  entregue: 3,
};

export default function DeliveryDashboard() {
  const [pedidos] = useState<Pedido[]>([
    { id: '1', loja: 'Burger King', valor: 54.9, status: 'disponivel', data: '16/12/2025' },
    { id: '2', loja: 'Pizza Hut', valor: 89.5, status: 'disponivel', data: '16/12/2025' },
    { id: '3', loja: "McDonald's", entregador: 'Carlos Mendes', valor: 125.0, status: 'em_entrega', data: '16/12/2025' },
    { id: '4', loja: 'Subway', entregador: 'Ana Souza', valor: 78.0, status: 'entregue', data: '16/12/2025' },
    { id: '5', loja: 'KFC', valor: 95.8, status: 'disponivel', data: '16/12/2025' },
  ]);

  // Simulação de dados de entregadores
  const entregadoresLivres = 2;
  const entregadoresEmRota = 1;
  const totalGanhos = 7450.0;
  const pedidosDisponiveis = pedidos.filter((p) => p.status === 'disponivel').length;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<'id' | 'loja' | 'entregador' | 'status' | 'valor'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleChangeSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  const pedidosOrdenados = useMemo(() => {
    const valueForSort = (row: Pedido) => {
      switch (sortKey) {
        case 'id':
          return Number(row.id);
        case 'loja':
          return row.loja;
        case 'entregador':
          return row.entregador || '';
        case 'status':
          return statusOrder[row.status];
        case 'valor':
          return row.valor;
      }
    };

    const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

    return [...pedidos].sort((a, b) => {
      const av = valueForSort(a);
      const bv = valueForSort(b);
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * direction;
      }

      return collator.compare(String(av), String(bv)) * direction;
    });
  }, [pedidos, sortDirection, sortKey]);

  const totalRegistros = pedidosOrdenados.length;
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / pageSize));
  const paginaAtualCorrigida = Math.min(Math.max(page, 1), totalPaginas);
  const startIndex = (paginaAtualCorrigida - 1) * pageSize;
  const pedidosPaginados = pedidosOrdenados.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[24px] sm:text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
            Delivery Dashboard
          </h1>
          <p className="mt-1 text-[20px] leading-[24px] text-[var(--text-primary)]">
            Visão geral do sistema de entregas
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Entregadores Livres</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{entregadoresLivres}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Package size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Em Rota</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{entregadoresEmRota}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Total de Ganhos</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {totalGanhos.toFixed(2)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Store size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Pedidos Disponíveis</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{pedidosDisponiveis}</p>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pedidos Recentes</h2>
          </div>

          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3 text-xs text-[color:var(--text-primary)]">
            <p>
              {totalRegistros === 0
                ? 'Nenhum pedido encontrado'
                : totalRegistros === 1
                  ? 'Mostrando 1 de 1 pedido'
                  : `Mostrando ${startIndex + 1}–${
                      startIndex + pedidosPaginados.length
                    } de ${totalRegistros} pedidos`}
            </p>
          </div>

          <div className="block sm:hidden">
            <div className="divide-y divide-[var(--border)]">
              {pedidosPaginados.map((pedido) => (
                <div key={pedido.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                      ID • Loja
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        #{pedido.id}
                      </span>
                      <span className="text-sm text-[var(--text-primary)]">{pedido.loja}</span>
                    </div>
                    <span className="mt-1 text-[11px] text-[var(--text-secondary)]">
                      Entregador:{' '}
                      <span className="font-medium">
                        {pedido.entregador || 'Não atribuído'}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full ${
                        pedido.status === 'disponivel'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : pedido.status === 'em_entrega'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                    >
                      {pedido.status === 'disponivel'
                        ? 'Disponível'
                        : pedido.status === 'em_entrega'
                        ? 'Em Entrega'
                        : 'Entregue'}
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      R$ {pedido.valor.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-[color:var(--border)] text-sm">
              <thead className="bg-[color:var(--surface-nav)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    <button
                      type="button"
                      onClick={() => handleChangeSort('id')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>ID</span>
                      {sortKey === 'id' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
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
                      onClick={() => handleChangeSort('status')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Status</span>
                      {sortKey === 'status' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
                    <button
                      type="button"
                      onClick={() => handleChangeSort('valor')}
                      className="inline-flex items-center gap-1 hover:text-[color:var(--text-primary)]"
                    >
                      <span>Valor</span>
                      {sortKey === 'valor' && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--border)]">
                {totalRegistros === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-xs text-[color:var(--text-primary)]"
                    >
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                ) : (
                  pedidosPaginados.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="hover:bg-[color:var(--bg-hover)] transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                      #{pedido.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      <div className="text-sm font-medium text-[color:var(--text-primary)]">
                        {pedido.loja}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top text-sm text-[color:var(--text-primary)]">
                      {pedido.entregador || 'Não atribuído'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          pedido.status === 'disponivel'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : pedido.status === 'em_entrega'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}
                      >
                        {pedido.status === 'disponivel'
                          ? 'Disponível'
                          : pedido.status === 'em_entrega'
                            ? 'Em Entrega'
                            : 'Entregue'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right align-top">
                      <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        R$ {pedido.valor.toFixed(2)}
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
