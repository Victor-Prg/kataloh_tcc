import { useMemo, useState } from 'react';
import { CategorySelector } from '../../../components/menu/CategorySelector';
import type { Category } from '../../../components/menu/CategorySelector';
import { MenuBuilder } from '../../../components/menu/MenuBuilder';
import type { Product } from '../../../components/menu/ProductItem';
import { Button } from '../../../components/Button';
import { CheckCircle2, Loader2, ImageIcon } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { Text } from '../../../components/Text';

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
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Cheeseburger Duplo',
    active: true,
    categoryId: 'lanches',
    order: 1,
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Refrigerante Lata',
    active: true,
    categoryId: 'bebidas',
    order: 0,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Suco Natural',
    active: false,
    categoryId: 'bebidas',
    order: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Sorvete',
    active: true,
    categoryId: 'sobremesas',
    order: 0,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Combo Família',
    active: true,
    categoryId: 'combos',
    order: 0,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    type: 'combo',
  },
];

export default function MenuCadastro() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        imageUrl: product.imageUrl,
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
        onPreview={() => setIsPreviewOpen(true)}
      />

      <MenuBuilder
        categories={categories}
        products={products}
        onChangeCategories={setCategories}
        onChangeProducts={setProducts}
      />

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Preview do Cardápio"
      >
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Text as="p" size="sm" className="text-[var(--text-secondary)]">
              Selecione ao menos uma categoria para visualizar o preview do cardápio.
            </Text>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="px-4 py-2 rounded-[12px] text-xs font-medium whitespace-nowrap bg-[var(--primary-100)] text-white shadow-md">
                  Todos
                </span>
                {categories
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <span
                      key={category.id}
                      className="px-4 py-2 rounded-[12px] text-xs font-medium whitespace-nowrap bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)]"
                    >
                      {category.name}
                    </span>
                  ))}
              </div>

              <div className="space-y-6">
                {categories
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((category) => {
                    const categoryProducts = products
                      .filter(
                        (product) => product.categoryId === category.id && product.active,
                      )
                      .sort((a, b) => a.order - b.order);

                    if (!categoryProducts.length) {
                      return null;
                    }

                    return (
                      <div key={category.id} className="space-y-3">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryProducts.map((product) => (
                            <div
                              key={product.id}
                              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px] p-3 flex gap-3 cursor-default hover:border-[var(--primary-100)] transition-all hover:shadow-lg relative overflow-hidden"
                            >
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-[var(--text-primary)] line-clamp-1 text-sm">
                                      {product.name}
                                    </h4>
                                    {product.type === 'combo' && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--surface-nav)] text-[var(--text-secondary)] border border-[var(--border)] flex-shrink-0">
                                        Combo
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mt-1">
                                    Produto do cardápio da loja.
                                  </p>
                                </div>
                              </div>

                              <div className="w-20 h-20 rounded-[12px] overflow-hidden shrink-0 bg-[var(--bg-body)] border border-[var(--border)]">
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={18} className="text-[var(--text-muted)]" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--surface-nav)] mt-4 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 z-20">
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
