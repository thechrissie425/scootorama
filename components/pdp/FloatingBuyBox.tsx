'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, MapPin } from 'lucide-react'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'

interface FloatingBuyBoxProps {
  productTitle: string
  price: number
  currency: string
  fulfillment: 'direct' | 'retailer'
  shopifyVariantId?: string
  language?: string
}

export default function FloatingBuyBox({
  productTitle,
  price,
  currency,
  fulfillment,
  shopifyVariantId,
  language = 'en-US',
}: FloatingBuyBoxProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // NEW: Federated Data Fetch Simulation
  const [isFetching, setIsFetching] = useState(true)

  const { formatCurrency } = useMarketFormatting()

  // Simulate Fetch (Synced with Main BuyBox timing usually, but local here for demo)
  useEffect(() => {
    setIsFetching(true)
    const timer = setTimeout(() => setIsFetching(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Show/hide based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight * 0.95
      setIsVisible(scrollPosition > heroHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = async () => {
    if (!shopifyVariantId) return
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      alert(`Added ${productTitle} to cart!`)
    }, 800)
  }

  const handleFindRetailer = () => {
    alert(`Finding retailers for ${productTitle}...`)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/98 via-black/98 to-gray-900/98 backdrop-blur-xl border-b-2 border-brand-primary/60 shadow-2xl shadow-brand-primary/30"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-3 text-left w-full group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/50">
                    <ShoppingBag size={20} className="text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-display text-sm md:text-base truncate group-hover:text-brand-primary transition-colors uppercase tracking-wide">
                      {productTitle}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* LOADING STATE FOR PRICE */}
                      {isFetching ? (
                        <div className="h-6 w-20 bg-white/20 rounded animate-pulse" />
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-brand-primary font-display text-lg md:text-xl"
                        >
                          {formatCurrency(price)}
                        </motion.span>
                      )}

                      {!isFetching && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-heading-bold uppercase tracking-wider border border-green-500/30">
                          Save 20%
                        </span>
                      )}
                    </div>
                  </div>
                  {/* ... Arrow Icon ... */}
                </motion.button>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2">
                {fulfillment === 'direct' ? (
                  <motion.button
                    onClick={handleAddToCart}
                    // Disable if fetching OR adding
                    disabled={isAdding || isFetching}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 md:px-8 py-3 rounded-full font-display text-sm md:text-base flex items-center gap-2 transition-all duration-300 border uppercase tracking-wide
                      ${
                        isFetching
                          ? 'bg-gray-700 text-gray-400 border-gray-600 cursor-wait'
                          : 'bg-gradient-to-r from-brand-primary via-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-red-500 text-white shadow-lg shadow-brand-primary/40 border-brand-primary-light'
                      }`}
                  >
                    {/* ... Button Content ... */}
                    {isFetching
                      ? 'Loading...'
                      : isAdding
                        ? 'Adding...'
                        : 'Add to Cart'}
                  </motion.button>
                ) : (
                  // ... Retailer Button ...
                  <button>Find Retailer</button>
                )}
              </div>
            </div>

            {/* ... Expanded Content ... */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
