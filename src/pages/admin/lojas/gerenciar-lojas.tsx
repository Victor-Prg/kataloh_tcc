import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  Clock,
  ChefHat,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Eye,
  ArrowRight,
  Package
} from 'lucide-react'

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
      // Prioriza lojas com alta demanda (≥8 pendentes)
      if (loja.pedidosPendentes >= 8) return 0
      
      // Depois lojas com demanda normal (≥5 pendentes) ou fila elevada
      if (loja.pedidosPendentes >= 5 || loja.pedidosEmPreparo >= 5) return 1
      
      // Lojas fechadas no meio
      if (loja.status === 'fechada') return 2
      
      // Lojas com pouca demanda ou sem demanda por último
      return 3
    }

    const prioridadeA = getPriority(a)
    const prioridadeB = getPriority(b)

    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB
    }

    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  const hasLojasAltaDemanda = lojasOrdenadas.some(
    (loja) => loja.pedidosPendentes >= 8 || loja.pedidosEmPreparo >= 5
  )

  const totalLojas = lojasOrdenadas.length
  const lojasAbertas = lojasOrdenadas.filter(l => l.status === 'aberta').length
  const totalPedidosPendentes = lojasOrdenadas.reduce((acc, l) => acc + l.pedidosPendentes, 0)
  const totalPedidosHoje = lojasOrdenadas.reduce((acc, l) => acc + l.totalPedidosHoje, 0)

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          Gerenciar Lojas
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Visualize e monitore todas as lojas em tempo real
        </p>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Store size={24} className="opacity-90" />
            <span className="text-2xl font-bold">{totalLojas}</span>
          </div>
          <p className="text-sm font-medium">Total de Lojas</p>
          <p className="text-xs opacity-90 mt-1">{lojasAbertas} abertas agora</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="opacity-90" />
            <span className="text-2xl font-bold">{totalPedidosPendentes}</span>
          </div>
          <p className="text-sm font-medium">Pendentes</p>
          <p className="text-xs opacity-90 mt-1">Todas as lojas</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ChefHat size={24} className="opacity-90" />
            <span className="text-2xl font-bold">
              {lojasOrdenadas.reduce((acc, l) => acc + l.pedidosEmPreparo, 0)}
            </span>
          </div>
          <p className="text-sm font-medium">Em Preparo</p>
          <p className="text-xs opacity-90 mt-1">Todas as lojas</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package size={24} className="opacity-90" />
            <span className="text-2xl font-bold">{totalPedidosHoje}</span>
          </div>
          <p className="text-sm font-medium">Hoje</p>
          <p className="text-xs opacity-90 mt-1">Total do dia</p>
        </div>
      </div>

      {/* ALERTA DE ALTA DEMANDA */}
      {hasLojasAltaDemanda && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle size={24} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                Atenção: Alta Demanda Detectada
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Algumas lojas estão com alta demanda ou fila elevada. Monitore os pedidos com atenção.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GRID DE LOJAS */}
      <div className="mt-6">
        {lojasOrdenadas.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-20">
            <div className="text-center">
              <Store size={64} className="mx-auto text-[var(--text-muted)] opacity-30 mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Nenhuma loja cadastrada
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                Cadastre lojas para começar a monitorar pedidos e status em tempo real
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lojasOrdenadas.map((loja) => {
              // Classifica a demanda baseada nos pedidos pendentes
              const getDemandaStatus = () => {
                if (loja.pedidosPendentes >= 8) {
                  return {
                    label: 'ALTA DEMANDA',
                    bgColor: 'bg-red-500/20',
                    textColor: 'text-red-700 dark:text-red-400',
                    icon: AlertTriangle
                  }
                } else if (loja.pedidosPendentes >= 5) {
                  return {
                    label: 'DEMANDA NORMAL',
                    bgColor: 'bg-yellow-500/20',
                    textColor: 'text-yellow-700 dark:text-yellow-400',
                    icon: Clock
                  }
                } else if (loja.pedidosPendentes >= 3) {
                  return {
                    label: 'POUCA DEMANDA',
                    bgColor: 'bg-blue-500/20',
                    textColor: 'text-blue-700 dark:text-blue-400',
                    icon: TrendingUp
                  }
                }
                return null
              }

              const demandaStatus = getDemandaStatus()
              const temFilaElevada = loja.pedidosEmPreparo >= 5
              
              return (
              <div
                key={loja.id}
                role="button"
                tabIndex={0}
                onClick={() => handleIrParaPedidosLoja(loja)}
                onKeyDown={(event) => handleKeyDownCard(event, loja)}
                className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary-100)] focus-visible:outline-none flex flex-col"
              >
                {/* HEADER DO CARD */}
                <div className="bg-gradient-to-r from-[var(--primary-100)] to-purple-600 p-4 relative">
                  <div className="absolute top-2 right-2">
                    {loja.status === 'aberta' ? (
                      <span className="flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Aberta
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Fechada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-lg font-bold text-white border-2 border-white/30">
                      {getLojaAvatarLabel(loja.nome)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white truncate">
                        {loja.nome}
                      </h3>
                      <p className="text-xs text-white/80 font-medium">
                        ID: {loja.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BADGES DE STATUS - SEMPRE OCUPA ESPAÇO */}
                <div className={`px-4 py-2 border-b flex flex-wrap items-center gap-1.5 min-h-[40px] ${
                  demandaStatus 
                    ? demandaStatus.bgColor.replace('/20', '/10') + ' border-' + demandaStatus.bgColor.split('-')[1] + '-500/30'
                    : 'bg-gray-500/10 border-gray-500/30'
                }`}>
                  {demandaStatus ? (
                    <>
                      <span className={`inline-flex items-center gap-1.5 ${demandaStatus.bgColor} ${demandaStatus.textColor} text-[10px] font-bold px-2 py-1 rounded`}>
                        {demandaStatus.icon && <demandaStatus.icon size={12} />}
                        {demandaStatus.label}
                      </span>
                      {temFilaElevada && (
                        <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded">
                          <ChefHat size={12} />
                          FILA ELEVADA
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] italic">Sem pedidos pendentes</span>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  {/* ESTATÍSTICAS PRINCIPAIS */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-orange-500/10">
                        <Clock size={20} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">
                        {loja.pedidosPendentes}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Pendentes
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500/10">
                        <ChefHat size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">
                        {loja.pedidosEmPreparo}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Preparo
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg bg-green-500/10">
                        <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">
                        {loja.pedidosFinalizadosHoje}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Finalizados
                      </p>
                    </div>
                  </div>

                  {/* TOTAL DO DIA */}
                  <div className="bg-[var(--bg-body)] rounded-lg p-3 border border-[var(--border)] mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-[var(--text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">
                          Total do Dia
                        </span>
                      </div>
                      <span className="text-xl font-bold text-[var(--primary-100)]">
                        {loja.totalPedidosHoje}
                      </span>
                    </div>
                  </div>

                  {/* BOTÃO VER DETALHES */}
                  <button className="w-full flex items-center justify-center gap-2 bg-[var(--primary-100)] hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-all group-hover:gap-3 mt-4">
                    <Eye size={18} />
                    <span>Ver Pedidos</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
          </div>
        )}
      </div>
    </div>
  )
}

