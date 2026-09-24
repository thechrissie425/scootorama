'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin, Activity } from 'lucide-react'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'

interface BuyBoxProps {
  productTitle: string
  price: number
  currency: string
  fulfillment: 'direct' | 'retailer'
  shopifyVariantId?: string
  language?: string
  productImage?: string
}

// ... (Keep your existing translations object here) ...
const translations = {
  'en-US': {
    addToCart: 'Add to Cart',
    findRetailer: 'Find a Retailer',
    adding: 'Adding...',
    freeShipping: 'Free shipping & 30-day home trial.',
    checkAvailability: 'Check availability at stores near you.',
    addedToCart: 'Added {productTitle} to cart! (Opening Sidecart...)',
    retailerMapLoading: 'Retailer Map Loading...',
    mockingConnection: 'Mocking connection to Locally for {productTitle}',
    locallyIntegration: 'Locally.com Integration',
    loadingPrice: 'Fetching live price...',
    checkingStock: 'Checking Stock...',
    inStock: 'In Stock',
    soldOut: 'Sold Out',
    regionDetected: 'Region Detected',
    variantId: 'Shopify Variant ID',
    poweredBy: 'Powered by Federated Data: Sanity + Shopify',
  },
  'de-DE': {
    addToCart: 'In den Warenkorb',
    findRetailer: 'Händler finden',
    adding: 'Wird hinzugefügt...',
    freeShipping: 'Kostenloser Versand & 30-Tage-Heimtest.',
    checkAvailability: 'Verfügbarkeit in Geschäften in Ihrer Nähe prüfen.',
    addedToCart:
      '{productTitle} wurde dem Warenkorb hinzugefügt! (Seitenwarenkorb wird geöffnet...)',
    retailerMapLoading: 'Händlerkarte wird geladen...',
    mockingConnection:
      'Verbindung zu Locally für {productTitle} wird simuliert',
    locallyIntegration: 'Locally.com Integration',
    loadingPrice: 'Live-Preis wird geladen...',
    checkingStock: 'Lagerbestand wird geprüft...',
    inStock: 'Auf Lager',
    soldOut: 'Ausverkauft',
    regionDetected: 'Region erkannt',
    variantId: 'Shopify Varianten-ID',
    poweredBy: 'Bereitgestellt durch föderierte Daten: Sanity + Shopify',
  },
  // ... (Add other languages as needed)
}

export default function BuyBox({
  productTitle,
  price,
  currency: _currency,
  fulfillment,
  shopifyVariantId,
  language = 'en-US',
}: BuyBoxProps) {
  const [isLocallyOpen, setIsLocallyOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // NEW: State for the "Fake Fetch" Demo
  const [isFetching, setIsFetching] = useState(true)
  const [stockStatus, setStockStatus] = useState<
    'checking' | 'in_stock' | 'out_of_stock'
  >('checking')

  const { formatCurrency, market } = useMarketFormatting()

  // Get translations with fallback
  const t =
    translations[language as keyof typeof translations] || translations['en-US']

  const translate = (key: string, vars?: Record<string, string>) => {
    const text = (t[key as keyof typeof t] ?? key) as string
    if (!vars) return text

    return Object.entries(vars).reduce((value, [k, v]) => {
      return value.replace(`{${k}}`, v)
    }, text)
  }

  // SIMULATE DATA FETCH ON MOUNT
  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setIsFetching(true)
      setStockStatus('checking')
    }, 0)

    // The "500ms Lie" - Simulate fetching live data from Shopify
    const timer = window.setTimeout(() => {
      setIsFetching(false)
      setStockStatus('in_stock') // Mock result
    }, 800)

    return () => {
      clearTimeout(resetTimer)
      clearTimeout(timer)
    }
  }, [shopifyVariantId, market])

  const handleAddToCart = async () => {
    if (!shopifyVariantId) return
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      alert(translate('addedToCart', { productTitle }))
    }, 800)
  }

  const handleFindRetailer = () => {
    setIsLocallyOpen(true)
  }

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-brand-ink dark:to-neutral-900 p-8 rounded-2xl border border-lightGrey dark:border-darkGrey/50 shadow-2xl shadow-black/5 dark:shadow-black/20 sticky top-24 backdrop-blur-sm z-40">
        {/* === DEMO: VISUAL PROOF BADGE === */}
        <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <div>
            <span className="block text-brand-primary font-bold">
              {t.regionDetected}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {market?.name || market?.code || 'Unknown'} ({language})
            </span>
          </div>
          <div className="text-right">
            <span className="block text-blue-500 font-bold">{t.variantId}</span>
            <span className="text-gray-600 dark:text-gray-300">
              {shopifyVariantId || 'N/A'}
            </span>
          </div>
        </div>
        {/* ================================ */}

        <h2 className="text-2xl font-heading-bold mb-3 dark:text-white">
          {productTitle}
        </h2>

        {/* PRICE DISPLAY WITH LOADING STATE */}
        <div className="min-h-[60px] flex flex-col justify-center mb-6">
          {isFetching ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-display text-brand-primary">
                  {formatCurrency(price)}
                </div>
                {/* Simulated Stock Badge */}
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                  ● {t.inStock}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {formatCurrency(price * 1.2)}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* DYNAMIC ACTION BUTTON */}
        {fulfillment === 'direct' ? (
          <button
            onClick={handleAddToCart}
            // Disable while fetching price OR while adding to cart
            disabled={isAdding || isFetching || stockStatus === 'out_of_stock'}
            className={`w-full font-heading-bold py-5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg 
              ${
                isFetching
                  ? 'bg-gray-300 cursor-wait text-gray-500'
                  : 'bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-red-500 text-white transform hover:scale-[1.02] active:scale-95 shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/40'
              }`}
          >
            {isFetching ? (
              <span className="animate-pulse flex items-center gap-2">
                <Activity size={20} className="animate-spin" />
                {t.checkingStock}
              </span>
            ) : isAdding ? (
              <span className="animate-pulse">{t.adding}</span>
            ) : (
              <>
                <ShoppingBag size={20} />
                {t.addToCart}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleFindRetailer}
            className="w-full bg-gradient-to-r from-brand-ink to-gray-800 dark:from-white dark:to-gray-100 dark:text-black text-white hover:opacity-90 font-heading-bold py-5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <MapPin size={20} />
            {t.findRetailer}
          </button>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-center text-grey mb-3">
            {fulfillment === 'direct' ? t.freeShipping : t.checkAvailability}
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {/* ... Keep existing trust indicators ... */}
            <span className="text-[10px] opacity-60 mt-2 block w-full text-center">
              {t.poweredBy}
            </span>
          </div>
        </div>
      </div>

      {/* ... Keep Modal Logic ... */}
      <AnimatePresence>
        {isLocallyOpen && (
          // ... (Existing Modal JSX) ...
          // Just including wrapper to save space, keep your existing Modal code here
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* ... */}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
