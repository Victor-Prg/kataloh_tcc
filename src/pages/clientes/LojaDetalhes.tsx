import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Search, Plus, Minus, ShoppingBag, X, Trash2 } from 'lucide-react';

// --- TIPAGENS ---
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  id: string;
  title: string;
  items: Product[];
}

// --- DADOS MOCKADOS ---
const CATALOG_MOCK: Category[] = [
  {
    id: 'promo',
    title: 'Destaques da Casa',
    items: [
      { id: 101, name: "Combo Duplo", description: "2 Hamburgueres + Batata", price: 45.90, image: "https://placehold.co/100x100/orange/white?text=Combo" },
      { id: 102, name: "Trio Cheddar", description: "Hamburguer Cheddar + Refri", price: 32.50, image: "https://placehold.co/100x100/red/white?text=Trio" },
    ]
  },
  {
    id: 'burgers',
    title: 'Hambúrgueres',
    items: [
      { id: 201, name: "X-Bacon", description: "Pão, carne, queijo e muito bacon", price: 28.00, image: "https://placehold.co/100x100/brown/white?text=Bacon" },
      { id: 202, name: "X-Salada", description: "Clássico com alface e tomate", price: 22.00, image: "https://placehold.co/100x100/green/white?text=Salada" },
      { id: 203, name: "Veggie", description: "Hamburguer de grão de bico", price: 26.00, image: "https://placehold.co/100x100/green/white?text=Veggie" },
    ]
  },
  {
    id: 'drinks',
    title: 'Bebidas',
    items: [
      { id: 301, name: "Coca-Cola Lata", description: "350ml", price: 6.00, image: "https://placehold.co/100x100/red/white?text=Cola" },
      { id: 302, name: "Suco Natural", description: "Laranja 500ml", price: 12.00, image: "https://placehold.co/100x100/orange/white?text=Suco" },
    ]
  }
];

export const LojaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <div className="relative w-full min-h-screen bg-[var(--bg-body)]">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => navigate('/clientes')} 
        className="absolute top-4 left-4 z-40 bg-[var(--surface)] p-3 rounded-full shadow-md border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-body)] active:scale-95 transition-all"
      >
        <ArrowLeft size={20} />
      </button>

      {/* BANNER DE FUNDO */}
      <div className="absolute top-0 left-0 w-full h-40 bg-[var(--surface-nav)] z-0"></div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-6">
        
        {/* INFO DA LOJA */}
        <div className="mt-28 mb-6 md:mb-8">
           <div className="flex items-end gap-4 md:gap-5">
             <div className="relative flex-shrink-0">
                <img 
                  src="https://placehold.co/100x100/orange/white?text=LOGO" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[var(--bg-body)] shadow-lg bg-[var(--surface)]"
                  alt="Logo"
                />
             </div>
             
             <div className="mb-1 md:mb-2 flex-1">
               <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] drop-shadow-sm leading-tight">Loja Exemplo #{id}</h1>
               <div className="flex flex-wrap items-center text-xs md:text-sm text-[var(--text-secondary)] gap-2 mt-1 md:mt-2 font-medium">
                 <span className="text-yellow-500 flex items-center gap-1 bg-[var(--surface)] px-2 py-0.5 rounded-md border border-[var(--border)] shadow-sm">
                    <Star size={12} className="md:w-3.5 md:h-3.5" fill="currentColor"/> 4.8
                 </span>
                 <span className="px-2 py-0.5 bg-[var(--surface)] rounded-md border border-[var(--border)]">• Lanches</span>
                 <span className="px-2 py-0.5 bg-[var(--surface)] rounded-md border border-[var(--border)]">• 30-45 min</span>
               </div>
             </div>
           </div>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="mb-6 md:mb-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
            <input 
              type="text" 
              placeholder="Buscar neste cardápio..." 
              className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* LISTAGEM DE PRODUTOS */}
        <div className="space-y-8 md:space-y-10 pb-32">
          {CATALOG_MOCK.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-24">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4 md:mb-5 border-b border-[var(--border)] pb-2">{category.title}</h2>
              
              {/* ALTERAÇÃO AQUI: grid-cols-2 no mobile */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
                {category.items.map((product) => {
                  const qty = getItemQuantity(product.id);
                  return (
                    <div 
                      key={product.id} 
                      className={`
                        bg-[var(--surface)] p-3 md:p-4 rounded-xl border flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4 hover:shadow-lg transition-all cursor-pointer group h-full
                        ${qty > 0 ? 'border-[var(--primary-100)] ring-1 ring-[var(--primary-100)]' : 'border-[var(--border)] hover:border-[var(--primary-100)]'}
                      `}
                    >
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          {/* Ajustei o tamanho da fonte no mobile (text-xs) para não quebrar o layout lado a lado */}
                          <h3 className="font-semibold text-xs md:text-lg text-[var(--text-primary)] group-hover:text-[var(--primary-100)] transition-colors line-clamp-2">{product.name}</h3>
                          {/* Escondi a descrição no mobile muito pequeno ou limitei mais as linhas */}
                          <p className="text-[10px] md:text-sm text-[var(--text-secondary)] line-clamp-2 mt-1 md:mt-2 leading-relaxed">{product.description}</p>
                        </div>
                        <p className="text-[var(--text-primary)] font-bold mt-2 md:mt-3 text-sm md:text-base">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      
                      {/* IMAGEM E CONTROLES */}
                      {/* Ajustei a altura da imagem no mobile para h-28 para ficar proporcional */}
                      <div className="relative w-full h-28 md:w-32 md:h-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        
                        {qty === 0 ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddItem(product);
                            }}
                            className="absolute bottom-2 right-2 bg-[var(--surface)] p-1.5 md:p-2 rounded-full shadow-md border border-[var(--border)] text-[var(--primary-100)] hover:bg-[var(--primary-100)] hover:text-white transition-colors"
                          >
                            <Plus size={16} strokeWidth={3} className="md:w-5 md:h-5" />
                          </button>
                        ) : (
                          <div className="absolute bottom-2 right-2 flex items-center bg-[var(--surface)] rounded-full shadow-md border border-[var(--primary-100)] overflow-hidden scale-90 origin-bottom-right md:scale-100">
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveItem(product.id); }}
                                className="p-1.5 md:p-2 hover:bg-gray-100 text-[var(--text-primary)]"
                             >
                               <Minus size={14} className="md:w-4 md:h-4" />
                             </button>
                             <span className="text-xs md:text-sm font-bold text-[var(--primary-100)] px-1">{qty}</span>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleAddItem(product); }}
                                className="p-1.5 md:p-2 bg-[var(--primary-100)] text-white hover:brightness-90"
                             >
                               <Plus size={14} className="md:w-4 md:h-4" />
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BARRA FLUTUANTE DO CARRINHO (COR DO TEMA) --- */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-0 left-0 w-full z-40 p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-4xl mx-auto bg-[var(--primary-100)] hover:brightness-110 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-black/20 p-2 rounded-lg">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/90">Total sem entrega</p>
                <p className="font-bold text-lg text-white">{formatCurrency(cartTotal)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-white">Ver sacola</span>
              <span className="bg-[var(--surface)] text-[var(--primary-100)] px-2.5 py-0.5 rounded-full text-xs border border-white/20 shadow-sm">
                {cartCount}
              </span>
            </div>
          </button>
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
          <div className="relative w-full md:w-[480px] bg-[var(--surface)] md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShoppingBag size={20} className="text-[var(--primary-100)]" />
                Sua Sacola
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)]">
                  Sua sacola está vazia.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start border-b border-[var(--border)] pb-4 last:border-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-[var(--text-primary)] text-sm">{item.name}</h4>
                        <span className="font-bold text-[var(--text-primary)] text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{item.description}</p>
                      
                      {/* Controles do Item */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[var(--border)] rounded-lg">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 px-2 text-[var(--text-primary)] hover:bg-[var(--bg-body)]"
                          >
                             {item.quantity === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} />}
                          </button>
                          <span className="px-2 text-sm font-medium text-[var(--text-primary)]">{item.quantity}</span>
                          <button 
                            onClick={() => handleAddItem(item)}
                            className="p-1 px-2 text-[var(--primary-100)] hover:bg-[var(--bg-body)]"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Totais */}
            <div className="p-4 bg-[var(--surface-nav)] border-t border-[var(--border)] md:rounded-b-2xl">
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Taxa de entrega</span>
                  <span>R$ 5,00</span>
                </div>
                <div className="flex justify-between font-bold text-[var(--text-primary)] text-lg pt-2 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal + 5)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-[var(--primary-100)] hover:brightness-110 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Fazer Pedido
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};