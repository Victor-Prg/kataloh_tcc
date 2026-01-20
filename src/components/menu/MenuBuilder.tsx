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

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((category) => category.id === categoryId);
    if (index === -1) {
      return;
    }

    if (direction === 'up' && index === 0) {
      return;
    }

    if (direction === 'down' && index === categories.length - 1) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...categories];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

    const updated = reordered.map((category, idx) => ({
      ...category,
      order: idx,
    }));

    onChangeCategories(updated);
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
          Use as setas para ordenar categorias e produtos
        </span>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        Organize a ordem em que o cardápio aparecerá para o cliente. Você pode ativar, desativar ou limitar itens sem perder os cadastros.
      </p>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
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
            onMoveCategoryUp={() => handleMoveCategory(category.id, 'up')}
            onMoveCategoryDown={() => handleMoveCategory(category.id, 'down')}
            canMoveCategoryUp={index > 0}
            canMoveCategoryDown={index < categories.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
