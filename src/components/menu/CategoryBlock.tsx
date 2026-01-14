import { GripVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Product } from './ProductItem';
import { ProductItem } from './ProductItem';

interface CategoryBlockProps {
  id: UniqueIdentifier;
  name: string;
  products: Product[];
  onToggleProduct: (id: string) => void;
  onChangeProductMaxQuantity: (id: string, value: number | undefined) => void;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
}

export const CategoryBlock = ({
  id,
  name,
  products,
  onToggleProduct,
  onChangeProductMaxQuantity,
  onMoveProduct,
}: CategoryBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 ${
        isDragging ? 'ring-2 ring-[var(--primary-100)] shadow-lg' : ''
      }`}
    >
      {/* Header da categoria */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <GripVertical size={18} />
        </button>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{name}</h3>
      </div>

      {/* Lista de produtos */}
      <div ref={setDroppableRef} className="space-y-2">
        <SortableContext
          items={products.map((product) => product.id)}
          strategy={verticalListSortingStrategy}
        >
          {products.length === 0 ? (
            <div className="border border-dashed border-[var(--border)] rounded-lg px-3 py-4 text-xs text-[var(--text-secondary)] text-center">
              Nenhum produto disponível nesta categoria.
            </div>
          ) : (
            products.map((product, index) => (
              <SortableProductRow
                key={product.id}
                product={product}
                onToggleProduct={onToggleProduct}
                onChangeProductMaxQuantity={onChangeProductMaxQuantity}
                onMoveProduct={onMoveProduct}
                canMoveUp={index > 0}
                canMoveDown={index < products.length - 1}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

interface SortableProductRowProps {
  product: Product;
  onToggleProduct: (id: string) => void;
  onChangeProductMaxQuantity: (id: string, value: number | undefined) => void;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const SortableProductRow = ({
  product,
  onToggleProduct,
  onChangeProductMaxQuantity,
  onMoveProduct,
  canMoveUp,
  canMoveDown,
}: SortableProductRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'ring-2 ring-[var(--primary-100)] rounded-lg' : ''}
    >
      <ProductItem
        product={product}
        onToggleActive={onToggleProduct}
        onChangeMaxQuantity={onChangeProductMaxQuantity}
        onMoveUp={() => onMoveProduct(product.id, 'up')}
        onMoveDown={() => onMoveProduct(product.id, 'down')}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};
