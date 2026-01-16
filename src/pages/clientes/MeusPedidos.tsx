import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Store,
  Clock,
  CreditCard,
  Wallet,
  Receipt,
  Star,
  X,
} from 'lucide-react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'

type PedidoStatus = 'em_andamento' | 'finalizado' | 'cancelado'

type PagamentoMetodo = 'pix' | 'cartao' | 'dinheiro'

interface Pedido {
  id: string
  lojaId: string
  lojaNome: string
  lojaLogo: string
  numeroPedido: string
  data: string
  hora: string
  status: PedidoStatus
  total: number
  metodoPagamento: PagamentoMetodo
  avaliado: boolean
  nota?: number
  comentario?: string
}

const MOCK_PEDIDOS: Pedido[] = [
  {
    id: '1',
    lojaId: 'bk',
    lojaNome: 'Burger King',
    lojaLogo: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=200&h=200&fit=crop',
    numeroPedido: '#1245',
    data: '2026-01-14',
    hora: '20:15',
    status: 'finalizado',
    total: 89.9,
    metodoPagamento: 'pix',
    avaliado: true,
    nota: 5,
    comentario: 'Pedido chegou rápido e tudo quentinho.'
  },
  {
    id: '2',
    lojaId: 'pizza-hut',
    lojaNome: 'Pizza Hut',
    lojaLogo: 'https://images.unsplash.com/photo-1548366086-7f1abd4a0f2c?w=200&h=200&fit=crop',
    numeroPedido: '#1244',
    data: '2026-01-14',
    hora: '19:10',
    status: 'em_andamento',
    total: 74.5,
    metodoPagamento: 'cartao',
    avaliado: false
  },
  {
    id: '3',
    lojaId: 'sushi-house',
    lojaNome: 'Sushi House',
    lojaLogo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop',
    numeroPedido: '#1243',
    data: '2026-01-13',
    hora: '21:30',
    status: 'cancelado',
    total: 129.9,
    metodoPagamento: 'cartao',
    avaliado: false
  },
  {
    id: '4',
    lojaId: 'acai',
    lojaNome: 'Açaí do Bom',
    lojaLogo: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=200&h=200&fit=crop',
    numeroPedido: '#1242',
    data: '2026-01-12',
    hora: '18:05',
    status: 'finalizado',
    total: 39.5,
    metodoPagamento: 'dinheiro',
    avaliado: false
  },
  {
    id: '5',
    lojaId: 'mcdonalds',
    lojaNome: 'McDonald\'s',
    lojaLogo: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop',
    numeroPedido: '#1241',
    data: '2026-01-11',
    hora: '22:10',
    status: 'finalizado',
    total: 59.9,
    metodoPagamento: 'cartao',
    avaliado: true,
    nota: 4,
    comentario: 'Muito bom, mas poderia ter vindo um pouco mais quente.'
  },
  {
    id: '6',
    lojaId: 'pastelaria',
    lojaNome: 'Pastelaria Central',
    lojaLogo: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&h=200&fit=crop',
    numeroPedido: '#1240',
    data: '2026-01-10',
    hora: '19:45',
    status: 'em_andamento',
    total: 29.9,
    metodoPagamento: 'dinheiro',
    avaliado: false
  },
  {
    id: '7',
    lojaId: 'padaria',
    lojaNome: 'Padaria do Bairro',
    lojaLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    numeroPedido: '#1239',
    data: '2026-01-10',
    hora: '08:30',
    status: 'cancelado',
    total: 19.9,
    metodoPagamento: 'pix',
    avaliado: false
  },
  {
    id: '8',
    lojaId: 'hamburgueria-artesanal',
    lojaNome: 'Hamburgueria Artesanal',
    lojaLogo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    numeroPedido: '#1238',
    data: '2026-01-09',
    hora: '21:20',
    status: 'finalizado',
    total: 94.7,
    metodoPagamento: 'pix',
    avaliado: true,
    nota: 5,
    comentario: 'Hambúrguer incrível, entrega dentro do tempo estimado.'
  },
  {
    id: '9',
    lojaId: 'pizzaria-da-esquina',
    lojaNome: 'Pizzaria da Esquina',
    lojaLogo: 'https://images.unsplash.com/photo-1548365328-9da4b6fd50d2?w=200&h=200&fit=crop',
    numeroPedido: '#1237',
    data: '2026-01-08',
    hora: '20:40',
    status: 'finalizado',
    total: 79.9,
    metodoPagamento: 'cartao',
    avaliado: false
  },
  {
    id: '10',
    lojaId: 'esfiha-express',
    lojaNome: 'Esfiha Express',
    lojaLogo: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=200&h=200&fit=crop',
    numeroPedido: '#1236',
    data: '2026-01-07',
    hora: '19:00',
    status: 'em_andamento',
    total: 34.9,
    metodoPagamento: 'pix',
    avaliado: false
  },
]

type FiltroStatus = 'todos' | 'em_andamento' | 'finalizado' | 'cancelado'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface RatingState {
  pedidoId: string | null
  lojaNome: string
  nota: number
  comentario: string
}

export function MeusPedidos() {
  const navigate = useNavigate()
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos')
  const [pedidos, setPedidos] = useState<Pedido[]>(MOCK_PEDIDOS)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 5
  const [ratingState, setRatingState] = useState<RatingState>({
    pedidoId: null,
    lojaNome: '',
    nota: 0,
    comentario: '',
  })
  const [ratingAberto, setRatingAberto] = useState(false)
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)

  const pedidosFiltrados = useMemo(() => {
    const filtrados =
      filtroStatus === 'todos'
        ? pedidos
        : pedidos.filter((pedido) => pedido.status === filtroStatus)

    return filtrados
  }, [pedidos, filtroStatus])

  const totalPaginas = Math.max(
    1,
    Math.ceil(pedidosFiltrados.length / itensPorPagina),
  )

  const pedidosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    return pedidosFiltrados.slice(inicio, fim)
  }, [pedidosFiltrados, paginaAtual])

  const handleAbrirAvaliacao = (pedido: Pedido) => {
    if (pedido.status !== 'finalizado' || pedido.avaliado) return

    setRatingState({
      pedidoId: pedido.id,
      lojaNome: pedido.lojaNome,
      nota: 0,
      comentario: '',
    })
    setRatingAberto(true)
  }

  const handleEnviarAvaliacao = () => {
    if (!ratingState.pedidoId || ratingState.nota === 0) return

    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === ratingState.pedidoId
          ? {
              ...pedido,
              avaliado: true,
              nota: ratingState.nota,
              comentario: ratingState.comentario || undefined,
            }
          : pedido
      )
    )

    setRatingAberto(false)
    setRatingState({
      pedidoId: null,
      lojaNome: '',
      nota: 0,
      comentario: '',
    })
  }

  const handleAbrirDetalhes = (pedido: Pedido) => {
    setPedidoSelecionado(pedido)
  }

  const handleFecharDetalhes = () => {
    setPedidoSelecionado(null)
  }

  const renderStatusChip = (status: PedidoStatus) => {
    if (status === 'em_andamento') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30 px-2 py-0.5 text-[11px] font-semibold">
          <Clock size={12} />
          Em andamento
        </span>
      )
    }

    if (status === 'finalizado') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold">
          <Receipt size={12} />
          Finalizado
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 px-2 py-0.5 text-[11px] font-semibold">
        <X size={12} />
        Cancelado
      </span>
    )
  }

  const renderPagamento = (metodo: PagamentoMetodo) => {
    if (metodo === 'pix') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Wallet size={14} />
          Pix
        </span>
      )
    }
    if (metodo === 'dinheiro') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Wallet size={14} />
          Dinheiro
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
        <CreditCard size={14} />
        Cartão
      </span>
    )
  }

  const renderStars = (nota: number, size: number = 14) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < nota
          return (
            <Star
              key={index}
              size={size}
              className={filled ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--text-muted)]'}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Meus Pedidos</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Acompanhe seu histórico de pedidos e avalie suas experiências.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { value: 'todos' as FiltroStatus, label: 'Todos' },
            { value: 'em_andamento' as FiltroStatus, label: 'Em andamento' },
            { value: 'finalizado' as FiltroStatus, label: 'Finalizados' },
            { value: 'cancelado' as FiltroStatus, label: 'Cancelados' },
          ].map((filtro) => (
            <button
              key={filtro.value}
              type="button"
              onClick={() => {
                setFiltroStatus(filtro.value)
                setPaginaAtual(1)
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                filtroStatus === filtro.value
                  ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)] shadow-sm'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Store size={40} className="text-[var(--text-muted)] mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">
              Nenhum pedido encontrado para o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {pedidosPaginados.map((pedido) => (
                <Card
                  key={pedido.id}
                  variant="flat"
                  className="border border-[var(--border)] rounded-xl bg-[var(--surface)] cursor-pointer hover:border-[var(--primary-100)] hover:shadow-md transition-all"
                  onClick={() => handleAbrirDetalhes(pedido)}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg-body)] flex items-center justify-center">
                        {pedido.lojaLogo ? (
                          <img
                            src={pedido.lojaLogo}
                            alt={pedido.lojaNome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store size={24} className="text-[var(--text-muted)]" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] truncate">
                              {pedido.lojaNome}
                            </h2>
                            {pedido.avaliado && pedido.nota ? (
                              <div className="flex items-center gap-1">
                                {renderStars(pedido.nota, 12)}
                              </div>
                            ) : null}
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Pedido {pedido.numeroPedido}
                          </p>
                        </div>

                        {renderStatusChip(pedido.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(pedido.data)} • {pedido.hora}
                        </span>
                        {renderPagamento(pedido.metodoPagamento)}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-[var(--text-secondary)]">
                            Total pago
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                            {formatCurrency(pedido.total)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {pedido.status === 'finalizado' && !pedido.avaliado && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleAbrirAvaliacao(pedido)
                              }}
                              label="Avaliar Loja"
                              icon={<Star size={14} />}
                            />
                          )}
                        </div>
                      </div>

                      {pedido.avaliado && pedido.comentario && (
                        <div className="mt-1 text-xs text-[var(--text-secondary)] bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-3 py-2">
                          <span className="font-medium text-[var(--text-primary)]">
                            Seu comentário:
                          </span>{' '}
                          <span className="line-clamp-2">{pedido.comentario}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pedidosFiltrados.length > itensPorPagina && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-secondary)]">
                <p>
                  Mostrando{' '}
                  <span className="font-medium text-[var(--text-primary)]">
                    {(paginaAtual - 1) * itensPorPagina + 1}
                  </span>
                  {' - '}
                  <span className="font-medium text-[var(--text-primary)]">
                    {Math.min(paginaAtual * itensPorPagina, pedidosFiltrados.length)}
                  </span>
                  {' de '}
                  <span className="font-medium text-[var(--text-primary)]">
                    {pedidosFiltrados.length}
                  </span>{' '}
                  pedidos
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setPaginaAtual((prev) => Math.max(1, prev - 1))}
                    disabled={paginaAtual === 1}
                    className="px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span>
                    Página{' '}
                    <span className="font-medium text-[var(--text-primary)]">
                      {paginaAtual}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium text-[var(--text-primary)]">
                      {totalPaginas}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))
                    }
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {pedidoSelecionado && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] shadow-xl p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg-body)] flex items-center justify-center">
                  {pedidoSelecionado.lojaLogo ? (
                    <img
                      src={pedidoSelecionado.lojaLogo}
                      alt={pedidoSelecionado.lojaNome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store size={22} className="text-[var(--text-muted)]" />
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                    {pedidoSelecionado.lojaNome}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Pedido {pedidoSelecionado.numeroPedido}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFecharDetalhes}
                className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                {renderStatusChip(pedidoSelecionado.status)}
                <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                  <Clock size={14} />
                  {formatDate(pedidoSelecionado.data)} • {pedidoSelecionado.hora}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg-body)]">
                <div className="flex flex-col">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Total pago
                  </span>
                  <span className="text-base font-semibold text-[var(--text-primary)]">
                    {formatCurrency(pedidoSelecionado.total)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[var(--text-secondary)]">
                    Forma de pagamento
                  </span>
                  {renderPagamento(pedidoSelecionado.metodoPagamento)}
                </div>
              </div>

              {pedidoSelecionado.avaliado && pedidoSelecionado.nota && (
                <div className="border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg-body)] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Sua avaliação</p>
                    <div className="mt-1">{renderStars(pedidoSelecionado.nota)}</div>
                  </div>
                  {pedidoSelecionado.comentario && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 max-w-xs">
                      {pedidoSelecionado.comentario}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {ratingAberto && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full sm:max-w-md bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] shadow-xl p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Avaliar loja
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {ratingState.lojaNome}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRatingAberto(false)}
                className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                  Como foi sua experiência?
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value = index + 1
                    const active = ratingState.nota >= value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setRatingState((prev) => ({
                            ...prev,
                            nota: value,
                          }))
                        }
                        className="p-1"
                      >
                        <Star
                          size={28}
                          className={
                            active
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-[var(--text-muted)]'
                          }
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Comentário (opcional)
                </label>
                <textarea
                  rows={3}
                  value={ratingState.comentario}
                  onChange={(e) =>
                    setRatingState((prev) => ({
                      ...prev,
                      comentario: e.target.value,
                    }))
                  }
                  placeholder="Conte como foi o pedido, tempo de entrega, qualidade, etc."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleEnviarAvaliacao}
                label="Enviar avaliação"
                disabled={ratingState.nota === 0}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRatingAberto(false)}
                label="Cancelar"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
