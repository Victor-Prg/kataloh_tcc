import { GripVertical } from 'lucide-react';
import { Switch } from '../Switch';
import { Input } from '../Input';

export interface Product {
  id: string;
  name: string;
  active: boolean;
  maxQuantity?: number;
  categoryId: string;
  order: number;
}

interface ProductItemProps {
  product: Product;
  onToggleActive: (id: string) => void;
  onChangeMaxQuantity: (id: string, value: number | undefined) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export const ProductItem = ({
  product,
  onToggleActive,
  onChangeMaxQuantity,
  dragHandleProps,
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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...dragHandleProps}
          className="cursor-grab text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <GripVertical size={18} />
        </button>

        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">{product.name}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            {product.active ? 'Ativo no cardápio' : 'Inativo para o cliente'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-[var(--text-secondary)]">Qtd. máxima</span>
          <div className="w-24">
            <Input
              type="number"
              min={0}
              value={product.maxQuantity ?? ''}
              onChange={handleChangeQuantity}
              placeholder="-"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--text-secondary)]">Ativo</span>
          <Switch checked={product.active} onToggle={() => onToggleActive(product.id)} />
        </div>
      </div>
    </div>
  );
};
