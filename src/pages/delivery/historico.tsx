import { useState, useMemo } from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { Card } from '../../components/Card';

interface Entrega {
  id: string;
  entregador: string;
  loja: string;
  valor: number;
  data: string;
  hora: string;
  endereco: string;
  distancia: string;
}

export default function DeliveryHistorico() {
  const [periodoFiltro, setPeriodoFiltro] = useState<'hoje' | '7dias' | '30dias' | 'todos'>('7dias');
  const [entregadorFiltro, setEntregadorFiltro] = useState<string>('todos');
  const [buscaFiltro, setBuscaFiltro] = useState('');

  const [entregas] = useState<Entrega[]>([
    { id: '1', entregador: 'Carlos Mendes', loja: 'Burger King', valor: 54.90, data: '14/01/2026', hora: '12:30', endereco: 'Rua das Flores, 123', distancia: '2.5 km' },
    { id: '2', entregador: 'Ana Souza', loja: 'Pizza Hut', valor: 89.50, data: '14/01/2026', hora: '13:15', endereco: 'Av. Principal, 456', distancia: '1.8 km' },
    { id: '3', entregador: 'Roberto Lima', loja: "McDonald's", valor: 125.00, data: '14/01/2026', hora: '14:20', endereco: 'Rua do Comércio, 789', distancia: '3.2 km' },
    { id: '4', entregador: 'Carlos Mendes', loja: 'Subway', valor: 78.00, data: '13/01/2026', hora: '11:45', endereco: 'Praça Central, 321', distancia: '1.5 km' },
    { id: '5', entregador: 'Ana Souza', loja: 'KFC', valor: 95.80, data: '13/01/2026', hora: '15:30', endereco: 'Rua das Palmeiras, 654', distancia: '4.1 km' },
    { id: '6', entregador: 'Roberto Lima', loja: 'Burger King', valor: 67.40, data: '13/01/2026', hora: '16:10', endereco: 'Av. Paulista, 1000', distancia: '2.8 km' },
    { id: '7', entregador: 'Carlos Mendes', loja: 'Pizza Hut', valor: 112.30, data: '12/01/2026', hora: '12:00', endereco: 'Rua Augusta, 500', distancia: '3.5 km' },
    { id: '8', entregador: 'Ana Souza', loja: "McDonald's", valor: 58.90, data: '12/01/2026', hora: '13:25', endereco: 'Av. Ipiranga, 200', distancia: '2.1 km' },
    { id: '9', entregador: 'Roberto Lima', loja: 'Subway', valor: 82.50, data: '12/01/2026', hora: '14:40', endereco: 'Rua da Consolação, 850', distancia: '3.7 km' },
    { id: '10', entregador: 'Carlos Mendes', loja: 'KFC', valor: 145.60, data: '11/01/2026', hora: '18:20', endereco: 'Av. Rebouças, 300', distancia: '5.2 km' },
    { id: '11', entregador: 'Ana Souza', loja: 'Burger King', valor: 73.20, data: '11/01/2026', hora: '19:15', endereco: 'Rua Haddock Lobo, 450', distancia: '2.9 km' },
    { id: '12', entregador: 'Roberto Lima', loja: 'Pizza Hut', valor: 98.70, data: '11/01/2026', hora: '20:05', endereco: 'Av. Faria Lima, 1500', distancia: '4.3 km' },
    { id: '13', entregador: 'Carlos Mendes', loja: "McDonald's", valor: 56.80, data: '10/01/2026', hora: '12:35', endereco: 'Rua Oscar Freire, 120', distancia: '1.6 km' },
    { id: '14', entregador: 'Ana Souza', loja: 'Subway', valor: 91.40, data: '10/01/2026', hora: '13:50', endereco: 'Av. Brigadeiro, 780', distancia: '3.0 km' },
    { id: '15', entregador: 'Roberto Lima', loja: 'KFC', valor: 105.30, data: '10/01/2026', hora: '15:25', endereco: 'Rua Pamplona, 560', distancia: '2.4 km' },
  ]);

  const entregadores = ['Carlos Mendes', 'Ana Souza', 'Roberto Lima'];

  const getDaysAgo = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const entregaDate = new Date(year, month - 1, day);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    entregaDate.setHours(0, 0, 0, 0);
    const diffTime = hoje.getTime() - entregaDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const entregasFiltradas = useMemo(() => {
    let filtered = [...entregas];

    if (periodoFiltro !== 'todos') {
      filtered = filtered.filter((entrega) => {
        const daysAgo = getDaysAgo(entrega.data);
        if (periodoFiltro === 'hoje') return daysAgo === 0;
        if (periodoFiltro === '7dias') return daysAgo <= 7;
        if (periodoFiltro === '30dias') return daysAgo <= 30;
        return true;
      });
    }

    if (entregadorFiltro !== 'todos') {
      filtered = filtered.filter((entrega) => entrega.entregador === entregadorFiltro);
    }

    if (buscaFiltro.trim()) {
      const busca = buscaFiltro.toLowerCase();
      filtered = filtered.filter(
        (entrega) =>
          entrega.loja.toLowerCase().includes(busca) ||
          entrega.endereco.toLowerCase().includes(busca)
      );
    }

    return filtered;
  }, [entregas, periodoFiltro, entregadorFiltro, buscaFiltro]);

  const metricasHistorico = useMemo(() => {
    const total = entregasFiltradas.reduce((sum, e) => sum + e.valor, 0);
    const quantidade = entregasFiltradas.length;
    const ticketMedio = quantidade > 0 ? total / quantidade : 0;
    
    return {
      totalEntregas: quantidade,
      valorTotal: total,
      ticketMedio,
    };
  }, [entregasFiltradas]);

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header com Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
              Histórico de Entregas
            </h1>
            <p className="mt-1 text-[20px] leading-[24px] text-[var(--text-primary)]">
              Acompanhe todas as entregas realizadas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            {/* Filtro de Período */}
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setPeriodoFiltro('hoje')}
                className={`px-3 py-1.5 text-xs font-medium rounded-[12px] border transition-colors ${
                  periodoFiltro === 'hoje'
                    ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                    : 'bg-[var(--surface-nav)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setPeriodoFiltro('7dias')}
                className={`px-3 py-1.5 text-xs font-medium rounded-[12px] border transition-colors ${
                  periodoFiltro === '7dias'
                    ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                    : 'bg-[var(--surface-nav)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                7 dias
              </button>
              <button
                type="button"
                onClick={() => setPeriodoFiltro('30dias')}
                className={`px-3 py-1.5 text-xs font-medium rounded-[12px] border transition-colors ${
                  periodoFiltro === '30dias'
                    ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                    : 'bg-[var(--surface-nav)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                30 dias
              </button>
              <button
                type="button"
                onClick={() => setPeriodoFiltro('todos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-[12px] border transition-colors ${
                  periodoFiltro === 'todos'
                    ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                    : 'bg-[var(--surface-nav)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                Todos
              </button>
            </div>

            {/* Filtro de Entregador */}
            <div className="relative">
              <select
                value={entregadorFiltro}
                onChange={(e) => setEntregadorFiltro(e.target.value)}
                className="appearance-none rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              >
                <option value="todos">Todos os entregadores</option>
                {entregadores.map((ent) => (
                  <option key={ent} value={ent}>
                    {ent}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[var(--text-primary)]">
                ▼
              </span>
            </div>

            {/* Busca */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar loja ou endereço..."
                value={buscaFiltro}
                onChange={(e) => setBuscaFiltro(e.target.value)}
                className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
              />
            </div>
          </div>
        </div>

        {/* Métricas do Histórico */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Package size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Total de Entregas</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {metricasHistorico.totalEntregas}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Valor Total</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {metricasHistorico.valorTotal.toFixed(2)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">Ticket Médio</h3>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              R$ {metricasHistorico.ticketMedio.toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Tabela de Entregas */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-nav)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Entregador
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Loja
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Distância
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {entregasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Package size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                      <p className="text-sm font-medium text-[var(--text-secondary)]">
                        Nenhuma entrega encontrada
                      </p>
                    </td>
                  </tr>
                ) : (
                  entregasFiltradas.map((entrega) => (
                    <tr
                      key={entrega.id}
                      className="hover:bg-[var(--surface-nav)] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {entrega.entregador.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {entrega.entregador}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--text-primary)] font-medium">
                          {entrega.loja}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--text-secondary)]">
                          {entrega.endereco}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {entrega.distancia}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-[var(--text-primary)]">
                          {entrega.data}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {entrega.hora}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          R$ {entrega.valor.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
