import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X, 
  Trash2, 
  Clock, 
  MapPin 
} from 'lucide-react';

// Importamos o contexto global
import { useCart, type CartItem } from '../../composables/CartContext'; 

// --- TIPAGENS ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  discount?: number;
  type?: 'simple' | 'configurable';
  isCustomizable?: boolean;
}

interface Category {
  id: string;
  title: string;
  icon?: string;
  items: Product[];
}

const MARMITA_PROTEINS = [
  { id: 'frango-grelhado', name: 'Frango grelhado' },
  { id: 'frango-empanado', name: 'Frango empanado' },
  { id: 'estrogonoff-frango', name: 'Estrogonoff de frango' },
  { id: 'carne-bovina-acebolada', name: 'Carne bovina acebolada' },
  { id: 'carne-moida', name: 'Carne moída' },
  { id: 'bife-milanesa', name: 'Bife à milanesa' },
  { id: 'linguica-calabresa', name: 'Linguiça calabresa' },
  { id: 'ovo-frito', name: 'Ovo frito' },
  { id: 'ovo-mexido', name: 'Ovo mexido' },
];

const MARMITA_SIDES = [
  { id: 'arroz-branco', name: 'Arroz branco' },
  { id: 'arroz-temperado', name: 'Arroz temperado com legumes' },
  { id: 'feijao', name: 'Feijão' },
  { id: 'feijao-tropeiro', name: 'Feijão tropeiro' },
  { id: 'farofa', name: 'Farofa' },
  { id: 'pure-batata', name: 'Purê de batata' },
  { id: 'batata-frita', name: 'Batata frita' },
  { id: 'macarrao', name: 'Macarrão ao alho e óleo' },
  { id: 'legumes', name: 'Legumes no vapor' },
  { id: 'salada', name: 'Salada simples' },
  { id: 'vinagrete', name: 'Vinagrete' },
];

const MARMITA_EXTRAS = [
  { id: 'extra-ovo', name: 'Ovo extra', price: 2 },
  { id: 'queijo-ralado', name: 'Queijo ralado', price: 1.5 },
  { id: 'bacon', name: 'Bacon', price: 3 },
  { id: 'molho-especial', name: 'Molho especial', price: 1 },
];

// --- DADOS MOCKADOS ---
const CATALOG_MOCK: Category[] = [
  {
    id: 'promo',
    title: '🔥 Destaques da Casa',
    items: [
      { 
        id: 101, 
        name: "Combo Duplo", 
        description: "2 Hamburgueres suculentos + Batata frita crocante + Refri 1L", 
        price: 45.90, 
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&q=80", 
        discount: 10
      },
      { 
        id: 102, 
        name: "Box Família", 
        description: "4 Smash Burgers + Batata Suprema + Nuggets (12un) + 2 Refris", 
        price: 89.90, 
        image: "https://images.unsplash.com/photo-1604908176997-125188f2c5b9?w=800&h=600&fit=crop&q=80" 
      },
      {
        id: 103,
        name: 'Monte sua Marmita',
        description: 'Escolha o tamanho e monte sua combinação perfeita de pratos executivos',
        price: 21.9,
        image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&h=600&fit=crop&q=80',
        type: 'configurable',
        isCustomizable: true,
      }
    ]
  },
  {
    id: 'executivos',
    title: '🍽️ Pratos Executivos',
    items: [
      {
        id: 401,
        name: 'Prato Executivo Filé Grelhado',
        description: 'Arroz, feijão, filé grelhado e batata frita',
        price: 32.9,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80',
      },
      {
        id: 402,
        name: 'Prato Executivo Estrogonoff de Frango',
        description: 'Estrogonoff de frango com arroz e batata palha',
        price: 29.9,
        image: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac1?w=800&h=600&fit=crop&q=80',
      },
      {
        id: 403,
        name: 'Prato Executivo Bife Acebolado',
        description: 'Arroz, feijão, bife acebolado e salada',
        price: 31.5,
        image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'burgers',
    title: '🍔 Hambúrgueres',
    items: [
      { 
        id: 201, 
        name: "X-Bacon", 
        description: "Pão brioche, carne 160g, queijo cheddar, bacon crocante e maionese da casa", 
        price: 28.50, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 202, 
        name: "Salada Burger", 
        description: "Pão, carne 160g, queijo prato, alface americana, tomate e cebola roxa", 
        price: 24.90, 
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop&q=80" 
      }
    ]
  },
  {
    id: 'bebidas',
    title: '🥤 Bebidas',
    items: [
      { id: 301, name: "Coca-Cola Lata", description: "350ml", price: 6.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&h=600&fit=crop&q=80" },
      { id: 302, name: "Suco de Laranja", description: "Natural 500ml", price: 12.00, image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&h=600&fit=crop&q=80" }
    ]
  }
];

export const LojaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- INTEGRAÇÃO COM CARRINHO GLOBAL ---
  const { 
    items: cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [customProductModal, setCustomProductModal] = useState<{
    product: Product;
    size: 'P' | 'M' | 'G' | null;
    selectedProteins: string[];
    selectedSides: string[];
    selectedExtras?: string[];
  } | null>(null);

  // Simulação de dados da Loja
  const storeMock = {
    id: id || '1',
    name: "Burger King", 
    rating: 4.8,
    deliveryTime: "30-45 min",
    minOrder: 15.00,
    deliveryFee: 5.90, 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
    categories: ["Lanches", "Bebidas", "Sobremesas"]
  };

  // Filtragem de produtos
  const filteredCatalog = useMemo(() => {
    return CATALOG_MOCK.map(cat => ({
      ...cat,
      items: cat.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0 && (selectedCategory === 'todos' || cat.id === selectedCategory));
  }, [searchTerm, selectedCategory]);

  const groupedCartItems = useMemo(() => {
    const groups: { storeId: string; storeName: string; items: CartItem[] }[] = [];
    const map = new Map<string, { storeId: string; storeName: string; items: CartItem[] }>();

    cartItems.forEach((item) => {
      let group = map.get(item.storeId);
      if (!group) {
        group = { storeId: item.storeId, storeName: item.storeName, items: [] };
        map.set(item.storeId, group);
        groups.push(group);
      }
      group.items.push(item);
    });

    return groups;
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    if (product.type === 'configurable') {
      setCustomProductModal({
        product,
        size: null,
        selectedProteins: [],
        selectedSides: [],
      });
      return;
    }

    addToCart({
      id: String(product.id),
      name: product.name,
      price: product.discount ? (product.price * (1 - product.discount / 100)) : product.price,
      image: product.image,
      quantity: 1,
      storeId: storeMock.id,
      storeName: storeMock.name
    });
  };

  const formatCurrency = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getMarmitaPrice = (basePrice: number, size: 'P' | 'M' | 'G') => {
    if (size === 'P') return basePrice;
    if (size === 'M') return basePrice + 4;
    return basePrice + 8;
  };

  const getProteinLimit = (size: 'P' | 'M' | 'G') => {
    if (size === 'G') return 2;
    return 1;
  };

  const getSideLimit = (size: 'P' | 'M' | 'G') => {
    if (size === 'P') return 2;
    return 3;
  };

  const extrasTotal =
    customProductModal?.selectedExtras && customProductModal.selectedExtras.length > 0
      ? customProductModal.selectedExtras.reduce((acc, extraId) => {
          const extra = MARMITA_EXTRAS.find((item) => item.id === extraId);
          if (!extra) return acc;
          return acc + extra.price;
        }, 0)
      : 0;

  let isMarmitaButtonDisabled = true;

  if (customProductModal && customProductModal.size) {
    const size = customProductModal.size;
    const proteinLimit = getProteinLimit(size);
    const sideLimit = getSideLimit(size);

    isMarmitaButtonDisabled =
      customProductModal.selectedProteins.length !== proteinLimit ||
      customProductModal.selectedSides.length !== sideLimit;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-24 md:pb-0">
      
      {/* HEADER / CAPA DA LOJA */}
      <div className="relative h-48 md:h-64 bg-[var(--bg-body)]">
        <img src={storeMock.image} alt={storeMock.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <button 
          onClick={() => navigate('/cliente/lojas')}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
          <h1 className="text-[28px] font-bold text-white mb-2">{storeMock.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
            <span className="flex items-center gap-1 text-yellow-400 font-bold">
              <Star size={16} fill="#FACC15" /> {storeMock.rating}
            </span>
            <span>• {storeMock.categories.join(', ')}</span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {storeMock.deliveryTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> 2.5km
            </span>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {/* BARRA DE PESQUISA E FILTROS 
            Ajuste: top-[70px] para não esconder atrás do header principal da App.
            z-40 para garantir que o conteúdo role por baixo dela.
        */}
        <div className="bg-[var(--bg-body)] pt-2 pb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input 
              type="text" 
              placeholder="Buscar no cardápio..." 
              className="w-full pl-10 pr-4 py-3 rounded-[12px] border border-[var(--border)] bg-[var(--bg-body)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('todos')}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'todos' 
                ? 'bg-[var(--primary-100)] text-white shadow-md' 
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]'
              }`}
            >
              Todos
            </button>
            {CATALOG_MOCK.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-[12px] text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id 
                  ? 'bg-[var(--primary-100)] text-white shadow-md' 
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* LISTAGEM DE PRODUTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Itens */}
          <div className="lg:col-span-2 space-y-8">
            {filteredCatalog.map(category => (
              <div key={category.id} id={category.id} className="scroll-mt-48">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map(product => {
                    // Cálculo de preço com desconto
                    const finalPrice = product.discount 
                      ? product.price * (1 - product.discount / 100) 
                      : product.price;

                    return (
                        <div 
                          key={product.id}
                          onClick={() => handleAddToCart(product)}
                          className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px] p-3 flex gap-3 cursor-pointer hover:border-[var(--primary-100)] transition-all hover:shadow-lg relative overflow-hidden"
                        >
                        {product.discount && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-[12px] z-10">
                            {product.discount}% OFF
                          </div>
                        )}
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {product.isCustomizable && (
                              <span className="inline-flex items-center rounded-full border border-[var(--primary-100)]/50 bg-[var(--surface-nav)] px-2 py-0.5 text-[10px] font-semibold text-[var(--primary-100)] mb-1">
                                Personalizável
                              </span>
                            )}
                            <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{product.description}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.discount && (
                                <span className="text-xs text-[var(--text-muted)] line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                              <span className="font-bold text-[var(--primary-100)]">
                                {formatCurrency(finalPrice)}
                              </span>
                            </div>
                            <button className="p-1.5 bg-[var(--bg-body)] rounded-[12px] text-[var(--text-secondary)] group-hover:bg-[var(--primary-100)] group-hover:text-white transition-colors">
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="w-24 h-24 rounded-[12px] overflow-hidden shrink-0 bg-[var(--bg-body)]">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna Direita: Carrinho */}
          <>
            {/* OVERLAY MOBILE */}
            {isCartOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsCartOpen(false)}
              />
            )}

            <div className={`
              fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-[var(--bg-card)] shadow-2xl transform transition-transform duration-300 ease-in-out
              ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
              
              /* --- AJUSTES PARA DESKTOP (lg:) --- */
              lg:translate-x-0 
              lg:static 
              lg:block 
              lg:sticky 
              /* AQUI ESTÁ A CORREÇÃO: top-[230px] para ficar bem abaixo da barra de pesquisa */
              lg:top-[230px]                 
              lg:h-fit                      
              /* Ajuste do max-h para descontar o novo top maior */
              lg:max-h-[calc(100vh-250px)]  
              lg:rounded-[12px] 
              lg:border 
              lg:border-[var(--border)]
              
              flex flex-col
            `}>
              
              {/* HEADER DO CARRINHO */}
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-nav)] lg:rounded-t-[12px] shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-[var(--primary-100)]" />
                  <span className="font-bold text-lg text-[var(--text-primary)]">Sua Sacola</span>
                  <span className="bg-[var(--primary-100)] text-white text-xs px-2 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-[var(--bg-hover)] rounded-full lg:hidden text-[var(--text-secondary)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* LISTA DE ITENS */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingBag size={48} className="mb-2 text-[var(--text-soft)]" />
                    <p className="text-[var(--text-secondary)]">Sua sacola está vazia</p>
                    <p className="text-xs text-[var(--text-muted)]">Adicione itens deliciosos!</p>
                  </div>
                ) : (
                  groupedCartItems.map(group => (
                    <div key={group.storeId} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">
                          {group.storeName}
                        </h3>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {group.items.reduce((acc, it) => acc + it.quantity, 0)} itens
                        </span>
                      </div>
                      <div className="space-y-3">
                        {group.items.map((item) => (
                          <div key={item.id} className="flex gap-3 animate-fadeIn">
                            <div className="w-16 h-16 rounded-[12px] overflow-hidden shrink-0 border border-[var(--border)]">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{item.name}</h4>
                                <span className="text-xs font-bold text-[var(--text-primary)]">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-[var(--border)] rounded-[12px]">
                                  <button 
                                    onClick={() => updateQuantity(String(item.id), -1)}
                                    className="p-1 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-xs font-medium w-6 text-center text-[var(--text-primary)]">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(String(item.id), 1)}
                                    className="p-1 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button 
                                  onClick={() => removeFromCart(String(item.id))}
                                  className="text-[var(--danger)] hover:bg-red-50 p-1.5 rounded-[12px] transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[var(--border)] pt-2" />
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER DO CARRINHO (AÇÕES) */}
              {cartItems.length > 0 && (
                <div className="p-4 bg-[var(--surface-nav)] border-t border-[var(--border)] md:rounded-b-[12px] shrink-0">
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-[var(--text-secondary)] text-sm">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[var(--text-primary)] text-xl pt-3 border-t border-[var(--border)]">
                      <span>Total</span>
                      <span className="text-[var(--primary-100)]">{formatCurrency(cartTotal)}</span>
                    </div>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => navigate('/cliente/checkout')}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-[12px] font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Fazer Pedido</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-[12px] text-sm">{formatCurrency(cartTotal)}</span>
                    </button>

                    <button 
                      onClick={() => navigate('/cliente/lojas')}
                      className="w-full bg-transparent border border-[var(--primary-100)] text-[var(--primary-100)] hover:bg-[var(--primary-50)] py-3 rounded-[12px] font-bold text-md transition-colors"
                    >
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>

        </div>
      </div>
      
      {/* BOTÃO FLUTUANTE MOBILE (Só aparece se o drawer estiver fechado e tiver itens) */}
      {!isCartOpen && cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-[var(--primary-100)] text-white p-4 rounded-[12px] shadow-xl flex items-center justify-between font-bold animate-bounce-short"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white/20 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
              <span>Ver Sacola</span>
            </div>
            <span>{formatCurrency(cartTotal)}</span>
          </button>
        </div>
      )}

      {customProductModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[18px] md:rounded-[18px] border border-[var(--border)] shadow-2xl p-4 md:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)]">
                  {customProductModal.product.name}
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {customProductModal.product.description}
                </p>
              </div>
              <button
                onClick={() => setCustomProductModal(null)}
                className="p-1.5 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Escolha o tamanho da marmita
              </span>
              <div className="grid grid-cols-3 gap-3">
                {(['P', 'M', 'G'] as const).map((size) => {
                  const isActive = customProductModal.size === size;
                  const basePrice = customProductModal.product.price;
                  const price = getMarmitaPrice(basePrice, size);

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setCustomProductModal((prev) =>
                          prev
                            ? {
                                ...prev,
                                size,
                                selectedProteins: [],
                                selectedSides: [],
                              }
                            : prev
                        )
                      }
                      className={`flex flex-col items-center justify-center rounded-[14px] border px-2 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'border-[var(--primary-100)] bg-[var(--primary-100)]/10 text-[var(--primary-100)] shadow-sm'
                          : 'border-[var(--border)] bg-[var(--surface-nav)] text-[var(--text-secondary)] hover:border-[var(--primary-100)]'
                      }`}
                    >
                      <span className="text-base">
                        {size === 'P' ? 'P' : size === 'M' ? 'M' : 'G'}
                      </span>
                      <span className="text-[10px] opacity-80">
                        {size === 'P'
                          ? '1 proteína + 2 acompanhamentos'
                          : size === 'M'
                          ? '1 proteína + 3 acompanhamentos'
                          : '2 proteínas + 3 acompanhamentos'}
                      </span>
                      <span className="mt-1 text-[11px] font-semibold">
                        {formatCurrency(price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {customProductModal.size && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Proteínas
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Proteínas: {customProductModal.selectedProteins.length} de{' '}
                      {getProteinLimit(customProductModal.size)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {MARMITA_PROTEINS.map((protein) => {
                      const isSelected = customProductModal.selectedProteins.includes(
                        protein.id,
                      );
                      const limit = getProteinLimit(customProductModal.size as 'P' | 'M' | 'G');
                      const isFull =
                        !isSelected &&
                        customProductModal.selectedProteins.length >= limit;

                      return (
                        <button
                          key={protein.id}
                          type="button"
                          disabled={isFull}
                          onClick={() =>
                            setCustomProductModal((prev) => {
                              if (!prev || !prev.size) return prev;

                              const currentSelected = prev.selectedProteins;
                              const alreadySelected = currentSelected.includes(
                                protein.id,
                              );
                              const max = getProteinLimit(prev.size);

                              if (alreadySelected) {
                                return {
                                  ...prev,
                                  selectedProteins: currentSelected.filter(
                                    (id) => id !== protein.id,
                                  ),
                                };
                              }

                              if (currentSelected.length >= max) {
                                return prev;
                              }

                              return {
                                ...prev,
                                selectedProteins: [
                                  ...currentSelected,
                                  protein.id,
                                ],
                              };
                            })
                          }
                          className={`flex items-center justify-between rounded-[12px] border px-3 py-2 text-xs transition-all ${
                            isSelected
                              ? 'border-[var(--primary-100)] bg-[var(--primary-100)]/10 text-[var(--primary-100)]'
                              : 'border-[var(--border)] bg-[var(--surface-nav)] text-[var(--text-secondary)] hover:border-[var(--primary-100)]'
                          } ${isFull ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <span className="truncate">{protein.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Acompanhamentos
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Acompanhamentos: {customProductModal.selectedSides.length} de{' '}
                      {getSideLimit(customProductModal.size)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {MARMITA_SIDES.map((side) => {
                      const isSelected = customProductModal.selectedSides.includes(
                        side.id,
                      );
                      const limit = getSideLimit(customProductModal.size as 'P' | 'M' | 'G');
                      const isFull =
                        !isSelected &&
                        customProductModal.selectedSides.length >= limit;

                      return (
                        <button
                          key={side.id}
                          type="button"
                          disabled={isFull}
                          onClick={() =>
                            setCustomProductModal((prev) => {
                              if (!prev || !prev.size) return prev;

                              const currentSelected = prev.selectedSides;
                              const alreadySelected = currentSelected.includes(
                                side.id,
                              );
                              const max = getSideLimit(prev.size);

                              if (alreadySelected) {
                                return {
                                  ...prev,
                                  selectedSides: currentSelected.filter(
                                    (id) => id !== side.id,
                                  ),
                                };
                              }

                              if (currentSelected.length >= max) {
                                return prev;
                              }

                              return {
                                ...prev,
                                selectedSides: [...currentSelected, side.id],
                              };
                            })
                          }
                          className={`flex items-center justify-between rounded-[12px] border px-3 py-2 text-xs transition-all ${
                            isSelected
                              ? 'border-[var(--primary-100)] bg-[var(--primary-100)]/10 text-[var(--primary-100)]'
                              : 'border-[var(--border)] bg-[var(--surface-nav)] text-[var(--text-secondary)] hover:border-[var(--primary-100)]'
                          } ${isFull ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <span className="truncate">{side.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Extras (opcional)
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Não entram no limite, somam no total
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
                    {MARMITA_EXTRAS.map((extra) => {
                      const isSelected =
                        customProductModal.selectedExtras?.includes(extra.id) ?? false;

                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() =>
                            setCustomProductModal((prev) => {
                              if (!prev) return prev;

                              const currentSelected = prev.selectedExtras ?? [];
                              const alreadySelected = currentSelected.includes(extra.id);

                              if (alreadySelected) {
                                return {
                                  ...prev,
                                  selectedExtras: currentSelected.filter(
                                    (id) => id !== extra.id,
                                  ),
                                };
                              }

                              return {
                                ...prev,
                                selectedExtras: [...currentSelected, extra.id],
                              };
                            })
                          }
                          className={`flex items-center justify-between rounded-[12px] border px-3 py-2 text-xs transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                              : 'border-[var(--border)] bg-[var(--surface-nav)] text-[var(--text-secondary)] hover:border-[var(--primary-100)]'
                          }`}
                        >
                          <span className="truncate">{extra.name}</span>
                          <span className="ml-2 whitespace-nowrap text-[11px] font-semibold">
                            + {formatCurrency(extra.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-[11px] text-[var(--text-secondary)]">
                  Total da marmita
                </span>
                <span className="text-lg font-bold text-[var(--primary-100)]">
                  {customProductModal.size
                    ? formatCurrency(
                        getMarmitaPrice(
                          customProductModal.product.price,
                          customProductModal.size,
                        ) + extrasTotal,
                      )
                    : formatCurrency(customProductModal.product.price + extrasTotal)}
                </span>
              </div>

              <button
                type="button"
                disabled={isMarmitaButtonDisabled}
                onClick={() => {
                  if (!customProductModal || !customProductModal.size) return;

                  const size = customProductModal.size;
                  const price =
                    getMarmitaPrice(customProductModal.product.price, size) +
                    extrasTotal;

                  const selectedProteinNames = MARMITA_PROTEINS.filter((protein) =>
                    customProductModal.selectedProteins.includes(protein.id),
                  )
                    .map((protein) => protein.name)
                    .join(', ');

                  const selectedSideNames = MARMITA_SIDES.filter((side) =>
                    customProductModal.selectedSides.includes(side.id),
                  )
                    .map((side) => side.name)
                    .join(', ');

                  const selectedExtraNames =
                    customProductModal.selectedExtras && customProductModal.selectedExtras.length > 0
                      ? MARMITA_EXTRAS.filter((extra) =>
                          customProductModal.selectedExtras?.includes(extra.id),
                        )
                          .map((extra) => extra.name)
                          .join(', ')
                      : '';

                  addToCart({
                    id: `${customProductModal.product.id}-${size}-${customProductModal.selectedProteins.join(
                      '+',
                    )}-${customProductModal.selectedSides.join('+')}${
                      customProductModal.selectedExtras &&
                      customProductModal.selectedExtras.length > 0
                        ? `-${customProductModal.selectedExtras.join('+')}`
                        : ''
                    }`,
                    name: `${customProductModal.product.name} (${size}) - ${selectedProteinNames} | ${selectedSideNames}${
                      selectedExtraNames ? ` | Extras: ${selectedExtraNames}` : ''
                    }`,
                    price,
                    image: customProductModal.product.image,
                    quantity: 1,
                    storeId: storeMock.id,
                    storeName: storeMock.name,
                  });

                  setCustomProductModal(null);
                  setIsCartOpen(true);
                }}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-[14px] text-sm font-semibold transition-all ${
                  isMarmitaButtonDisabled
                    ? 'bg-[var(--bg-hover)] text-[var(--text-secondary)] cursor-not-allowed'
                    : 'bg-[var(--primary-100)] text-white hover:bg-[var(--primary-90)]'
                }`}
              >
                Adicionar à sacola
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
