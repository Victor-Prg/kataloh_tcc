import { useMemo, useState } from 'react'
import { Search, Plus, Minus, X, ShoppingCart, Trash2, StickyNote } from 'lucide-react'

type Produto = {
  id: string
  nome: string
  descricao: string
  preco: number
  categoriaId: string
  disponivel?: boolean
  tempo?: string
  imagem?: string
}

type ItemPedido = {
  produto: Produto
  quantidade: number
  observacao: string
}

type Categoria = {
  id: string
  nome: string
}

const categoriasMock: Categoria[] = [
  { id: 'destaques', nome: 'Destaques da Casa' },
  { id: 'hamburgueres', nome: 'Hambúrgueres' },
  { id: 'bebidas', nome: 'Bebidas' },
]

const produtosMock: Produto[] = [
  {
    id: 'combo-duplo',
    nome: 'Combo Duplo',
    descricao: '2 hambúrgueres + batata frita grande',
    preco: 45.9,
    categoriaId: 'destaques',
    disponivel: true,
    tempo: '25-30 min',
    imagem: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
  },
  {
    id: 'trio-cheddar',
    nome: 'Trio Cheddar',
    descricao: 'Hambúrguer cheddar + refri + batata',
    preco: 32.5,
    categoriaId: 'destaques',
    disponivel: true,
    tempo: '20-25 min',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    id: 'x-bacon',
    nome: 'X-Bacon',
    descricao: 'Pão artesanal, 180g de carne, queijo cheddar e muito bacon crocante',
    preco: 28,
    categoriaId: 'hamburgueres',
    disponivel: true,
    tempo: '15-20 min',
    imagem: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
  },
  {
    id: 'x-salada',
    nome: 'X-Salada',
    descricao: 'Clássico com alface, tomate, cebola e maionese da casa',
    preco: 22,
    categoriaId: 'hamburgueres',
    disponivel: true,
    tempo: '15-20 min',
    imagem: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
  },
  {
    id: 'x-veggie',
    nome: 'Veggie Burger',
    descricao: 'Hambúrguer de grão-de-bico, queijo, rúcula e molho especial',
    preco: 26,
    categoriaId: 'hamburgueres',
    disponivel: true,
    tempo: '15-20 min',
    imagem: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',
  },
  {
    id: 'refrigerante',
    nome: 'Refrigerante Lata',
    descricao: 'Coca-Cola, Guaraná ou Sprite - 350ml gelado',
    preco: 6.5,
    categoriaId: 'bebidas',
    disponivel: true,
    tempo: 'Imediato',
    imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
  },
  {
    id: 'suco-laranja',
    nome: 'Suco de Laranja',
    descricao: 'Natural, feito na hora, 500ml',
    preco: 9.9,
    categoriaId: 'bebidas',
    disponivel: true,
    tempo: '5 min',
    imagem: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  },
  {
    id: 'agua',
    nome: 'Água Mineral',
    descricao: 'Garrafa 500ml gelada',
    preco: 4.5,
    categoriaId: 'bebidas',
    disponivel: true,
    tempo: 'Imediato',
    imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function NewPedido() {
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('destaques')
  const [carrinho, setCarrinho] = useState<ItemPedido[]>([])
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null)
  const [observacaoTemp, setObservacaoTemp] = useState('')
  const [numeroMesa, setNumeroMesa] = useState('')

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    let produtos = produtosMock

    if (categoriaAtiva !== 'todos') {
      produtos = produtos.filter(p => p.categoriaId === categoriaAtiva)
    }

    if (termo) {
      produtos = produtos.filter(produto => {
        return (
          produto.nome.toLowerCase().includes(termo) ||
          produto.descricao.toLowerCase().includes(termo)
        )
      })
    }

    return produtos
  }, [busca, categoriaAtiva])

  const totalItens = useMemo(
    () => carrinho.reduce((acc, item) => acc + item.quantidade, 0),
    [carrinho],
  )

  const totalValor = useMemo(
    () => carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0),
    [carrinho],
  )

  const handleAdicionarAoCarrinho = (produto: Produto) => {
    setProdutoSelecionado(produto)
    setObservacaoTemp('')
  }

  const handleConfirmarItem = () => {
    if (!produtoSelecionado) return

    const itemExistente = carrinho.find(item => 
      item.produto.id === produtoSelecionado.id && 
      item.observacao === observacaoTemp
    )

    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item === itemExistente 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ))
    } else {
      setCarrinho([...carrinho, {
        produto: produtoSelecionado,
        quantidade: 1,
        observacao: observacaoTemp
      }])
    }

    setProdutoSelecionado(null)
    setObservacaoTemp('')
  }

  const handleRemoverItem = (index: number) => {
    setCarrinho(carrinho.filter((_, i) => i !== index))
  }

  const handleAlterarQuantidade = (index: number, delta: number) => {
    setCarrinho(carrinho.map((item, i) => {
      if (i === index) {
        const novaQuantidade = item.quantidade + delta
        return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item
      }
      return item
    }).filter(item => item.quantidade > 0))
  }

  const handleFinalizarPedido = () => {
    if (carrinho.length === 0 || !numeroMesa) return
    alert(`Pedido da mesa ${numeroMesa} enviado para a cozinha!\n\nTotal: ${formatCurrency(totalValor)}`)
    setCarrinho([])
    setNumeroMesa('')
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* COLUNA ESQUERDA - CARDÁPIO */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Novo Pedido
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Selecione os produtos do cardápio
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Mesa:</span>
            <input
              type="text"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(e.target.value)}
              placeholder="Nº"
              className="w-20 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] text-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
            />
          </div>
        </div>

        {/* BUSCA */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-11 pr-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
          />
        </div>

        {/* CATEGORIAS */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setCategoriaAtiva('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              categoriaAtiva === 'todos'
                ? 'bg-[var(--primary-100)] text-white'
                : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-hover)]'
            }`}
          >
            Todos
          </button>
          {categoriasMock.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                categoriaAtiva === cat.id
                  ? 'bg-[var(--primary-100)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUTOS */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {produtosFiltrados.map((produto) => (
              <button
                key={produto.id}
                onClick={() => handleAdicionarAoCarrinho(produto)}
                disabled={!produto.disponivel}
                className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-left hover:shadow-lg hover:border-[var(--primary-100)] transition-all group ${
                  !produto.disponivel ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-[var(--surface-nav)]">
                  <img
                    src={produto.imagem || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {produto.disponivel && (
                    <div className="absolute bottom-2 right-2 bg-[var(--primary-100)] text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={20} />
                    </div>
                  )}
                  {!produto.disponivel && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Indisponível</span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-base text-[var(--text-primary)] mb-1 line-clamp-1">
                  {produto.nome}
                </h3>
                
                <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2 leading-relaxed">
                  {produto.descricao}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-[var(--primary-100)]">
                    {formatCurrency(produto.preco)}
                  </span>
                  {produto.tempo && (
                    <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-body)] px-2 py-1 rounded">
                      {produto.tempo}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA - CARRINHO */}
      <div className="lg:w-96 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-[var(--primary-100)]" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Pedido
            </h2>
          </div>
          <span className="bg-[var(--primary-100)] text-white text-xs font-bold px-2 py-1 rounded-full">
            {totalItens} {totalItens === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* LISTA DE ITENS */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {carrinho.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart size={48} className="text-[var(--text-muted)] mb-3 opacity-30" />
              <p className="text-[var(--text-muted)] text-sm">
                Nenhum item no pedido
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-1">
                Selecione produtos do cardápio
              </p>
            </div>
          ) : (
            carrinho.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--bg-body)] border border-[var(--border)] rounded-lg p-3 space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                      {item.produto.nome}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatCurrency(item.produto.preco)} cada
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoverItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {item.observacao && (
                  <div className="flex items-start gap-1 bg-[var(--surface)] p-2 rounded text-xs">
                    <StickyNote size={12} className="text-[var(--primary-100)] mt-0.5 flex-shrink-0" />
                    <span className="text-[var(--text-secondary)]">{item.observacao}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleAlterarQuantidade(index, -1)}
                      className="p-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-bold text-[var(--text-primary)]">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => handleAlterarQuantidade(index, 1)}
                      className="p-2 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-[var(--text-primary)]">
                    {formatCurrency(item.produto.preco * item.quantidade)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TOTAL E FINALIZAR */}
        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)] text-sm">Subtotal</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {formatCurrency(totalValor)}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-[var(--text-primary)]">Total</span>
            <span className="font-bold text-[var(--primary-100)]">
              {formatCurrency(totalValor)}
            </span>
          </div>

          <button
            onClick={handleFinalizarPedido}
            disabled={carrinho.length === 0 || !numeroMesa}
            className="w-full bg-[var(--primary-100)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar para Cozinha
          </button>
        </div>
      </div>

      {/* MODAL DE ADICIONAR ITEM COM OBSERVAÇÃO */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {produtoSelecionado.nome}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {formatCurrency(produtoSelecionado.preco)}
                </p>
              </div>
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={24} />
              </button>
            </div>

            <div className="h-48 rounded-lg overflow-hidden bg-[var(--surface-nav)]">
              <img
                src={produtoSelecionado.imagem || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`}
                alt={produtoSelecionado.nome}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={observacaoTemp}
                onChange={(e) => setObservacaoTemp(e.target.value)}
                placeholder="Ex: Sem cebola, ponto da carne, etc..."
                rows={3}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-body)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] resize-none"
              />
            </div>

            <button
              onClick={handleConfirmarItem}
              className="w-full bg-[var(--primary-100)] hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all"
            >
              Adicionar ao Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
