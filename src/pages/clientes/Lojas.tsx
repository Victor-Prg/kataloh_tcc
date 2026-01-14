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
  { id: 1, name: "Burger King", category: "Lanches", rating: 4.8, time: "30-40 min", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop" },
  { id: 2, name: "Sushi House", category: "Japonesa", rating: 4.5, time: "40-50 min", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop" },
  { id: 3, name: "Pizza Hut", category: "Pizza", rating: 4.2, time: "25-35 min", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop" },
  { id: 4, name: "Açaí do Bom", category: "Sobremesa", rating: 4.9, time: "15-25 min", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop" },
  { id: 5, name: "McDonalds", category: "Lanches", rating: 4.7, time: "20-30 min", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop" },
  { id: 6, name: "Subway", category: "Lanches", rating: 4.6, time: "15-25 min", image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=400&fit=crop" },
  { id: 7, name: "Coco Bambu", category: "Frutos do Mar", rating: 4.8, time: "50-60 min", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop" },
  { id: 8, name: "Habibs", category: "Árabe", rating: 4.3, time: "20-30 min", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop" },
];

export const Lojas = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="w-full">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Lojas Disponíveis</h1>
        
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

      {/* GRID DE LOJAS */}
      <div className={`
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
  );
};