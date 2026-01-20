import { useMemo, useState } from 'react';
import { MapPin, CheckCircle, Package, TrendingUp, AlertCircle, MessageCircle, Send, X } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

type OrderStatus = 'disponivel' | 'em_entrega' | 'entregue';

interface Order {
  id: string;
  cliente: string;
  endereco: string;
  valor: number;
  status: OrderStatus;
  data: string;
  hora: string;
  distancia?: string;
  observacoes?: string;
  empresa: string;
}

type ChatSender = 'entregador' | 'operacao';

type ChatDestino = 'loja' | 'cliente';

interface ChatMessage {
  id: string;
  remetente: ChatSender;
  texto: string;
  hora: string;
}

export default function DeliveryOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      cliente: 'João Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      valor: 54.9,
      status: 'disponivel',
      data: '16/12/2025',
      hora: '14:30',
      distancia: '2.5 km',
      observacoes: 'Entregar na portaria',
      empresa: 'Burger King',
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      endereco: 'Av. Principal, 456 - Jardim',
      valor: 89.5,
      status: 'disponivel',
      data: '16/12/2025',
      hora: '15:15',
      distancia: '1.8 km',
      empresa: 'Pizza Hut',
    },
    {
      id: '3',
      cliente: 'Pedro Costa',
      endereco: 'Rua do Comércio, 789 - Vila Nova',
      valor: 125.0,
      status: 'em_entrega',
      data: '16/12/2025',
      hora: '13:45',
      distancia: '3.2 km',
      observacoes: 'Apartamento 501',
      empresa: "McDonald's",
    },
    {
      id: '4',
      cliente: 'Ana Oliveira',
      endereco: 'Praça Central, 321 - Centro',
      valor: 78.0,
      status: 'entregue',
      data: '16/12/2025',
      hora: '12:20',
      distancia: '1.5 km',
      empresa: 'Subway',
    },
    {
      id: '5',
      cliente: 'Carlos Mendes',
      endereco: 'Rua das Palmeiras, 654 - Jardim Sul',
      valor: 95.8,
      status: 'disponivel',
      data: '16/12/2025',
      hora: '15:45',
      distancia: '4.1 km',
      empresa: 'KFC',
    },
  ]);
  const [chatTipo, setChatTipo] = useState<'nenhum' | 'geral' | 'pedido'>('nenhum');
  const [chatPedidoId, setChatPedidoId] = useState<string | null>(null);
  const [chatDestino, setChatDestino] = useState<ChatDestino | null>(null);
  const [pedidoParaEscolherDestino, setPedidoParaEscolherDestino] = useState<string | null>(null);
  const [mensagensGerais, setMensagensGerais] = useState<ChatMessage[]>([
    {
      id: '1',
      remetente: 'operacao',
      texto: 'Olá! Este é o chat geral do delivery.',
      hora: '09:00',
    },
    {
      id: '2',
      remetente: 'entregador',
      texto: 'Bom dia, já estou online para as entregas.',
      hora: '09:05',
    },
  ]);
  const [mensagensPorPedido, setMensagensPorPedido] = useState<Record<string, ChatMessage[]>>({});
  const [mensagemAtual, setMensagemAtual] = useState('');

  const sortedOrders = useMemo(
    () => {
      const statusOrder: Record<OrderStatus, number> = {
        disponivel: 0,
        em_entrega: 1,
        entregue: 2,
      };

      return [...orders].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );
    },
    [orders],
  );

  const ordersByStatus = useMemo(
    () => ({
      disponivel: orders.filter((order) => order.status === 'disponivel'),
      em_entrega: orders.filter((order) => order.status === 'em_entrega'),
      entregue: orders.filter((order) => order.status === 'entregue'),
    }),
    [orders],
  );

  const pedidoSelecionadoChat = useMemo(
    () => (chatPedidoId ? orders.find((order) => order.id === chatPedidoId) ?? null : null),
    [orders, chatPedidoId],
  );

  const pedidoParaDefinirDestino = useMemo(
    () =>
      pedidoParaEscolherDestino
        ? orders.find((order) => order.id === pedidoParaEscolherDestino) ?? null
        : null,
    [orders, pedidoParaEscolherDestino],
  );

  const mensagensChatAtual: ChatMessage[] =
    chatTipo === 'geral'
      ? mensagensGerais
      : chatTipo === 'pedido' && chatPedidoId
        ? mensagensPorPedido[chatPedidoId] ?? []
        : [];

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
  };

  const abrirChatGeral = () => {
    setChatTipo('geral');
    setChatPedidoId(null);
    setChatDestino(null);
    setPedidoParaEscolherDestino(null);
  };

  const escolherDestinoChatPedido = (pedidoId: string) => {
    setPedidoParaEscolherDestino(pedidoId);
  };

  const abrirChatPedido = (pedidoId: string, destino: ChatDestino) => {
    setChatTipo('pedido');
    setChatPedidoId(pedidoId);
    setChatDestino(destino);
    setPedidoParaEscolherDestino(null);
  };

  const fecharChat = () => {
    setChatTipo('nenhum');
    setChatPedidoId(null);
    setChatDestino(null);
    setMensagemAtual('');
    setPedidoParaEscolherDestino(null);
  };

  const handleEnviarMensagem = () => {
    if (chatTipo === 'nenhum') {
      return;
    }

    const texto = mensagemAtual.trim();
    if (!texto) {
      return;
    }

    const hora = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const novaMensagem: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      remetente: 'entregador',
      texto,
      hora,
    };

    if (chatTipo === 'geral') {
      setMensagensGerais((prev) => [...prev, novaMensagem]);
    } else if (chatTipo === 'pedido' && chatPedidoId) {
      setMensagensPorPedido((prev) => ({
        ...prev,
        [chatPedidoId]: [...(prev[chatPedidoId] ?? []), novaMensagem],
      }));
    }

    setMensagemAtual('');
  };

  const handleChatKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleEnviarMensagem();
    }
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'disponivel':
        return {
          label: 'Disponível',
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-100 dark:bg-purple-900/20',
          icon: Package,
        };
      case 'em_entrega':
        return {
          label: 'Em Rota',
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          icon: TrendingUp,
        };
      case 'entregue':
        return {
          label: 'Entregue',
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-100 dark:bg-green-900/20',
          icon: CheckCircle,
        };
    }
  };

  const tituloChat =
    chatTipo === 'geral'
      ? 'Chat geral'
      : chatTipo === 'pedido' && pedidoSelecionadoChat
        ? `Pedido ${pedidoSelecionadoChat.id} - ${pedidoSelecionadoChat.cliente}`
        : 'Chat';

  const subtituloChat =
    chatTipo === 'geral'
      ? 'Converse com a central do delivery'
      : chatTipo === 'pedido' && chatDestino === 'loja'
        ? 'Converse com a loja sobre este pedido'
        : chatTipo === 'pedido' && chatDestino === 'cliente'
          ? 'Converse com o cliente sobre a entrega'
          : 'Converse sobre este pedido em rota';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[var(--text-primary)] mb-2">
          Pedidos
        </h1>
        <p className="text-[20px] leading-[24px] text-[var(--text-secondary)]">
          Aceite pedidos e comece a entregar
        </p>
      </div>

      <div className="space-y-4 md:hidden">
        {sortedOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="font-semibold text-[var(--text-secondary)]">Nenhum pedido encontrado</p>
          </Card>
        ) : (
          sortedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={order.id}
                className={`p-5 transition-all ${
                  order.status === 'em_entrega'
                    ? 'border-2 border-blue-400 dark:border-blue-600 shadow-lg'
                    : order.status === 'entregue'
                    ? 'opacity-75'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] rounded-lg flex items-center justify-center text-white font-bold">
                      {order.empresa.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{order.cliente}</h3>
                      <p className="text-xs text-[var(--primary-100)] font-semibold">{order.empresa}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {order.data} às {order.hora}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1.5`}
                  >
                    {order.status === 'em_entrega' && (
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                    )}
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </span>
                </div>

                <div className="p-3 bg-[var(--surface-nav)] rounded-lg mb-3">
                  <p className="text-sm text-[var(--text-secondary)] mb-2 flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{order.endereco}</span>
                  </p>
                  {order.distancia && (
                    <p
                      className={`text-xs font-semibold flex items-center gap-1.5 ${
                        order.status === 'entregue'
                          ? 'text-green-600 dark:text-green-400'
                          : order.status === 'em_entrega'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-[var(--primary-100)]'
                      }`}
                    >
                      <TrendingUp size={14} />
                      {order.status === 'entregue' ? `Entregue • ${order.distancia}` : `${order.distancia} de distância`}
                    </p>
                  )}
                </div>

                {order.observacoes && (
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg mb-3">
                    <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Obs:</strong> {order.observacoes}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center gap-3">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {order.valor.toFixed(2)}
                  </span>

                  {order.status === 'disponivel' && (
                    <Button onClick={() => updateOrderStatus(order.id, 'em_entrega')} icon={<CheckCircle size={16} />}>
                      Aceitar
                    </Button>
                  )}

                  {order.status === 'em_entrega' && (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => updateOrderStatus(order.id, 'entregue')}
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                        icon={<CheckCircle size={16} />}
                      >
                        Marcar Entregue
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => escolherDestinoChatPedido(order.id)}
                        icon={<MessageCircle size={16} />}
                      >
                        Chat
                      </Button>
                    </div>
                  )}

                  {order.status === 'entregue' && (
                    <div className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-semibold flex items-center gap-2">
                      <CheckCircle size={16} />
                      Completo
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-4 hidden md:block">
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="font-semibold text-[var(--text-secondary)]">Nenhum pedido encontrado</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {(['disponivel', 'em_entrega', 'entregue'] as OrderStatus[]).map((status) => {
              const statusOrders = ordersByStatus[status];
              const statusConfig = getStatusConfig(status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={status}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col"
                >
                  <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${statusConfig.color}`}>
                      <StatusIcon size={18} />
                      <span className="font-semibold text-sm">{statusConfig.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">
                      {statusOrders.length}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 min-h-[260px]">
                    {statusOrders.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)]">Nenhum pedido</p>
                    ) : (
                      statusOrders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-xl border border-[var(--border)] bg-[var(--surface-nav)] px-4 py-5 flex flex-col gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-90)] rounded-lg flex items-center justify-center text-white font-bold">
                              {order.empresa.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                                {order.cliente}
                              </h3>
                              <p className="text-xs text-[var(--primary-100)] font-semibold">
                                {order.empresa}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {order.data} às {order.hora}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{order.endereco}</span>
                          </p>
                          {order.observacoes && (
                            <p className="text-xs text-amber-400 flex items-start gap-2">
                              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                              <span>{order.observacoes}</span>
                            </p>
                          )}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-base font-bold text-green-500">
                              R$ {order.valor.toFixed(2)}
                            </span>
                            {order.status === 'disponivel' && (
                              <Button
                                onClick={() => updateOrderStatus(order.id, 'em_entrega')}
                                icon={<CheckCircle size={16} />}
                              >
                                Aceitar
                              </Button>
                            )}
                            {order.status === 'em_entrega' && (
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => updateOrderStatus(order.id, 'entregue')}
                                  className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                                  icon={<CheckCircle size={16} />}
                                >
                                  Marcar Entregue
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => escolherDestinoChatPedido(order.id)}
                                  icon={<MessageCircle size={14} />}
                                >
                                  Chat
                                </Button>
                              </div>
                            )}
                            {order.status === 'entregue' && (
                              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                                <CheckCircle size={16} />
                                Completo
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 shadow-lg"
        icon={<MessageCircle size={18} />}
        onClick={abrirChatGeral}
      >
        Chat geral
      </Button>

      {pedidoParaDefinirDestino && chatTipo === 'nenhum' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm px-4">
            <div className="bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)] p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Escolher chat do pedido
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Selecione com quem você quer falar sobre este pedido em rota.
                </p>
              </div>

              <div className="rounded-lg bg-[var(--surface-nav)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                <p className="font-medium text-[var(--text-primary)]">
                  Pedido {pedidoParaDefinirDestino.id} • {pedidoParaDefinirDestino.cliente}
                </p>
                <p className="mt-1">
                  {pedidoParaDefinirDestino.endereco}
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  icon={<MessageCircle size={16} />}
                  onClick={() => abrirChatPedido(pedidoParaDefinirDestino.id, 'loja')}
                >
                  Abrir chat com a loja
                </Button>
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                  icon={<MessageCircle size={16} />}
                  onClick={() => abrirChatPedido(pedidoParaDefinirDestino.id, 'cliente')}
                >
                  Abrir chat com o cliente
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setPedidoParaEscolherDestino(null)}
                className="w-full text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mt-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {chatTipo !== 'nenhum' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:justify-center bg-black/40">
          <div className="w-full sm:max-w-md md:max-w-lg px-3 pb-3 sm:px-0 sm:pb-0">
            <div className="bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-[var(--border)] flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-100)] text-white">
                    <MessageCircle size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {tituloChat}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {subtituloChat}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fecharChat}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-body)]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[var(--bg-body)]">
                {mensagensChatAtual.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="max-w-[240px] text-center text-xs text-[var(--text-secondary)]">
                      Nenhuma mensagem ainda. Envie uma mensagem para iniciar a conversa.
                    </p>
                  </div>
                )}

                {mensagensChatAtual.map((mensagem) => {
                  const alinhamento =
                    mensagem.remetente === 'entregador' ? 'justify-end' : 'justify-start';
                  const bubbleClasses =
                    mensagem.remetente === 'entregador'
                      ? 'bg-[var(--primary-100)] text-white rounded-[12px] rounded-br-sm'
                      : 'bg-[var(--surface-nav)] text-[var(--text-primary)] border border-[var(--border)] rounded-[12px] rounded-bl-sm';

                  return (
                    <div key={mensagem.id} className={`flex ${alinhamento}`}>
                      <div className={`max-w-[80%] px-3 py-2 text-xs ${bubbleClasses}`}>
                        <p className="whitespace-pre-wrap break-words">{mensagem.texto}</p>
                        <span className="mt-1 inline-block text-[10px] opacity-80">
                          {mensagem.hora}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleEnviarMensagem();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={mensagemAtual}
                    onChange={(event) => setMensagemAtual(event.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder={
                      chatTipo === 'geral'
                        ? 'Digite uma mensagem para a central'
                        : 'Digite uma mensagem sobre este pedido'
                    }
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                  />
                  <button
                    type="submit"
                    disabled={!mensagemAtual.trim()}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
