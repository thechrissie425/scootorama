'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getInventory } from '@/app/actions/getInventory'

interface InventoryData {
  available: boolean
  quantity: number
  price?: number
  compareAtPrice?: number
  currencyCode?: string
}

interface InventoryContextValue {
  inventory: InventoryData | null
  isLoading: boolean
  error: Error | null
}

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined
)

export function InventoryProvider({
  variantId,
  market,
  children,
}: {
  variantId?: string
  market: string
  children: React.ReactNode
}) {
  const [inventory, setInventory] = useState<InventoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!variantId) {
      return
    }

    let cancelled = false

    const fetchInventory = async () => {
      try {
        const data = await getInventory(variantId, market)
        if (!cancelled) {
          setInventory(_prevInventory => data)
          setIsLoading(_prevLoading => false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(_prevError => err as Error)
          setIsLoading(_prevLoading => false)
          setInventory(_prevInventory => null)
        }
      }
    }

    // Use functional updates to avoid direct setState
    setIsLoading(() => true)
    setError(() => null)
    fetchInventory()

    return () => {
      cancelled = true
    }
  }, [variantId, market])

  return (
    <InventoryContext.Provider value={{ inventory, isLoading, error }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}
