import React, { useMemo, useState } from 'react'
import { CartContext, type CartItem, type CartContextType } from './CartContext'

type CartProviderProps = {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart: CartContextType['addToCart'] = (newItem) => {
    setItems((previous) => {
      const existing = previous.find((item) => item.id === newItem.id)
      if (existing) {
        return previous.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...previous, newItem]
    })
  }

  const removeFromCart: CartContextType['removeFromCart'] = (itemId) => {
    setItems((previous) => previous.filter((item) => item.id !== itemId))
  }

  const updateQuantity: CartContextType['updateQuantity'] = (itemId, delta) => {
    setItems((previous) =>
      previous
        .map((item) => {
          if (item.id === itemId) {
            const quantity = Math.max(0, item.quantity + delta)
            return { ...item, quantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart: CartContextType['clearCart'] = () => setItems([])

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])

  const uniqueStoreIds = useMemo(() => [...new Set(items.map((item) => item.storeId))], [items])
  const uniqueStoreNames = useMemo(
    () => [...new Set(items.map((item) => item.storeName))],
    [items]
  )
  const isMultiStore = uniqueStoreIds.length > 1

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
        uniqueStoreNames,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

