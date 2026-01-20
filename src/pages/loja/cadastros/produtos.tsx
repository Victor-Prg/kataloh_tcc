import { useState } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  X,
  Package,
  List,
} from 'lucide-react'
import { 
  Input, 
  Button, 
  Textarea, 
  Select, 
  Card, 
  Badge,
  Switch 
} from '../../../components'

// --- TIPAGENS ---

type Categoria = {
  id: string
  nome: string
  descricao: string
  subDescricao?: string
}

type Adicional = {
  id: string
  nome: string
  valor: number
}

type TipoProduto = 'simples' | 'combo'

type ItemCombo = {
  produtoId: string
  quantidade: number
}

type Produto = {
  id: string
  categoriaId: string
  nome: string
  descricao: string
  ingredientes: string
  valor: number
  valorPromocional?: number
  imagem?: string
  adicionais: Adicional[]
  ativo: boolean
  tipo: TipoProduto
  itensCombo: ItemCombo[]
}

// --- DADOS MOCKADOS INICIAIS ---
const CATEGORIAS_MOCK: Categoria[] = [
  { id: '1', nome: 'Lanches', descricao: 'Hamburgueres artesanais', subDescricao: 'Acompanha maionese da casa' },
  { id: '2', nome: 'Bebidas', descricao: 'Refrigerantes e Sucos', subDescricao: 'Geladíssimos' }
]

const PRODUTOS_MOCK: Produto[] = []

export default function ProdutosCadastro() {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<'categorias' | 'produtos'>('categorias')
  
  // Estados de Dados
  const [categorias, setCategorias] = useState<Categoria[]>(CATEGORIAS_MOCK)
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_MOCK)

  // Estados dos Formulários
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form Categoria
  const [catForm, setCatForm] = useState<Omit<Categoria, 'id'>>({ nome: '', descricao: '', subDescricao: '' })

  // Form Produto
  const [prodForm, setProdForm] = useState<Omit<Produto, 'id'>>({
    categoriaId: '',
    nome: '',
    descricao: '',
    ingredientes: '',
    valor: 0,
    valorPromocional: undefined,
    imagem: '',
    adicionais: [],
    ativo: true,
    tipo: 'simples',
    itensCombo: [],
  })

  // Estado temporário para Adicionais dentro do form de produto
  const [tempAdicional, setTempAdicional] = useState({ nome: '', valor: '' })
  const [tempItemCombo, setTempItemCombo] = useState({ produtoId: '', quantidade: '' })

  // --- LÓGICA DE CATEGORIAS ---

  const handleSaveCategoria = () => {
    if (!catForm.nome || !catForm.descricao) return alert('Preencha os campos obrigatórios')

    if (editingId) {
      setCategorias(prev => prev.map(c => c.id === editingId ? { ...c, ...catForm } : c))
    } else {
      setCategorias(prev => [...prev, { id: crypto.randomUUID(), ...catForm }])
    }
    resetForms()
  }

  const handleEditCategoria = (cat: Categoria) => {
    setCatForm({ nome: cat.nome, descricao: cat.descricao, subDescricao: cat.subDescricao })
    setEditingId(cat.id)
    setIsFormOpen(true)
    setActiveTab('categorias')
  }

  const handleDeleteCategoria = (id: string) => {
    // Verifica se tem produtos vinculados antes de excluir
    const temProdutos = produtos.some(p => p.categoriaId === id);
    if (temProdutos) {
      alert('Não é possível excluir esta categoria pois existem produtos vinculados a ela.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategorias(prev => prev.filter(c => c.id !== id))
    }
  }

  // --- LÓGICA DE PRODUTOS ---

  const handleAddAdicional = () => {
    if (!tempAdicional.nome || !tempAdicional.valor) return
    const novoAdicional: Adicional = {
      id: crypto.randomUUID(),
      nome: tempAdicional.nome,
      valor: Number(tempAdicional.valor)
    }
    setProdForm(prev => ({ ...prev, adicionais: [...prev.adicionais, novoAdicional] }))
    setTempAdicional({ nome: '', valor: '' })
  }

  const handleRemoveAdicional = (id: string) => {
    setProdForm(prev => ({ ...prev, adicionais: prev.adicionais.filter(a => a.id !== id) }))
  }

  const handleSaveProduto = () => {
    if (!prodForm.nome || !prodForm.categoriaId || !prodForm.valor) {
      alert('Preencha os campos obrigatórios e selecione uma categoria')
      return
    }

    if (prodForm.tipo === 'combo' && (!prodForm.itensCombo || prodForm.itensCombo.length === 0)) {
      alert('Adicione ao menos um produto ao kit/combos antes de salvar')
      return
    }

    if (editingId) {
      setProdutos(prev => prev.map(p => p.id === editingId ? { ...p, ...prodForm } : p))
    } else {
      setProdutos(prev => [...prev, { id: crypto.randomUUID(), ...prodForm }])
    }
    resetForms()
  }

  const handleEditProduto = (prod: Produto) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = prod
    setProdForm(rest)
    setEditingId(prod.id)
    setIsFormOpen(true)
    setActiveTab('produtos')
  }

  // --- NOVA FUNÇÃO DE EXCLUIR PRODUTO ---
  const handleDeleteProduto = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto permanentemente?')) {
      setProdutos(prev => prev.filter(p => p.id !== id))
      resetForms() // Fecha o formulário após excluir
    }
  }

  const resetForms = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setCatForm({ nome: '', descricao: '', subDescricao: '' })
    setProdForm({
      categoriaId: '',
      nome: '',
      descricao: '',
      ingredientes: '',
      valor: 0,
      valorPromocional: undefined,
      imagem: '',
      adicionais: [],
      ativo: true,
      tipo: 'simples',
      itensCombo: [],
    })
  }

  const handleAddItemCombo = () => {
    if (!tempItemCombo.produtoId || !tempItemCombo.quantidade) return
    const quantidadeNumber = Number(tempItemCombo.quantidade)
    if (!Number.isFinite(quantidadeNumber) || quantidadeNumber <= 0) return

    setProdForm((prev) => {
      const itens = prev.itensCombo || []
      const existente = itens.find((item) => item.produtoId === tempItemCombo.produtoId)
      const atualizados = existente
        ? itens.map((item) =>
            item.produtoId === tempItemCombo.produtoId
              ? { ...item, quantidade: quantidadeNumber }
              : item,
          )
        : [...itens, { produtoId: tempItemCombo.produtoId, quantidade: quantidadeNumber }]

      return {
        ...prev,
        itensCombo: atualizados,
      }
    })

    setTempItemCombo({ produtoId: '', quantidade: '' })
  }

  const handleRemoveItemCombo = (produtoId: string) => {
    setProdForm((prev) => ({
      ...prev,
      itensCombo: prev.itensCombo.filter((item) => item.produtoId !== produtoId),
    }))
  }

  // --- RENDERIZADORES ---

  const renderTabButton = (tab: 'categorias' | 'produtos', label: string, icon: React.ReactNode) => (
    <button
      onClick={() => { setActiveTab(tab); setIsFormOpen(false); }}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
        activeTab === tab 
          ? 'border-[var(--primary-100)] text-[var(--primary-100)] font-semibold' 
          : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
      }`}
    >
      {icon}
      {label}
    </button>
  )

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--text-primary)]">Gestão de Cardápio</h1>
          <p className="text-sm text-[var(--text-secondary)]">Gerencie categorias e produtos da sua loja</p>
        </div>
        {!isFormOpen && (
          <Button 
            onClick={() => setIsFormOpen(true)}
            icon={<Plus size={20} />}
            label={activeTab === 'categorias' ? "Nova Categoria" : "Novo Produto"}
          />
        )}
      </div>

      {/* TABS */}
      {!isFormOpen && (
        <div className="flex border-b border-[var(--border-color)] mb-6">
          {renderTabButton('categorias', 'Categorias', <List size={18} />)}
          {renderTabButton('produtos', 'Produtos', <Package size={18} />)}
        </div>
      )}

      {/* --- MODO FORMULÁRIO --- */}
      {isFormOpen ? (
        <Card className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
            <h2 className="text-[20px] font-medium text-[var(--text-primary)]">
              {editingId ? 'Editar' : 'Cadastrar'} {activeTab === 'categorias' ? 'Categoria' : 'Produto'}
            </h2>
            <button onClick={resetForms} className="text-[var(--text-secondary)] hover:text-[var(--danger)]">
              <X size={24} />
            </button>
          </div>

          {activeTab === 'categorias' ? (
            // --- FORM CATEGORIA ---
            <div className="space-y-4 max-w-2xl">
              <Input 
                label="Nome da Categoria *"
                placeholder="Ex: Lanches, Bebidas"
                value={catForm.nome}
                onChange={e => setCatForm(prev => ({...prev, nome: e.target.value}))}
              />
              <Input 
                label="Descrição Curta *"
                placeholder="Ex: Os melhores da cidade"
                value={catForm.descricao}
                onChange={e => setCatForm(prev => ({...prev, descricao: e.target.value}))}
              />
              <Input 
                label="Sub-descrição (Opcional)"
                placeholder="Ex: Acompanha fritas"
                value={catForm.subDescricao || ''}
                onChange={e => setCatForm(prev => ({...prev, subDescricao: e.target.value}))}
              />
              <div className="pt-4 flex gap-3">
                <Button label="Salvar Categoria" onClick={handleSaveCategoria} />
                <Button variant="outline" label="Cancelar" onClick={resetForms} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Select 
                  label="Categoria *"
                  options={categorias.map(c => ({ label: c.nome, value: c.id }))}
                  value={prodForm.categoriaId}
                  onChange={e => setProdForm(prev => ({...prev, categoriaId: e.target.value}))}
                  placeholder="Selecione uma categoria..."
                />
                
                <Input 
                  label="Nome do Produto *"
                  placeholder="Ex: X-Salada"
                  value={prodForm.nome}
                  onChange={e => setProdForm(prev => ({...prev, nome: e.target.value}))}
                />

                <div>
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">
                    Tipo de produto
                  </span>
                  <div className="mt-2 inline-flex rounded-full bg-[var(--bg-body)] p-1 border border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() =>
                        setProdForm(prev => ({
                          ...prev,
                          tipo: 'simples',
                          itensCombo: [],
                        }))
                      }
                      className={`px-4 py-1.5 text-xs sm:text-[14px] rounded-full font-medium transition-colors ${
                        prodForm.tipo === 'simples'
                          ? 'bg-[var(--primary-100)] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Produto simples
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setProdForm(prev => ({
                          ...prev,
                          tipo: 'combo',
                        }))
                      }
                      className={`px-4 py-1.5 text-xs sm:text-[14px] rounded-full font-medium transition-colors ${
                        prodForm.tipo === 'combo'
                          ? 'bg-[var(--primary-100)] text-white shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Kit / Combo
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    Use combos para criar ofertas com vários produtos em um único item.
                  </p>
                </div>

                <Textarea 
                  label="Descrição *"
                  placeholder="Descreva o produto de forma atraente..."
                  value={prodForm.descricao}
                  onChange={e => setProdForm(prev => ({...prev, descricao: e.target.value}))}
                />

                <Textarea 
                  label="Ingredientes"
                  placeholder="Lista de ingredientes..."
                  value={prodForm.ingredientes}
                  onChange={e => setProdForm(prev => ({...prev, ingredientes: e.target.value}))}
                />

                <div className="space-y-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Imagem do Produto</span>
                  <div className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 flex flex-col items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs">Clique para fazer upload</span>
                    {prodForm.imagem && <span className="text-xs text-[var(--primary-100)] mt-1">Imagem selecionada</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label={prodForm.tipo === 'combo' ? 'Preço final do combo (R$) *' : 'Valor (R$) *'}
                    type="number"
                    placeholder="0,00"
                    value={prodForm.valor}
                    onChange={e => setProdForm(prev => ({...prev, valor: Number(e.target.value)}))}
                  />
                  <Input 
                    label="Valor Promocional"
                    type="number"
                    placeholder="0,00"
                    value={prodForm.valorPromocional || ''}
                    onChange={e => setProdForm(prev => ({...prev, valorPromocional: e.target.value ? Number(e.target.value) : undefined}))}
                  />
                </div>

                {prodForm.tipo === 'combo' && (
                  <div className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--surface)] space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Package size={16} /> Itens do Kit / Combo
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Selecione produtos já cadastrados e defina a quantidade de cada um.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <Select
                          label="Produtos da loja"
                          placeholder="Selecione um produto"
                          value={tempItemCombo.produtoId}
                          onChange={e => setTempItemCombo(prev => ({ ...prev, produtoId: e.target.value }))}
                          options={produtos
                            .filter(p => p.id !== editingId && p.ativo && p.tipo === 'simples')
                            .map(p => ({ label: p.nome, value: p.id }))}
                        />
                      </div>
                      <Input
                        label="Qtd."
                        type="number"
                        min={1}
                        className="sm:w-24"
                        value={tempItemCombo.quantidade}
                        onChange={e => setTempItemCombo(prev => ({ ...prev, quantidade: e.target.value }))}
                      />
                      <div className="flex items-end">
                        <Button
                          variant="secondary"
                          icon={<Plus size={16} />}
                          onClick={handleAddItemCombo}
                        />
                      </div>
                    </div>
                    {prodForm.itensCombo.length > 0 ? (
                      <div className="space-y-2">
                        {prodForm.itensCombo.map((item) => {
                          const base = produtos.find(p => p.id === item.produtoId)
                          if (!base) return null
                          return (
                            <div
                              key={item.produtoId}
                              className="flex justify-between items-center bg-[var(--bg-body)] p-2 rounded text-sm"
                            >
                              <div>
                                <p className="font-medium text-[var(--text-primary)]">
                                  {base.nome}
                                </p>
                                <p className="text-[11px] text-[var(--text-secondary)]">
                                  Quantidade: {item.quantidade}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemCombo(item.produtoId)}
                                className="text-[var(--danger)] hover:opacity-80"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-[var(--text-secondary)] italic">
                        Nenhum item adicionado ao combo.
                      </p>
                    )}
                  </div>
                )}

                <div className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--surface)]">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Plus size={16} /> Adicionais / Opcionais
                  </h3>
                  
                  <div className="flex gap-2 mb-3">
                    <Input 
                      placeholder="Nome (ex: Bacon)" 
                      className="flex-1" 
                      value={tempAdicional.nome}
                      onChange={e => setTempAdicional(prev => ({...prev, nome: e.target.value}))}
                    />
                    <Input 
                      placeholder="R$" 
                      type="number" 
                      className="w-24" 
                      value={tempAdicional.valor}
                      onChange={e => setTempAdicional(prev => ({...prev, valor: e.target.value}))}
                    />
                    <Button 
                      variant="secondary" 
                      icon={<Plus size={16} />} 
                      onClick={handleAddAdicional}
                    />
                  </div>

                  {prodForm.adicionais.length > 0 ? (
                    <div className="space-y-2">
                      {prodForm.adicionais.map(ad => (
                        <div key={ad.id} className="flex justify-between items-center bg-[var(--bg-body)] p-2 rounded text-sm">
                          <span>{ad.nome}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{formatCurrency(ad.valor)}</span>
                            <button onClick={() => handleRemoveAdicional(ad.id)} className="text-[var(--danger)] hover:opacity-80">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-secondary)] italic">Nenhum adicional cadastrado.</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                   <span className="text-sm font-medium">Produto Ativo?</span>
                   <Switch checked={prodForm.ativo} onToggle={() => setProdForm(prev => ({...prev, ativo: !prev.ativo}))} />
                </div>

                <div className="pt-6 flex flex-wrap justify-between items-center gap-4 border-t border-[var(--border-color)] mt-4">
                   {editingId ? (
                     <Button 
                        variant="danger" 
                        icon={<Trash2 size={18} />} 
                        label="Excluir Produto"
                        onClick={() => handleDeleteProduto(editingId)} 
                     />
                   ) : (
                     <div />
                   )}

                   <div className="flex gap-3">
                      <Button variant="outline" label="Cancelar" onClick={resetForms} />
                      <Button label="Salvar Produto" onClick={handleSaveProduto} />
                   </div>
                </div>

              </div>
            </div>
          )}
        </Card>
      ) : (
        // --- MODO LISTAGEM ---
        <div className="space-y-4">
          
          {/* LISTA DE CATEGORIAS */}
          {activeTab === 'categorias' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorias.length === 0 && (
                <div className="col-span-full text-center py-10 text-[var(--text-secondary)]">
                  Nenhuma categoria cadastrada.
                </div>
              )}
              {categorias.map(cat => (
                <Card key={cat.id} className="group relative hover:border-[var(--primary-100)] transition-colors">
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditCategoria(cat)} className="p-1 hover:bg-[var(--bg-hover)] rounded"><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteCategoria(cat.id)} className="p-1 hover:bg-[var(--danger)] hover:text-white rounded"><Trash2 size={16} /></button>
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{cat.nome}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{cat.descricao}</p>
                  {cat.subDescricao && (
                     <Badge label={cat.subDescricao} variant="neutro" />
                  )}
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                     {produtos.filter(p => p.categoriaId === cat.id).length} produtos vinculados
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* LISTA DE PRODUTOS */}
          {activeTab === 'produtos' && (
            <div className="space-y-4">
               {produtos.length === 0 && (
                <div className="text-center py-10 text-[var(--text-secondary)] bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border-color)]">
                  Nenhum produto cadastrado. <br/> Certifique-se de ter uma categoria antes de criar um produto.
                </div>
              )}
              {produtos.map(prod => (
                <div key={prod.id} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-16 h-16 bg-[var(--bg-body)] rounded-md flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                    <ImageIcon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                       <h3 className="font-bold text-[var(--text-primary)] truncate">{prod.nome}</h3>
                       {prod.tipo === 'combo' && <Badge label="Combo" variant="neutro" />}
                       {!prod.ativo && <Badge label="Inativo" variant="perigo" />}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{prod.descricao}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {categorias.find(c => c.id === prod.categoriaId)?.nome || 'Sem Categoria'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {prod.valorPromocional ? (
                      <div className="flex flex-col items-end">
                         <span className="text-xs line-through text-[var(--text-secondary)]">{formatCurrency(prod.valor)}</span>
                         <span className="font-bold text-[var(--success)]">{formatCurrency(prod.valorPromocional)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-[var(--text-primary)]">{formatCurrency(prod.valor)}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pl-4 border-l border-[var(--border-color)]">
                    <button onClick={() => handleEditProduto(prod)} className="p-2 hover:bg-[var(--bg-hover)] rounded-md text-[var(--text-secondary)] hover:text-[var(--primary-100)]">
                      <Edit3 size={18} />
                    </button>
                    {/* Botão de excluir pode ser adicionado aqui se necessário */}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
