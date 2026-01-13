import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Search, Plus, Minus, ShoppingBag, X, Trash2, Clock, MapPin, Tag } from 'lucide-react';

// --- TIPAGENS ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  id: string;
  title: string;
  icon?: string;
  items: Product[];
}

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
        discount: 15 
      },
      { 
        id: 102, 
        name: "Trio Cheddar Premium", 
        description: "Hamburguer artesanal com cheddar derretido + Refri + Sobremesa", 
        price: 32.50, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&q=80", 
        discount: 10 
      },
    ]
  },
  {
    id: 'burgers',
    title: '🍔 Hambúrgueres',
    items: [
      { 
        id: 201, 
        name: "Bloomin' Bacon Burger", 
        description: "Pão brioche, carne angus 180g, queijo cheddar derretido, bacon crocante e molho barbecue", 
        price: 28.00, 
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 202, 
        name: "Classic Aussie Burger", 
        description: "O clássico com alface fresca, tomate, queijo e nosso molho especial da casa", 
        price: 22.00, 
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 203, 
        name: "Veggie Aussie", 
        description: "Hamburguer vegetariano de grão de bico, guacamole cremoso e vegetais grelhados", 
        price: 26.00, 
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 204, 
        name: "Double Smash Burger", 
        description: "Dupla de carne smash, queijo americano, cebola caramelizada e picles crocantes", 
        price: 34.00, 
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop&q=80" 
      },
    ]
  },
  {
    id: 'drinks',
    title: '🥤 Bebidas',
    items: [
      { 
        id: 301, 
        name: "Coca-Cola Lata", 
        description: "350ml geladinha", 
        price: 6.00, 
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 302, 
        name: "Suco Natural Premium", 
        description: "Laranja ou limonada suíça 500ml", 
        price: 12.00, 
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 303, 
        name: "Milkshake Artesanal", 
        description: "Chocolate belga, morango ou baunilha 400ml com chantilly", 
        price: 15.00, 
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&h=600&fit=crop&q=80" 
      },
    ]
  },
  {
    id: 'sides',
    title: '🍟 Acompanhamentos',
    items: [
      { 
        id: 401, 
        name: "Bloomin' Fries", 
        description: "Porção de 400g de batatas fritas crocantes com tempero especial", 
        price: 14.00, 
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 402, 
        name: "Onion Rings Crocantes", 
        description: "12 anéis de cebola empanados servidos com molho ranch", 
        price: 16.00, 
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&h=600&fit=crop&q=80" 
      },
      { 
        id: 403, 
        name: "Chicken Nuggets Premium", 
        description: "10 nuggets de frango empanados com molho barbecue ou mostarda e mel", 
        price: 18.00, 
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=600&fit=crop&q=80" 
      },
    ]
  }
];

export const LojaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // --- LÓGICA DO CARRINHO ---
  
  const handleAddItem = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const getItemQuantity = (productId: number) => {
    return cart.find((item) => item.id === productId)?.quantity || 0;
  };

  // Filtrar produtos
  const filteredCategories = useMemo(() => {
    return CATALOG_MOCK.map(category => ({
      ...category,
      items: category.items.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || category.id === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    })).filter(category => category.items.length > 0);
  }, [searchTerm, selectedCategory]);

  // Cálculos
  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleCheckout = () => {
    alert("Pedido enviado com sucesso! (Integração futura)");
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="w-full min-h-screen pb-32">
      {/* HEADER COM HERO */}
      <div className="relative bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl overflow-hidden mb-6 shadow-xl">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative p-6 md:p-8">
          {/* Botão Voltar */}
          <button 
            onClick={() => navigate('/cliente/lojas')} 
            className="mb-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-white transition-all border border-white/30"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar</span>
          </button>

          {/* Info da Loja */}
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-2xl p-4 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80" 
                  className="w-full h-full object-cover rounded-lg"
                  alt="Logo"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Burger House #{id}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 font-bold px-3 py-1.5 rounded-lg shadow-md">
                  <Star size={16} fill="currentColor" /> 4.8
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-medium px-3 py-1.5 rounded-lg border border-white/30">
                  <Clock size={16} /> 30-45 min
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-medium px-3 py-1.5 rounded-lg border border-white/30">
                  <MapPin size={16} /> 2.5 km
                </span>
              </div>
              <p className="text-white/90 text-sm mt-3 max-w-2xl">
                Os melhores hambúrgueres artesanais da região! Ingredientes frescos e entrega rápida.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="mb-6 space-y-4">
        {/* Pesquisa */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
          <input 
            type="text" 
            placeholder="Buscar no cardápio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Filtro de Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[var(--primary-100)] text-white shadow-md'
                : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary-100)]'
            }`}
          >
            Todos
          </button>
          {CATALOG_MOCK.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-[var(--primary-100)] text-white shadow-md'
                  : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary-100)]'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* LISTAGEM DE PRODUTOS */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Nenhum produto encontrado</h3>
            <p className="text-[var(--text-secondary)]">Tente buscar por outro termo</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} id={category.id}>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                {category.title}
                <span className="text-sm font-normal text-[var(--text-muted)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border)]">
                  {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {category.items.map((product) => {
                  const qty = getItemQuantity(product.id);
                  const finalPrice = product.discount 
                    ? product.price * (1 - product.discount / 100)
                    : product.price;

                  return (
                    <div 
                      key={product.id} 
                      className={`
                        relative bg-[var(--surface)] rounded-2xl border overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 group
                        ${qty > 0 ? 'border-[var(--primary-100)] ring-2 ring-[var(--primary-100)] shadow-lg' : 'border-[var(--border)] hover:border-[var(--primary-100)]'}
                      `}
                    >
                      {/* Badge de Desconto */}
                      {product.discount && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Tag size={12} />
                          {product.discount}% OFF
                        </div>
                      )}

                      {/* IMAGEM */}
                      <div className="relative w-full h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        
                        {/* Botão de Adicionar/Quantidade */}
                        <div className="absolute bottom-3 right-3">
                          {qty === 0 ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddItem(product);
                              }}
                              className="bg-white hover:bg-[var(--primary-100)] text-[var(--primary-100)] hover:text-white p-3 rounded-full shadow-lg border-2 border-white transition-all hover:scale-110 active:scale-95"
                            >
                              <Plus size={20} strokeWidth={3} />
                            </button>
                          ) : (
                            <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-[var(--primary-100)] overflow-hidden">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveItem(product.id); }}
                                className="p-2 hover:bg-gray-100 text-[var(--primary-100)] transition-colors"
                              >
                                <Minus size={18} strokeWidth={3} />
                              </button>
                              <span className="text-base font-bold text-[var(--primary-100)] px-3">{qty}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAddItem(product); }}
                                className="p-2 bg-[var(--primary-100)] text-white hover:brightness-110 transition-all"
                              >
                                <Plus size={18} strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* INFORMAÇÕES DO PRODUTO */}
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--primary-100)] transition-colors line-clamp-2 min-h-[48px]">
                          {product.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex-1">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {product.discount ? (
                            <>
                              <span className="text-xs text-[var(--text-muted)] line-through">
                                {formatCurrency(product.price)}
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                {formatCurrency(finalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-[var(--text-primary)]">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- BARRA FLUTUANTE DO CARRINHO --- */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 w-full z-40 p-4 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between transition-all active:scale-[0.98] border-2 border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/90 font-medium">Total do pedido</p>
                  <p className="font-bold text-2xl text-white">{formatCurrency(cartTotal)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-white font-semibold hidden sm:block">Ver sacola</span>
                <span className="bg-white text-[var(--primary-100)] px-4 py-2 rounded-xl text-base font-bold shadow-md">
                  {cartCount}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL / SACOLA DE COMPRAS --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:justify-center items-end md:items-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Conteúdo do Modal */}
          <div className="relative w-full md:w-[520px] bg-[var(--surface)] md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 border border-[var(--border)]">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <div className="bg-[var(--primary-100)] p-2 rounded-lg">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                Sua Sacola
                <span className="bg-[var(--primary-100)] text-white text-sm font-bold px-3 py-1 rounded-full">
                  {cartCount}
                </span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-[var(--text-muted)]">Sua sacola está vazia.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start bg-[var(--bg-body)] border border-[var(--border)] rounded-xl p-4 hover:shadow-md transition-all">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100 flex-shrink-0 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-[var(--text-primary)] text-base line-clamp-1">{item.name}</h4>
                        <span className="font-bold text-[var(--text-primary)] text-base whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">{item.description}</p>
                      
                      {/* Controles do Item */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-[var(--border)] rounded-lg overflow-hidden">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 px-3 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            {item.quantity === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
                          </button>
                          <span className="px-4 text-base font-bold text-[var(--text-primary)] bg-[var(--surface)]">{item.quantity}</span>
                          <button 
                            onClick={() => handleAddItem(item)}
                            className="p-2 px-3 text-white bg-[var(--primary-100)] hover:brightness-110 transition-all"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {formatCurrency(item.price)} / un
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Totais */}
            {cart.length > 0 && (
              <div className="p-6 bg-[var(--surface-nav)] border-t border-[var(--border)] md:rounded-b-3xl">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Taxa de entrega</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between font-bold text-[var(--text-primary)] text-2xl pt-3 border-t-2 border-[var(--border)]">
                    <span>Total</span>
                    <span className="text-[var(--primary-100)]">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                  Fazer Pedido
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
