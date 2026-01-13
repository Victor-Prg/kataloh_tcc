import { useMemo, useState } from 'react'
import { Card, Text, Button, Input, Badge, Checkbox } from '../../components'
import exemploImagem from '../../assets/exemplo.png'

type Produto = {
  id: string
  nome: string
  descricao: string
  preco: number
  categoriaId: string
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
    descricao: '2 hambúrgueres + batata',
    preco: 45.9,
    categoriaId: 'destaques',
  },
  {
    id: 'trio-cheddar',
    nome: 'Trio Cheddar',
    descricao: 'Hambúrguer cheddar + refri',
    preco: 32.5,
    categoriaId: 'destaques',
  },
  {
    id: 'x-bacon',
    nome: 'X-Bacon',
    descricao: 'Pão, carne, queijo e muito bacon',
    preco: 28,
    categoriaId: 'hamburgueres',
  },
  {
    id: 'x-salada',
    nome: 'X-Salada',
    descricao: 'Clássico com alface e tomate',
    preco: 22,
    categoriaId: 'hamburgueres',
  },
  {
    id: 'refrigerante',
    nome: 'Refrigerante lata',
    descricao: '350 ml bem gelado',
    preco: 6.5,
    categoriaId: 'bebidas',
  },
  {
    id: 'suco-laranja',
    nome: 'Suco de laranja',
    descricao: 'Natural, sem açúcar',
    preco: 9.9,
    categoriaId: 'bebidas',
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
  const [pedidoPresencial, setPedidoPresencial] = useState(true)
  const [itens, setItens] = useState<Record<string, number>>({})

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) {
      return produtosMock
    }

    return produtosMock.filter(produto => {
      return (
        produto.nome.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo)
      )
    })
  }, [busca])

  const totalItens = useMemo(
    () => Object.values(itens).reduce((accumulator, quantidade) => accumulator + quantidade, 0),
    [itens],
  )

  const totalValor = useMemo(
    () =>
      produtosMock.reduce((accumulator, produto) => {
        const quantidade = itens[produto.id] ?? 0
        if (!quantidade) {
          return accumulator
        }
        return accumulator + quantidade * produto.preco
      }, 0),
    [itens],
  )

  const handleAdicionarProduto = (produtoId: string) => {
    setItens(previous => ({
      ...previous,
      [produtoId]: (previous[produtoId] ?? 0) + 1,
    }))
  }

  const handleLimparProduto = (produtoId: string) => {
    setItens(previous => {
      const atual = previous[produtoId] ?? 0
      const novo = Math.max(0, atual - 1)

      if (novo === 0) {
        const copia = { ...previous }
        delete copia[produtoId]
        return copia
      }

      return {
        ...previous,
        [produtoId]: novo,
      }
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary-100)] text-sm font-bold text-black">
              LOGO
            </div>
            <div className="space-y-1">
              <Text as="h1" size="heading" style={{ fontWeight: 'bold', fontSize: 28 }}>
                Loja Exemplo #1
              </Text>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge label="4.8" variant="sucesso" />
                <Badge label="Lanches" variant="neutro" />
                <Badge label="30-45 min" variant="neutro" />
              </div>
            </div>
          </div>

          <Card variant="outlined" padding="12px" className="flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between gap-3">
              <Text size="sm" color="var(--text-secondary)">
                Pedido presencial
              </Text>
              <Checkbox
                checked={pedidoPresencial}
                onChange={event => setPedidoPresencial(event.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
              <span>Itens selecionados: {totalItens}</span>
              <span>Total: {formatCurrency(totalValor)}</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              label="Avançar para resumo"
              disabled={totalItens === 0}
            />
          </Card>
        </div>

        <Input
          label="Buscar no cardápio"
          placeholder="Digite o nome do produto"
          value={busca}
          onChange={event => setBusca(event.target.value)}
        />
      </header>

      <div className="space-y-8">
        {categoriasMock.map(categoria => {
          const produtosDaCategoria = produtosFiltrados.filter(
            produto => produto.categoriaId === categoria.id,
          )

          if (produtosDaCategoria.length === 0) {
            return null
          }

          return (
            <section key={categoria.id} className="space-y-3">
              <Text as="h2" size="lg" style={{ fontWeight: 'bold', fontSize: 28 }}>
                {categoria.nome}
              </Text>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                {produtosDaCategoria.map(produto => {
                  const quantidadeSelecionada = itens[produto.id] ?? 0

                  return (
                    <Card
                      key={produto.id}
                      variant="elevated"
                      padding="16px"
                      className="flex flex-col md:flex-row items-start gap-3 h-full"
                    >
                      <div className="w-full space-y-1 min-h-[72px] md:flex-1 md:mt-4">
                        <Text
                          size="sm"
                          style={{ fontWeight: 'bold', fontSize: 20 }}
                        >
                          {produto.nome}
                        </Text>
                        <Text
                          size="sm"
                          color="var(--text-secondary)"
                          style={{ fontSize: 14 }}
                        >
                          {produto.descricao}
                        </Text>
                        <Text
                          size="sm"
                          style={{ fontWeight: 'bold', fontSize: 16 }}
                        >
                          {formatCurrency(produto.preco)}
                        </Text>
                      </div>

                      <div className="flex w-full items-start justify-center md:w-auto md:justify-end md:ml-auto">
                        <div className="relative flex h-32 w-32 md:h-40 md:w-40 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--surface-nav)]">
                          <img
                            src={exemploImagem}
                            alt={produto.nome}
                            className="h-full w-full object-cover"
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            label="+"
                            onClick={() => handleAdicionarProduto(produto.id)}
                            className="absolute bottom-1 right-1 rounded-full px-0 py-0 h-7 w-7 flex items-center justify-center"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex w-full gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          label="-1"
                          onClick={() => handleLimparProduto(produto.id)}
                          disabled={quantidadeSelecionada === 0}
                          className="w-1/2 justify-center"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          label={quantidadeSelecionada > 0 ? `+ ${quantidadeSelecionada}` : '+1'}
                          onClick={() => handleAdicionarProduto(produto.id)}
                          className="w-1/2 justify-center"
                        />
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
