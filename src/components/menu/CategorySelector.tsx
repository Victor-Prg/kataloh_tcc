import { useState } from 'react';
import { Modal } from '../Modal';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Text } from '../Text';

export interface Category {
  id: string;
  name: string;
  order: number;
}

interface CategorySelectorProps {
  allCategories: Category[];
  selectedCategories: Category[];
  onConfirm: (categories: Category[]) => void;
}

export const CategorySelector = ({
  allCategories,
  selectedCategories,
  onConfirm,
}: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(
    selectedCategories.map((c) => c.id),
  );

  const toggleCategory = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleOpen = () => {
    setTempSelectedIds(selectedCategories.map((c) => c.id));
    setIsOpen(true);
  };

  const handleConfirm = () => {
    const nextCategories = allCategories
      .filter((category) => tempSelectedIds.includes(category.id))
      .map((category, index) => ({
        ...category,
        order: index,
      }));

    onConfirm(nextCategories);
    setIsOpen(false);
  };

  const hasSelection = selectedCategories.length > 0;
  const primaryIsSelect = !hasSelection;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">Montar Cardápio</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Selecione categorias e organize os produtos que aparecerão no cardápio da sua loja.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {hasSelection && (
          <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Categorias selecionadas:{' '}
            <span className="font-medium text-[var(--text-primary)]">
              {selectedCategories.map((c) => c.name).join(', ')}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1 sm:items-end">
          <div className="flex gap-2">
            <Button
              variant={primaryIsSelect ? 'primary' : 'outline'}
              onClick={handleOpen}
            >
              Selecionar categorias
            </Button>

            <Button
              variant={primaryIsSelect ? 'outline' : 'primary'}
              disabled={!hasSelection}
            >
              Montar Menu
            </Button>
          </div>

          {!hasSelection && (
            <span className="text-[10px] text-[var(--text-secondary)]">
              Selecione ao menos uma categoria para montar o menu.
            </span>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Selecionar categorias">
        <div className="space-y-4">
          <Text as="p" size="sm" className="text-[var(--text-secondary)]">
            Escolha as categorias que farão parte do cardápio da loja.
          </Text>

          <div className="max-h-72 overflow-y-auto space-y-2">
            {allCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={tempSelectedIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span className="text-sm text-[var(--text-primary)]">{category.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={tempSelectedIds.length === 0}>
              Confirmar categorias
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

