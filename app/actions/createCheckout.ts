'use server'

import { createCheckout as createShopifyCheckout } from '@/lib/shopify'
import { CartItem } from '@/contexts/CartContext'

export async function createCheckout(items: CartItem[], market: string) {
  return await createShopifyCheckout(items, market)
}
