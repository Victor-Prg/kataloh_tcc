import { useState } from 'react';
import { Store, Users, Package, TrendingUp } from 'lucide-react';
import { Card } from '../../components/Card';

interface Pedido {
  id: string;
  loja: string;
  entregador?: string;
  valor: number;
  status: 'disponivel' | 'em_entrega' | 'entregue';
  data: string;
}

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

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
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

        {/* Pedidos Recentes */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pedidos Recentes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-nav)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Loja
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Entregador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[var(--surface-nav)] transition-colors">
                    <td className="px-4 py-3 text-sm text-[var(--text-primary)]">#{pedido.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{pedido.loja}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                      {pedido.entregador || 'Não atribuído'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
                    <td className="px-4 py-3 text-sm font-bold text-right text-green-600 dark:text-green-400">
                      R$ {pedido.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
