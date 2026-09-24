'use client'

import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
  lazy,
  Suspense,
} from 'react'
import Image from 'next/image'
import { getImageProps } from '../../lib/imageHelpers'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import PriceDisplay from './PriceDisplay'
import type { LocalizedString, BaseBlockProps } from '@/types'
import { getLocalizedText } from '@/types'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import type { TakeoverTheme } from '@/lib/takeoverManager'

// Lazy load heavy animation components
const ConfettiLayer = lazy(() =>
  import('./FirecrackerAnimations').then(m => ({ default: m.ConfettiLayer }))
)
const AnimatedModal = lazy(() =>
  import('framer-motion').then(m => ({ default: m.motion.section }))
)
const AnimatePresence = lazy(() =>
  import('framer-motion').then(m => ({ default: m.AnimatePresence }))
)

// --- 1. TYPES ---
export interface ProductData {
  title: string
  slug?: { current: string }
  image: SanityImageSource
  marketData?: {
    price?: number
    compareAtPrice?: number
    currency?: string
  }
  // New markets array structure
  markets?: Array<{
    region: string
    price: number
    compareAtPrice?: number
    currency: string
    fulfillmentMethod?: string
  }>
  // Legacy fallback fields
  price?: number
  compareAtPrice?: number
  stickers?: StickerData[]
}

export interface StickerData {
  text?: LocalizedString | string
  style: 'starburst' | 'circle' | 'pill' | 'blob'
  rotation: number
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'price-tag'
    | 'custom'
  displayType?: 'text' | 'price'
  customPosition?: {
    top?: number
    left?: number
    bottom?: number
    right?: number
  }
  color?: string
  type?: 'text' | 'price'
  product?: ProductData
}

interface StickerProps extends Omit<StickerData, 'customPosition'> {
  product?: ProductData
  displayType?: 'text' | 'price'
  language?: string
  formatCurrency?: (amount: number) => string
}

export interface FirecrackerProps extends BaseBlockProps {
  layout?: 'banner' | 'takeover'
  heading?: LocalizedString | string
  subheading?: LocalizedString | string
  backgroundColor?: string
  product?: ProductData // Legacy single product support
  products?: ProductData[] // New carousel products array
  carouselSettings?: {
    autoRotate?: boolean
    rotationSpeed?: number
    showIndicators?: boolean
    showArrows?: boolean
  }
  marketingImage?: SanityImageSource
  cta?: {
    text: string
    url: string
  }
  stickers?: StickerData[]
  takeoverTheme?: TakeoverTheme | null // Takeover theme integration
  confettiConfig?: {
    generate: boolean
    palette: string[]
    density?: 'low' | 'medium' | 'high'
    particleStyle?: 'none' | 'stars' | 'snowflakes' | 'hearts'
  }
  // Raw Sanity fields for backward compatibility
  showConfetti?: boolean
  confettiColor?: string
  enableConfetti?: boolean
  colorPalette?: string[]
  // Debug: Additional possible field names
  confetti?: boolean
  confettiEnabled?: boolean
  colors?: string[]
  confettiColors?: string[]
  autoplay?: boolean
  autoplayDelay?: number
  showDots?: boolean
  showArrows?: boolean
}

interface FirecrackerContentProps {
  heading?: string
  subheading?: string
  backgroundColor?: string
  cta?: {
    text: string
    url: string
  }
  confettiConfig?: {
    generate: boolean
    palette: string[]
    density?: 'low' | 'medium' | 'high'
    particleStyle?: 'none' | 'stars' | 'snowflakes' | 'hearts'
  }
  currentProduct?: ProductData | null
  displayProducts: ProductData[]
  currentIndex: number
  isTransitioning: boolean
  imageProps?: ReturnType<typeof getImageProps>
  formatCurrency?: (amount: number) => string
  isCarousel: boolean
  carouselSettings: {
    autoRotate?: boolean
    rotationSpeed?: number
    showIndicators?: boolean
    showArrows?: boolean
  }
  stickers?: StickerData[]
  goToPrev: () => void
  goToNext: () => void
  goToIndex: (index: number) => void
  language?: string
  enableGlow?: boolean
}

// Confetti moved to separate file for lazy loading - see FirecrackerAnimations.tsx

// B. THE OPTIMIZED SVG STICKER COMPONENT
const Sticker = memo(
  ({
    text,
    style,
    rotation,
    color, // Remove default here - let it come from Sanity or fallback logic
    type = 'text',
    displayType,
    position,
    product,
    language = 'en',
  }: StickerProps) => {
    // Clean data function
    const cleanString = (str: string | undefined) =>
      str
        ?.replace(/[\u200B-\u200D\uFEFF\u2060\u061C\u200E\u200F]/g, '')
        .trim() || ''

    // Clean the color - use Sanity color or fallback to default
    const cleanColor = cleanString(color) || color || '#FF6600'

    // Check multiple indicators for price stickers
    const localizedText = getLocalizedText(text, language)
    const isPriceSticker =
      type === 'price' ||
      displayType === 'price' ||
      position === 'price-tag' ||
      // Also check if text suggests it's a price sticker
      (localizedText &&
        ['sale', 'price', '$'].some(keyword =>
          localizedText.toLowerCase().includes(keyword)
        ) &&
        product &&
        (product.price || product.marketData?.price))

    return (
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Text content determines the size */}
        <div
          className={`relative z-10 font-body-black text-white leading-tight m-2 ${
            isPriceSticker
              ? 'px-10 py-2'
              : style === 'starburst'
                ? 'px-8 py-8'
                : 'px-2 py-2'
          }`}
        >
          {isPriceSticker && product ? (
            <div className="flex flex-col items-center justify-center">
              {(product.marketData?.compareAtPrice ||
                product.compareAtPrice) && (
                <span className="font-heading text-sm line-through opacity-90 decoration-2 decoration-red-500 mb-0.5">
                  <PriceDisplay
                    amount={
                      product.marketData?.compareAtPrice ||
                      product.compareAtPrice ||
                      0
                    }
                    currency={
                      (product.marketData?.currency || 'USD') as
                        | 'USD'
                        | 'EUR'
                        | 'GBP'
                        | 'JPY'
                    }
                  />
                </span>
              )}
              <span
                className="font-display text-3xl tracking-tighter drop-shadow-sm whitespace-nowrap"
                style={{
                  textShadow: `2px 0px 0px ${cleanColor}, -2px 0px 0px ${cleanColor}, 0px 2px 0px ${cleanColor}, 0px -2px 0px ${cleanColor}, 2px 2px 0px ${cleanColor}, -2px -2px 0px ${cleanColor}, 2px -2px 0px ${cleanColor}, -2px 2px 0px ${cleanColor}`,
                }}
              >
                <PriceDisplay
                  amount={product.marketData?.price || product.price || 0}
                  currency={
                    (product.marketData?.currency || 'USD') as
                      | 'USD'
                      | 'EUR'
                      | 'GBP'
                      | 'JPY'
                  }
                />
              </span>
            </div>
          ) : (
            <div
              className={`${style === 'starburst' ? 'w-32 text-center' : 'inline-block'} overflow-hidden`}
            >
              <span
                className={`font-heading-bold uppercase transform drop-shadow-md leading-tight ${
                  style === 'starburst'
                    ? 'block break-words hyphens-auto text-base'
                    : 'whitespace-nowrap text-sm'
                }`}
                style={{
                  fontSize: style === 'starburst' ? '1.1rem' : '0.95rem',
                  lineHeight: style === 'starburst' ? '1.1' : '1',
                }}
              >
                {getLocalizedText(text, language) || ''}
              </span>
            </div>
          )}
        </div>

        {/* SVG background that scales with content */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 194.35 194.35"
          preserveAspectRatio={style === 'starburst' ? 'xMidYMid meet' : 'none'}
          style={{ zIndex: -1 }}
        >
          <defs>
            <filter
              id="dropShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="8"
                floodColor="rgba(0,0,0,0.3)"
              />
            </filter>
          </defs>
          {style === 'starburst' && (
            <path
              d="M101.01,1.8l6.67,8.05c1.6,1.93,4.38,2.37,6.5,1.03l8.83-5.59c2.64-1.67,6.14-.53,7.29,2.37l3.86,9.71c.92,2.33,3.43,3.61,5.86,2.99l10.13-2.59c3.02-.77,6,1.39,6.2,4.51l.66,10.43c.16,2.5,2.15,4.49,4.65,4.65l10.43.66c3.11.2,5.28,3.18,4.51,6.2l-2.59,10.13c-.62,2.43.66,4.94,2.99,5.86l9.71,3.86c2.9,1.15,4.04,4.66,2.37,7.29l-5.59,8.83c-1.34,2.12-.9,4.9,1.03,6.5l8.05,6.67c2.4,1.99,2.4,5.68,0,7.67l-8.05,6.67c-1.93,1.6-2.37,4.38-1.03,6.5l5.59,8.83c1.67,2.64.53,6.14-2.37,7.29l-9.71,3.86c-2.33.92-3.61,3.43-2.99,5.86l2.59,10.13c.77,3.02-1.39,6-4.51,6.2l-10.43.66c-2.5.16-4.49,2.15-4.65,4.65l-.66,10.43c-.2,3.11-3.18,5.28-6.2,4.51l-10.13-2.59c-2.43-.62-4.94.66-5.86,2.99l-3.86,9.71c-1.15,2.9-4.66,4.04-7.29,2.37l-8.83-5.59c-2.12-1.34-4.9-.9-6.5,1.03l-6.67,8.05c-1.99,2.4-5.68,2.4-7.67,0l-6.67-8.05c-1.6-1.93-4.38-2.37-6.5-1.03l-8.83,5.59c-2.64,1.67-6.14.53-7.29-2.37l-3.86-9.71c-.92-2.33-3.43-3.61-5.86-2.99l-10.13,2.59c-3.02.77-6-1.39-6.2-4.51l-.66-10.43c-.16-2.5-2.15-4.49-4.65-4.65l-10.43-.66c-3.11-.2-5.28-3.18-4.51-6.2l2.59-10.13c.62-2.43-.66-4.94-2.99-5.86l-9.71-3.86c-2.9-1.15-4.04-4.66-2.37-7.29l5.59-8.83c1.34-2.12.9-4.9-1.03-6.5l-8.05-6.67c-2.4-1.99-2.4-5.68,0-7.67l8.05-6.67c1.93-1.6,2.37-4.38,1.03-6.5l-5.59-8.83c-1.67-2.64-.53-6.14,2.37-7.29l9.71-3.86c2.33-.92,3.61-3.43,2.99-5.86l-2.59-10.13c-.77-3.02,1.39-6,4.51-6.2l10.43-.66c2.5-.16,4.49-2.15,4.65-4.65l.66-10.43c.2-3.11,3.18-5.28,6.2-4.51l10.13,2.59c2.43.62,4.94-.66,5.86-2.99l3.86-9.71c1.15-2.9,4.66-4.04,7.29-2.37l8.83,5.59c2.12,1.34,4.9.9,6.5-1.03l6.67-8.05c1.99-2.4,5.68-2.4,7.67,0Z"
              fill={cleanColor}
              filter="url(#dropShadow)"
            />
          )}
          {cleanString(style) === 'circle' && (
            <ellipse
              cx="50%"
              cy="50%"
              rx="48%"
              ry="48%"
              fill={cleanColor}
              filter="url(#dropShadow)"
            />
          )}
          {(cleanString(style) === 'pill' || cleanString(style) === 'blob') && (
            <rect
              x="2%"
              y="2%"
              width="96%"
              height="96%"
              rx="50%"
              ry="50%"
              fill={cleanColor}
              filter="url(#dropShadow)"
            />
          )}
        </svg>
      </div>
    )
  }
)

Sticker.displayName = 'Sticker'

// --- 3. OPTIMIZED CONTENT ENGINE ---
const FirecrackerContent = memo(
  ({
    heading,
    subheading,
    backgroundColor,
    cta,
    confettiConfig,
    currentProduct,
    displayProducts,
    currentIndex,
    isTransitioning,
    imageProps,
    isCarousel,
    carouselSettings,
    stickers,
    goToPrev,
    goToNext,
    goToIndex,
    language = 'en',
    formatCurrency,
    enableGlow: _enableGlow = false,
  }: FirecrackerContentProps) => {
    // Debug logging to check what data is being received

    // Background is now applied to outer wrapper for immediate rendering
    // Keep this for takeover theme fallback via CSS variables
    const bgStyle = backgroundColor
      ? undefined
      : {
          background: 'var(--campaign-primary, var(--campaign-secondary))',
        }

    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center"
        style={bgStyle}
      >
        {/* 1. LAZY LOADED Confetti Background */}
        {confettiConfig?.generate !== false && (
          <Suspense fallback={<div className="absolute inset-0" />}>
            <ConfettiLayer
              palette={
                confettiConfig?.palette || [
                  'rgb(252, 252, 252)',
                  'rgb(248, 90, 23)',
                ]
              }
              density={confettiConfig?.density}
              particleStyle={confettiConfig?.particleStyle}
            />
          </Suspense>
        )}

        <div className="container mx-auto px-8 lg:px-12 relative z-10 py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT: Text */}
            <div className="lg:col-span-5 text-white space-y-6 text-center lg:text-left relative z-20">
              <h2
                className={`font-display text-5xl md:text-7xl uppercase leading-[0.9] drop-shadow-xl transition-all duration-300 ${
                  isTransitioning
                    ? 'opacity-75 scale-95'
                    : 'opacity-100 scale-100'
                }`}
              >
                {getLocalizedText(heading, language) || 'Featured Products'}
              </h2>
              <p className="font-body-bold text-xl md:text-2xl opacity-90 max-w-md mx-auto lg:mx-0">
                {getLocalizedText(subheading, language) ||
                  'While supplies last.'}
              </p>
              {cta && (
                <div className="pt-4">
                  <a
                    href={cta.url}
                    className="inline-block bg-brand-primary hover:bg-brand-primary-dark text-white text-xl font-display uppercase py-4 px-10 rounded-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl border-2 border-white/20"
                  >
                    {cta.text}
                  </a>
                </div>
              )}
            </div>

            {/* RIGHT: Visuals */}
            <div className="lg:col-span-7 flex items-center justify-center w-full">
              <div className="relative w-full max-w-lg h-96 mx-auto">
                {imageProps?.src && (
                  <Image
                    {...imageProps}
                    alt={imageProps.alt || 'Product'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px"
                    className={`object-contain transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
                    priority
                  />
                )}

                {/* RESTORED STICKERS */}
                <div className="absolute inset-0 pointer-events-none">
                  {(currentProduct?.stickers || stickers)?.map(
                    (sticker: StickerData, idx: number) => {
                      // Skip null stickers
                      if (!sticker) return null

                      // Clean string function for sticker data
                      const cleanString = (str: string | undefined) =>
                        str
                          ?.replace(
                            /[\u200B-\u200D\uFEFF\u2060\u061C\u200E\u200F]/g,
                            ''
                          )
                          .trim() || ''

                      let pos: Record<string, string> = {}
                      const cleanPosition = cleanString(sticker?.position || '')

                      // Check if this is a price sticker
                      const isPriceSticker =
                        cleanPosition === 'price-tag' ||
                        cleanString(sticker.displayType) === 'price' ||
                        cleanString(sticker.type) === 'price'

                      // PRIORITY 1: Use customPosition values from Sanity editor
                      if (sticker?.customPosition) {
                        // Use the exact values from Sanity editor
                        if (
                          sticker.customPosition.top !== undefined &&
                          sticker.customPosition.top !== null
                        ) {
                          pos.top = `${sticker.customPosition.top}%`
                        }
                        if (
                          sticker.customPosition.left !== undefined &&
                          sticker.customPosition.left !== null
                        ) {
                          pos.left = `${sticker.customPosition.left}%`
                        }
                        if (
                          sticker.customPosition.bottom !== undefined &&
                          sticker.customPosition.bottom !== null
                        ) {
                          pos.bottom = `${sticker.customPosition.bottom}%`
                        }
                        if (
                          sticker.customPosition.right !== undefined &&
                          sticker.customPosition.right !== null
                        ) {
                          pos.right = `${sticker.customPosition.right}%`
                        }
                      }
                      // PRIORITY 2: Use named positions only if no customPosition
                      else if (cleanPosition === 'top-left') {
                        pos = { top: '5%', left: '5%' }
                      } else if (cleanPosition === 'top-right') {
                        pos = { top: '5%', right: '5%' }
                      } else if (cleanPosition === 'bottom-left') {
                        pos = { bottom: '5%', left: '5%' }
                      } else if (cleanPosition === 'bottom-right') {
                        pos = { bottom: '5%', right: '5%' }
                      } else if (
                        cleanPosition === 'price-tag' ||
                        isPriceSticker
                      ) {
                        pos = { bottom: '8%', right: '5%' }
                      } else {
                        // PRIORITY 3: Fallback only if no customPosition and no named position
                        pos = {
                          top: `${8 + idx * 12}%`,
                          right: `${5 + idx * 8}%`,
                        }
                      }

                      // Handle sticker color - prioritize Sanity color, then fallback
                      const color = cleanString(sticker.color) || sticker.color // Preserve original if cleaning fails

                      if (!color) {
                        if (
                          cleanString(sticker.displayType) === 'price' ||
                          cleanString(sticker.type) === 'price' ||
                          isPriceSticker
                        ) {
                          // Use fallback logic below instead of hardcoded color
                        } else {
                          // Let Sticker component handle color fallback logic
                        }
                      }

                      // Clean the sticker data
                      const cleanedSticker = {
                        ...sticker,
                        text: cleanString(
                          getLocalizedText(sticker.text, language)
                        ),
                        style: cleanString(sticker.style) as
                          | 'starburst'
                          | 'circle'
                          | 'pill'
                          | 'blob',
                        displayType: cleanString(sticker.displayType) as
                          | 'text'
                          | 'price'
                          | undefined,
                        type: cleanString(sticker.type) as
                          | 'text'
                          | 'price'
                          | undefined,
                        position: cleanString(
                          sticker.position
                        ) as StickerData['position'],
                      }

                      // Enhanced price sticker identification
                      let shouldShowPrice = isPriceSticker

                      // Also check if sticker text suggests it should show price
                      const stickerText = cleanString(
                        getLocalizedText(sticker.text, language)
                      ).toLowerCase()
                      const priceKeywords = [
                        'price',
                        'sale',
                        '$',
                        'usd',
                        'eur',
                        'gbp',
                        'cost',
                        'msrp',
                      ]
                      if (
                        !shouldShowPrice &&
                        priceKeywords.some(keyword =>
                          stickerText.includes(keyword)
                        )
                      ) {
                        shouldShowPrice = true
                      }

                      // Force price display if we have price data available and no explicit text
                      if (
                        !shouldShowPrice &&
                        !cleanString(
                          getLocalizedText(sticker.text, language)
                        ) &&
                        currentProduct &&
                        (currentProduct.marketData?.price ||
                          currentProduct.price)
                      ) {
                        shouldShowPrice = true
                      }

                      // If this is identified as a price sticker, update the type/displayType
                      if (
                        shouldShowPrice &&
                        !cleanedSticker.displayType &&
                        !cleanedSticker.type
                      ) {
                        cleanedSticker.displayType = 'price'
                      }

                      return (
                        <div
                          key={idx}
                          className="absolute"
                          style={{
                            ...pos,
                            zIndex: 10,
                            pointerEvents: 'none',
                            minWidth: shouldShowPrice ? '120px' : '80px',
                            minHeight: shouldShowPrice ? '60px' : '80px',
                          }}
                        >
                          <Sticker
                            {...cleanedSticker}
                            color={color}
                            product={currentProduct || undefined}
                            language={language}
                            formatCurrency={formatCurrency}
                          />
                        </div>
                      )
                    }
                  )}
                </div>

                {/* Carousel Controls */}
                {isCarousel && carouselSettings.showArrows && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-colors z-50"
                    >
                      ←
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-colors z-50"
                    >
                      →
                    </button>
                  </>
                )}

                {isCarousel && carouselSettings.showIndicators && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-50">
                    {displayProducts.map((_: ProductData, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentIndex
                            ? 'bg-white scale-110'
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

FirecrackerContent.displayName = 'FirecrackerContent'

// --- 4. MAIN COMPONENT ---
export default function Firecracker(props: FirecrackerProps) {
  // Use market formatting hook
  const { market: currentMarket, formatCurrency } = useMarketFormatting()

  // Clean data function to remove invisible Unicode characters (must be before useCallback)
  const cleanString = (str: string | undefined | null | unknown) => {
    if (typeof str !== 'string') return ''
    return (
      str
        ?.replace(/[\u200B-\u200D\uFEFF\u2060\u061C\u200E\u200F]/g, '')
        .trim() || ''
    )
  }

  // Helper function to get market-aware pricing
  const getMarketPrice = useCallback(
    (product: any, priceType: 'price' | 'compareAtPrice' = 'price') => {
      if (!product) return 0

      // Map current market to region names used in Sanity
      const marketToRegion: Record<string, string> = {
        us: 'US',
        uk: 'UK',
        gb: 'UK',
        de: 'EU', // Germany maps to EU market
        eu: 'EU',
        fr: 'EU', // France maps to EU market
        it: 'EU', // Italy maps to EU market
        es: 'EU', // Spain maps to EU market
        jp: 'JP',
        japan: 'JP',
      }

      const targetRegion =
        marketToRegion[currentMarket?.code?.toLowerCase()] ||
        currentMarket?.code?.toUpperCase()

      // If product has markets array with region-specific pricing
      if (product.markets && Array.isArray(product.markets)) {
        const marketData = product.markets.find(
          (m: any) => cleanString(m.region) === targetRegion
        )

        if (marketData) {
          const price =
            priceType === 'compareAtPrice'
              ? marketData.compareAtPrice || marketData.price
              : marketData.price

          return price
        }
      }

      // Fallback to marketData or direct price
      if (product.marketData) {
        return priceType === 'compareAtPrice'
          ? product.marketData.compareAtPrice || product.marketData.price
          : product.marketData.price
      }

      return priceType === 'compareAtPrice'
        ? product.compareAtPrice || product.price
        : product.price
    },
    [currentMarket?.code]
  )

  const {
    layout = 'banner',
    heading,
    subheading,
    backgroundColor,
    product,
    products = [],
    marketingImage,
    cta,
    stickers,
    // Market and language context
    market = 'us',
    language = 'en',
    // Raw Sanity data fields - get confettiConfig from Sanity
    showConfetti,
    confettiColor,
    enableConfetti,
    colorPalette,
    confetti,
    confettiEnabled,
    colors,
    confettiColors,
    autoplay,
    autoplayDelay,
    showDots,
    showArrows,
    carouselSettings: passedCarouselSettings,
    ...rest
  } = props

  // Extract confettiConfig - prioritize passed props over Sanity data
  const sanityConfettiConfig = props.confettiConfig
  const passedConfettiConfig = rest.confettiConfig

  // Extract takeover theme glow setting (outside confettiConfig so it can be used elsewhere)
  const takeoverGlow = props.takeoverTheme?.effects?.glow ?? false

  // Transform raw Sanity data into expected format
  const carouselSettings = useMemo(
    () =>
      passedCarouselSettings || {
        autoRotate: autoplay ?? false,
        rotationSpeed: autoplayDelay ?? 5,
        showIndicators: showDots ?? false,
        showArrows: showArrows ?? false,
      },
    [passedCarouselSettings, autoplay, autoplayDelay, showDots, showArrows]
  )

  // Track reduced motion preference (client-only)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Subscribe to media query changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches)
    }

    // Set initial value
    handleChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const confettiConfig = useMemo(() => {
    // Clean color strings to remove invisible Unicode characters
    const cleanColorArray = (colors: string[] | undefined) => {
      if (!colors || !Array.isArray(colors)) return undefined
      return colors
        .map(color =>
          typeof color === 'string'
            ? color
                .replace(/[\u200B-\u200D\uFEFF\u2060\u061C\u200E\u200F]/g, '')
                .trim()
            : color
        )
        .filter(color => typeof color === 'string' && color.length > 0)
    }

    const cleanedSanityPalette = cleanColorArray(sanityConfettiConfig?.palette)

    // Extract takeover theme confetti settings
    const takeoverConfettiEnabled =
      props.takeoverTheme?.effects?.confetti ?? false
    const takeoverConfettiColors =
      props.takeoverTheme?.colors?.confetti?.map(c => c.hex) || []
    const cleanedTakeoverColors = cleanColorArray(takeoverConfettiColors)
    const takeoverConfettiDensity =
      props.takeoverTheme?.effects?.confettiDensity
    const takeoverParticleStyle = props.takeoverTheme?.effects?.particles
    const hasTakeoverTheme = !!props.takeoverTheme

    // Extract non-primary campaign colors (secondary, tertiary, accent) as fallback
    const campaignNonPrimaryColors = [
      props.takeoverTheme?.colors?.secondary?.hex,
      props.takeoverTheme?.colors?.tertiary?.hex,
      props.takeoverTheme?.colors?.accent?.hex,
    ].filter((c): c is string => !!c && c.trim().length > 0)

    // Build confetti config with proper priority fallbacks
    const finalConfig = {
      generate: prefersReducedMotion
        ? false
        : (passedConfettiConfig?.generate ??
          sanityConfettiConfig?.generate ??
          (hasTakeoverTheme
            ? takeoverConfettiEnabled
            : (enableConfetti ??
              confetti ??
              confettiEnabled ??
              showConfetti)) ??
          true),
      palette:
        (passedConfettiConfig?.palette?.filter(c => c && c.trim()).length ??
          0) > 0
          ? (passedConfettiConfig?.palette?.filter(c => c && c.trim()) ?? [])
          : cleanedSanityPalette && cleanedSanityPalette.length > 0
            ? cleanedSanityPalette
            : hasTakeoverTheme &&
                cleanedTakeoverColors &&
                cleanedTakeoverColors.length > 0
              ? cleanedTakeoverColors
              : hasTakeoverTheme && campaignNonPrimaryColors.length > 0
                ? campaignNonPrimaryColors
                : colorPalette && colorPalette.length > 0
                  ? cleanColorArray(colorPalette) || colorPalette
                  : colors && colors.length > 0
                    ? cleanColorArray(colors) || colors
                    : confettiColors && confettiColors.length > 0
                      ? cleanColorArray(confettiColors) || confettiColors
                      : confettiColor
                        ? [confettiColor]
                        : cleanedTakeoverColors &&
                            cleanedTakeoverColors.length > 0
                          ? cleanedTakeoverColors
                          : campaignNonPrimaryColors.length > 0
                            ? campaignNonPrimaryColors
                            : ['#ff6b35', '#f7931e', '#00a8e8'],
      density:
        passedConfettiConfig?.density ??
        sanityConfettiConfig?.density ??
        takeoverConfettiDensity ??
        'medium',
      particleStyle:
        passedConfettiConfig?.particleStyle ??
        sanityConfettiConfig?.particleStyle ??
        takeoverParticleStyle ??
        'none',
    }

    return finalConfig
  }, [
    prefersReducedMotion,
    passedConfettiConfig,
    sanityConfettiConfig,
    enableConfetti,
    confetti,
    confettiEnabled,
    showConfetti,
    props.takeoverTheme,
    colorPalette,
    colors,
    confettiColors,
    confettiColor,
  ])

  // For takeover layout, delay appearance by 2 seconds
  const [isVisible, setIsVisible] = useState(layout !== 'takeover')

  useEffect(() => {
    if (layout === 'takeover') {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000) // 2 second delay
      return () => clearTimeout(timer)
    }
    return
  }, [layout])

  // Function to check if a product is available in the current market
  const isProductAvailableInMarket = useCallback(
    (rawProduct: unknown): boolean => {
      if (!rawProduct || typeof rawProduct !== 'object') return false

      const product = rawProduct as Record<string, unknown>

      // If no markets array, assume it's available (legacy behavior)
      if (!Array.isArray(product.markets) || product.markets.length === 0) {
        return true
      }

      // Map current market to region names used in Sanity
      const marketToRegion: Record<string, string> = {
        us: 'US',
        uk: 'UK',
        gb: 'UK',
        de: 'EU',
        eu: 'EU',
        fr: 'EU',
        it: 'EU',
        es: 'EU',
        jp: 'JP',
        japan: 'JP',
      }

      const targetRegion =
        marketToRegion[market?.toLowerCase()] || market?.toUpperCase()

      // Check if product has availability in the target market
      const hasTargetMarket = (product.markets as any[]).some(
        m => m?.region === targetRegion
      )

      // Fall back to US market if target market not found (for demo purposes)
      const hasUSMarket = (product.markets as any[]).some(
        m => m?.region === 'US'
      )

      // Allow if there's ANY market data (permissive for carousel functionality)
      const hasAnyMarket = (product.markets as any[]).length > 0

      return hasTargetMarket || hasUSMarket || hasAnyMarket
    },
    [market]
  )

  // Transform product data from Sanity format
  const transformProduct = useCallback(
    (rawProduct: unknown): ProductData | null => {
      if (!rawProduct || typeof rawProduct !== 'object') return null

      const product = rawProduct as Record<string, unknown>

      return {
        title: typeof product.title === 'string' ? product.title : '',
        slug: product.slug as { current: string } | undefined,
        image: product.image as SanityImageSource,
        // Extract price from the markets array with proper market mapping
        price: (() => {
          // Strategy 1: Handle markets array (new structure)
          if (Array.isArray(product.markets) && product.markets.length > 0) {
            // Map current market to region names used in Sanity
            const marketToRegion: Record<string, string> = {
              us: 'US',
              uk: 'UK',
              gb: 'UK',
              de: 'EU', // Germany maps to EU market
              eu: 'EU',
              fr: 'EU', // France maps to EU market
              it: 'EU', // Italy maps to EU market
              es: 'EU', // Spain maps to EU market
              jp: 'JP',
              japan: 'JP',
            }

            const targetRegion =
              marketToRegion[market?.toLowerCase()] || market?.toUpperCase()

            // Find the matching market data
            const marketData = (product.markets as any[]).find(
              m => m?.region === targetRegion
            )

            if (marketData?.price) {
              return marketData.price
            }

            // Fallback to US market if available
            const usMarket = (product.markets as any[]).find(
              m => m?.region === 'US'
            )
            if (usMarket?.price) {
              return usMarket.price
            }

            // Final fallback: use first available market
            const firstMarket = (product.markets as any[])[0]
            if (firstMarket?.price) {
              return firstMarket.price
            }
          }

          // Legacy fallback to old marketData structure (if it exists)
          const legacyMarketData = product.marketData as { price?: number }
          if (legacyMarketData?.price) {
            return legacyMarketData.price
          }

          // Final fallback to direct price field
          const directPrice =
            typeof product.price === 'number' ? product.price : undefined

          return directPrice
        })(),
        compareAtPrice: (() => {
          // Handle markets array for compareAtPrice
          if (Array.isArray(product.markets) && product.markets.length > 0) {
            const marketToRegion: Record<string, string> = {
              us: 'US',
              uk: 'UK',
              gb: 'UK',
              de: 'EU',
              eu: 'EU',
              fr: 'EU',
              it: 'EU',
              es: 'EU',
              jp: 'JP',
              japan: 'JP',
            }

            const targetRegion =
              marketToRegion[market?.toLowerCase()] || market?.toUpperCase()
            const marketData = (product.markets as any[]).find(
              m => m?.region === targetRegion
            )

            if (marketData?.compareAtPrice) {
              return marketData.compareAtPrice
            }

            // Fallback to US market
            const usMarket = (product.markets as any[]).find(
              m => m?.region === 'US'
            )
            if (usMarket?.compareAtPrice) {
              return usMarket.compareAtPrice
            }

            // Final fallback: first available
            const firstMarket = (product.markets as any[])[0]
            if (firstMarket?.compareAtPrice) {
              return firstMarket.compareAtPrice
            }
          }

          // Legacy fallbacks
          const legacyMarketData = product.marketData as {
            compareAtPrice?: number
          }
          return (
            legacyMarketData?.compareAtPrice ||
            (typeof product.compareAtPrice === 'number'
              ? product.compareAtPrice
              : undefined)
          )
        })(),
        // Keep marketData for backward compatibility but populate from markets array
        marketData: (() => {
          if (Array.isArray(product.markets) && product.markets.length > 0) {
            const marketToRegion: Record<string, string> = {
              us: 'US',
              uk: 'UK',
              gb: 'UK',
              de: 'EU',
              eu: 'EU',
              fr: 'EU',
              it: 'EU',
              es: 'EU',
              jp: 'JP',
              japan: 'JP',
            }

            const targetRegion =
              marketToRegion[market?.toLowerCase()] || market?.toUpperCase()
            const marketData = (product.markets as any[]).find(
              m => m?.region === targetRegion
            )

            if (marketData) {
              return {
                price: marketData.price,
                compareAtPrice: marketData.compareAtPrice,
                currency: marketData.currency,
                region: marketData.region,
                fulfillmentMethod: marketData.fulfillmentMethod,
              }
            }

            // Fallback to first available market
            const firstMarket = (product.markets as any[])[0]
            if (firstMarket) {
              return {
                price: firstMarket.price,
                compareAtPrice: firstMarket.compareAtPrice,
                currency: firstMarket.currency,
                region: firstMarket.region,
                fulfillmentMethod: firstMarket.fulfillmentMethod,
              }
            }
          }

          // Legacy fallback
          return (
            (product.marketData as Record<string, unknown>) || {
              price:
                typeof product.price === 'number' ? product.price : undefined,
              compareAtPrice:
                typeof product.compareAtPrice === 'number'
                  ? product.compareAtPrice
                  : undefined,
            }
          )
        })(),
        stickers: Array.isArray(product.stickers)
          ? (() => {
              const filtered = product.stickers.filter(Boolean)
              return filtered.map((sticker: unknown) => {
                const stickerObj = sticker as Record<string, unknown>
                const transformedSticker = {
                  text:
                    typeof stickerObj?.text === 'string'
                      ? stickerObj.text
                      : typeof stickerObj?.label === 'string'
                        ? stickerObj.label
                        : '',
                  style:
                    typeof stickerObj?.style === 'string'
                      ? (stickerObj.style as
                          | 'starburst'
                          | 'circle'
                          | 'pill'
                          | 'blob')
                      : 'circle',
                  rotation:
                    typeof stickerObj?.rotation === 'number'
                      ? stickerObj.rotation
                      : 0,
                  position: stickerObj?.position as StickerData['position'],
                  // Preserve color exactly as it comes from Sanity - don't filter or clean it yet
                  color: stickerObj?.color as string | undefined,
                  customPosition: stickerObj?.customPosition as
                    | {
                        top?: number
                        left?: number
                        bottom?: number
                        right?: number
                      }
                    | undefined,
                  displayType:
                    typeof stickerObj?.displayType === 'string' &&
                    ['text', 'price'].includes(stickerObj.displayType)
                      ? (stickerObj.displayType as 'text' | 'price')
                      : undefined,
                  type:
                    typeof stickerObj?.type === 'string' &&
                    ['text', 'price'].includes(stickerObj.type)
                      ? (stickerObj.type as 'text' | 'price')
                      : undefined,
                }

                return transformedSticker
              })
            })()
          : undefined,
        // Preserve the original markets array for market-aware pricing
        markets: Array.isArray(product.markets) ? product.markets : undefined,
      }
    },
    [market]
  )

  const transformedProduct = useMemo(() => {
    const transformed = product ? transformProduct(product) : null

    return transformed
  }, [product, transformProduct])
  const transformedProducts = useMemo(() => {
    const filtered = products
      .filter(p => isProductAvailableInMarket(p))
      .map(p => transformProduct(p))
      .filter(Boolean) as ProductData[]

    return filtered
  }, [products, isProductAvailableInMarket, transformProduct])

  const displayProducts = useMemo(() => {
    return transformedProducts.length > 0
      ? transformedProducts
      : transformedProduct
        ? [transformedProduct]
        : []
  }, [transformedProducts, transformedProduct])

  const isCarousel = displayProducts.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const rawCurrentProduct = displayProducts[currentIndex] || product || null

  // Apply market-aware pricing to current product
  const currentProduct = useMemo(
    () =>
      rawCurrentProduct
        ? {
            ...rawCurrentProduct,
            marketData: {
              price: getMarketPrice(rawCurrentProduct, 'price'),
              compareAtPrice: getMarketPrice(
                rawCurrentProduct,
                'compareAtPrice'
              ),
              currency: currentMarket?.currency?.code || 'USD',
            },
          }
        : null,
    [rawCurrentProduct, currentMarket, getMarketPrice]
  )

  const displayImage = marketingImage || currentProduct?.image
  const imageProps = displayImage
    ? getImageProps(displayImage, 'hero', 'Product')
    : null

  useEffect(() => {
    if (!isCarousel || !carouselSettings.autoRotate) return

    const interval = setInterval(
      () => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentIndex(prev => {
            const newIndex = (prev + 1) % displayProducts.length
            return newIndex
          })
          setIsTransitioning(false)
        }, 150)
      },
      (carouselSettings.rotationSpeed || 5) * 1000
    )
    return () => {
      clearInterval(interval)
    }
  }, [
    isCarousel,
    carouselSettings.autoRotate,
    carouselSettings.rotationSpeed,
    displayProducts.length,
  ])

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % displayProducts.length)
      setIsTransitioning(false)
    }, 150)
  }, [isTransitioning, displayProducts.length])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(
        prev => (prev - 1 + displayProducts.length) % displayProducts.length
      )
      setIsTransitioning(false)
    }, 150)
  }, [isTransitioning, displayProducts.length])

  const goToIndex = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setIsTransitioning(false)
      }, 150)
    },
    [isTransitioning, currentIndex]
  )

  // Helper to convert hex color to RGB for glow effect
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
      : '214,17,122' // fallback to brand primary
  }

  // Generate dynamic glow style based on theme color
  const glowStyle = useMemo(() => {
    if (!takeoverGlow || !props.takeoverTheme?.colors?.primary?.hex) return ''
    const rgb = hexToRgb(props.takeoverTheme.colors.primary.hex)
    return `shadow-[0_0_40px_rgba(${rgb},0.6),0_0_80px_rgba(${rgb},0.4),0_0_120px_rgba(${rgb},0.2)]`
  }, [takeoverGlow, props.takeoverTheme?.colors?.primary?.hex])

  // Memoize content props to prevent object recreation
  const contentProps = useMemo(() => {
    // Transform Sanity CTA format to component format
    const transformCTA = (rawCTA: unknown) => {
      if (!rawCTA)
        return {
          text: getLocalizedText('SHOP NOW', language) || 'SHOP NOW',
          url: '#',
        }

      const ctaObj = rawCTA as Record<string, unknown>

      // If it's already in the expected format, use it
      if (ctaObj.text && ctaObj.url)
        return ctaObj as { text: string; url: string }

      // Transform from Sanity link format
      const url = (ctaObj.externalUrl ||
        ctaObj.internalUrl ||
        ctaObj.url ||
        '#') as string
      const labelObj = ctaObj.label as Record<string, unknown> | undefined
      const text = (labelObj?.en ||
        ctaObj.label ||
        ctaObj.text ||
        getLocalizedText('SHOP NOW', language) ||
        'SHOP NOW') as string

      return { text, url }
    }

    const transformedCTA = transformCTA(cta)

    return {
      heading:
        cleanString(getLocalizedText(heading, language)) ||
        getLocalizedText('Featured Products', language) ||
        'Featured Products',
      subheading: cleanString(getLocalizedText(subheading, language)),
      backgroundColor:
        props.takeoverTheme?.colors?.primary?.hex ||
        cleanString(backgroundColor) ||
        undefined,
      cta: transformedCTA,
      confettiConfig: {
        generate: confettiConfig?.generate !== false,
        palette: confettiConfig?.palette?.filter(
          (c): c is string => typeof c === 'string' && c.length > 0
        ) || ['#FF6600', '#00D4FF', '#FFD700', '#FF69B4', '#00FF7F', '#FF4500'],
        density: confettiConfig?.density,
        particleStyle: confettiConfig?.particleStyle,
      },
      currentProduct,
      displayProducts,
      currentIndex,
      isTransitioning,
      imageProps: imageProps || undefined,
      isCarousel,
      carouselSettings,
      stickers:
        stickers?.map(sticker => ({
          ...sticker,
          // Override pricing data with market-aware pricing if this sticker has a product
          ...(sticker.product && {
            product: {
              ...sticker.product,
              marketData: {
                price: getMarketPrice(sticker.product, 'price'),
                compareAtPrice: getMarketPrice(
                  sticker.product,
                  'compareAtPrice'
                ),
                currency: currentMarket?.currency?.code || 'USD',
              },
            },
          }),
        })) || [],
      goToPrev,
      goToNext,
      goToIndex,
      language,
      formatCurrency,
      enableGlow: takeoverGlow,
    }
  }, [
    heading,
    subheading,
    backgroundColor,
    cta,
    confettiConfig,
    currentProduct,
    displayProducts,
    currentIndex,
    isTransitioning,
    imageProps,
    isCarousel,
    carouselSettings,
    stickers,
    goToPrev,
    goToNext,
    goToIndex,
    language,
    formatCurrency,
    getMarketPrice,
    currentMarket?.currency?.code,
    props.takeoverTheme,
    takeoverGlow,
  ])

  // --- RENDERING ---

  // OPTION 1: TAKEOVER (Lazy loaded modal)
  if (layout === 'takeover') {
    return (
      <Suspense
        fallback={<div className="fixed inset-0 bg-black/60 z-[100]" />}
      >
        <AnimatePresence>
          {isVisible && (
            <AnimatedModal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              {/* Modal Container */}
              <div
                className={`relative w-full max-w-7xl rounded-[3rem] overflow-hidden shadow-2xl ${
                  glowStyle
                }`}
                style={{
                  backgroundColor: contentProps.backgroundColor || undefined,
                }}
              >
                {props.takeoverTheme && (
                  <div className="absolute left-4 top-4 z-50 rounded-md bg-black/80 text-white text-[10px] px-2 py-1 border border-white/20">
                    Takeover Theme Applied
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="absolute top-6 right-6 z-50 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <FirecrackerContent {...contentProps} />
              </div>
            </AnimatedModal>
          )}
        </AnimatePresence>
      </Suspense>
    )
  }

  // OPTION 2: BANNER (Inline)
  if (!isVisible && layout === 'banner') return null

  // Apply background color immediately to outer wrapper for instant rendering
  const wrapperBgStyle = {
    backgroundColor: contentProps.backgroundColor || undefined,
  }

  return (
    <section className="relative w-full overflow-hidden" style={wrapperBgStyle}>
      {props.takeoverTheme && (
        <div className="absolute left-4 top-4 z-20 rounded-md bg-black/80 text-white text-[10px] px-2 py-1 border border-white/20">
          Takeover Theme Applied
        </div>
      )}
      <FirecrackerContent {...contentProps} />
    </section>
  )
}
