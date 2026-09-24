'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  variantId: string
  title: string
  price: number
  currency: string
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existingItem = current.find(
        item => item.variantId === newItem.variantId
      )

      if (existingItem) {
        return current.map(item =>
          item.variantId === newItem.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...current, { ...newItem, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeItem = (variantId: string) => {
    setItems(current => current.filter(item => item.variantId !== variantId))
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }

    setItems(current =>
      current.map(item =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
