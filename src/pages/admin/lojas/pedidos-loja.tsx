import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  EyeIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CreditCardIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { Clock as LucideClock, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react'

interface PedidoItem {
  id: string
  nome: string
  quantidade: number
  imagem?: string
  observacao?: string
}

type FormaPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'
type LojaStatus = 'aberta' | 'fechada'
type StatusPedido = 'pendente' | 'em_preparo' | 'finalizado'

interface PedidoLoja {
  id: string
  lojaId: string
  codigo: string
  cliente: string
  hora: string
  itens: PedidoItem[]
  formaPagamento: FormaPagamento
  status: StatusPedido
  atrasado?: boolean
  observacao?: string
}

const PEDIDOS_LOJA_MOCK: PedidoLoja[] = [
  {
    id: '1',
    lojaId: 'loja-central',
    codigo: 'P-2026-0001',
    cliente: 'João Silva',
    hora: '10:15',
    itens: [
      {
        id: '1',
        nome: 'Combo X-Burger',
        quantidade: 1,
        imagem: 'https://placehold.co/96x96/ea580c/ffffff?text=Burger',
        observacao: 'Sem maionese, adicionar bacon extra',
      },
      {
        id: '2',
        nome: 'Refrigerante Lata',
        quantidade: 2,
        imagem: 'https://placehold.co/96x96/0ea5e9/ffffff?text=Refri',
      },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
    atrasado: true,
    observacao: 'Cliente pediu para entregar na portaria. Tocar interfone 301.',
  },
  {
    id: '2',
    lojaId: 'loja-central',
    codigo: 'P-2026-0002',
    cliente: 'Maria Souza',
    hora: '10:32',
    itens: [
      { id: '1', nome: 'Pizza Calabresa (8 fatias)', quantidade: 1 },
      { id: '2', nome: 'Suco de Laranja', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'em_preparo',
  },
  {
    id: '3',
    lojaId: 'loja-shopping',
    codigo: 'P-2026-0003',
    cliente: 'Carlos Andrade',
    hora: '11:05',
    itens: [
      {
        id: '1',
        nome: 'Prato Executivo Frango Grelhado',
        quantidade: 1,
        imagem: 'https://placehold.co/96x96/22c55e/ffffff?text=Prato',
      },
    ],
    formaPagamento: 'cartao_debito',
    status: 'pendente',
    atrasado: true,
    observacao: 'Retirar cebola da guarnição.',
  },
  {
    id: '4',
    lojaId: 'loja-bairro',
    codigo: 'P-2026-0004',
    cliente: 'Ana Paula',
    hora: '11:40',
    itens: [
      { id: '1', nome: 'Salada Caesar', quantidade: 1 },
      { id: '2', nome: 'Água sem gás', quantidade: 1 },
    ],
    formaPagamento: 'dinheiro',
    status: 'finalizado',
  },
  {
    id: '5',
    lojaId: 'loja-norte',
    codigo: 'P-2026-0005',
    cliente: 'Pedro Martins',
    hora: '12:05',
    itens: [
      { id: '1', nome: 'Combo Duplo Burger', quantidade: 1 },
      { id: '2', nome: 'Batata frita grande', quantidade: 1 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
  },
  {
    id: '6',
    lojaId: 'loja-norte',
    codigo: 'P-2026-0006',
    cliente: 'Beatriz Lima',
    hora: '12:18',
    itens: [
      { id: '1', nome: 'Wrap de Frango', quantidade: 1 },
      { id: '2', nome: 'Chá gelado', quantidade: 1 },
    ],
    formaPagamento: 'cartao_debito',
    status: 'em_preparo',
  },
  {
    id: '7',
    lojaId: 'loja-sul',
    codigo: 'P-2026-0007',
    cliente: 'Rafael Costa',
    hora: '12:42',
    itens: [
      { id: '1', nome: 'Hambúrguer Artesanal', quantidade: 2 },
      { id: '2', nome: 'Refrigerante 600ml', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'pendente',
    atrasado: true,
  },
  {
    id: '8',
    lojaId: 'loja-sul',
    codigo: 'P-2026-0008',
    cliente: 'Fernanda Dias',
    hora: '13:05',
    itens: [
      { id: '1', nome: 'Salada Mediterrânea', quantidade: 1 },
      { id: '2', nome: 'Suco Detox', quantidade: 1 },
    ],
    formaPagamento: 'dinheiro',
    status: 'finalizado',
  },
  {
    id: '9',
    lojaId: 'loja-leste',
    codigo: 'P-2026-0009',
    cliente: 'Lucas Ferreira',
    hora: '13:20',
    itens: [
      { id: '1', nome: 'Prato Executivo Carne Grelhada', quantidade: 1 },
      { id: '2', nome: 'Refrigerante Lata', quantidade: 1 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
  },
  {
    id: '10',
    lojaId: 'loja-leste',
    codigo: 'P-2026-0010',
    cliente: 'Camila Rocha',
    hora: '13:37',
    itens: [
      { id: '1', nome: 'Massa ao molho pesto', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'em_preparo',
    atrasado: true,
  },
  {
    id: '11',
    lojaId: 'loja-central',
    codigo: 'P-2026-0011',
    cliente: 'Bruno Almeida',
    hora: '13:55',
    itens: [
      {
        id: '1',
        nome: 'Combo Família (4 burguers)',
        quantidade: 1,
        imagem: 'https://placehold.co/96x96/f97316/ffffff?text=Combo',
      },
      {
        id: '2',
        nome: 'Refrigerante 2L',
        quantidade: 1,
        imagem: 'https://placehold.co/96x96/4b5563/ffffff?text=2L',
      },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
    atrasado: true,
    observacao: 'Enviar copos e gelo à parte.',
  },
  {
    id: '12',
    lojaId: 'loja-central',
    codigo: 'P-2026-0012',
    cliente: 'Patrícia Gomes',
    hora: '14:10',
    itens: [
      { id: '1', nome: 'Salada Tropical', quantidade: 1 },
      { id: '2', nome: 'Água com gás', quantidade: 1 },
    ],
    formaPagamento: 'cartao_debito',
    status: 'finalizado',
  },
  {
    id: '13',
    lojaId: 'loja-shopping',
    codigo: 'P-2026-0013',
    cliente: 'Henrique Souza',
    hora: '14:25',
    itens: [
      { id: '1', nome: 'Yakissoba de Frango', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'em_preparo',
  },
  {
    id: '14',
    lojaId: 'loja-shopping',
    codigo: 'P-2026-0014',
    cliente: 'Carla Menezes',
    hora: '14:39',
    itens: [
      { id: '1', nome: 'Sushi Combo 16 peças', quantidade: 1 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
  },
  {
    id: '15',
    lojaId: 'loja-bairro',
    codigo: 'P-2026-0015',
    cliente: 'Diego Lima',
    hora: '14:55',
    itens: [
      { id: '1', nome: 'Prato Feito Bovina', quantidade: 1 },
      { id: '2', nome: 'Suco de Uva', quantidade: 1 },
    ],
    formaPagamento: 'dinheiro',
    status: 'pendente',
  },
  {
    id: '16',
    lojaId: 'loja-bairro',
    codigo: 'P-2026-0016',
    cliente: 'Luana Ferreira',
    hora: '15:07',
    itens: [
      { id: '1', nome: 'Lasanha à bolonhesa', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'em_preparo',
    atrasado: true,
  },
  {
    id: '17',
    lojaId: 'loja-norte',
    codigo: 'P-2026-0017',
    cliente: 'Ricardo Oliveira',
    hora: '15:20',
    itens: [
      { id: '1', nome: 'Combo Kids', quantidade: 2 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
  },
  {
    id: '18',
    lojaId: 'loja-norte',
    codigo: 'P-2026-0018',
    cliente: 'Mariana Castro',
    hora: '15:32',
    itens: [
      { id: '1', nome: 'Sanduíche Natural', quantidade: 1 },
      { id: '2', nome: 'Suco de Laranja', quantidade: 1 },
    ],
    formaPagamento: 'cartao_debito',
    status: 'finalizado',
  },
  {
    id: '19',
    lojaId: 'loja-sul',
    codigo: 'P-2026-0019',
    cliente: 'Tiago Barros',
    hora: '15:45',
    itens: [
      { id: '1', nome: 'Pizza Margherita (8 fatias)', quantidade: 1 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
    atrasado: true,
  },
  {
    id: '20',
    lojaId: 'loja-leste',
    codigo: 'P-2026-0020',
    cliente: 'Sofia Martins',
    hora: '16:00',
    itens: [
      { id: '1', nome: 'Espaguete ao sugo', quantidade: 1 },
      { id: '2', nome: 'Refrigerante Lata', quantidade: 1 },
    ],
    formaPagamento: 'cartao_credito',
    status: 'em_preparo',
  },
]

const LAST_UPDATE_SECONDS = 42

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
    icon: LucideClock,
    colorLight: '#f59e0b',
    bgColorLight: '#fef3c7',
    borderColorLight: '#fcd34d',
    colorDark: '#fbbf24',
    bgColorDark: '#78350f',
    borderColorDark: '#f59e0b',
  },
  em_preparo: {
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
  finalizado: {
    titulo: 'Finalizados',
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

const getFormaPagamentoLabel = (forma: FormaPagamento) => {
  if (forma === 'pix') return 'Pix'
  if (forma === 'cartao_credito') return 'Cartão de crédito'
  if (forma === 'cartao_debito') return 'Cartão de débito'
  return 'Dinheiro'
}

const getLojaStatus = (lojaId: string): LojaStatus => {
  if (!lojaId) return 'fechada'
  if (lojaId === 'loja-bairro') return 'fechada'
  return 'aberta'
}

export default function AdminPedidosLoja() {
  const navigate = useNavigate()
  const params = useParams<{ lojaId: string }>()
  const lojaId = params.lojaId ?? ''
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoLoja | null>(null)

  const pedidosDaLoja = useMemo(
    () => PEDIDOS_LOJA_MOCK.filter((pedido) => pedido.lojaId === lojaId),
    [lojaId]
  )

  const pedidosPorStatus = useMemo(
    () => ({
      pendente: pedidosDaLoja.filter((pedido) => pedido.status === 'pendente'),
      em_preparo: pedidosDaLoja.filter((pedido) => pedido.status === 'em_preparo'),
      finalizado: pedidosDaLoja.filter((pedido) => pedido.status === 'finalizado'),
    }),
    [pedidosDaLoja]
  )

  const metrics = useMemo(() => {
    const abertos = pedidosPorStatus.pendente.length
    const emPreparo = pedidosPorStatus.em_preparo.length
    const finalizados = pedidosPorStatus.finalizado.length
    const total = pedidosDaLoja.length

    return {
      abertos,
      emPreparo,
      finalizados,
      total,
    }
  }, [pedidosDaLoja, pedidosPorStatus])

  const hasPedidosEmAtraso = useMemo(
    () => pedidosDaLoja.some((pedido) => pedido.atrasado),
    [pedidosDaLoja]
  )

  const lojaStatus = getLojaStatus(lojaId)

  const handleAbrirDetalhes = (pedido: PedidoLoja) => {
    setPedidoSelecionado(pedido)
  }

  const handleFecharDetalhes = () => {
    setPedidoSelecionado(null)
  }

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--text-primary)]">
              Admin – Pedidos da Loja
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Visualização em tempo real • Somente leitura
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-nav)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-primary)]">
                <EyeIcon className="h-3 w-3" />
                Modo monitoramento
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                  lojaStatus === 'aberta'
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-black dark:text-emerald-200'
                    : 'border border-zinc-500/40 bg-zinc-500/10 text-black dark:text-zinc-300'
                }`}
              >
                <BuildingStorefrontIcon className="h-3 w-3" />
                Loja {lojaStatus === 'aberta' ? 'aberta' : 'fechada'}
              </span>
              {hasPedidosEmAtraso && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-black dark:text-amber-200">
                  <ExclamationTriangleIcon className="h-3 w-3 text-amber-500" />
                  Pedidos em atraso
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Loja ID: {lojaId || 'não informada'} • Atualizado há {LAST_UPDATE_SECONDS}s
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-nav)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-100)]"
          >
            Voltar
          </button>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <LucideClock size={24} className="opacity-90" />
              <span className="text-2xl font-bold">{metrics.abertos}</span>
            </div>
            <p className="text-sm font-medium">Aguardando</p>
            <p className="text-xs opacity-90 mt-1">Pedidos pendentes</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ChefHat size={24} className="opacity-90" />
              <span className="text-2xl font-bold">{metrics.emPreparo}</span>
            </div>
            <p className="text-sm font-medium">Em Preparo</p>
            <p className="text-xs opacity-90 mt-1">Na cozinha</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 size={24} className="opacity-90" />
              <span className="text-2xl font-bold">{metrics.finalizados}</span>
            </div>
            <p className="text-sm font-medium">Finalizados</p>
            <p className="text-xs opacity-90 mt-1">Concluídos hoje</p>
          </div>

          <div className="bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ChartBarIcon className="h-6 w-6 opacity-90" />
              <span className="text-2xl font-bold">{metrics.total}</span>
            </div>
            <p className="text-sm font-medium">Total no Dia</p>
            <p className="text-xs opacity-90 mt-1">Todos os pedidos</p>
          </div>
        </div>

        {/* KANBAN DE PEDIDOS */}
        <div className="grid gap-4 lg:grid-cols-3">
          {(Object.keys(statusConfig) as StatusPedido[]).map((status) => {
            const lista = pedidosPorStatus[status]
            const config = statusConfig[status]
            const Icon = config.icon

            return (
              <div key={status} className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)]">
                {/* HEADER DA COLUNA */}
                <style>{`
                  .kanban-header-admin-${status} {
                    background-color: ${config.bgColorLight};
                    border-bottom: 3px solid ${config.borderColorLight};
                  }
                  .kanban-header-admin-${status} .kanban-icon {
                    color: ${config.colorLight};
                  }
                  .kanban-header-admin-${status} .kanban-badge {
                    background-color: ${config.colorLight};
                    color: white;
                  }
                  @media (prefers-color-scheme: dark) {
                    .kanban-header-admin-${status} {
                      background-color: ${config.bgColorDark};
                      border-bottom: 3px solid ${config.borderColorDark};
                    }
                    .kanban-header-admin-${status} .kanban-icon {
                      color: ${config.colorDark};
                    }
                    .kanban-header-admin-${status} .kanban-badge {
                      background-color: ${config.colorDark};
                      color: white;
                    }
                  }
                `}</style>
                <div className={`kanban-header-admin-${status} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={20} className="kanban-icon" />
                      <h3 className="font-bold text-white">{config.titulo}</h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full kanban-badge">
                      {lista.length}
                    </span>
                  </div>
                </div>

                {/* LISTA DE PEDIDOS */}
                <div className="flex-1 bg-[var(--surface)] p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {lista.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon size={40} className="text-[var(--text-muted)] opacity-30 mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">Nenhum pedido</p>
                    </div>
                  ) : (
                    lista.map((pedido) => (
                      <div
                        key={pedido.id}
                        onClick={() => handleAbrirDetalhes(pedido)}
                        className="bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-3 hover:shadow-md transition-all cursor-pointer hover:border-[var(--primary-100)]"
                      >
                        {/* HEADER DO CARD */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                              {pedido.cliente}
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                              <LucideClock size={12} />
                              {pedido.hora} • {pedido.codigo}
                            </p>
                          </div>
                          {pedido.atrasado && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30">
                              ATRASO
                            </span>
                          )}
                        </div>

                        {/* ITENS DO PEDIDO */}
                        <div className="mb-3">
                          <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase mb-1">
                            Itens ({pedido.itens.length})
                          </p>
                          <div className="space-y-1">
                            {pedido.itens.slice(0, 2).map((item) => (
                              <p key={item.id} className="text-xs text-[var(--text-secondary)] truncate">
                                {item.quantidade}x {item.nome}
                              </p>
                            ))}
                            {pedido.itens.length > 2 && (
                              <p className="text-xs text-[var(--text-muted)] italic">
                                +{pedido.itens.length - 2} item(ns)
                              </p>
                            )}
                          </div>
                        </div>

                        {/* OBSERVAÇÃO */}
                        {pedido.observacao && (
                          <div className="flex items-start gap-2 mb-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                            <AlertCircle size={12} className="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-300 line-clamp-2">
                              {pedido.observacao}
                            </p>
                          </div>
                        )}

                        {/* FOOTER */}
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <CreditCardIcon className="h-3 w-3" />
                            <span>{getFormaPagamentoLabel(pedido.formaPagamento)}</span>
                          </div>
                          <span className="text-xs font-semibold text-[var(--text-primary)] bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border)]">
                            {pedido.codigo}
                          </span>
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleFecharDetalhes}
        >
          <div
            className="bg-[var(--surface)] rounded-[12px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[28px] font-bold text-[var(--text-primary)]">Detalhes do Pedido</h3>
                <p className="text-[20px] font-medium text-[var(--text-secondary)] mt-1">{pedidoSelecionado.codigo}</p>
              </div>
              <button
                onClick={handleFecharDetalhes}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Cliente
                </label>
                <p className="text-base font-semibold text-[var(--text-primary)] mt-1">
                  {pedidoSelecionado.cliente}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Horário do Pedido
                </label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{pedidoSelecionado.hora}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Forma de Pagamento
                </label>
                <p className="text-sm text-[var(--text-primary)] mt-1">
                  {getFormaPagamentoLabel(pedidoSelecionado.formaPagamento)}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2 block">
                  Itens do Pedido
                </label>
                <div className="space-y-3">
                  {pedidoSelecionado.itens.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-nav)] p-2"
                    >
                      <div className="h-16 w-16 overflow-hidden rounded-md bg-[var(--bg-body)]">
                        <img
                          src={item.imagem ?? 'https://placehold.co/96x96/111827/FFFFFF?text=ITEM'}
                          alt={item.nome}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{item.nome}</p>
                        <p className="text-xs text-[var(--text-muted)]">Quantidade: {item.quantidade}x</p>
                        {item.observacao && (
                          <p className="mt-1 text-xs text-[var(--text-primary)] bg-yellow-50 dark:bg-yellow-900/20 rounded px-2 py-1">
                            Obs: {item.observacao}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {pedidoSelecionado.observacao && (
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    Observações do Pedido
                  </label>
                  <p className="text-sm text-[var(--text-primary)] bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 mt-1">
                    {pedidoSelecionado.observacao}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    Status
                  </label>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 flex items-center gap-2">
                    {(() => {
                      const Icon = statusConfig[pedidoSelecionado.status].icon
                      return <Icon size={16} className="text-[var(--primary-100)]" />
                    })()}
                    {statusConfig[pedidoSelecionado.status].titulo}
                  </p>
                </div>
                {pedidoSelecionado.atrasado && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                    <ExclamationTriangleIcon className="h-3 w-3" />
                    Em atraso
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleFecharDetalhes}
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
