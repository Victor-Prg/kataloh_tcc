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
import { useCart } from '../../composables/CartContext'; 

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
        discount: 10
      },
      { 
        id: 102, 
        name: "Box Família", 
        description: "4 Smash Burgers + Batata Suprema + Nuggets (12un) + 2 Refris", 
        price: 89.90, 
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop&q=80" 
      }
    ]
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

  const handleAddToCart = (product: Product) => {
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

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pb-24 md:pb-0">
      
      {/* HEADER / CAPA DA LOJA */}
      <div className="relative h-48 md:h-64 bg-gray-200">
        <img src={storeMock.image} alt={storeMock.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <button 
          onClick={() => navigate('/cliente/lojas')}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{storeMock.name}</h1>
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
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        
        {/* BARRA DE PESQUISA E FILTROS 
            Ajuste: top-[70px] para não esconder atrás do header principal da App.
            z-40 para garantir que o conteúdo role por baixo dela.
        */}
        <div className="bg-[var(--bg-body)] pt-2 pb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar no cardápio..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-body)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
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
                        className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 flex gap-3 cursor-pointer hover:border-[var(--primary-100)] transition-all hover:shadow-lg relative overflow-hidden"
                      >
                        {product.discount && (
                          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">
                            {product.discount}% OFF
                          </div>
                        )}
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{product.description}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.discount && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                              )}
                              <span className="font-bold text-[var(--primary-100)]">
                                {formatCurrency(finalPrice)}
                              </span>
                            </div>
                            <button className="p-1.5 bg-[var(--bg-body)] rounded-lg text-[var(--text-secondary)] group-hover:bg-[var(--primary-100)] group-hover:text-white transition-colors">
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
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
              lg:rounded-2xl 
              lg:border 
              lg:border-[var(--border)]
              
              flex flex-col
            `}>
              
              {/* HEADER DO CARRINHO */}
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-nav)] lg:rounded-t-2xl shrink-0">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingBag size={48} className="mb-2 text-gray-300" />
                    <p className="text-[var(--text-secondary)]">Sua sacola está vazia</p>
                    <p className="text-xs text-[var(--text-muted)]">Adicione itens deliciosos!</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 animate-fadeIn">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{item.name}</h4>
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                        {item.storeName && (
                          <p className="text-[10px] text-[var(--text-muted)] mb-2 truncate">
                            Loja: {item.storeName}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[var(--border)] rounded-lg">
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
                            className="text-[var(--danger)] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER DO CARRINHO (AÇÕES) */}
              {cartItems.length > 0 && (
                <div className="p-4 bg-[var(--surface-nav)] border-t border-[var(--border)] md:rounded-b-3xl shrink-0">
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
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Fazer Pedido</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{formatCurrency(cartTotal)}</span>
                    </button>

                    <button 
                      onClick={() => navigate('/cliente/lojas')}
                      className="w-full bg-transparent border border-[var(--primary-100)] text-[var(--primary-100)] hover:bg-[var(--primary-50)] py-3 rounded-xl font-bold text-md transition-colors"
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
            className="w-full bg-[var(--primary-100)] text-white p-4 rounded-xl shadow-xl flex items-center justify-between font-bold animate-bounce-short"
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

    </div>
  );
};
