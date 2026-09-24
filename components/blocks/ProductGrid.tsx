'use client'

import { cn } from '@/lib/utils'
import { ProductCard } from './ProductCard'
// 👇 Import shared types
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// Helper to safely get string from localized object
const getLocalized = (content?: LocalizedString, lang: string = 'en') => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content[lang] || content.en || Object.values(content)[0] || ''
}

export interface ProductGridProps extends BaseBlockProps {
  heading?: LocalizedString
  columns?: number
  showPricing?: boolean
  ctaText?: LocalizedString
  products: Array<{
    _id: string
    title: LocalizedString
    slug: string | { current: string }
    image: SanityImage
    marketData?: {
      price: number
      compareAtPrice?: number
      currency?: string
      isNew?: boolean
      shopifyVariantId?: string
    }
  }>
}

export function ProductGrid({
  heading,
  columns = 3,
  products,
  showPricing = true,
  ctaText,
  // 👇 Destructure market/language (passed from page.tsx)
  market = 'us',
  language = 'en',
}: ProductGridProps) {
  if (!products || products.length === 0) return null

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

  // Responsive column mapping
  const gridCols =
    {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns] || 'md:grid-cols-3'

  // Localize text once at the top level
  const displayHeading = getLocalized(heading, safeLanguage)

  return (
    <section className="py-24 bg-slate-50 dark:bg-black border-t border-white/10">
      <div className="container mx-auto px-4">
        {displayHeading && (
          <h2 className="text-3xl md:text-5xl font-display text-center mb-16 text-brand-ink dark:text-white uppercase tracking-tight">
            {displayHeading}
          </h2>
        )}

        <div className={cn('grid grid-cols-1 gap-x-8 gap-y-16', gridCols)}>
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              title={product.title}
              slug={product.slug}
              image={product.image}
              // Market Data
              price={product.marketData?.price}
              compareAtPrice={product.marketData?.compareAtPrice}
              currency={product.marketData?.currency}
              isNew={product.marketData?.isNew}
              shopifyVariantId={product.marketData?.shopifyVariantId}
              // Config & Text
              showPricing={showPricing}
              ctaText={ctaText} // Pass the raw object, Card handles localization
              // Context props for URL generation
              market={safeMarket}
              language={safeLanguage}
              // Priority loading for first 3 images (above the fold)
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
