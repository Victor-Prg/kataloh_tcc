import { ChevronUp, ChevronDown } from 'lucide-react';
import { Switch } from '../Switch';
import { Input } from '../Input';

export interface Product {
  id: string;
  name: string;
  active: boolean;
  maxQuantity?: number;
  categoryId: string;
  order: number;
  imageUrl?: string;
  type?: 'combo' | 'montavel';
  productType?: 'montavel' | 'marmita';
}

interface ProductItemProps {
  product: Product;
  onToggleActive: (id: string) => void;
  onChangeMaxQuantity: (id: string, value: number | undefined) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const ProductItem = ({
  product,
  onToggleActive,
  onChangeMaxQuantity,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
}: ProductItemProps) => {
  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!raw) {
      onChangeMaxQuantity(product.id, undefined);
      return;
    }

    const parsed = Number(raw.replace(/\D/g, ''));
    if (Number.isNaN(parsed)) {
      return;
    }

    onChangeMaxQuantity(product.id, parsed);
  };

  return (
    <div className="relative rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-1.5 z-[5]">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="w-9 h-9 rounded-lg bg-[var(--primary-100)] text-white hover:bg-[var(--primary-90)] disabled:bg-[var(--surface-nav)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center"
          aria-label="Mover para cima"
        >
          <ChevronUp size={20} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="w-9 h-9 rounded-lg bg-[var(--primary-100)] text-white hover:bg-[var(--primary-90)] disabled:bg-[var(--surface-nav)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center"
          aria-label="Mover para baixo"
        >
          <ChevronDown size={20} strokeWidth={3} />
        </button>
      </div>

      <div className="pl-12 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-md bg-[var(--surface-nav)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={
                product.imageUrl ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
              }
              alt={product.name}
              onError={event => {
                event.currentTarget.src =
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nome e status */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[var(--text-primary)] leading-tight mb-1">
              {product.name}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {product.active ? 'Ativo no cardápio' : 'Inativo para o cliente'}
            </div>
          </div>
        </div>

        {/* Controles: Quantidade e Toggle lado a lado */}
        <div className="pt-2 border-t border-[var(--border)]">
          {/* Labels alinhadas */}
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="text-[10px] font-medium text-[var(--text-secondary)]">
              Qtd. máxima
            </label>
            <label className="text-[10px] font-medium text-[var(--text-secondary)]">
              Ativo
            </label>
          </div>
          
          {/* Controles alinhados */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Input
                type="number"
                min={0}
                value={product.maxQuantity ?? ''}
                onChange={handleChangeQuantity}
                placeholder="-"
                className="text-sm h-8 w-full"
              />
            </div>
            <div className="flex items-center justify-center flex-shrink-0 h-8">
              <Switch checked={product.active} onToggle={() => onToggleActive(product.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
