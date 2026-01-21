import { useState } from 'react'
import { Package, ShoppingCart, Store, Trophy, Truck } from 'lucide-react'

type LojaDestaque = {
  nome: string
  pedidos: number
  faturamento: number
}

type EntregadorDestaque = {
  nome: string
  entregas: number
}

type ProdutoDestaque = {
  nome: string
  vendidos: number
}

const totalPedidos = 12840
const totalLojasAtivas = 56
const totalEntregadoresAtivos = 134
const totalProdutosAtivos = 842

const lojasDestaque: LojaDestaque[] = [
  { nome: 'Burger King', pedidos: 1820, faturamento: 248700 },
  { nome: 'Pizza Hut', pedidos: 1395, faturamento: 198430 },
  { nome: "McDonald's", pedidos: 1254, faturamento: 176920 },
  { nome: 'Subway', pedidos: 980, faturamento: 124380 },
]

const entregadoresDestaque: EntregadorDestaque[] = [
  { nome: 'Carlos Mendes', entregas: 342 },
  { nome: 'Ana Souza', entregas: 318 },
  { nome: 'João Pereira', entregas: 287 },
  { nome: 'Mariana Lima', entregas: 245 },
]

const produtosDestaque: ProdutoDestaque[] = [
  { nome: 'Hambúrguer Clássico da Casa', vendidos: 580 },
  { nome: 'Combo Família 4 Pessoas', vendidos: 462 },
  { nome: 'Pizza Calabresa Grande', vendidos: 431 },
  { nome: 'Batata Rústica Temperada', vendidos: 389 },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function Dashboard() {
  const [storeFilter, setStoreFilter] = useState<'geral' | string>('geral')

  const lojasVisiveis =
    storeFilter === 'geral'
      ? lojasDestaque
      : lojasDestaque.filter((loja) => loja.nome === storeFilter)

  const lojaTop = lojasVisiveis[0] ?? lojasDestaque[0]

  const totalPedidosVisao =
    storeFilter === 'geral' ? totalPedidos : lojaTop?.pedidos ?? 0

  const lojasAtivasVisao =
    storeFilter === 'geral' ? totalLojasAtivas : lojasVisiveis.length || 1

  const somaPedidosDestaque = lojasDestaque.reduce(
    (total, loja) => total + loja.pedidos,
    0
  )

  const proporcaoLoja =
    storeFilter === 'geral' || somaPedidosDestaque === 0
      ? 1
      : (lojaTop?.pedidos ?? 0) / somaPedidosDestaque

  const entregadoresAtivosVisao =
    storeFilter === 'geral'
      ? totalEntregadoresAtivos
      : Math.max(1, Math.round(totalEntregadoresAtivos * proporcaoLoja))

  const produtosAtivosVisao =
    storeFilter === 'geral'
      ? totalProdutosAtivos
      : Math.max(1, Math.round(totalProdutosAtivos * proporcaoLoja))

  const storeFilterLabel =
    storeFilter === 'geral' ? 'Todas as lojas' : lojaTop?.nome ?? 'Loja selecionada'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-[32px] font-semibold tracking-tight text-[color:var(--text-primary)]">
            Visão Geral
          </h1>
          <p className="mt-1 text-[20px] leading-[24px] text-[color:var(--text-soft)]">
            Resumo geral da plataforma
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
          <div className="relative">
            <select
              value={storeFilter}
              onChange={(event) => setStoreFilter(event.target.value)}
              className="appearance-none rounded-[12px] border border-[color:var(--border)] bg-[color:var(--surface-nav)] pr-8 pl-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-100)]"
            >
              <option value="geral">Geral (todas as lojas)</option>
              {lojasDestaque.map((loja) => (
                <option key={loja.nome} value={loja.nome}>
                  {loja.nome}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[color:var(--text-primary)]">
              ▼
            </span>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-sky-500/10 text-sky-400">
                <ShoppingCart size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-soft)]">
                  Pedidos
                </span>
                <h2 className="text-[13px] font-medium text-[color:var(--text-primary)]">
                  Total de pedidos
                </h2>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[26px] leading-none font-semibold text-[color:var(--text-primary)]">
            {totalPedidosVisao.toLocaleString('pt-BR')}
          </p>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-emerald-500/10 text-emerald-300">
                <Store size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-soft)]">
                  Lojas
                </span>
                <h2 className="text-[13px] font-medium text-[color:var(--text-primary)]">
                  Lojas ativas
                </h2>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[26px] leading-none font-semibold text-[color:var(--text-primary)]">
            {lojasAtivasVisao.toLocaleString('pt-BR')}
          </p>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-indigo-500/10 text-indigo-300">
                <Truck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-soft)]">
                  Entregadores
                </span>
                <h2 className="text-[13px] font-medium text-[color:var(--text-primary)]">
                  Entregadores ativos
                </h2>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[26px] leading-none font-semibold text-[color:var(--text-primary)]">
            {entregadoresAtivosVisao.toLocaleString('pt-BR')}
          </p>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[12px] bg-amber-500/10 text-amber-300">
                <Package size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-soft)]">
                  Produtos
                </span>
                <h2 className="text-[13px] font-medium text-[color:var(--text-primary)]">
                  Produtos ativos
                </h2>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[26px] leading-none font-semibold text-[color:var(--text-primary)]">
            {produtosAtivosVisao.toLocaleString('pt-BR')}
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="lg:col-span-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                Lojas em destaque
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
                Loja que mais vende e ranking por pedidos.
              </p>
            </div>
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-300">
              <Trophy size={18} />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2 text-[12px] flex flex-col gap-1">
            <span className="text-[color:var(--text-soft)]">
              Loja que mais vende
            </span>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[color:var(--text-primary)]">
                {lojaTop.nome}
              </span>
              <span className="font-semibold text-emerald-300">
                {formatCurrency(lojaTop.faturamento)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-[color:var(--text-soft)] mb-2">
              <span>Top lojas por pedidos</span>
              <span>Pedidos</span>
            </div>
            <ol className="divide-y divide-[color:var(--border)]">
              {lojasVisiveis.map((loja, index) => (
                <li key={loja.nome} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--surface-nav)] text-[11px] font-semibold text-[color:var(--text-primary)]">
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-[color:var(--text-primary)]">
                        {loja.nome}
                      </span>
                      <span className="text-[11px] text-[color:var(--text-soft)]">
                        {formatCurrency(loja.faturamento)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                    {loja.pedidos.toLocaleString('pt-BR')}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                Entregadores
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
                Quem mais entregou e volume total de entregas.
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--text-soft)]">
                Visão: {storeFilterLabel}
              </p>
            </div>
            <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-300">
              <Truck size={18} />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2 text-[12px] flex flex-col gap-1">
            <span className="text-[color:var(--text-soft)]">
              Entregador em destaque
            </span>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[color:var(--text-primary)]">
                {entregadoresDestaque[0].nome}
              </span>
              <span className="font-semibold text-indigo-300">
                {entregadoresDestaque[0].entregas} entregas
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-[color:var(--text-soft)] mb-2">
              <span>Ranking de entregadores</span>
              <span>Entregas</span>
            </div>
            <ol className="divide-y divide-[color:var(--border)]">
              {entregadoresDestaque.map((entregador, index) => (
                <li key={entregador.nome} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--surface-nav)] text-[11px] font-semibold text-[color:var(--text-primary)]">
                      {index + 1}
                    </span>
                    <span className="text-[13px] font-medium text-[color:var(--text-primary)]">
                      {entregador.nome}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                    {entregador.entregas.toLocaleString('pt-BR')}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
                Produtos mais vendidos
              </h2>
              <p className="mt-1 text-[13px] text-[color:var(--text-soft)]">
                Destaques de vendas por produto.
              </p>
              <p className="mt-0.5 text-[11px] text-[color:var(--text-soft)]">
                Visão: {storeFilterLabel}
              </p>
            </div>
            <div className="p-2 rounded-full bg-amber-500/10 text-amber-300">
              <Package size={18} />
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-[color:var(--surface-nav)] border border-[color:var(--border)] px-3 py-2 text-[12px] flex flex-col gap-1">
            <span className="text-[color:var(--text-soft)]">
              Produto em destaque
            </span>
            <div className="flex items-center justify-between">
              <span className="font-medium text-[color:var(--text-primary)]">
                {produtosDestaque[0].nome}
              </span>
              <span className="font-semibold text-amber-300">
                {produtosDestaque[0].vendidos} unid.
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-[color:var(--text-soft)] mb-2">
              <span>Ranking de produtos</span>
              <span>Vendidos</span>
            </div>
            <ol className="divide-y divide-[color:var(--border)]">
              {produtosDestaque.map((produto, index) => (
                <li key={produto.nome} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--surface-nav)] text-[11px] font-semibold text-[color:var(--text-primary)]">
                      {index + 1}
                    </span>
                    <span className="text-[13px] font-medium text-[color:var(--text-primary)]">
                      {produto.nome}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-[color:var(--text-primary)]">
                    {produto.vendidos.toLocaleString('pt-BR')}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </article>
      </section>
    </div>
  )
}
