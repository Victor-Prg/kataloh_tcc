import { useMemo, useState, type FormEvent } from 'react'
import { Tag, TicketPercent, Heart, CalendarDays } from 'lucide-react'
import {
  Input,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Badge,
} from '../../../components'

type TipoAplicacaoCupom = 'pedido' | 'produtos'

type Cupom = {
  id: string
  nomeCampanha: string
  codigo: string
  descontoPercentual: number
  tipoAplicacao: TipoAplicacaoCupom
  categoriasIds: string[]
  validade?: Date
  quantidade: number
}

type CupomCardProps = {
  cupom: Cupom
  categoriasLegiveis: string
}

const CATEGORIAS_MOCK = [
  { id: 'lanches', nome: 'Lanches' },
  { id: 'bebidas', nome: 'Bebidas' },
  { id: 'sobremesas', nome: 'Sobremesas' },
  { id: 'combos', nome: 'Combos Especiais' },
]

const formatDate = (date?: Date) => {
  if (!date) return 'Sem data definida'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const CupomCard = ({ cupom, categoriasLegiveis }: CupomCardProps) => {
  const desconto = cupom.descontoPercentual || 0

  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-lg bg-[color:var(--surface)]">
      <div className="flex w-20 flex-col items-center justify-between px-3 py-4 text-white bg-[color:var(--secondary-100)]">
        <div className="text-[9px] font-semibold tracking-[0.25em] uppercase">
          Cupom
        </div>
        <div className="flex-1 flex items-center">
          <div className="h-20 w-[2px] bg-white/20 rounded-full" />
        </div>
        <div className="text-[9px] font-mono tracking-[0.3em]">
          #{cupom.codigo.slice(0, 10).toUpperCase()}
        </div>
      </div>

      <div
        className="relative flex-1 px-5 py-4 text-white flex"
        style={{ backgroundImage: 'var(--coupon-gradient)' }}
      >
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="flex flex-col justify-between">
            <div className="inline-flex items-center gap-1 rounded-full bg-black/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-white/95">
              <Tag size={12} />
              <span className="font-mono tracking-[0.15em]">
                {cupom.codigo.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
              <span className="text-[32px] leading-none font-extrabold">
                {desconto.toFixed(0)}%
              </span>
              <span className="text-[18px] leading-none font-semibold uppercase">
                off
              </span>
            </div>
            <p className="mt-2 text-[14px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {cupom.nomeCampanha || 'Campanha especial da loja'}
            </p>
            <p className="mt-1 text-[13px] text-white/90">
              {cupom.tipoAplicacao === 'pedido'
                ? 'Válido em todo o pedido'
                : categoriasLegiveis}
            </p>
          </div>

          <div className="w-32 rounded-xl bg-[color:var(--surface)] p-3 text-[11px] text-[color:var(--text-primary)] shadow-md flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[color:var(--primary-100)] font-semibold">
              <CalendarDays size={14} />
              <span>Validade</span>
            </div>
            <p className="mt-1 text-[11px] font-medium">
              {formatDate(cupom.validade)}
            </p>
            <div className="mt-2 border-t border-[var(--border)] pt-1.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <TicketPercent size={13} className="text-[color:var(--primary-100)]" />
                <span className="font-semibold text-[12px] text-[color:var(--text-primary)]">
                  {desconto.toFixed(0)}% OFF
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={13} className="text-rose-500" />
                <span className="truncate text-[color:var(--danger)]">
                  {cupom.quantidade} cupons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CuponsCadastro() {
  const [activeTab, setActiveTab] = useState<'cadastrar' | 'cadastrados'>('cadastrar')
  const [nomeCampanha, setNomeCampanha] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descontoPercentual, setDescontoPercentual] = useState<number | ''>('')
  const [tipoAplicacao, setTipoAplicacao] = useState<TipoAplicacaoCupom>('pedido')
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
  const [validade, setValidade] = useState<Date | undefined>()
  const [quantidade, setQuantidade] = useState<number | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [cupons, setCupons] = useState<Cupom[]>([
    {
      id: crypto.randomUUID(),
      nomeCampanha: 'Campanha Dia dos Namorados',
      codigo: 'NAMORO30',
      descontoPercentual: 30,
      tipoAplicacao: 'pedido',
      categoriasIds: [],
      validade: new Date(new Date().getFullYear(), 5, 12),
      quantidade: 100,
    },
    {
      id: crypto.randomUUID(),
      nomeCampanha: 'Semana do Cliente',
      codigo: 'CLIENTE50',
      descontoPercentual: 50,
      tipoAplicacao: 'produtos',
      categoriasIds: ['lanches', 'combos'],
      validade: new Date(new Date().getFullYear(), 8, 20),
      quantidade: 50,
    },
    {
      id: crypto.randomUUID(),
      nomeCampanha: 'Festival de Sabores',
      codigo: 'SABOR60',
      descontoPercentual: 60,
      tipoAplicacao: 'produtos',
      categoriasIds: ['sobremesas'],
      validade: new Date(new Date().getFullYear(), 10, 30),
      quantidade: 30,
    },
  ])

  const descontoNumber =
    typeof descontoPercentual === 'number' ? descontoPercentual : 0

  const quantidadeNumber =
    typeof quantidade === 'number' ? quantidade : 0

  const renderTabButton = (tab: 'cadastrar' | 'cadastrados', label: string) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
        activeTab === tab
          ? 'border-[var(--primary-100)] text-[var(--primary-100)] font-semibold'
          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </button>
  )

  const handleToggleCategoria = (id: string) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id],
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensagemSucesso('')

    const trimmedCodigo = codigo.trim().toUpperCase()
    const trimmedNome = nomeCampanha.trim()

    if (!trimmedNome || !trimmedCodigo) {
      alert('Informe o nome da campanha e o código do cupom.')
      return
    }

    if (!descontoPercentual || descontoNumber <= 0 || descontoNumber > 100) {
      alert('Informe um percentual de desconto entre 1 e 100%.')
      return
    }

    if (!quantidade || quantidadeNumber <= 0) {
      alert('Informe a quantidade de cupons disponíveis.')
      return
    }

    if (tipoAplicacao === 'produtos' && categoriasSelecionadas.length === 0) {
      alert('Selecione ao menos uma categoria de produtos.')
      return
    }

    setIsSubmitting(true)

    const novoCupom: Cupom = {
      id: crypto.randomUUID(),
      nomeCampanha: trimmedNome,
      codigo: trimmedCodigo,
      descontoPercentual: descontoNumber,
      tipoAplicacao,
      categoriasIds: tipoAplicacao === 'pedido' ? [] : categoriasSelecionadas,
      validade,
      quantidade: quantidadeNumber,
    }

    setTimeout(() => {
      setCupons((prev) => [novoCupom, ...prev])
      setIsSubmitting(false)
      setMensagemSucesso('Cupom cadastrado com sucesso (interface).')
      setNomeCampanha('')
      setCodigo('')
      setDescontoPercentual('')
      setTipoAplicacao('pedido')
      setCategoriasSelecionadas([])
      setValidade(undefined)
      setQuantidade('')
    }, 400)
  }

  const previewCupom: Cupom = {
    id: 'preview',
    nomeCampanha: nomeCampanha || 'Campanha especial da loja',
    codigo: (codigo || 'PROMO2024').toUpperCase(),
    descontoPercentual: descontoNumber || 30,
    tipoAplicacao,
    categoriasIds: categoriasSelecionadas,
    validade,
    quantidade: quantidadeNumber || 50,
  }

  const categoriasPreview = useMemo(() => {
    if (previewCupom.tipoAplicacao === 'pedido') {
      return 'Válido em todo o pedido'
    }

    if (!previewCupom.categoriasIds.length) {
      return 'Categorias ainda não selecionadas'
    }

    const nomes = CATEGORIAS_MOCK.filter((cat) =>
      previewCupom.categoriasIds.includes(cat.id),
    ).map((cat) => cat.nome)

    return `Categorias: ${nomes.join(', ')}`
  }, [previewCupom.tipoAplicacao, previewCupom.categoriasIds])

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] font-bold text-[var(--text-primary)]">
          Cupons de Desconto
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Divida entre cadastrar novos cupons e visualizar os já cadastrados
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex border-b border-[var(--border-color)]">
          {renderTabButton('cadastrar', 'Cadastrar cupons')}
          {renderTabButton('cadastrados', 'Cupons cadastrados')}
        </div>
      </div>

      {activeTab === 'cadastrar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border-color)]">
                <div>
                  <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">
                    Cadastro de Cupom
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Defina as regras para aplicar o desconto na sua loja
                  </p>
                </div>
                <Badge label="Interface" variant="neutro" />
              </div>

              {mensagemSucesso && (
                <div className="rounded-lg border border-[var(--success)] bg-[var(--bg-input)] px-3 py-2 text-[14px] text-[var(--success)]">
                  {mensagemSucesso}
                </div>
              )}

              <Input
                label="Nome da campanha"
                placeholder="Ex: Dia dos Namorados, Semana do Cliente"
                value={nomeCampanha}
                onChange={(event) => setNomeCampanha(event.target.value)}
              />

              <Input
                label="Código do cupom"
                placeholder="Ex: NAMORADOS30"
                value={codigo}
                onChange={(event) =>
                  setCodigo(event.target.value.toUpperCase())
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-4">
                <div>
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">
                    Aplicação do cupom
                  </span>
                  <div className="mt-2 inline-flex rounded-full bg-[var(--bg-body)] p-1 border border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => setTipoAplicacao('pedido')}
                      className={`px-4 py-1.5 text-xs sm:text-[14px] rounded-full font-medium transition-colors ${
                        tipoAplicacao === 'pedido'
                          ? 'bg-[var(--primary-100)] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Todo o pedido
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipoAplicacao('produtos')}
                      className={`px-4 py-1.5 text-xs sm:text-[14px] rounded-full font-medium transition-colors ${
                        tipoAplicacao === 'produtos'
                          ? 'bg-[var(--primary-100)] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Categorias específicas
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    Para cupons focados em combos ou categorias especiais, selecione
                    a segunda opção.
                  </p>
                </div>

                <div>
                  <Input
                    label="Percentual de desconto (%)"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Ex: 30"
                    value={descontoPercentual}
                    onChange={(event) =>
                      setDescontoPercentual(
                        event.target.value
                          ? Number(event.target.value)
                          : '',
                      )
                    }
                  />
                </div>
              </div>

              {tipoAplicacao === 'produtos' && (
                <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface)] px-4 py-3">
                  <p className="text-xs font-medium text-[var(--text-primary)] mb-2">
                    Categorias de produtos
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mb-3">
                    Selecione em quais categorias o cupom será aplicado.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIAS_MOCK.map((categoria) => (
                      <Checkbox
                        key={categoria.id}
                        label={categoria.nome}
                        checked={categoriasSelecionadas.includes(categoria.id)}
                        onChange={() => handleToggleCategoria(categoria.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  label="Data de validade"
                  placeholder="Selecione a data de expiração do cupom"
                  value={validade}
                  onChange={setValidade}
                />
                <Input
                  label="Quantidade de cupons"
                  type="number"
                  min={1}
                  placeholder="Ex: 50"
                  value={quantidade}
                  onChange={(event) =>
                    setQuantidade(
                      event.target.value ? Number(event.target.value) : '',
                    )
                  }
                />
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Campos obrigatórios: nome, código, percentual, validade e quantidade.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    label="Limpar"
                    onClick={() => {
                      setNomeCampanha('')
                      setCodigo('')
                      setDescontoPercentual('')
                      setTipoAplicacao('pedido')
                      setCategoriasSelecionadas([])
                      setValidade(undefined)
                      setQuantidade('')
                      setMensagemSucesso('')
                    }}
                  />
                  <Button
                    type="submit"
                    label={isSubmitting ? 'Salvando...' : 'Cadastrar Cupom'}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="animate-fade-in">
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-1">
                Pré-visualização do cupom
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)] mb-4">
                Veja como o cupom aparecerá visualmente para campanhas da loja.
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-xl">
                  <CupomCard
                    cupom={previewCupom}
                    categoriasLegiveis={categoriasPreview}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'cadastrados' && (
        <div className="space-y-8 mt-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Cupons cadastrados
            </h2>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Visualize os cupons existentes com o layout de tickets
            </span>
          </div>

          {cupons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--surface)] px-4 py-6 text-center text-[14px] text-[var(--text-secondary)] max-w-xl mx-auto">
              Nenhum cupom cadastrado ainda. Volte para a aba de cadastro para criar o primeiro.
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cupons.map((cupom) => {
                const categoriasLegiveis =
                  cupom.tipoAplicacao === 'pedido'
                    ? 'Válido em todo o pedido'
                    : cupom.categoriasIds.length
                      ? `Categorias: ${CATEGORIAS_MOCK.filter((cat) =>
                          cupom.categoriasIds.includes(cat.id),
                        )
                          .map((cat) => cat.nome)
                          .join(', ')}`
                      : 'Categorias não informadas'

                  return (
                    <div key={cupom.id} className="h-full">
                      <CupomCard
                        cupom={cupom}
                        categoriasLegiveis={categoriasLegiveis}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

