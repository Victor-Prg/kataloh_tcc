import { useEffect, useMemo, useState } from 'react'
import { Wallet, TrendingUp, Clock, CreditCard, DollarSign, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { Button, Card, Table, type TableColumn, Pagination, Tooltip, Skeleton, EmptyState } from '../../components'
import { filtrarPorPeriodo, type PeriodoFiltro } from '../../composables/periodoFiltro'

type MetodoRecebimento = 'pix' | 'dinheiro' | 'cartao'

type RepasseStatus = 'disponivel' | 'solicitado' | 'processando' | 'pago' | 'bloqueado'

type RepasseHistorico = {
  id: string
  data: string
  metodo: MetodoRecebimento
  valor: number
  status: RepasseStatus
}

type EstadoTela = 'default' | 'carregando' | 'erro' | 'sem_historico' | 'bloqueado'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const todayIso = () => new Date().toISOString().split('T')[0]

const mockRepasses: RepasseHistorico[] = [
  { id: '1', data: todayIso(), metodo: 'pix', valor: 245.8, status: 'pago' },
  { id: '2', data: todayIso(), metodo: 'cartao', valor: 180.35, status: 'processando' },
  { id: '3', data: todayIso(), metodo: 'dinheiro', valor: 96.4, status: 'solicitado' },
  { id: '4', data: todayIso(), metodo: 'pix', valor: 320.0, status: 'disponivel' },
]

const statusLabel: Record<RepasseStatus, string> = {
  disponivel: 'Disponível',
  solicitado: 'Solicitado',
  processando: 'Em processamento',
  pago: 'Pago',
  bloqueado: 'Bloqueado',
}

const statusColor: Record<RepasseStatus, string> = {
  disponivel: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  solicitado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  processando: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
  pago: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  bloqueado: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

export default function DeliveryFinanceiro() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('semana')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [valorSolicitacao, setValorSolicitacao] = useState('')
  const [metodo, setMetodo] = useState<MetodoRecebimento>('pix')
  const [observacao, setObservacao] = useState('')
  const [estadoTela, setEstadoTela] = useState<EstadoTela>('default')
  const [carregandoAcao, setCarregandoAcao] = useState(false)
  const [repasseSelecionado, setRepasseSelecionado] = useState<RepasseHistorico | null>(null)

  const itensPorPagina = 8

  const saldoDisponivel = 1245.7
  const saldoPendente = 320.0
  const totalRecebido = 8420.5
  const repassesSolicitados = 6

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mockRepasses.length === 0) {
        setEstadoTela('sem_historico')
      } else {
        setEstadoTela('default')
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  const repassesFiltrados = useMemo(
    () => filtrarPorPeriodo(mockRepasses, repasse => new Date(repasse.data), periodo),
    [periodo],
  )

  const totalPaginas = Math.ceil(repassesFiltrados.length / itensPorPagina)
  const indexInicio = (paginaAtual - 1) * itensPorPagina
  const repassesPaginados = repassesFiltrados.slice(indexInicio, indexInicio + itensPorPagina)

  const columns: TableColumn<RepasseHistorico>[] = [
    {
      key: 'data',
      header: 'Data do Repasse',
      renderCell: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-[var(--text-primary)]">{formatDate(row.data)}</span>
          <span className="text-xs text-[var(--text-secondary)]">Agendado</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      renderCell: (row) => (
        <span className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)]">
          {row.metodo === 'pix' && <CreditCard size={14} />}
          {row.metodo === 'dinheiro' && <DollarSign size={14} />}
          {row.metodo === 'cartao' && <CreditCard size={14} />}
          {row.metodo === 'pix' && 'PIX'}
          {row.metodo === 'dinheiro' && 'Dinheiro'}
          {row.metodo === 'cartao' && 'Cartão'}
        </span>
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      width: '140px',
      renderCell: (row) => (
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.valor)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '150px',
      renderCell: (row) => (
        <Tooltip content={statusLabel[row.status]}>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor[row.status]}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusLabel[row.status]}
          </span>
        </Tooltip>
      ),
    },
    {
      key: 'acao',
      header: 'Ação',
      width: '120px',
      renderCell: (row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setRepasseSelecionado(row)
          }}
          className="text-xs font-medium text-[var(--primary-100)] hover:underline"
        >
          Ver detalhes
        </button>
      ),
    },
  ]

  const handleSolicitarRepasse = () => {
    const valor = parseFloat(valorSolicitacao.replace(',', '.'))
    if (!valor || valor <= 0) {
      alert('Informe um valor válido para o repasse.')
      return
    }
    if (valor > saldoDisponivel) {
      alert('Valor superior ao saldo disponível.')
      return
    }

    setCarregandoAcao(true)
    setTimeout(() => {
      setCarregandoAcao(false)
      setModalAberto(false)
      setValorSolicitacao('')
      setObservacao('')
      alert('Solicitação de repasse enviada com sucesso!')
    }, 800)
  }

  const bloqueado = estadoTela === 'bloqueado' || saldoDisponivel <= 0
  const loading = estadoTela === 'carregando'

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Financeiro
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Controle de ganhos e repasses
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Info size={14} />
              <span>
                Saldo disponível é atualizado após cada entrega concluída
              </span>
            </div>
            <Button
              variant="primary"
              disabled={bloqueado}
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Wallet size={18} />
              Solicitar Repasse
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {([
            { value: 'hoje', label: 'Hoje' },
            { value: 'semana', label: 'Últimos 7 dias' },
            { value: 'mes', label: 'Últimos 30 dias' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriodo(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                periodo === opt.value
                  ? 'bg-[var(--primary-100)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <Wallet size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <Tooltip content="Valor disponível para solicitar repasse">
                <Info size={16} className="text-[var(--text-secondary)]" />
              </Tooltip>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Saldo Disponível
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(saldoDisponivel)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Total Recebido
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(totalRecebido)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock size={20} className="text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Saldo Pendente
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatCurrency(saldoPendente)}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/20 rounded-lg">
                <CreditCard size={20} className="text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Últimos 30 dias
              </span>
            </div>
            <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              Repasses Solicitados
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {repassesSolicitados}
            </p>
          </Card>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Histórico de Repasses
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Acompanhe todos os repasses solicitados e pagos
              </p>
            </div>
          </div>

          {estadoTela === 'erro' && (
            <AlertCircle className="text-red-500" />
          )}

          {estadoTela === 'sem_historico' && (
            <EmptyState
              title="Nenhum repasse encontrado"
              description="Quando você solicitar repasses, eles aparecerão aqui."
            />
          )}

          {estadoTela !== 'sem_historico' && (
            <>
              <Table
                columns={columns}
                data={repassesPaginados}
                loading={loading}
                emptyTitle="Nenhum repasse encontrado"
                emptyDescription="Ajuste os filtros ou solicite um novo repasse."
              />

              {!loading && repassesFiltrados.length > 0 && (
                <Pagination
                  currentPage={paginaAtual}
                  totalPages={totalPaginas}
                  onPageChange={setPaginaAtual}
                  className="mt-2"
                />
              )}
            </>
          )}
        </Card>
      </div>

      {repasseSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Detalhes do repasse
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Veja as informações completas deste repasse
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRepasseSelecionado(null)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    Valor do repasse
                  </span>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(repasseSelecionado.valor)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColor[repasseSelecionado.status]}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {statusLabel[repasseSelecionado.status]}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Data do repasse</span>
                  <span className="text-[var(--text-primary)]">
                    {formatDate(repasseSelecionado.data)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Método</span>
                  <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                    {repasseSelecionado.metodo === 'pix' && <CreditCard size={14} />}
                    {repasseSelecionado.metodo === 'dinheiro' && <DollarSign size={14} />}
                    {repasseSelecionado.metodo === 'cartao' && <CreditCard size={14} />}
                    {repasseSelecionado.metodo === 'pix' && 'PIX'}
                    {repasseSelecionado.metodo === 'dinheiro' && 'Dinheiro'}
                    {repasseSelecionado.metodo === 'cartao' && 'Cartão'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Identificador</span>
                  <span className="text-[var(--text-secondary)]">#{repasseSelecionado.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Os repasses podem levar até 24 horas úteis para serem compensados,
                dependendo do método selecionado.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRepasseSelecionado(null)}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Solicitar Repasse
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Confirme o valor e a forma de recebimento
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">
                  Saldo disponível
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(saldoDisponivel)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Taxa estimada</span>
                <span>0%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span>Valor líquido estimado</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {valorSolicitacao
                    ? formatCurrency(parseFloat(valorSolicitacao.replace(',', '.')) || 0)
                    : formatCurrency(0)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Valor do repasse
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                    R$
                  </span>
                  <input
                    type="text"
                    value={valorSolicitacao}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^\d,]/g, '')
                      setValorSolicitacao(value)
                    }}
                    placeholder="0,00"
                    className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg-body)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-sm font-medium text-[var(--text-primary)]">
                  Método de recebimento
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'pix', label: 'PIX' },
                    { value: 'dinheiro', label: 'Dinheiro' },
                    { value: 'cartao', label: 'Cartão' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMetodo(opt.value)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border ${
                        metodo === opt.value
                          ? 'bg-[var(--primary-100)] text-white border-[var(--primary-100)]'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Observação (opcional)
                </label>
                <textarea
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] resize-none"
                  placeholder="Ex: repasse referente às entregas do final de semana"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  O repasse será analisado e, após aprovação, será depositado no método
                  selecionado em até 24 horas úteis.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setModalAberto(false)
                  setValorSolicitacao('')
                  setObservacao('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                disabled={carregandoAcao}
                onClick={handleSolicitarRepasse}
                className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {carregandoAcao && (
                  <Skeleton variant="circular" width="16px" height="16px" />
                )}
                {!carregandoAcao && <CheckCircle2 size={16} />}
                Confirmar Solicitação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
