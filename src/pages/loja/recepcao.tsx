import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  AlertCircle,
  Plus,
  X,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

type StatusPedido = 'pendente' | 'preparacao' | 'rota' | 'entregue'

type Pedido = {
  id: string
  cliente: string
  endereco: string
  observacao?: string
  valor: number
  status: StatusPedido
  criadoEm: string
}

const pedidosMock: Pedido[] = [
  {
    id: 'PED-001',
    cliente: 'João Silva',
    endereco: 'Rua das Flores, 123 - Centro',
    observacao: 'Entregar na portaria',
    valor: 54.9,
    status: 'pendente',
    criadoEm: '16/12/2025 às 14:30',
  },
  {
    id: 'PED-004',
    cliente: 'Ana Paula',
    endereco: 'Rua Horizonte, 321 - Bela Vista',
    observacao: 'Apartamento 502',
    valor: 67.8,
    status: 'pendente',
    criadoEm: '16/12/2025 às 14:45',
  },
  {
    id: 'PED-002',
    cliente: 'Maria Santos',
    endereco: 'Av. Principal, 456 - Jardim',
    valor: 89.5,
    status: 'preparacao',
    criadoEm: '16/12/2025 às 15:15',
  },
  {
    id: 'PED-005',
    cliente: 'Carlos Eduardo',
    endereco: 'Rua São José, 890 - Centro',
    valor: 45.0,
    status: 'preparacao',
    criadoEm: '16/12/2025 às 15:20',
  },
  {
    id: 'PED-003',
    cliente: 'Pedro Costa',
    endereco: 'Rua do Comércio, 789 - Vila Nova',
    observacao: 'Entregar para Ana Souza',
    valor: 125,
    status: 'rota',
    criadoEm: '16/12/2025 às 15:45',
  },
  {
    id: 'PED-006',
    cliente: 'Juliana Mendes',
    endereco: 'Av. Brasil, 234 - Jardim América',
    valor: 78.9,
    status: 'entregue',
    criadoEm: '16/12/2025 às 13:00',
  },
  {
    id: 'PED-007',
    cliente: 'Roberto Lima',
    endereco: 'Rua das Acácias, 567 - Vila Rosa',
    valor: 92.5,
    status: 'entregue',
    criadoEm: '16/12/2025 às 13:30',
  },
]

const statusConfig: Record<
  StatusPedido,
  { 
    titulo: string
    badge: string
    icon: React.ElementType
    colorLight: string
    bgColorLight: string
    borderColorLight: string
    colorDark: string
    bgColorDark: string
    borderColorDark: string
  }
> = {
  pendente: {
    titulo: 'Aguardando',
    badge: 'Pendente',
    icon: Clock,
    colorLight: '#f59e0b',
    bgColorLight: '#fef3c7',
    borderColorLight: '#fcd34d',
    colorDark: '#fbbf24',
    bgColorDark: '#78350f',
    borderColorDark: '#f59e0b',
  },
  preparacao: {
    titulo: 'Em Preparo',
    badge: 'Preparando',
    icon: ChefHat,
    colorLight: '#3b82f6',
    bgColorLight: '#dbeafe',
    borderColorLight: '#93c5fd',
    colorDark: '#60a5fa',
    bgColorDark: '#1e3a8a',
    borderColorDark: '#3b82f6',
  },
  rota: {
    titulo: 'Em Entrega',
    badge: 'Em Rota',
    icon: Truck,
    colorLight: '#8b5cf6',
    bgColorLight: '#ede9fe',
    borderColorLight: '#c4b5fd',
    colorDark: '#a78bfa',
    bgColorDark: '#4c1d95',
    borderColorDark: '#8b5cf6',
  },
  entregue: {
    titulo: 'Entregues',
    badge: 'Concluído',
    icon: CheckCircle2,
    colorLight: '#10b981',
    bgColorLight: '#d1fae5',
    borderColorLight: '#6ee7b7',
    colorDark: '#34d399',
    bgColorDark: '#064e3b',
    borderColorDark: '#10b981',
  },
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function RecepcaoLoja() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock)
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
  const [pedidoArrastando, setPedidoArrastando] = useState<string | null>(null)
  const [colunaHover, setColunaHover] = useState<StatusPedido | null>(null)

  const pedidosPorStatus = useMemo(
    () => ({
      pendente: pedidos.filter(pedido => pedido.status === 'pendente'),
      preparacao: pedidos.filter(pedido => pedido.status === 'preparacao'),
      rota: pedidos.filter(pedido => pedido.status === 'rota'),
      entregue: pedidos.filter(pedido => pedido.status === 'entregue'),
    }),
    [pedidos],
  )

  const totalPedidos = pedidos.length
  const totalPendentes = pedidosPorStatus.pendente.length
  const totalEmPreparo = pedidosPorStatus.preparacao.length
  const totalEmRota = pedidosPorStatus.rota.length
  const totalEntregues = pedidosPorStatus.entregue.length
  
  const valorTotal = useMemo(
    () => pedidos.reduce((acc, p) => acc + p.valor, 0),
    [pedidos]
  )

  const handleAvancarStatus = (pedidoId: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        if (p.status === 'pendente') return { ...p, status: 'preparacao' }
        if (p.status === 'preparacao') return { ...p, status: 'rota' }
        if (p.status === 'rota') return { ...p, status: 'entregue' }
      }
      return p
    }))
  }

  const handleCancelarPedido = (pedidoId: string) => {
    if (confirm('Deseja realmente cancelar este pedido?')) {
      setPedidos(prev => prev.filter(p => p.id !== pedidoId))
    }
  }

  const handleDragStart = (e: React.DragEvent, pedidoId: string) => {
    setPedidoArrastando(pedidoId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('pedidoId', pedidoId)
    
    // Adiciona um efeito visual ao elemento arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setPedidoArrastando(null)
    setColunaHover(null)
    
    // Remove o efeito visual
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
  }

  const handleDragOver = (e: React.DragEvent, status: StatusPedido) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setColunaHover(status)
  }

  const handleDragLeave = () => {
    setColunaHover(null)
  }

  const handleDrop = (e: React.DragEvent, novoStatus: StatusPedido) => {
    e.preventDefault()
    const pedidoId = e.dataTransfer.getData('pedidoId')
    
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        // Permite mover para qualquer status
        return { ...p, status: novoStatus }
      }
      return p
    }))
    
    setPedidoArrastando(null)
    setColunaHover(null)
  }

  const handleMoverStatus = (pedidoId: string, direcao: 'anterior' | 'proximo') => {
    const statusFlow: StatusPedido[] = ['pendente', 'preparacao', 'rota', 'entregue']
    
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        const currentIndex = statusFlow.indexOf(p.status)
        let newIndex = currentIndex
        
        if (direcao === 'anterior' && currentIndex > 0) {
          newIndex = currentIndex - 1
        } else if (direcao === 'proximo' && currentIndex < statusFlow.length - 1) {
          newIndex = currentIndex + 1
        }
        
        return { ...p, status: statusFlow[newIndex] }
      }
      return p
    }))
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Recepção de Pedidos
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Acompanhe e gerencie todos os pedidos em tempo real
            </p>
          </div>
          
          <button
            onClick={() => navigate('/loja/newpedido')}
            className="inline-flex items-center gap-2 bg-[var(--primary-100)] hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-lg transition-all"
          >
            <Plus size={20} />
            <span>Novo Pedido</span>
          </button>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Aguardando
              </h3>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalPendentes}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Novos pedidos</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChefHat size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Em Preparo
              </h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalEmPreparo}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Na cozinha</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Truck size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Em Entrega
              </h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalEmRota}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">A caminho</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Concluídos
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalEntregues}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Hoje</p>
          </div>
        </div>

        {/* RESUMO */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Total de pedidos:</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">{totalPedidos}</span>
            </div>
            <div className="h-6 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Faturamento:</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(valorTotal)}</span>
            </div>
          </div>
        </div>

        {/* KANBAN DE PEDIDOS */}
        <div className="grid gap-4 lg:grid-cols-4">
          {(Object.keys(statusConfig) as StatusPedido[]).map(status => {
            const lista = pedidosPorStatus[status]
            const config = statusConfig[status]
            const Icon = config.icon

            return (
              <div key={status} className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]">
                {/* HEADER DA COLUNA */}
                <style>{`
                  .kanban-header-${status} {
                    background-color: ${config.bgColorLight};
                    border-bottom: 3px solid ${config.borderColorLight};
                  }
                  .kanban-header-${status} .kanban-icon {
                    color: ${config.colorLight};
                  }
                  .kanban-header-${status} .kanban-badge {
                    background-color: ${config.colorLight};
                    color: white;
                  }
                  @media (prefers-color-scheme: dark) {
                    .kanban-header-${status} {
                      background-color: ${config.bgColorDark};
                      border-bottom: 3px solid ${config.borderColorDark};
                    }
                    .kanban-header-${status} .kanban-icon {
                      color: ${config.colorDark};
                    }
                    .kanban-header-${status} .kanban-badge {
                      background-color: ${config.colorDark};
                      color: white;
                    }
                  }
                `}</style>
                <div className={`kanban-header-${status} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={20} className="kanban-icon" />
                      <h3 className="font-bold text-white">
                        {config.titulo}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full kanban-badge">
                      {lista.length}
                    </span>
                  </div>
                </div>

                {/* LISTA DE PEDIDOS */}
                <div 
                  className={`flex-1 bg-[var(--surface)] p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto transition-all ${
                    colunaHover === status ? 'ring-2 ring-[var(--primary-100)] ring-inset' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {lista.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon size={40} className="text-[var(--text-muted)] opacity-30 mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">
                        {colunaHover === status ? 'Solte aqui' : 'Nenhum pedido'}
                      </p>
                    </div>
                  ) : (
                    lista.map(pedido => (
                      <div
                        key={pedido.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, pedido.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-3 hover:shadow-md transition-all cursor-move ${
                          pedidoArrastando === pedido.id ? 'opacity-50 scale-95' : ''
                        }`}
                        onClick={() => setPedidoSelecionado(pedido)}
                      >
                        {/* HEADER DO CARD */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                              {pedido.cliente}
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                              <Clock size={12} />
                              {pedido.criadoEm}
                            </p>
                          </div>
                          <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                            {pedido.id}
                          </span>
                        </div>

                        {/* ENDEREÇO */}
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin size={14} className="text-[var(--text-secondary)] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                            {pedido.endereco}
                          </p>
                        </div>

                        {/* OBSERVAÇÃO */}
                        {pedido.observacao && (
                          <div className="flex items-start gap-2 mb-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                            <AlertCircle size={14} className="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-300">
                              {pedido.observacao}
                            </p>
                          </div>
                        )}

                        {/* FOOTER */}
                        <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(pedido.valor)}
                            </span>
                            
                            {/* Botões Desktop - Ocultos no mobile */}
                            <div className="hidden md:flex gap-1">
                              {status === 'pendente' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAvancarStatus(pedido.id)
                                    }}
                                    className="text-xs bg-[var(--primary-100)] hover:opacity-90 text-white font-medium px-3 py-1.5 rounded"
                                  >
                                    Iniciar
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCancelarPedido(pedido.id)
                                    }}
                                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1.5 rounded"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              )}
                              
                              {status === 'preparacao' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAvancarStatus(pedido.id)
                                  }}
                                  className="text-xs bg-[var(--primary-100)] hover:opacity-90 text-white font-medium px-3 py-1.5 rounded"
                                >
                                  Enviar
                                </button>
                              )}
                              
                              {status === 'rota' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAvancarStatus(pedido.id)
                                  }}
                                  className="text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded"
                                >
                                  Concluir
                                </button>
                              )}

                              {status === 'entregue' && (
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 size={14} />
                                  Entregue
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Botões Mobile - Navegação de Status */}
                          <div className="flex md:hidden gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoverStatus(pedido.id, 'anterior')
                              }}
                              disabled={status === 'pendente'}
                              className="flex-1 flex items-center justify-center gap-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded text-xs"
                            >
                              <ChevronLeft size={16} />
                              Voltar
                            </button>
                            
                            {status === 'pendente' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelarPedido(pedido.id)
                                }}
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded text-xs"
                              >
                                <X size={16} />
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoverStatus(pedido.id, 'proximo')
                              }}
                              disabled={status === 'entregue'}
                              className="flex-1 flex items-center justify-center gap-1 bg-[var(--primary-100)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded text-xs"
                            >
                              Avançar
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL DE DETALHES DO PEDIDO */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Detalhes do Pedido
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {pedidoSelecionado.id}
                </p>
              </div>
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Cliente</label>
                <p className="text-base font-semibold text-[var(--text-primary)] mt-1">{pedidoSelecionado.cliente}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Endereço de Entrega</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{pedidoSelecionado.endereco}</p>
              </div>

              {pedidoSelecionado.observacao && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Observações</label>
                  <p className="text-sm text-[var(--text-primary)] bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-1">
                    {pedidoSelecionado.observacao}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Status</label>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 flex items-center gap-2">
                    {React.createElement(statusConfig[pedidoSelecionado.status].icon, { 
                      size: 16,
                      className: 'text-[var(--primary-100)]'
                    })}
                    {statusConfig[pedidoSelecionado.status].titulo}
                  </p>
                </div>
                <div className="text-right">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Valor Total</label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(pedidoSelecionado.valor)}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Criado em</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{pedidoSelecionado.criadoEm}</p>
              </div>
            </div>

            <button
              onClick={() => setPedidoSelecionado(null)}
              className="w-full bg-[var(--primary-100)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

