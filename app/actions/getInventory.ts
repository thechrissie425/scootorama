'use server'

import { checkInventory } from '@/lib/shopify'

export async function getInventory(variantId: string, market: string) {
  return await checkInventory(variantId, market)
}
