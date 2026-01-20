import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from './ProductItem';
import { ProductItem } from './ProductItem';

interface CategoryBlockProps {
  id: string;
  name: string;
  products: Product[];
  onToggleProduct: (id: string) => void;
  onChangeProductMaxQuantity: (id: string, value: number | undefined) => void;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
  onMoveCategoryUp?: () => void;
  onMoveCategoryDown?: () => void;
  canMoveCategoryUp?: boolean;
  canMoveCategoryDown?: boolean;
}

export const CategoryBlock = ({
  id,
  name,
  products,
  onToggleProduct,
  onChangeProductMaxQuantity,
  onMoveProduct,
  onMoveCategoryUp,
  onMoveCategoryDown,
  canMoveCategoryUp = true,
  canMoveCategoryDown = true,
}: CategoryBlockProps) => {
  return (
    <div
      data-category-id={id}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{name}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveCategoryUp}
            disabled={!canMoveCategoryUp}
            className="w-8 h-8 rounded-lg bg-[var(--primary-100)] text-white hover:bg-[var(--primary-90)] disabled:bg-[var(--surface-nav)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Mover categoria para cima"
          >
            <ChevronUp size={18} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={onMoveCategoryDown}
            disabled={!canMoveCategoryDown}
            className="w-8 h-8 rounded-lg bg-[var(--primary-100)] text-white hover:bg-[var(--primary-90)] disabled:bg-[var(--surface-nav)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Mover categoria para baixo"
          >
            <ChevronDown size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {products.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] rounded-lg px-3 py-4 text-xs text-[var(--text-secondary)] text-center">
            Nenhum produto disponível nesta categoria.
          </div>
        ) : (
          products.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              onToggleActive={onToggleProduct}
              onChangeMaxQuantity={onChangeProductMaxQuantity}
              onMoveUp={() => onMoveProduct(product.id, 'up')}
              onMoveDown={() => onMoveProduct(product.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < products.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};
