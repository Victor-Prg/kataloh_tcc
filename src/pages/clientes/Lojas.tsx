import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Star, Clock } from 'lucide-react';

// Tipagem básica
interface Store {
  id: number;
  name: string;
  category: string;
  rating: number;
  time: string;
  image: string;
}

// Dados Mockados
const MOCK_STORES: Store[] = [
  { id: 1, name: "Burger King", category: "Lanches", rating: 4.8, time: "30-40 min", image: "https://placehold.co/100x100/orange/white?text=BK" },
  { id: 2, name: "Sushi House", category: "Japonesa", rating: 4.5, time: "40-50 min", image: "https://placehold.co/100x100/red/white?text=SH" },
  { id: 3, name: "Pizza Hut", category: "Pizza", rating: 4.2, time: "25-35 min", image: "https://placehold.co/100x100/red/white?text=PH" },
  { id: 4, name: "Açaí do Bom", category: "Sobremesa", rating: 4.9, time: "15-25 min", image: "https://placehold.co/100x100/purple/white?text=AB" },
  { id: 5, name: "McDonalds", category: "Lanches", rating: 4.7, time: "20-30 min", image: "https://placehold.co/100x100/red/white?text=MC" },
  { id: 6, name: "Subway", category: "Lanches", rating: 4.6, time: "15-25 min", image: "https://placehold.co/100x100/green/white?text=SUB" },
  { id: 7, name: "Coco Bambu", category: "Frutos do Mar", rating: 4.8, time: "50-60 min", image: "https://placehold.co/100x100/brown/white?text=CB" },
  { id: 8, name: "Habibs", category: "Árabe", rating: 4.3, time: "20-30 min", image: "https://placehold.co/100x100/red/white?text=HB" },
];

export const Lojas = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-[var(--bg-body)]">
      
      {/* BARRA SUPERIOR (CABEÇALHO) 
          Alteração: Mudei de 'bg-[var(--surface)]' para 'bg-[var(--bg-body)]'
          Mantive a borda ('border-b') para separar visualmente do conteúdo de forma sutil.
      */}
      <div className="w-full bg-[var(--bg-body)] border-b border-[var(--border)] px-4 md:px-6 py-4 shrink-0 z-20">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Lojas Disponíveis</h1>
          
          <div className="flex bg-[var(--surface-nav)] p-1 rounded-lg border border-[var(--border)]">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[var(--surface)] shadow text-[var(--primary-100)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-[var(--surface)] shadow text-[var(--primary-100)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO (CARDS) - Scroll apenas aqui dentro */}
      <div className="flex-1 w-full overflow-y-auto p-4 md:p-6">
        <div className={`
          max-w-7xl mx-auto pb-4
          ${viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6' 
            : 'flex flex-col gap-4' 
          }
        `}>
          {MOCK_STORES.map((store) => (
            <div 
              key={store.id} 
              onClick={() => navigate(`/cliente/lojas/${store.id}`)}
              className={`
                bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:shadow-lg transition-all cursor-pointer overflow-hidden group
                ${viewMode === 'list' ? 'flex flex-row items-center p-4' : 'flex flex-col'}
              `}
            >
              {/* Imagem */}
              <div className={`${viewMode === 'list' ? 'w-24 h-24 mr-4' : 'w-full h-32 md:h-40'} flex-shrink-0 relative overflow-hidden`}>
                <img 
                  src={store.image} 
                  alt={store.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Textos */}
              <div className={`flex flex-col ${viewMode === 'grid' ? 'p-3 md:p-4' : 'flex-1'}`}>
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-bold text-sm md:text-lg text-[var(--text-primary)] truncate">{store.name}</h3>
                  <span className="flex items-center text-[10px] md:text-xs font-bold text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full shrink-0">
                    <Star size={10} className="fill-yellow-500 mr-0.5 md:mr-1 md:w-3 md:h-3" /> {store.rating}
                  </span>
                </div>
                
                <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1 truncate">{store.category}</p>
                
                <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3 text-[10px] md:text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="md:w-3.5 md:h-3.5" /> {store.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};