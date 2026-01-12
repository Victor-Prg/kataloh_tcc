import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface PedidoItem {
  id: string
  nome: string
  quantidade: number
}

type FormaPagamento = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'
type LojaStatus = 'aberta' | 'fechada'

interface PedidoLoja {
  id: string
  lojaId: string
  codigo: string
  cliente: string
  hora: string
  itens: PedidoItem[]
  formaPagamento: FormaPagamento
  status: 'pendente' | 'em_preparo' | 'finalizado'
  atrasado?: boolean
}

const PEDIDOS_LOJA_MOCK: PedidoLoja[] = [
  {
    id: '1',
    lojaId: 'loja-central',
    codigo: 'P-2026-0001',
    cliente: 'João Silva',
    hora: '10:15',
    itens: [
      { id: '1', nome: 'Combo X-Burger', quantidade: 1 },
      { id: '2', nome: 'Refrigerante Lata', quantidade: 2 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
    atrasado: true,
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
      { id: '1', nome: 'Prato Executivo Frango Grelhado', quantidade: 1 },
    ],
    formaPagamento: 'cartao_debito',
    status: 'pendente',
    atrasado: true,
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
      { id: '1', nome: 'Combo Família (4 burguers)', quantidade: 1 },
      { id: '2', nome: 'Refrigerante 2L', quantidade: 1 },
    ],
    formaPagamento: 'pix',
    status: 'pendente',
    atrasado: true,
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

  const pedidosPendentes = useMemo(
    () =>
      PEDIDOS_LOJA_MOCK.filter(
        (pedido) => pedido.lojaId === lojaId && pedido.status === 'pendente'
      ),
    [lojaId]
  )

  const pedidosDaLoja = useMemo(
    () => PEDIDOS_LOJA_MOCK.filter((pedido) => pedido.lojaId === lojaId),
    [lojaId]
  )

  const metrics = useMemo(() => {
    const abertos = pedidosDaLoja.filter((pedido) => pedido.status === 'pendente').length
    const emPreparo = pedidosDaLoja.filter((pedido) => pedido.status === 'em_preparo').length
    const finalizados = pedidosDaLoja.filter((pedido) => pedido.status === 'finalizado').length
    const total = pedidosDaLoja.length

    return {
      abertos,
      emPreparo,
      finalizados,
      total,
    }
  }, [pedidosDaLoja])

  const hasPedidosEmAtraso = useMemo(
    () =>
      pedidosDaLoja.some(
        (pedido) => pedido.status === 'pendente' && pedido.atrasado
      ),
    [pedidosDaLoja]
  )

  const lojaStatus = getLojaStatus(lojaId)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Admin – Pedidos da Loja
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Visualização somente leitura dos pedidos pendentes da loja.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:space-x-3">
            <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
              Modo monitoramento
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                lojaStatus === 'aberta'
                  ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : 'border border-zinc-500/40 bg-zinc-500/10 text-zinc-300'
              }`}
            >
              Loja {lojaStatus === 'aberta' ? 'aberta' : 'fechada'}
            </span>
            {hasPedidosEmAtraso && (
              <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-200">
                Pedidos em atraso
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--text-soft)]">
            Loja ID: {lojaId || 'não informada'}
          </p>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface-nav)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] inset-ring inset-ring-white/5 hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
          >
            Voltar
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Pedidos abertos
            </p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {metrics.abertos}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Em preparo
            </p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {metrics.emPreparo}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Finalizados
            </p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {metrics.finalizados}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Total no dia
            </p>
            <p className="text-2xl font-semibold text-[var(--text-primary)]">
              {metrics.total}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {pedidosPendentes.length === 0 ? (
          <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-10 text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Nenhum pedido pendente no momento
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Assim que novos pedidos chegarem, eles aparecerão aqui para monitoramento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pedidosPendentes.map((pedido) => (
              <div
                key={pedido.id}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {pedido.cliente}
                    </p>
                    <p className="text-xs text-[var(--text-soft)]">
                      Pedido {pedido.codigo} • {pedido.hora}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
                      Pendente
                    </span>
                    {pedido.atrasado && (
                      <span className="inline-flex rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-200">
                        Em atraso
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Itens
                  </p>
                  <ul className="space-y-1 text-sm text-[var(--text-primary)]">
                    {pedido.itens.map((item) => (
                      <li key={item.id}>
                        <span className="text-[var(--text-soft)]">
                          {item.quantidade}x
                        </span>{' '}
                        {item.nome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-col gap-1 text-sm text-[var(--text-soft)] sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    Forma de pagamento:{' '}
                    <span className="text-[var(--text-primary)]">
                      {getFormaPagamentoLabel(pedido.formaPagamento)}
                    </span>
                  </p>
                  <p className="text-[var(--text-muted)]">
                    Status:{' '}
                    <span className="text-[var(--text-primary)]">Pendente</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 border-t border-[color:var(--border)] pt-3 text-xs text-[var(--text-muted)]">
        Última atualização: há {LAST_UPDATE_SECONDS} segundos
      </div>
    </div>
  )
}
