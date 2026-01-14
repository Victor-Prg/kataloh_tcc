import { useMemo, useState } from 'react';
import { CategorySelector } from '../../../components/menu/CategorySelector';
import type { Category } from '../../../components/menu/CategorySelector';
import { MenuBuilder } from '../../../components/menu/MenuBuilder';
import type { Product } from '../../../components/menu/ProductItem';
import { Button } from '../../../components/Button';
import { CheckCircle2, Loader2 } from 'lucide-react';

const ALL_CATEGORIES: Category[] = [
  { id: 'lanches', name: 'Lanches', order: 0 },
  { id: 'bebidas', name: 'Bebidas', order: 1 },
  { id: 'sobremesas', name: 'Sobremesas', order: 2 },
  { id: 'combos', name: 'Combos', order: 3 },
];

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Hambúrguer Clássico',
    active: true,
    categoryId: 'lanches',
    order: 0,
  },
  {
    id: '2',
    name: 'Cheeseburger Duplo',
    active: true,
    categoryId: 'lanches',
    order: 1,
  },
  {
    id: '3',
    name: 'Refrigerante Lata',
    active: true,
    categoryId: 'bebidas',
    order: 0,
  },
  {
    id: '4',
    name: 'Suco Natural',
    active: false,
    categoryId: 'bebidas',
    order: 1,
  },
  {
    id: '5',
    name: 'Sorvete',
    active: true,
    categoryId: 'sobremesas',
    order: 0,
  },
  {
    id: '6',
    name: 'Combo Família',
    active: true,
    categoryId: 'combos',
    order: 0,
  },
];

export default function MenuCadastro() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>('');

  const handleConfirmCategories = (selectedCategories: Category[]) => {
    setCategories(selectedCategories);

    const selectedIds = new Set(selectedCategories.map((category) => category.id));
    const nextProducts = ALL_PRODUCTS.filter((product) => selectedIds.has(product.categoryId));

    setProducts(nextProducts);
  };

  const menuPayload = useMemo(
    () => ({
      categories: categories.map((category, index) => ({
        id: category.id,
        name: category.name,
        order: index,
      })),
      products: products.map((product, index) => ({
        id: product.id,
        name: product.name,
        active: product.active,
        maxQuantity: product.maxQuantity,
        categoryId: product.categoryId,
        order: index,
      })),
    }),
    [categories, products],
  );

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setLastSavedSnapshot(JSON.stringify(menuPayload));
      console.log('Menu salvo:', menuPayload);
    }, 1000);
  };

  const currentSnapshot = JSON.stringify(menuPayload);
  const hasChanges = !!categories.length && currentSnapshot !== lastSavedSnapshot;
  const canSave = hasChanges && !isSaving;

  return (
    <div className="flex flex-col gap-6">
      <CategorySelector
        allCategories={ALL_CATEGORIES}
        selectedCategories={categories}
        onConfirm={handleConfirmCategories}
      />

      <MenuBuilder
        categories={categories}
        products={products}
        onChangeCategories={setCategories}
        onChangeProducts={setProducts}
      />

      <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--surface-nav)] mt-4 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            {hasChanges ? (
              <>
                <CheckCircle2 size={14} className="text-amber-500" />
                <span>Alterações não salvas. Clique em “Salvar alterações” para aplicar.</span>
              </>
            ) : (
              <span>Cardápio atualizado. Você pode ajustar o menu a qualquer momento.</span>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!canSave}
            className="min-w-[180px] flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            Salvar alterações
          </Button>
        </div>
      </div>

    </div>
  );
}
