import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  AlertCircle,
  Plus,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react'

type StatusPedido = 'pendente' | 'preparacao' | 'rota' | 'entregue'

type ChatRemetente = 'cliente' | 'loja'

type ChatMessage = {
  id: string
  remetente: ChatRemetente
  texto: string
  hora: string
}

type ClienteChat = {
  nome: string
  ultimoPedidoId: string
  avatarUrl: string
}

type AdicionalConfig = {
  id: string
  nome: string
  descricao: string
  preco: number
}

type ProdutoPedido = {
  nome: string
  quantidade: number
  descricao?: string
  adicionais?: string[]
}

type Pedido = {
  id: string
  cliente: string
  endereco: string
  observacao?: string
  valor: number
  status: StatusPedido
  criadoEm: string
  produtos: ProdutoPedido[]
}

const adicionaisConfig: AdicionalConfig[] = [
  {
    id: 'batata-palha',
    nome: 'Batata Palha No Sanduíche',
    descricao: 'adicional batata',
    preco: 3,
  },
  {
    id: 'bacon-sanduiche',
    nome: 'Bacon No Sanduíche',
    descricao: 'adicional bacon',
    preco: 5,
  },
  {
    id: 'hamburguer-sanduiche',
    nome: 'Hambúrguer No Sanduíche',
    descricao: 'adicional hambúrguer',
    preco: 8,
  },
  {
    id: 'frango-sanduiche',
    nome: 'Frango No Sanduíche',
    descricao: 'adicional frango',
    preco: 9,
  },
  {
    id: 'catupiry-sanduiche',
    nome: 'Catupiry No Sanduíche',
    descricao: 'adicional catupiry',
    preco: 4,
  },
  {
    id: 'milho-sanduiche',
    nome: 'Milho No Sanduíche',
    descricao: 'adicional milho',
    preco: 2,
  },
]

const pedidosMock: Pedido[] = [
  {
    id: 'PED-001',
    cliente: 'João',
    endereco: 'Rua das Flores, 123 - Centro',
    observacao: 'Entregar na portaria',
    valor: 54.9,
    status: 'pendente',
    criadoEm: '16/12/2025 às 14:30',
    produtos: [
      { 
        nome: 'X-Burger', 
        quantidade: 1,
        descricao: 'Hambúrguer clássico com queijo, alface, tomate e maionese da casa.',
        adicionais: ['Queijo extra', 'Sem cebola'],
      },
      { 
        nome: 'Batata frita média', 
        quantidade: 1,
        descricao: 'Porção de batata frita crocante.',
      },
      { 
        nome: 'Refrigerante lata', 
        quantidade: 1,
        descricao: 'Lata 350ml bem gelada.',
      },
    ],
  },
  {
    id: 'PED-004',
    cliente: 'Ana',
    endereco: 'Rua Horizonte, 321 - Bela Vista',
    observacao: 'Apartamento 502',
    valor: 67.8,
    status: 'pendente',
    criadoEm: '16/12/2025 às 14:45',
    produtos: [
      { 
        nome: 'Pizza Calabresa (8 fatias)', 
        quantidade: 1,
        descricao: 'Pizza de calabresa com muito queijo e cebola.',
        adicionais: ['Borda recheada de queijo'],
      },
      { 
        nome: 'Suco de Laranja', 
        quantidade: 1,
        descricao: 'Suco natural de laranja, 500ml.',
      },
    ],
  },
  {
    id: 'PED-002',
    cliente: 'Maria',
    endereco: 'Av. Principal, 456 - Jardim',
    valor: 89.5,
    status: 'preparacao',
    criadoEm: '16/12/2025 às 15:15',
    produtos: [
      { 
        nome: 'Prato Executivo Frango Grelhado', 
        quantidade: 1,
        descricao: 'Frango grelhado com arroz, feijão e salada.',
      },
      { nome: 'Arroz branco', quantidade: 1 },
      { nome: 'Feijão', quantidade: 1 },
    ],
  },
  {
    id: 'PED-005',
    cliente: 'Carlos',
    endereco: 'Rua São José, 890 - Centro',
    valor: 45.0,
    status: 'preparacao',
    criadoEm: '16/12/2025 às 15:20',
    produtos: [
      { 
        nome: 'Hambúrguer Artesanal', 
        quantidade: 1,
        descricao: 'Hambúrguer de carne artesanais com pão brioche e queijo.',
        adicionais: ['Queijo prato', 'Molho especial'],
      },
      { 
        nome: 'Batata frita pequena', 
        quantidade: 1,
        descricao: 'Porção pequena de batata frita.',
      },
    ],
  },
  {
    id: 'PED-003',
    cliente: 'Pedro',
    endereco: 'Rua do Comércio, 789 - Vila Nova',
    observacao: 'Entregar para Ana Souza',
    valor: 125,
    status: 'rota',
    criadoEm: '16/12/2025 às 15:45',
    produtos: [
      { 
        nome: 'Combo Família (4 burguers)', 
        quantidade: 1,
        descricao: 'Combo com 4 hambúrgueres variados para compartilhar.',
      },
      { 
        nome: 'Refrigerante 2L', 
        quantidade: 1,
        descricao: 'Refrigerante garrafa 2L.',
      },
    ],
  },
  {
    id: 'PED-006',
    cliente: 'Juliana',
    endereco: 'Av. Brasil, 234 - Jardim América',
    valor: 78.9,
    status: 'entregue',
    criadoEm: '16/12/2025 às 13:00',
    produtos: [
      { 
        nome: 'Salada Caesar', 
        quantidade: 1,
        descricao: 'Salada com frango grelhado, croutons e molho caesar.',
      },
      { 
        nome: 'Água sem gás', 
        quantidade: 1,
        descricao: 'Garrafa de água mineral sem gás, 500ml.',
      },
    ],
  },
  {
    id: 'PED-007',
    cliente: 'Roberto',
    endereco: 'Rua das Acácias, 567 - Vila Rosa',
    valor: 92.5,
    status: 'entregue',
    criadoEm: '16/12/2025 às 13:30',
    produtos: [
      { 
        nome: 'Pizza Margherita (8 fatias)', 
        quantidade: 1,
        descricao: 'Pizza de muçarela com tomate e manjericão fresco.',
      },
      { 
        nome: 'Refrigerante 600ml', 
        quantidade: 1,
        descricao: 'Garrafa 600ml gelada.',
      },
    ],
  },
  {
    id: 'PED-008',
    cliente: 'Marcela',
    endereco: 'Av. das Palmeiras, 999 - Jardim Tropical',
    observacao: 'Cliente montou o hambúrguer com vários adicionais.',
    valor: 39.9,
    status: 'pendente',
    criadoEm: '16/12/2025 às 16:10',
    produtos: [
      {
        nome: 'Monte seu Hambúrguer',
        quantidade: 1,
        descricao: 'Hambúrguer montado pelo cliente: escolha de pão, carne, queijos, molhos e adicionais.',
        adicionais: [
          'Pão brioche',
          'Carne 180g',
          'Queijo cheddar',
          'Bacon crocante',
          'Molho da casa',
        ],
      },
    ],
  },
]

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
    icon: Clock,
    colorLight: '#f59e0b',
    bgColorLight: '#fef3c7',
    borderColorLight: '#fcd34d',
    colorDark: '#fbbf24',
    bgColorDark: '#78350f',
    borderColorDark: '#f59e0b',
  },
  preparacao: {
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
  rota: {
    titulo: 'Em Entrega',
    badge: 'Em Rota',
    icon: Truck,
    colorLight: '#8b5cf6',
    bgColorLight: '#ede9fe',
    borderColorLight: '#c4b5fd',
    colorDark: '#a78bfa',
    bgColorDark: '#4c1d95',
    borderColorDark: '#8b5cf6',
  },
  entregue: {
    titulo: 'Entregues',
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function RecepcaoLoja() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock)
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null)
  const [pedidoArrastando, setPedidoArrastando] = useState<string | null>(null)
  const [colunaHover, setColunaHover] = useState<StatusPedido | null>(null)
  const [chatAberto, setChatAberto] = useState(false)
  const [clienteSelecionadoChat, setClienteSelecionadoChat] = useState<string | null>(null)
  const [mensagensPorCliente, setMensagensPorCliente] = useState<Record<string, ChatMessage[]>>({})
  const [mensagemAtual, setMensagemAtual] = useState('')
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null)
  const [pedidoOriginalEdicao, setPedidoOriginalEdicao] = useState<Pedido | null>(null)
  const [novoItemNome, setNovoItemNome] = useState('')
  const [novoItemQuantidade, setNovoItemQuantidade] = useState(1)
  const [novoAdicionalPorProduto, setNovoAdicionalPorProduto] = useState<Record<number, string>>({})

  const pedidosPorStatus = useMemo(
    () => ({
      pendente: pedidos.filter(pedido => pedido.status === 'pendente'),
      preparacao: pedidos.filter(pedido => pedido.status === 'preparacao'),
      rota: pedidos.filter(pedido => pedido.status === 'rota'),
      entregue: pedidos.filter(pedido => pedido.status === 'entregue'),
    }),
    [pedidos],
  )

  const totalPedidos = pedidos.length
  const totalPendentes = pedidosPorStatus.pendente.length
  const totalEmPreparo = pedidosPorStatus.preparacao.length
  const totalEmRota = pedidosPorStatus.rota.length
  const totalEntregues = pedidosPorStatus.entregue.length
  
  const valorTotal = useMemo(
    () => pedidos.reduce((acc, p) => acc + p.valor, 0),
    [pedidos]
  )

  const clientesChat: ClienteChat[] = useMemo(() => {
    const mapa = new Map<string, { ultimoPedidoId: string }>()

    pedidos.forEach(pedido => {
      if (!mapa.has(pedido.cliente)) {
        mapa.set(pedido.cliente, { ultimoPedidoId: pedido.id })
      }
    })

    return Array.from(mapa.entries()).map(([nome, info]) => {
      const avatarUrl = `https://i.pravatar.cc/80?u=${encodeURIComponent(nome)}`

      return {
        nome,
        ultimoPedidoId: info.ultimoPedidoId,
        avatarUrl,
      }
    })
  }, [pedidos])

  const handleAvancarStatus = (pedidoId: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        if (p.status === 'pendente') return { ...p, status: 'preparacao' }
        if (p.status === 'preparacao') return { ...p, status: 'rota' }
        if (p.status === 'rota') return { ...p, status: 'entregue' }
      }
      return p
    }))
  }

  const handleCancelarPedido = (pedidoId: string) => {
    if (confirm('Deseja realmente cancelar este pedido?')) {
      setPedidos(prev => prev.filter(p => p.id !== pedidoId))
    }
  }

  const iniciarEdicaoPedido = (pedido: Pedido) => {
    setPedidoOriginalEdicao(pedido)
    setPedidoEditando({
      ...pedido,
      produtos: pedido.produtos.map(produto => ({
        nome: produto.nome,
        quantidade: produto.quantidade,
        descricao: produto.descricao,
        adicionais: produto.adicionais ? [...produto.adicionais] : undefined,
      })),
    })
    setNovoItemNome('')
    setNovoItemQuantidade(1)
    setNovoAdicionalPorProduto({})
  }

  const cancelarEdicaoPedido = () => {
    setPedidoEditando(null)
    setPedidoOriginalEdicao(null)
    setNovoItemNome('')
    setNovoItemQuantidade(1)
    setNovoAdicionalPorProduto({})
  }

  const atualizarQuantidadeProduto = (index: number, novaQuantidade: number) => {
    if (!pedidoEditando) return

    if (novaQuantidade <= 0) {
      const novosProdutos = pedidoEditando.produtos.filter((_, i) => i !== index)
      setPedidoEditando({
        ...pedidoEditando,
        produtos: novosProdutos,
      })
      return
    }

    const novosProdutos = pedidoEditando.produtos.map((produto, i) =>
      i === index ? { ...produto, quantidade: novaQuantidade } : produto,
    )

    setPedidoEditando({
      ...pedidoEditando,
      produtos: novosProdutos,
    })
  }

  const removerProduto = (index: number) => {
    if (!pedidoEditando) return
    const novosProdutos = pedidoEditando.produtos.filter((_, i) => i !== index)
    setPedidoEditando({
      ...pedidoEditando,
      produtos: novosProdutos,
    })
  }

  const adicionarNovoProduto = () => {
    if (!pedidoEditando) return
    const nome = novoItemNome.trim()
    if (!nome || novoItemQuantidade <= 0) return

    const novoProduto: ProdutoPedido = {
      nome,
      quantidade: novoItemQuantidade,
    }

    setPedidoEditando({
      ...pedidoEditando,
      produtos: [...pedidoEditando.produtos, novoProduto],
    })

    setNovoItemNome('')
    setNovoItemQuantidade(1)
  }

  const adicionarAdicionalProduto = (index: number) => {
    if (!pedidoEditando) return
    const texto = (novoAdicionalPorProduto[index] ?? '').trim()
    if (!texto) return

    const novosProdutos = pedidoEditando.produtos.map((produto, i) => {
      if (i !== index) return produto
      const existentes = produto.adicionais ?? []
      if (existentes.includes(texto)) {
        return produto
      }
      return {
        ...produto,
        adicionais: [...existentes, texto],
      }
    })

    setPedidoEditando({
      ...pedidoEditando,
      produtos: novosProdutos,
    })

    setNovoAdicionalPorProduto(prev => {
      const copia = { ...prev }
      delete copia[index]
      return copia
    })
  }

  const removerAdicionalProduto = (indexProduto: number, indexAdicional: number) => {
    if (!pedidoEditando) return
    const novosProdutos = pedidoEditando.produtos.map((produto, i) => {
      if (i !== indexProduto) return produto
      const atuais = produto.adicionais ?? []
      const filtrados = atuais.filter((_, idx) => idx !== indexAdicional)
      if (filtrados.length === 0) {
        return {
          nome: produto.nome,
          quantidade: produto.quantidade,
          descricao: produto.descricao,
        }
      }
      return {
        ...produto,
        adicionais: filtrados,
      }
    })

    setPedidoEditando({
      ...pedidoEditando,
      produtos: novosProdutos,
    })
  }

  const atualizarObservacaoPedido = (valor: string) => {
    if (!pedidoEditando) return
    setPedidoEditando({
      ...pedidoEditando,
      observacao: valor || undefined,
    })
  }

  const atualizarValorPedido = (valor: string) => {
    if (!pedidoEditando) return
    const limpo = valor.replace(',', '.')
    const numero = Number(limpo)
    if (Number.isNaN(numero)) return
    setPedidoEditando({
      ...pedidoEditando,
      valor: numero,
    })
  }

  const gerarResumoAlteracoes = (original: Pedido, atualizado: Pedido) => {
    const linhas: string[] = []

    const construirMapaAdicionais = (pedido: Pedido) => {
      const mapa = new Map<string, Set<string>>()
      pedido.produtos.forEach(produto => {
        if (!produto.adicionais || produto.adicionais.length === 0) return
        const existentes = mapa.get(produto.nome) ?? new Set<string>()
        produto.adicionais.forEach(adicional => {
          const texto = adicional.trim()
          if (texto) {
            existentes.add(texto)
          }
        })
        if (existentes.size > 0) {
          mapa.set(produto.nome, existentes)
        }
      })
      return mapa
    }

    const mapaOriginal = new Map<string, number>()
    original.produtos.forEach(produto => {
      const atual = mapaOriginal.get(produto.nome) ?? 0
      mapaOriginal.set(produto.nome, atual + produto.quantidade)
    })

    const mapaAtualizado = new Map<string, number>()
    atualizado.produtos.forEach(produto => {
      const atual = mapaAtualizado.get(produto.nome) ?? 0
      mapaAtualizado.set(produto.nome, atual + produto.quantidade)
    })

    const nomes = new Set<string>()
    mapaOriginal.forEach((_, nome) => nomes.add(nome))
    mapaAtualizado.forEach((_, nome) => nomes.add(nome))

    nomes.forEach(nome => {
      const quantidadeOriginal = mapaOriginal.get(nome) ?? 0
      const quantidadeAtualizada = mapaAtualizado.get(nome) ?? 0

      if (quantidadeOriginal > 0 && quantidadeAtualizada === 0) {
        linhas.push(`Removido: ${quantidadeOriginal}x ${nome}`)
        return
      }

      if (quantidadeOriginal === 0 && quantidadeAtualizada > 0) {
        linhas.push(`Adicionado: ${quantidadeAtualizada}x ${nome}`)
        return
      }

      if (quantidadeOriginal !== quantidadeAtualizada) {
        if (quantidadeAtualizada > quantidadeOriginal) {
          linhas.push(
            `Quantidade aumentada: ${nome} de x${quantidadeOriginal} para x${quantidadeAtualizada}`,
          )
        } else {
          linhas.push(
            `Quantidade reduzida: ${nome} de x${quantidadeOriginal} para x${quantidadeAtualizada}`,
          )
        }
      }
    })

    const mapaAdicionaisOriginal = construirMapaAdicionais(original)
    const mapaAdicionaisAtualizado = construirMapaAdicionais(atualizado)

    const nomesProdutosAdicionais = new Set<string>()
    mapaAdicionaisOriginal.forEach((_, nome) => nomesProdutosAdicionais.add(nome))
    mapaAdicionaisAtualizado.forEach((_, nome) => nomesProdutosAdicionais.add(nome))

    nomesProdutosAdicionais.forEach(nomeProduto => {
      const origSet = mapaAdicionaisOriginal.get(nomeProduto) ?? new Set<string>()
      const novoSet = mapaAdicionaisAtualizado.get(nomeProduto) ?? new Set<string>()

      const todosAdicionais = new Set<string>()
      origSet.forEach(adicional => todosAdicionais.add(adicional))
      novoSet.forEach(adicional => todosAdicionais.add(adicional))

      todosAdicionais.forEach(adicional => {
        const existiaAntes = origSet.has(adicional)
        const existeAgora = novoSet.has(adicional)

        if (!existiaAntes && existeAgora) {
          linhas.push(`Adicional adicionado: ${adicional} em ${nomeProduto}`)
        } else if (existiaAntes && !existeAgora) {
          linhas.push(`Adicional removido: ${adicional} em ${nomeProduto}`)
        }
      })
    })

    if (original.observacao !== atualizado.observacao) {
      if (!original.observacao && atualizado.observacao) {
        linhas.push('Observação adicionada pela loja.')
      } else if (original.observacao && !atualizado.observacao) {
        linhas.push('Observação removida pela loja.')
      } else {
        linhas.push('Observação ajustada pela loja.')
      }
    }

    if (original.valor !== atualizado.valor) {
      linhas.push(
        `Valor total atualizado de ${formatCurrency(original.valor)} para ${formatCurrency(
          atualizado.valor,
        )}.`,
      )
    }

    if (linhas.length === 0) {
      return ''
    }

    const cabecalho = `Olá ${atualizado.cliente}, fizemos ajustes no seu pedido:\n`
    const corpo = linhas.map(linha => `• ${linha}`).join('\n')
    const rodape = '\n\nSe tiver alguma dúvida ou não concordar, responda por aqui.'

    return `${cabecalho}\n${corpo}${rodape}`
  }

  const salvarEdicaoPedido = () => {
    if (!pedidoEditando || !pedidoOriginalEdicao) return

    const resumo = gerarResumoAlteracoes(pedidoOriginalEdicao, pedidoEditando)

    setPedidos(prev =>
      prev.map(p => {
        if (p.id === pedidoEditando.id) {
          return pedidoEditando
        }
        return p
      }),
    )

    setPedidoSelecionado(pedidoEditando)

    if (resumo) {
      const hora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const novaMensagem: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        remetente: 'loja',
        texto: resumo,
        hora,
      }

      setMensagensPorCliente(prev => {
        const chaveCliente = pedidoEditando.cliente
        const mensagensAnteriores = prev[chaveCliente] ?? []

        return {
          ...prev,
          [chaveCliente]: [...mensagensAnteriores, novaMensagem],
        }
      })

      setClienteSelecionadoChat(pedidoEditando.cliente)
      setChatAberto(true)
    }

    cancelarEdicaoPedido()
  }

  const handleDragStart = (e: React.DragEvent, pedidoId: string) => {
    setPedidoArrastando(pedidoId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('pedidoId', pedidoId)
    
    // Adiciona um efeito visual ao elemento arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setPedidoArrastando(null)
    setColunaHover(null)
    
    // Remove o efeito visual
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
  }

  const handleDragOver = (e: React.DragEvent, status: StatusPedido) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setColunaHover(status)
  }

  const handleDragLeave = () => {
    setColunaHover(null)
  }

  const handleDrop = (e: React.DragEvent, novoStatus: StatusPedido) => {
    e.preventDefault()
    const pedidoId = e.dataTransfer.getData('pedidoId')
    
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        // Permite mover para qualquer status
        return { ...p, status: novoStatus }
      }
      return p
    }))
    
    setPedidoArrastando(null)
    setColunaHover(null)
  }

  const handleMoverStatus = (pedidoId: string, direcao: 'anterior' | 'proximo') => {
    const statusFlow: StatusPedido[] = ['pendente', 'preparacao', 'rota', 'entregue']
    
    setPedidos(prev => prev.map(p => {
      if (p.id === pedidoId) {
        const currentIndex = statusFlow.indexOf(p.status)
        let newIndex = currentIndex
        
        if (direcao === 'anterior' && currentIndex > 0) {
          newIndex = currentIndex - 1
        } else if (direcao === 'proximo' && currentIndex < statusFlow.length - 1) {
          newIndex = currentIndex + 1
        }
        
        return { ...p, status: statusFlow[newIndex] }
      }
      return p
    }))
  }

  const selecionarClienteChat = (nome: string) => {
    setClienteSelecionadoChat(nome)
  }

  const abrirChatComCliente = (nome: string) => {
    if (chatAberto && clienteSelecionadoChat === nome) {
      setChatAberto(false)
      return
    }

    setClienteSelecionadoChat(nome)
    setChatAberto(true)
  }

  const abrirOuFecharChat = () => {
    if (!chatAberto) {
      if (!clienteSelecionadoChat && clientesChat.length > 0) {
        setClienteSelecionadoChat(clientesChat[0].nome)
      }
      setChatAberto(true)
      return
    }

    setChatAberto(false)
  }

  const handleEnviarMensagem = () => {
    if (!clienteSelecionadoChat) return

    const texto = mensagemAtual.trim()
    if (!texto) return

    const hora = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    const novaMensagem: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      remetente: 'loja',
      texto,
      hora,
    }

    setMensagensPorCliente(prev => ({
      ...prev,
      [clienteSelecionadoChat]: [...(prev[clienteSelecionadoChat] ?? []), novaMensagem],
    }))

    setMensagemAtual('')
  }

  const mensagensClienteSelecionado = clienteSelecionadoChat
    ? mensagensPorCliente[clienteSelecionadoChat] ?? []
    : []

  const clienteSelecionadoInfo = clienteSelecionadoChat
    ? clientesChat.find(cliente => cliente.nome === clienteSelecionadoChat) ?? null
    : null

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[var(--text-primary)]">
              Recepção de Pedidos
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Acompanhe e gerencie todos os pedidos em tempo real
            </p>
          </div>
          
          <button
            onClick={() => navigate('/loja/newpedido')}
            className="inline-flex items-center gap-2 bg-[var(--primary-100)] hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-[12px] transition-all"
          >
            <Plus size={20} />
            <span>Novo Pedido</span>
          </button>
        </div>

        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock size={20} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Aguardando
              </h3>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalPendentes}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Novos pedidos</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChefHat size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Em Preparo
              </h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalEmPreparo}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Na cozinha</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Truck size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Em Entrega
              </h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalEmRota}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">A caminho</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xs font-medium text-[var(--text-secondary)]">
                Concluídos
              </h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalEntregues}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Hoje</p>
          </div>
        </div>

        {/* RESUMO */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Total de pedidos:</span>
              <span className="text-lg font-bold text-[var(--text-primary)]">{totalPedidos}</span>
            </div>
            <div className="h-6 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-[var(--text-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Faturamento:</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(valorTotal)}</span>
            </div>
          </div>
        </div>

        {/* KANBAN DE PEDIDOS */}
        <div className="grid gap-4 lg:grid-cols-4">
          {(Object.keys(statusConfig) as StatusPedido[]).map(status => {
            const lista = pedidosPorStatus[status]
            const config = statusConfig[status]
            const Icon = config.icon

            return (
              <div key={status} className="flex flex-col overflow-hidden rounded-[12px] border border-[var(--border)]">
                {/* HEADER DA COLUNA */}
                <style>{`
                  .kanban-header-${status} {
                    background-color: ${config.bgColorLight};
                    border-bottom: 3px solid ${config.borderColorLight};
                  }
                  .kanban-header-${status} .kanban-icon {
                    color: ${config.colorLight};
                  }
                  .kanban-header-${status} .kanban-badge {
                    background-color: ${config.colorLight};
                    color: white;
                  }
                  @media (prefers-color-scheme: dark) {
                    .kanban-header-${status} {
                      background-color: ${config.bgColorDark};
                      border-bottom: 3px solid ${config.borderColorDark};
                    }
                    .kanban-header-${status} .kanban-icon {
                      color: ${config.colorDark};
                    }
                    .kanban-header-${status} .kanban-badge {
                      background-color: ${config.colorDark};
                      color: white;
                    }
                  }
                `}</style>
                <div className={`kanban-header-${status} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={20} className="kanban-icon" />
                      <h3 className="font-bold text-white">
                        {config.titulo}
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full kanban-badge">
                      {lista.length}
                    </span>
                  </div>
                </div>

                {/* LISTA DE PEDIDOS */}
                <div 
                  className={`flex-1 bg-[var(--surface)] p-3 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto transition-all ${
                    colunaHover === status ? 'ring-2 ring-[var(--primary-100)] ring-inset' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {lista.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon size={40} className="text-[var(--text-muted)] opacity-30 mb-2" />
                      <p className="text-sm text-[var(--text-muted)]">
                        {colunaHover === status ? 'Solte aqui' : 'Nenhum pedido'}
                      </p>
                    </div>
                  ) : (
                    lista.map(pedido => (
                      <div
                        key={pedido.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, pedido.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-[var(--bg-body)] border border-[var(--border)] rounded-[12px] p-3 hover:shadow-md transition-all cursor-move ${
                          pedidoArrastando === pedido.id ? 'opacity-50 scale-95' : ''
                        }`}
                        onClick={() => {
                          setPedidoSelecionado(pedido)
                          cancelarEdicaoPedido()
                        }}
                      >
                        {/* HEADER DO CARD */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">
                              {pedido.cliente}
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                              <Clock size={12} />
                              {pedido.criadoEm}
                            </p>
                          </div>
                          <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                            {pedido.id}
                          </span>
                        </div>

                        {/* ENDEREÇO */}
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin size={14} className="text-[var(--text-secondary)] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                            {pedido.endereco}
                          </p>
                        </div>

                        {pedido.observacao && (
                          <div className="flex items-start gap-2 mb-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                            <AlertCircle size={14} className="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-300">
                              {pedido.observacao}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
                          {pedido.produtos.length > 0 && (
                            <div className="border border-[var(--border)] rounded-[10px] bg-[var(--surface)] px-2 py-2">
                              <p className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                                Itens
                              </p>
                              <ul className="space-y-1">
                                {pedido.produtos.slice(0, 3).map(produto => (
                                  <li key={produto.nome}>
                                    <div className="flex items-center justify-between text-[11px] text-[var(--text-primary)]">
                                      <span className="flex-1 truncate">
                                        {produto.nome}
                                      </span>
                                      <span className="ml-2 text-[var(--text-muted)]">
                                        x{produto.quantidade}
                                      </span>
                                    </div>
                                    {produto.descricao && (
                                      <p className="mt-0.5 text-[10px] text-[var(--text-secondary)] line-clamp-2">
                                        {produto.descricao}
                                      </p>
                                    )}
                                    {produto.adicionais && produto.adicionais.length > 0 && (
                                      <div className="mt-0.5 space-y-0.5">
                                        {produto.adicionais.map((adicional, index) => {
                                          const config = adicionaisConfig.find(
                                            item => item.nome === adicional,
                                          )
                                          const preco = config?.preco ?? 0
                                          const descricao = config?.descricao
                                          return (
                                            <div
                                              key={`${adicional}-${index}`}
                                              className="flex items-center justify-between text-[10px]"
                                            >
                                              <div className="flex flex-col">
                                                <span className="text-[var(--text-secondary)]">
                                                  {adicional}
                                                </span>
                                                <span className="text-[var(--text-muted)]">
                                                  {descricao ?? 'adicional'}
                                                </span>
                                              </div>
                                              {preco > 0 && (
                                                <span className="text-[var(--text-primary)] font-semibold">
                                                  {formatCurrency(preco)}
                                                </span>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </li>
                                ))}
                                {pedido.produtos.length > 3 && (
                                  <li className="text-[11px] text-[var(--text-muted)]">
                                    + {pedido.produtos.length - 3} itens
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(pedido.valor)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={event => {
                                  event.stopPropagation()
                                  abrirChatComCliente(pedido.cliente)
                                }}
                                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                              >
                                <MessageCircle size={14} />
                                Chat
                              </button>

                              <div className="hidden md:flex gap-1">
                                {status === 'pendente' && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAvancarStatus(pedido.id)
                                      }}
                                      className="text-xs bg-[var(--primary-100)] hover:opacity-90 text-white font-medium px-3 py-1.5 rounded-[12px]"
                                    >
                                      Iniciar
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleCancelarPedido(pedido.id)
                                      }}
                                      className="text-xs bg-red-500 hover:bg-red-600 text-white font-medium px-2 py-1.5 rounded-[12px]"
                                    >
                                      <X size={14} />
                                    </button>
                                  </>
                                )}
                                
                                {status === 'preparacao' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAvancarStatus(pedido.id)
                                    }}
                                    className="text-xs bg-[var(--primary-100)] hover:opacity-90 text-white font-medium px-3 py-1.5 rounded-[12px]"
                                  >
                                    Enviar
                                  </button>
                                )}
                                
                                {status === 'rota' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAvancarStatus(pedido.id)
                                    }}
                                    className="text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-[12px]"
                                  >
                                    Concluir
                                  </button>
                                )}

                                {status === 'entregue' && (
                                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    Entregue
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Botões Mobile - Navegação de Status */}
                          <div className="flex md:hidden gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoverStatus(pedido.id, 'anterior')
                              }}
                              disabled={status === 'pendente'}
                              className="flex-1 flex items-center justify-center gap-1 bg-[var(--surface-nav)] hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--text-primary)] font-medium px-3 py-2 rounded-[12px] text-xs"
                            >
                              <ChevronLeft size={16} />
                              Voltar
                            </button>
                            
                            {status === 'pendente' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelarPedido(pedido.id)
                                }}
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-[12px] text-xs"
                              >
                                <X size={16} />
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoverStatus(pedido.id, 'proximo')
                              }}
                              disabled={status === 'entregue'}
                              className="flex-1 flex items-center justify-center gap-1 bg-[var(--primary-100)] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded-[12px] text-xs"
                            >
                              Avançar
                              <ChevronRight size={16} />
                            </button>
                          </div>
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

      <button
        type="button"
        onClick={abrirOuFecharChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[var(--primary-100)] px-4 py-3 sm:px-5 sm:py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all"
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">Chat com clientes</span>
      </button>

      {/* MODAL DE DETALHES DO PEDIDO */}
      {pedidoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-[12px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Detalhes do Pedido
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {pedidoSelecionado.id}
                </p>
              </div>
                <div className="flex items-center gap-2">
                  {pedidoEditando && pedidoOriginalEdicao?.id === pedidoSelecionado.id ? (
                    <>
                      <button
                        type="button"
                        onClick={salvarEdicaoPedido}
                        className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--primary-100)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                      >
                        Salvar e avisar cliente
                      </button>
                      <button
                        type="button"
                        onClick={cancelarEdicaoPedido}
                        className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                      >
                        Cancelar edição
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => iniciarEdicaoPedido(pedidoSelecionado)}
                      className="inline-flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                    >
                      Editar pedido
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPedidoSelecionado(null)
                      cancelarEdicaoPedido()
                    }}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X size={24} />
                  </button>
                </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Cliente</label>
                <p className="text-base font-semibold text-[var(--text-primary)] mt-1">{pedidoSelecionado.cliente}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Endereço de Entrega</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{pedidoSelecionado.endereco}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Observações
                </label>
                {pedidoEditando && pedidoOriginalEdicao?.id === pedidoSelecionado.id ? (
                  <textarea
                    value={pedidoEditando.observacao ?? ''}
                    onChange={event => atualizarObservacaoPedido(event.target.value)}
                    className="mt-1 w-full rounded-[12px] border border-[var(--border)] bg-[var(--bg-body)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                    placeholder="Exemplos: retirar item em falta, trocar refrigerante por suco, adicionar bacon extra."
                    rows={3}
                  />
                ) : pedidoSelecionado.observacao ? (
                  <p className="text-sm text-[var(--text-primary)] bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[12px] p-3 mt-1">
                    {pedidoSelecionado.observacao}
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Nenhuma observação adicionada.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Itens do Pedido
                </label>
                {pedidoEditando && pedidoOriginalEdicao?.id === pedidoSelecionado.id ? (
                  <div className="mt-2 space-y-3">
                    {pedidoEditando.produtos.map((produto, index) => {
                      const novoAdicional = novoAdicionalPorProduto[index] ?? ''
                      return (
                        <div
                          key={`${produto.nome}-${index}`}
                          className="space-y-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex-1 truncate">
                              {produto.nome}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => atualizarQuantidadeProduto(index, produto.quantidade - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-body)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                              >
                                -
                              </button>
                              <span className="w-10 text-center text-xs text-[var(--text-secondary)]">
                                x{produto.quantidade}
                              </span>
                              <button
                                type="button"
                                onClick={() => atualizarQuantidadeProduto(index, produto.quantidade + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-body)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removerProduto(index)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remover
                            </button>
                          </div>

                          <div className="space-y-2">
                            {produto.descricao && (
                              <p className="text-[11px] text-[var(--text-secondary)]">
                                {produto.descricao}
                              </p>
                            )}
                            {produto.adicionais && produto.adicionais.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {produto.adicionais.map((adicional, i) => (
                                  <button
                                    key={`${adicional}-${i}`}
                                    type="button"
                                    onClick={() => removerAdicionalProduto(index, i)}
                                    className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-body)] px-2 py-1 text-[10px] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-hover)]"
                                  >
                                    <span>{adicional}</span>
                                    <span className="text-[var(--text-muted)]">×</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="flex flex-col gap-2 sm:flex-row">
                              <input
                                type="text"
                                value={novoAdicional}
                                onChange={event =>
                                  setNovoAdicionalPorProduto(prev => ({
                                    ...prev,
                                    [index]: event.target.value,
                                  }))
                                }
                                placeholder="Adicionar adicional (ex: queijo, bacon, sem cebola)"
                                className="flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                              />
                              <button
                                type="button"
                                onClick={() => adicionarAdicionalProduto(index)}
                                className="inline-flex items-center justify-center rounded-[10px] bg-[var(--primary-100)] px-3 py-2 text-[11px] font-semibold text-white hover:opacity-90"
                              >
                                Salvar adicional
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    <div className="mt-3 space-y-2 rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface)] p-3">
                      <p className="text-xs font-semibold text-[var(--text-secondary)]">
                        Adicionar item ou adicional
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={novoItemNome}
                          onChange={event => setNovoItemNome(event.target.value)}
                          placeholder="Exemplo: Bacon extra, borda recheada, trocar refrigerante por suco"
                          className="flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={novoItemQuantidade}
                            onChange={event => {
                              const valor = Number(event.target.value)
                              if (Number.isNaN(valor) || valor <= 0) {
                                setNovoItemQuantidade(1)
                              } else {
                                setNovoItemQuantidade(valor)
                              }
                            }}
                            className="w-20 rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] px-2 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                          />
                          <button
                            type="button"
                            onClick={adicionarNovoProduto}
                            className="inline-flex items-center justify-center rounded-[10px] bg-[var(--primary-100)] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Exemplos de adicionais: adicionar bacon extra, tirar cebola, trocar bebida,
                        adicionar molho especial.
                      </p>
                    </div>
                  </div>
                ) : pedidoSelecionado.produtos.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {pedidoSelecionado.produtos.map(produto => (
                      <div key={produto.nome} className="space-y-1 text-sm text-[var(--text-primary)]">
                        <div className="flex items-center justify-between">
                          <span className="flex-1 truncate">
                            {produto.nome}
                          </span>
                          <span className="ml-2 text-xs text-[var(--text-secondary)]">
                            x{produto.quantidade}
                          </span>
                        </div>
                        {produto.descricao && (
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            {produto.descricao}
                          </p>
                        )}
                        {produto.adicionais && produto.adicionais.length > 0 && (
                          <p className="text-[11px] text-[var(--text-muted)]">
                            Adicionais: {produto.adicionais.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Nenhum item cadastrado neste pedido.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Status</label>
                  <p className="text-sm font-medium text-[var(--text-primary)] mt-1 flex items-center gap-2">
                    {React.createElement(statusConfig[pedidoSelecionado.status].icon, { 
                      size: 16,
                      className: 'text-[var(--primary-100)]'
                    })}
                    {statusConfig[pedidoSelecionado.status].titulo}
                  </p>
                </div>
                <div className="text-right">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Valor Total</label>
                  {pedidoEditando && pedidoOriginalEdicao?.id === pedidoSelecionado.id ? (
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <input
                        type="text"
                        value={pedidoEditando.valor.toString().replace('.', ',')}
                        onChange={event => atualizarValorPedido(event.target.value)}
                        className="w-32 rounded-[10px] border border-[var(--border)] bg-[var(--bg-body)] px-2 py-1.5 text-right text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                      />
                      <span className="text-xs text-[var(--text-secondary)]">R$</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(pedidoSelecionado.valor)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Criado em</label>
                <p className="text-sm text-[var(--text-primary)] mt-1">{pedidoSelecionado.criadoEm}</p>
              </div>
            </div>

            <button
              onClick={() => setPedidoSelecionado(null)}
              className="w-full bg-[var(--primary-100)] hover:opacity-90 text-white font-bold py-3 rounded-[12px] transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {chatAberto && (
        <div className="fixed inset-0 z-50 flex justify-end items-end">
          <div className="flex-1 h-full" onClick={() => setChatAberto(false)} />
          <div className="w-full max-w-md px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="bg-[var(--surface)] rounded-[12px] shadow-2xl border border-[var(--border)] flex flex-col sm:flex-row h-[70vh] sm:h-[480px] overflow-hidden">
              <div className="hidden sm:flex w-60 flex-col border-r border-[var(--border)] bg-[var(--surface-nav)]">
                <div className="px-3 py-3 text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--border)]">
                  Clientes
                </div>
                <div className="flex-1">
                  {clientesChat.length === 0 && (
                    <div className="px-3 py-4 text-[11px] text-[var(--text-secondary)]">
                      Nenhum cliente com pedido no momento.
                    </div>
                  )}
                  {clientesChat.map(cliente => (
                    <button
                      key={cliente.nome}
                      type="button"
                      onClick={() => selecionarClienteChat(cliente.nome)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs border-l-4 ${
                        clienteSelecionadoChat === cliente.nome
                          ? 'bg-[var(--bg-hover)] border-[var(--primary-100)] text-[var(--text-primary)]'
                          : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <img
                        src={cliente.avatarUrl}
                        alt={cliente.nome}
                        className="h-8 w-8 rounded-full object-cover border border-[var(--border)] bg-[var(--bg-body)]"
                      />
                      <div className="flex flex-col items-start gap-0.5 w-full">
                        <span className="font-semibold text-xs text-[var(--text-primary)] truncate w-full">
                          {cliente.nome}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                          {cliente.ultimoPedidoId}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-[var(--bg-body)]">
                <div className="flex items-center justify-between gap-2 px-3 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center gap-2">
                    {clienteSelecionadoInfo ? (
                      <img
                        src={clienteSelecionadoInfo.avatarUrl}
                        alt={clienteSelecionadoInfo.nome}
                        className="h-8 w-8 rounded-full object-cover border border-[var(--border)] bg-[var(--bg-body)]"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-100)] text-white">
                        <MessageCircle size={18} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {clienteSelecionadoChat || 'Selecione um cliente'}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Atendimento da loja
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={clienteSelecionadoChat || ''}
                      onChange={event => selecionarClienteChat(event.target.value)}
                      className="sm:hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-body)] px-2 py-1 text-xs text-[var(--text-primary)]"
                    >
                      <option value="" disabled>
                        Clientes
                      </option>
                      {clientesChat.map(cliente => (
                        <option key={cliente.nome} value={cliente.nome}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setChatAberto(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-body)]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                  {clienteSelecionadoChat && mensagensClienteSelecionado.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <p className="max-w-[220px] text-center text-xs text-[var(--text-secondary)]">
                        Nenhuma mensagem ainda com este cliente. Envie uma mensagem para iniciar a
                        conversa.
                      </p>
                    </div>
                  )}

                  {!clienteSelecionadoChat && (
                    <div className="flex h-full items-center justify-center">
                      <p className="max-w-[240px] text-center text-xs text-[var(--text-secondary)]">
                        Selecione um cliente para visualizar e enviar mensagens.
                      </p>
                    </div>
                  )}

                  {clienteSelecionadoChat &&
                    mensagensClienteSelecionado.map(mensagem => {
                      const alinhamento =
                        mensagem.remetente === 'loja' ? 'justify-end' : 'justify-start'
                      const bubbleClasses =
                        mensagem.remetente === 'loja'
                          ? 'bg-[var(--primary-100)] text-white rounded-[12px] rounded-br-sm'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-[12px] rounded-bl-sm'

                      return (
                        <div key={mensagem.id} className={`flex ${alinhamento}`}>
                          <div className={`max-w-[80%] px-3 py-2 text-xs ${bubbleClasses}`}>
                            <p className="whitespace-pre-wrap break-words">{mensagem.texto}</p>
                            <span className="mt-1 inline-block text-[10px] opacity-80">
                              {mensagem.hora}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
                  <form
                    onSubmit={event => {
                      event.preventDefault()
                      handleEnviarMensagem()
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={mensagemAtual}
                      onChange={event => setMensagemAtual(event.target.value)}
                      placeholder={
                        clienteSelecionadoChat
                          ? 'Digite uma mensagem'
                          : 'Selecione um cliente para enviar mensagens'
                      }
                      className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg-body)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)]"
                    />
                    <button
                      type="submit"
                      disabled={!clienteSelecionadoChat || !mensagemAtual.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--primary-100)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

