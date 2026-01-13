import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/20/solid'

type LojaStatus = 'aberta' | 'fechada'

interface LojaAtiva {
  id: string
  nome: string
  status: LojaStatus
  pedidosPendentes: number
  pedidosEmPreparo: number
  pedidosFinalizadosHoje: number
  totalPedidosHoje: number
}

const LOJAS_ATIVAS_MOCK: LojaAtiva[] = [
  {
    id: 'loja-central',
    nome: 'Loja Central',
    status: 'aberta',
    pedidosPendentes: 8,
    pedidosEmPreparo: 3,
    pedidosFinalizadosHoje: 12,
    totalPedidosHoje: 23,
  },
  {
    id: 'loja-shopping',
    nome: 'Loja Shopping',
    status: 'aberta',
    pedidosPendentes: 3,
    pedidosEmPreparo: 2,
    pedidosFinalizadosHoje: 7,
    totalPedidosHoje: 12,
  },
  {
    id: 'loja-bairro',
    nome: 'Loja Bairro',
    status: 'fechada',
    pedidosPendentes: 5,
    pedidosEmPreparo: 1,
    pedidosFinalizadosHoje: 6,
    totalPedidosHoje: 12,
  },
  {
    id: 'loja-norte',
    nome: 'Loja Norte',
    status: 'aberta',
    pedidosPendentes: 2,
    pedidosEmPreparo: 1,
    pedidosFinalizadosHoje: 3,
    totalPedidosHoje: 6,
  },
  {
    id: 'loja-sul',
    nome: 'Loja Sul',
    status: 'fechada',
    pedidosPendentes: 4,
    pedidosEmPreparo: 2,
    pedidosFinalizadosHoje: 9,
    totalPedidosHoje: 15,
  },
  {
    id: 'loja-leste',
    nome: 'Loja Leste',
    status: 'aberta',
    pedidosPendentes: 6,
    pedidosEmPreparo: 2,
    pedidosFinalizadosHoje: 11,
    totalPedidosHoje: 19,
  },
]

const getLojaAvatarLabel = (nome: string) => {
  const partes = nome.trim().split(' ').filter(Boolean)
  if (partes.length === 0) return ''
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase()
  }
  return `${partes[0][0]}${partes[1][0]}`.toUpperCase()
}

export default function AdminGerenciarLojas() {
  const navigate = useNavigate()

  const handleIrParaPedidosLoja = (loja: LojaAtiva) => {
    navigate(`/admin/pedidos-loja/${encodeURIComponent(loja.id)}`)
  }

  const handleKeyDownCard = (event: KeyboardEvent<HTMLDivElement>, loja: LojaAtiva) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleIrParaPedidosLoja(loja)
    }
  }

  const lojasOrdenadas = [...LOJAS_ATIVAS_MOCK].sort((a, b) => {
    const getPriority = (loja: LojaAtiva) => {
      const hasAtencao =
        loja.pedidosPendentes >= 6 || loja.pedidosEmPreparo >= 5

      if (loja.status === 'fechada') return 2
      if (hasAtencao) return 0
      return 1
    }

    const prioridadeA = getPriority(a)
    const prioridadeB = getPriority(b)

    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB
    }

    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  const hasLojasAltaDemanda = lojasOrdenadas.some(
    (loja) => loja.pedidosPendentes >= 6 || loja.pedidosEmPreparo >= 5
  )

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-b border-[color:var(--border)] px-4 py-5 sm:px-0">
        <div className="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="mt-4 ml-4">
            <h1 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
              Admin – Gerenciar Lojas
            </h1>
            <p className="mt-1 text-sm text-[var(--text-primary)]">
              Visualize as lojas ativas e acesse os pedidos pendentes de cada uma.
            </p>
          </div>
        </div>
      </div>

      {hasLojasAltaDemanda && (
        <div className="mt-4 border-l-4 border-yellow-500 bg-yellow-500/10 p-4">
          <div className="flex">
            <div className="shrink-0">
              <ExclamationTriangleIcon aria-hidden="true" className="size-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-300">
                Algumas lojas estão com alta demanda ou fila elevada. Acompanhe os pedidos com atenção.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {lojasOrdenadas.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-12">
            <div className="text-center">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mx-auto size-12 text-[color:var(--text-primary)]"
              >
                <path
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">
                Nenhuma loja cadastrada
              </h3>
              <p className="mt-2 text-sm text-[color:var(--text-primary)]">
                Cadastre uma loja para começar a monitorar pedidos e status em tempo real.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <PlusIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
                  Nova loja
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lojasOrdenadas.map((loja) => (
              <div
                key={loja.id}
                role="button"
                tabIndex={0}
                onClick={() => handleIrParaPedidosLoja(loja)}
                onKeyDown={(event) => handleKeyDownCard(event, loja)}
                className="flex cursor-pointer flex-col justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm outline-none transition-colors hover:border-[color:var(--primary-100)] hover:bg-[color:var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-[color:var(--surface-nav)] text-sm font-semibold text-[var(--text-primary)] inset-ring inset-ring-white/10">
                      {getLojaAvatarLabel(loja.nome)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {loja.nome}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-primary)]">
                        ID: {loja.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        loja.status === 'aberta'
                          ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                          : 'border border-zinc-500/40 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <svg
                        viewBox="0 0 6 6"
                        aria-hidden="true"
                        className={`size-1.5 ${
                          loja.status === 'aberta' ? 'fill-emerald-400' : 'fill-red-400'
                        }`}
                      >
                        <circle r={3} cx={3} cy={3} />
                      </svg>
                      {loja.status === 'aberta' ? 'Aberta' : 'Fechada'}
                    </span>
                  <div className="flex flex-wrap justify-end gap-1">
                      {loja.pedidosPendentes >= 6 && (
                        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-200">
                          <svg
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                            className="size-1.5 fill-amber-400"
                          >
                            <circle r={3} cx={3} cy={3} />
                          </svg>
                          Alta demanda
                        </span>
                      )}
                      {loja.pedidosEmPreparo >= 5 && (
                        <span className="inline-flex items-center gap-x-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-200">
                          <svg
                            viewBox="0 0 6 6"
                            aria-hidden="true"
                            className="size-1.5 fill-amber-400"
                          >
                            <circle r={3} cx={3} cy={3} />
                          </svg>
                          Fila elevada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-[var(--text-primary)]">
                        <span className="inline-flex items-center gap-1">
                          <ClipboardDocumentListIcon
                            aria-hidden="true"
                            className="size-4 text-[var(--text-primary)]"
                          />
                          <span>Pedidos pendentes</span>
                        </span>
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                        {loja.pedidosPendentes}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[var(--text-primary)]">
                        Em preparo
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                        {loja.pedidosEmPreparo}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)]">
                        Finalizados hoje
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)]">
                        {loja.pedidosFinalizadosHoje}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between border-t border-[color:var(--border)] pt-3 text-xs">
                    <p className="text-[var(--text-primary)]">
                      Total no dia
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {loja.totalPedidosHoje}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

