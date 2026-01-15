import React, { createContext, useContext, useState, useMemo } from 'react';

export interface CartItem {
  id: string; // ou number, dependendo do seu produto
  name: string;
  price: number;
  image: string;
  quantity: number;
  storeId: string;
  storeName: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isMultiStore: boolean; // Verifica se tem mais de uma loja
  uniqueStoreNames: string[];
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  // Lógica vital para o pagamento
  const uniqueStoreIds = useMemo(() => [...new Set(items.map(i => i.storeId))], [items]);
  const uniqueStoreNames = useMemo(() => [...new Set(items.map(i => i.storeName))], [items]);
  const isMultiStore = uniqueStoreIds.length > 1;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        isMultiStore,
        uniqueStoreNames
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext);
}
