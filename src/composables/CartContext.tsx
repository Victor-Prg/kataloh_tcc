import { createContext, useContext } from 'react';

export interface CartItem {
  id: string; // ou number, dependendo do seu produto
  name: string;
  price: number;
  image: string;
  quantity: number;
  storeId: string;
  storeName: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isMultiStore: boolean; // Verifica se tem mais de uma loja
  uniqueStoreNames: string[];
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);
