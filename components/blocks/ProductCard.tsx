'use client'

import Image from 'next/image'
import Sunburst from '@/components/ui/Sunburst'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getImageUrl, getAltText } from '../../lib/imageHelpers'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { BaseBlockProps, SanityImage, LocalizedString } from '@/types'
import { translate } from '@/lib/uiTranslations'
import { getInventory } from '@/app/actions/getInventory'

// --- HELPER: Safely render localized content ---
const getLocalizedString = (
  content: LocalizedString | undefined,
  lang: string = 'en'
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content[lang] || content.en || Object.values(content)[0] || ''
}

// 👇 Extend BaseBlockProps to get 'market' and 'language' automatically
export interface ProductCardProps extends BaseBlockProps {
  title: LocalizedString
  slug: string | { current: string }
  image: SanityImage
  price?: number
  compareAtPrice?: number
  currency?: string
  isNew?: boolean
  showPricing?: boolean
  ctaText?: LocalizedString
  priority?: boolean // Add priority prop for above-the-fold images
  shopifyVariantId?: string // For live pricing
}

export function ProductCard({
  title,
  slug,
  image,
  price,
  compareAtPrice,
  currency: _currency = 'USD',
  isNew,
  showPricing = true,
  ctaText,
  priority = false,
  shopifyVariantId,
  // 👇 Destructure context props with defaults and validate
  market = 'us',
  language = 'en',
}: ProductCardProps) {
  // Validate and sanitize parameters to prevent object injection
  const safeMarket =
    typeof market === 'string' &&
    !market.includes('[object') &&
    !market.includes('%5Bobject')
      ? market.trim()
      : 'us'
  const safeLanguage =
    typeof language === 'string' &&
    !language.includes('[object') &&
    !language.includes('%5Bobject')
      ? language.trim()
      : 'en'

  const { formatCurrency } = useMarketFormatting()
  const formatPrice = (amount: number) => formatCurrency(amount) // formatCurrency likely handles locale internally or via context

  // Fetch live Shopify pricing
  const [livePrice, setLivePrice] = useState<number | null>(null)
  const [liveCompareAtPrice, setLiveCompareAtPrice] = useState<number | null>(
    null
  )

  useEffect(() => {
    if (shopifyVariantId && market) {
      getInventory(shopifyVariantId, market)
        .then(inventory => {
          if (inventory?.price) setLivePrice(inventory.price)
          if (inventory?.compareAtPrice)
            setLiveCompareAtPrice(inventory.compareAtPrice)
        })
        .catch(() => {
          // Silently fail and use Sanity prices
        })
    }
  }, [shopifyVariantId, market])

  // Use live prices if available, fallback to Sanity prices
  const displayPrice = livePrice ?? price
  const displayCompareAtPrice = liveCompareAtPrice ?? compareAtPrice
  const isOnSale =
    displayCompareAtPrice &&
    displayPrice &&
    displayCompareAtPrice > displayPrice

  // 1. Data Handling
  const displayTitle = getLocalizedString(title, safeLanguage)
  const displayCta =
    getLocalizedString(ctaText, safeLanguage) ||
    translate(safeLanguage, 'viewProduct')

  // 2. Safe Slug Extraction
  const safeSlug =
    typeof slug === 'object' && slug !== null ? slug.current : slug

  // 3. Link Construction (Prevents 307 Redirect)
  // 🔴 OLD: href={`/products/${safeSlug}`}
  // 🟢 NEW: Prepend market and language
  const productHref = `/${safeMarket}/${safeLanguage}/products/${safeSlug}`

  return (
    <Link href={productHref} className="group block h-full">
      <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300 hover:border-brand-primary hover:shadow-2xl hover:-translate-y-1">
        {/* IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden flex items-center justify-center">
          <Sunburst tone="light" />
          {image ? (
            <Image
              src={getImageUrl(image, { width: 800, fit: 'max' }) || ''}
              alt={getAltText(image, displayTitle)}
              fill
              className="relative object-contain p-5 drop-shadow-[0_14px_16px_rgba(36,30,58,0.28)] transition-transform duration-700 group-hover:scale-105"
              priority={priority} // Use priority prop for above-the-fold images
              loading={priority ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1 text-xs font-heading-bold uppercase tracking-wider bg-brand-secondary text-white rounded-full shadow-md">
                {translate(language, 'new')}
              </span>
            )}
            {isOnSale && showPricing && (
              <span className="px-3 py-1 text-xs font-heading-bold uppercase tracking-wider bg-brand-primary text-white rounded-full shadow-md">
                {translate(language, 'sale')}
              </span>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-heading-bold text-brand-ink dark:text-white mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {displayTitle}
          </h3>

          <div className="mt-auto flex flex-col gap-3">
            {showPricing && displayPrice ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(displayPrice)}
                  </span>
                  {isOnSale && displayCompareAtPrice && (
                    <span className="text-sm text-slate-500 line-through decoration-red-500">
                      {formatPrice(displayCompareAtPrice)}
                    </span>
                  )}
                </div>
                {/* Stock status - you can add inventory check here later */}
              </div>
            ) : showPricing ? (
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-sm italic">
                  {translate(language, 'priceNotAvailable')}
                </span>
              </div>
            ) : (
              <div className="h-2" />
            )}

            {/* CTA BUTTON */}
            <span className="text-sm font-heading-bold text-brand-primary group-hover:underline decoration-2 underline-offset-4">
              {displayCta} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
