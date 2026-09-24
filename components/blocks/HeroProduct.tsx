'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl, getBlurDataURL } from '@/lib/imageHelpers'
import {
  BaseBlockProps,
  SanityImage,
  LocalizedString,
  SanityCTA,
} from '@/types'
import { useMemo, useState, useEffect, lazy, Suspense } from 'react'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { getUITranslation } from '@/lib/i18n'
import SvgIcon from '@/components/ui/SvgIcon'
import pinIcon from '@/icons/system/pin.svg'
import { useCart } from '@/contexts/CartContext'
import { useInventory } from '@/contexts/InventoryContext'
import type { TakeoverTheme } from '@/lib/takeoverManager'
import LocallyFinder from '@/components/commerce/LocallyFinder'

const ConfettiLayer = lazy(() =>
  import('./FirecrackerAnimations').then(m => ({ default: m.ConfettiLayer }))
)

function getLocalized(text?: LocalizedString, lang: string = 'en') {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

interface HeroProductProps extends BaseBlockProps {
  eyebrow?: LocalizedString
  title?: LocalizedString
  description?: LocalizedString
  productImage?: SanityImage
  backgroundImage?: SanityImage
  cta?: SanityCTA
  align?: 'left' | 'center' | 'right'
  takeoverTheme?: TakeoverTheme | null
  product?: {
    price: number
    originalPrice?: number
    currency: string
    fulfillment?: 'direct' | 'retailer'
    shopifyVariantId?: string
    // We can keep this optional, but we rely on inventory.image now
    thumbnail?: string
  }
}

export default function HeroProduct({
  eyebrow,
  title,
  description,
  productImage,
  backgroundImage,
  align: _align = 'left',
  product,
  market = 'us',
  language = 'en',
  theme: _theme = 'dark',
  takeoverTheme,
}: HeroProductProps) {
  const displayTitle = getLocalized(title, language)?.replace(/\\n/g, '\n')
  const _displayDesc = getLocalized(description, language)
  const displayEyebrow = getLocalized(eyebrow, language)
  const { formatCurrency } = useMarketFormatting()

  const [isAdding, setIsAdding] = useState(false)
  const [showRetailerModal, setShowRetailerModal] = useState(false)
  const { addItem } = useCart()

  // 👇 Get inventory AND the live image from context
  const { inventory, isLoading } = useInventory()

  const stockStatus = isLoading
    ? 'checking'
    : inventory?.available
      ? 'in_stock'
      : 'out_of_stock'
  const livePrice = inventory?.price || null
  const compareAtPrice = inventory?.compareAtPrice || null

  // 👇 Grab the live image from Shopify
  const liveImage = (inventory as any)?.image || null

  const fulfillment =
    product?.fulfillment ||
    (['us', 'uk', 'eu', 'fr', 'de', 'es', 'it'].includes(market.toLowerCase())
      ? 'direct'
      : 'retailer')

  const handleAddToCart = async () => {
    if (!product?.shopifyVariantId) return
    setIsAdding(true)

    // Fallback if live fetch failed: Use prop thumbnail, then Hero image
    const heroImageUrl = productImage?.asset
      ? getImageUrl(productImage, { width: 400, quality: 80 })
      : undefined

    const finalImage = liveImage || product?.thumbnail || heroImageUrl

    console.log('🛒 Adding to Cart with Image:', finalImage)

    addItem({
      id: product.shopifyVariantId,
      variantId: product.shopifyVariantId,
      title: displayTitle,
      price: livePrice || product.price,
      currency: product.currency || 'USD',
      // 👇 Pass the live image from Shopify
      image: finalImage,
    })

    setTimeout(() => {
      setIsAdding(false)
    }, 800)
  }

  // ... (Rest of the component code remains the same: handleFindRetailer, effects, confetti, render) ...
  // (I'm omitting the rest of the file for brevity since it hasn't changed)

  const handleFindRetailer = () => {
    setShowRetailerModal(true)
  }

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches)
    }
    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const confettiConfig = useMemo(() => {
    const confettiEnabled = takeoverTheme?.effects?.confetti ?? false
    const confettiColors =
      takeoverTheme?.colors?.confetti?.map(c => c.hex) || []
    const confettiDensity = takeoverTheme?.effects?.confettiDensity || 'medium'
    const particleStyle = takeoverTheme?.effects?.particles || 'none'

    const fallbackColors = [
      takeoverTheme?.colors?.secondary?.hex,
      takeoverTheme?.colors?.tertiary?.hex,
      takeoverTheme?.colors?.accent?.hex,
    ].filter((c): c is string => !!c && c.trim().length > 0)

    return {
      generate: prefersReducedMotion ? false : confettiEnabled,
      palette:
        confettiColors.length > 0
          ? confettiColors
          : fallbackColors.length > 0
            ? fallbackColors
            : ['#ff6b35', '#f7931e', '#00a8e8'],
      density: confettiDensity,
      particleStyle: particleStyle,
    }
  }, [prefersReducedMotion, takeoverTheme])

  const getHeadline = (productTitle: string) => {
    const title = productTitle.toLowerCase()
    if (title.includes('cruiser')) return 'The Ultimate\nJoyride'
    if (title.includes('kick-stand')) return 'Feel Every\nKick'
    if (title.includes('honk')) return 'Honk If\nYou Love It'
    return ''
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        {confettiConfig.generate && (
          <div className="absolute inset-0 z-[5] pointer-events-none">
            <Suspense fallback={null}>
              <ConfettiLayer
                palette={confettiConfig.palette}
                density={confettiConfig.density}
                particleStyle={confettiConfig.particleStyle}
              />
            </Suspense>
          </div>
        )}

        <div className="absolute inset-0 z-0">
          {backgroundImage?.asset && (
            <motion.div
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <Image
                src={
                  getImageUrl(backgroundImage, { width: 2400, quality: 90 }) ||
                  ''
                }
                alt={backgroundImage.alt || 'Background'}
                fill
                className="object-cover opacity-40"
                priority
                sizes="100vw"
                {...(getBlurDataURL(backgroundImage) && {
                  placeholder: 'blur',
                  blurDataURL: getBlurDataURL(backgroundImage),
                })}
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 w-full">
          <div className="relative min-h-[90vh] flex flex-col items-center justify-center pt-header pb-20 gap-2">
            <div className="relative z-5 text-center -mb-4">
              {displayEyebrow && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="inline-block text-brand-primary-light font-heading-bold uppercase tracking-[0.3em] text-xs mb-8 px-6 py-3 rounded-full border border-brand-primary-light/40 backdrop-blur-sm"
                >
                  {displayEyebrow}
                </motion.span>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display uppercase leading-[0.75] mb-4 tracking-tighter text-white/95 mix-blend-overlay whitespace-pre-line"
                style={{
                  textShadow:
                    '0 0 80px rgba(255, 107, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.8)',
                }}
              >
                {displayTitle}
              </motion.h1>
              {getHeadline(displayTitle) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="relative z-5"
                >
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-brand-primary-light leading-[0.9] tracking-wide whitespace-pre-line">
                    {getHeadline(displayTitle)}
                  </h2>
                </motion.div>
              )}
            </div>

            {productImage?.asset && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  duration: 1.2,
                  ease: 'easeOut',
                }}
                className="relative z-20 pointer-events-none flex justify-center w-full -my-8"
              >
                <div className="relative w-full h-[35vh] md:h-[40vh] max-w-4xl max-h-[500px]">
                  <Image
                    src={
                      getImageUrl(productImage, {
                        width: 2000,
                        quality: 100,
                      }) || ''
                    }
                    alt={productImage.alt || displayTitle}
                    fill
                    className="object-contain drop-shadow-[0_0_150px_rgba(255,107,0,0.4)] filter"
                    sizes="(max-width: 768px) 95vw, 85vw"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {product && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="relative z-30 flex flex-col items-center justify-center gap-2 mt-8"
              >
                <div className="flex items-center gap-3">
                  {compareAtPrice &&
                    compareAtPrice > (livePrice || product.price) && (
                      <span className="text-gray-400 text-2xl font-heading-bold line-through">
                        {formatCurrency(compareAtPrice)}
                      </span>
                    )}
                  <span className="text-white text-4xl font-display">
                    {formatCurrency(livePrice || product.price)}
                  </span>
                  {compareAtPrice &&
                    compareAtPrice > (livePrice || product.price) && (
                      <span className="text-brand-primary-light text-lg font-heading-bold bg-brand-primary/10 px-3 py-1 rounded-full">
                        Save{' '}
                        {Math.round(
                          ((compareAtPrice - (livePrice || product.price)) /
                            compareAtPrice) *
                            100
                        )}
                        %
                      </span>
                    )}
                </div>

                {fulfillment === 'direct' ? (
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isAdding || stockStatus === 'out_of_stock'}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/90 hover:bg-white text-black px-8 py-4 rounded-full font-display text-base shadow-2xl transition-all duration-300 uppercase tracking-wide flex items-center gap-2"
                  >
                    {isAdding
                      ? getUITranslation('adding', language)
                      : getUITranslation('buyNow', language)}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleFindRetailer}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/90 hover:bg-white text-black px-8 py-4 rounded-full font-display text-base shadow-2xl transition-all duration-300 uppercase tracking-wide flex items-center gap-2"
                  >
                    <SvgIcon src={pinIcon} className="w-5 h-5" />
                    {getUITranslation('findRetailer', language)}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showRetailerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRetailerModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <button
                onClick={() => setShowRetailerModal(false)}
                className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-white transition-colors p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <LocallyFinder market={market} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
