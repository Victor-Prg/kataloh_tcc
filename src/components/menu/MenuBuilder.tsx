import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Category } from './CategorySelector';
import type { Product } from './ProductItem';
import { CategoryBlock } from './CategoryBlock';
import { ListChecks } from 'lucide-react';

interface MenuBuilderProps {
  categories: Category[];
  products: Product[];
  onChangeCategories: (categories: Category[]) => void;
  onChangeProducts: (products: Product[]) => void;
}

export const MenuBuilder = ({
  categories,
  products,
  onChangeCategories,
  onChangeProducts,
}: MenuBuilderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    console.log('🎯 Drag End:', active.id, '→', over.id);

    const isCategoryDrag = categories.some((category) => category.id === active.id);

    if (isCategoryDrag) {
      const oldIndex = categories.findIndex((category) => category.id === active.id);
      const newIndex = categories.findIndex((category) => category.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(categories, oldIndex, newIndex).map((category, index) => ({
        ...category,
        order: index,
      }));

      console.log('📁 Categorias reordenadas:', reordered.map(c => c.name));
      onChangeCategories(reordered);
      return;
    }

    const activeProduct = products.find((p) => p.id === active.id);
    const overProduct = products.find((p) => p.id === over.id);

    if (!activeProduct || !overProduct) {
      console.log('❌ Produto não encontrado');
      return;
    }

    if (activeProduct.categoryId !== overProduct.categoryId) {
      console.log('⚠️ Categorias diferentes - não permite mover');
      return;
    }

    console.log('📦 Movendo produto:', activeProduct.name, '→', overProduct.name);

    // Filtra e ordena produtos da mesma categoria
    const categoryProducts = products
      .filter((product) => product.categoryId === activeProduct.categoryId)
      .sort((a, b) => a.order - b.order);

    const oldIndex = categoryProducts.findIndex((p) => p.id === active.id);
    const newIndex = categoryProducts.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      console.log('❌ Índices inválidos');
      return;
    }

    console.log('📍 Movendo de', oldIndex, 'para', newIndex);

    // Reordena usando arrayMove
    const reorderedCategoryProducts = arrayMove(categoryProducts, oldIndex, newIndex).map(
      (product, idx) => ({
        ...product,
        order: idx,
      }),
    );

    console.log('✅ Nova ordem:', reorderedCategoryProducts.map(p => p.name));

    // Mescla com produtos de outras categorias
    const otherProducts = products.filter((p) => p.categoryId !== activeProduct.categoryId);
    const allProducts = [...otherProducts, ...reorderedCategoryProducts];

    onChangeProducts(allProducts);
  };

  const handleToggleProduct = (productId: string) => {
    const updated = products.map((product) =>
      product.id === productId ? { ...product, active: !product.active } : product,
    );

    onChangeProducts(updated);
  };

  const handleChangeMaxQuantity = (productId: string, value: number | undefined) => {
    const updated = products.map((product) =>
      product.id === productId ? { ...product, maxQuantity: value } : product,
    );

    onChangeProducts(updated);
  };

  const handleMoveProduct = (productId: string, direction: 'up' | 'down') => {
    console.log('🔄 Movendo produto:', productId, direction);
    
    const product = products.find((p) => p.id === productId);
    if (!product) {
      console.log('❌ Produto não encontrado');
      return;
    }

    // Filtra produtos da mesma categoria e ordena
    const categoryProducts = products
      .filter((p) => p.categoryId === product.categoryId)
      .sort((a, b) => a.order - b.order);

    console.log('📦 Produtos da categoria:', categoryProducts.map(p => p.name));

    const indexInCategory = categoryProducts.findIndex((p) => p.id === productId);
    console.log('📍 Índice atual:', indexInCategory);

    // Verifica se pode mover
    if (direction === 'up' && indexInCategory === 0) {
      console.log('⚠️ Já está no topo');
      return;
    }
    if (direction === 'down' && indexInCategory === categoryProducts.length - 1) {
      console.log('⚠️ Já está no final');
      return;
    }

    // Calcula novo índice
    const newIndex = direction === 'up' ? indexInCategory - 1 : indexInCategory + 1;
    console.log('📍 Novo índice:', newIndex);

    // Troca as posições no array
    const reordered = [...categoryProducts];
    [reordered[indexInCategory], reordered[newIndex]] = [reordered[newIndex], reordered[indexInCategory]];

    // Atualiza os valores de order
    const updatedCategoryProducts = reordered.map((p, idx) => ({
      ...p,
      order: idx,
    }));

    console.log('✅ Nova ordem:', updatedCategoryProducts.map(p => p.name));

    // Mescla com produtos de outras categorias
    const otherProducts = products.filter((p) => p.categoryId !== product.categoryId);
    const allProducts = [...otherProducts, ...updatedCategoryProducts];

    onChangeProducts(allProducts);
  };

  if (!categories.length) {
    return (
      <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl p-8 text-center space-y-4 transition-colors">
        <div className="inline-flex items-center justify-center rounded-full bg-[var(--surface-nav)] border border-[var(--border)] px-4 py-2 gap-2 text-[var(--text-secondary)]">
          <ListChecks size={18} />
          <span className="text-xs font-medium uppercase tracking-wide">Menu da Loja</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Nenhuma categoria selecionada ainda
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            Clique em <span className="font-medium">“Selecionar categorias”</span> para começar a montar o cardápio da sua loja.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5 shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Menu da Loja</h2>
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
          Arraste para ordenar categorias e produtos
        </span>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        Organize a ordem em que o cardápio aparecerá para o cliente. Você pode ativar, desativar ou limitar itens sem perder os cadastros.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={categories.map((category) => category.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryBlock
                key={category.id}
                id={category.id}
                name={category.name}
                products={products
                  .filter((product) => product.categoryId === category.id)
                  .sort((a, b) => a.order - b.order)}
                onToggleProduct={handleToggleProduct}
                onChangeProductMaxQuantity={handleChangeMaxQuantity}
                onMoveProduct={handleMoveProduct}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
