import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ComponentProps } from 'react'
import React from 'react'
import { sanityFetch } from '@/sanity/lib/live'
import { brand, HOME_SLUG } from '@/lib/brand'
import { PRODUCT_PAGE_BY_MARKET_QUERY, PAGE_QUERY } from '@/sanity/lib/queries'
import {
  getLanguageByCode,
  DEFAULT_LANGUAGE,
  generateHreflangAlternates,
} from '@/lib/i18n'
import {
  getActiveTakeover,
  shouldApplyCampaignTo,
  generateCampaignCSS,
} from '@/lib/takeoverManager'

// Product Page Components
import HeroProduct from '@/components/blocks/HeroProduct'
import { ProductGrid } from '@/components/blocks/ProductGrid'

// Homepage Components
import Firecracker from '@/components/blocks/Firecracker'
import River from '@/components/blocks/River'
import Carousel from '@/components/blocks/Carousel'
import PricingSection, { PricingTier } from '@/components/blocks/PricingSection'
import Hero from '@/components/blocks/Hero'
import HeroSplit from '@/components/blocks/HeroSplit'
import SocialProofSection from '@/components/blocks/SocialProofSection'
import BenefitsSection from '@/components/blocks/BenefitsSection'
import GoalsSection from '@/components/blocks/GoalsSection'
import TransformationTabs from '@/components/blocks/TransformationTabs'
import FeaturesByCategory from '@/components/blocks/FeaturesByCategory'
import InstagramVideoGrid from '@/components/blocks/InstagramVideoGrid'
import { StatsGrid } from '@/components/blocks/StatsGrid'
import FeatureGrid from '@/components/blocks/FeatureGrid'
import { FeatureTabs } from '@/components/blocks/FeatureTabs'
import { FaqSection } from '@/components/blocks/FaqSection'
import ContentDisplay from '@/components/blocks/ContentDisplay'
import { ProductCard } from '@/components/blocks/ProductCard'
import TechnicalSpecs from '@/components/blocks/TechnicalSpecs'
import FeaturesCarousel from '@/components/blocks/FeaturesCarousel'
import FloatingBuyBox from '@/components/pdp/FloatingBuyBox'
import { InventoryProvider } from '@/contexts/InventoryContext'

// Homepage types
type HeroBlock = ComponentProps<typeof Hero> & { _type: 'hero'; _key: string }
type HeroSplitBlock = ComponentProps<typeof HeroSplit> & {
  _type: 'heroSplit'
  _key: string
}
type FirecrackerBlock = ComponentProps<typeof Firecracker> & {
  _type: 'firecracker'
  _key: string
}
type RiverBlock = ComponentProps<typeof River> & {
  _type: 'river'
  _key: string
}
type CarouselBlock = ComponentProps<typeof Carousel> & {
  _type: 'carousel'
  _key: string
}
type PricingBlock = {
  _type: 'pricingBlock'
  _key: string
  title: string
  layoutVariant?: 'cards' | 'table'
  tiers: PricingTier[]
  [key: string]: unknown
}
type SocialProofBlock = ComponentProps<typeof SocialProofSection> & {
  _type: 'socialProofSection'
  _key: string
}
type BenefitsSectionBlock = ComponentProps<typeof BenefitsSection> & {
  _type: 'benefitsSection'
  _key: string
}
type GoalsSectionBlock = ComponentProps<typeof GoalsSection> & {
  _type: 'goalsSection'
  _key: string
}
type TransformationTabsBlock = ComponentProps<typeof TransformationTabs> & {
  _type: 'transformationTabs'
  _key: string
}
type FeaturesByCategoryBlock = ComponentProps<typeof FeaturesByCategory> & {
  _type: 'featuresByCategory'
  _key: string
}
type InstagramVideoGridBlock = ComponentProps<typeof InstagramVideoGrid> & {
  _type: 'instagramVideoGrid'
  _key: string
}
type StatsGridBlock = ComponentProps<typeof StatsGrid> & {
  _type: 'statsGrid'
  _key: string
}
type FeatureGridBlock = ComponentProps<typeof FeatureGrid> & {
  _type: 'featureGrid'
  _key: string
}
type FeatureTabsBlock = ComponentProps<typeof FeatureTabs> & {
  _type: 'featureTabs'
  _key: string
}
type FaqBlock = ComponentProps<typeof FaqSection> & {
  _type: 'faqSection'
  _key: string
}
type ContentDisplayBlock = ComponentProps<typeof ContentDisplay> & {
  _type: 'contentDisplay'
  _key: string
}
type ProductCardBlock = ComponentProps<typeof ProductCard> & {
  _type: 'productCard'
  _key: string
}
type ProductGridBlock = ComponentProps<typeof ProductGrid> & {
  _type: 'productGrid'
  _key: string
}
type ProductGridNewBlock = ComponentProps<typeof ProductGrid> & {
  _type: 'productGridNew'
  _key: string
}

type PageSection =
  | HeroBlock
  | HeroSplitBlock
  | FirecrackerBlock
  | RiverBlock
  | CarouselBlock
  | PricingBlock
  | SocialProofBlock
  | InstagramVideoGridBlock
  | StatsGridBlock
  | FeatureGridBlock
  | FeatureTabsBlock
  | FaqBlock
  | ContentDisplayBlock
  | ProductCardBlock
  | ProductGridBlock
  | ProductGridNewBlock
  | BenefitsSectionBlock
  | GoalsSectionBlock
  | TransformationTabsBlock
  | FeaturesByCategoryBlock

interface SanityResponse {
  page: {
    title: string
    slug: { current: string }
    content?: PageSection[]
  } | null
}

interface PageParams {
  params: Promise<{ market: string; lang: string; slug?: string[] }>
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { market, lang, slug } = await params
  const pageSlug = slug && slug.length > 0 ? slug.join('/') : HOME_SLUG
  const languageConfig = getLanguageByCode(lang) || DEFAULT_LANGUAGE

  // Fetch page data for SEO
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: {
      slug: pageSlug,
      language: languageConfig.code,
      market: market.toUpperCase(),
    },
  })

  const page = data?.page
  const title =
    page?.seoTitle ||
    (page?.title ? `${page.title} | ${brand.name}` : brand.name)
  const description = page?.seoDescription || brand.description

  // Build canonical URL path
  let path = `/${market}/${lang}`
  const basePath = slug && slug.length > 0 ? slug.join('/') : ''
  if (basePath) {
    path += `/${basePath}`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: languageConfig.locale,
      url: path,
    },
    alternates: {
      canonical: path,
      languages: generateHreflangAlternates(basePath),
    },
  }
}

export default async function IntlPage({ params }: PageParams) {
  const { market, lang, slug } = await params

  // Robust parameter validation to handle URL-encoded objects
  const safeMarket =
    typeof market === 'string' &&
    !market.includes('[object') &&
    !market.includes('%5Bobject')
      ? market.trim()
      : 'us'
  const safeLang =
    typeof lang === 'string' &&
    !lang.includes('[object') &&
    !lang.includes('%5Bobject')
      ? lang.trim()
      : 'en'

  // If no slug provided, render homepage
  if (!slug || slug.length === 0) {
    return renderHomepage(safeMarket, safeLang)
  }

  // If first slug is 'products', handle as product page
  if (slug[0] === 'products' && slug[1]) {
    return renderProductPage(safeMarket, safeLang, slug[1])
  }

  // Handle general page slugs (e.g., /us/en/home, /us/en/about)
  const pageSlug = slug.join('/')
  return renderPage(safeMarket, safeLang, pageSlug)
}

async function renderHomepage(market: string, lang: string) {
  // Validate and sanitize parameters
  const safeMarket = typeof market === 'string' ? market.trim() : 'us'
  const safeLang = typeof lang === 'string' ? lang.trim() : 'en'

  const pageSlug = HOME_SLUG
  const languageConfig = getLanguageByCode(safeLang) || DEFAULT_LANGUAGE

  // Fetch active takeover for this market
  const takeover = await getActiveTakeover({
    market: safeMarket,
    segment: 'all', // TODO: Get from user session/cookies
    scope: 'campaign-pages-only',
  })

  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: {
      slug: pageSlug,
      language: languageConfig.code,
      market: safeMarket.toUpperCase(),
    },
  })

  const sanityData = data as SanityResponse

  if (!sanityData?.page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
        <h1 className="text-3xl font-heading-bold">Page Not Found</h1>
        <p className="mt-2 text-grey">
          Could not find homepage content for market:{' '}
          <code className="text-brand-primary">{safeMarket}</code> language:{' '}
          <code className="text-brand-primary">{safeLang}</code>
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Inject takeover theme CSS variables */}
      {takeover && (
        <style
          dangerouslySetInnerHTML={{
            __html: generateCampaignCSS(takeover.theme),
          }}
        />
      )}
      {sanityData.page.content?.map(section => {
        switch (section._type) {
          case 'hero':
            return (
              <Hero
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'hero')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'heroSplit':
            return (
              <HeroSplit
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'hero')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'firecracker':
            return (
              <Firecracker
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'firecracker')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'river':
            return (
              <River
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'carousel':
            return (
              <Carousel
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'pricingBlock':
            return (
              <PricingSection
                key={section._key}
                data={section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'socialProofSection':
            return (
              <SocialProofSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'benefitsSection':
            return (
              <BenefitsSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'goalsSection':
            return <GoalsSection key={section._key} {...section} />
          case 'transformationTabs':
            return <TransformationTabs key={section._key} {...section} />
          case 'featuresByCategory':
            return <FeaturesByCategory key={section._key} {...section} />
          case 'instagramVideoGrid':
            return (
              <InstagramVideoGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'statsGrid':
            return (
              <StatsGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'featureGrid':
            return (
              <FeatureGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'featureTabs':
            return (
              <FeatureTabs
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'faqSection':
            return (
              <FaqSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'contentDisplay':
            return (
              <ContentDisplay
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'productCard':
            return (
              <ProductCard
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'productGrid':
          case 'productGridNew':
            return (
              <ProductGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}

async function renderPage(market: string, lang: string, pageSlug: string) {
  const safeMarket = typeof market === 'string' ? market.trim() : 'us'
  const safeLang = typeof lang === 'string' ? lang.trim() : 'en'
  const languageConfig = getLanguageByCode(safeLang) || DEFAULT_LANGUAGE

  // Fetch active takeover for this market
  const takeover = await getActiveTakeover({
    market: safeMarket,
    segment: 'all',
    scope: 'campaign-pages-only',
  })

  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: {
      slug: pageSlug,
      language: languageConfig.code,
      market: safeMarket.toUpperCase(),
    },
  })

  const sanityData = data as SanityResponse

  if (!sanityData?.page) {
    return notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      {takeover && (
        <style
          dangerouslySetInnerHTML={{
            __html: generateCampaignCSS(takeover.theme),
          }}
        />
      )}
      {sanityData.page.content?.map(section => {
        switch (section._type) {
          case 'hero':
            return (
              <Hero
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'hero')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'heroSplit':
            return (
              <HeroSplit
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'hero')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'firecracker':
            return (
              <Firecracker
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
                takeoverTheme={
                  takeover && shouldApplyCampaignTo(takeover, 'firecracker')
                    ? takeover.theme
                    : null
                }
              />
            )
          case 'river':
            return (
              <River
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'carousel':
            return (
              <Carousel
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'pricingBlock':
            return (
              <PricingSection
                key={section._key}
                data={section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'socialProofSection':
            return (
              <SocialProofSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'benefitsSection':
            return (
              <BenefitsSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'goalsSection':
            return <GoalsSection key={section._key} {...section} />
          case 'transformationTabs':
            return <TransformationTabs key={section._key} {...section} />
          case 'featuresByCategory':
            return <FeaturesByCategory key={section._key} {...section} />
          case 'instagramVideoGrid':
            return (
              <InstagramVideoGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'statsGrid':
            return (
              <StatsGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'featureGrid':
            return (
              <FeatureGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'featureTabs':
            return (
              <FeatureTabs
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'faqSection':
            return (
              <FaqSection
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'contentDisplay':
            return (
              <ContentDisplay
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'productCard':
            return (
              <ProductCard
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          case 'productGrid':
          case 'productGridNew':
            return (
              <ProductGrid
                key={section._key}
                {...section}
                market={safeMarket}
                language={safeLang}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}

async function renderProductPage(market: string, lang: string, slug: string) {
  // Validate and sanitize parameters to prevent object injection
  const safeMarket = typeof market === 'string' ? market.trim() : 'us'
  const safeLang = typeof lang === 'string' ? lang.trim() : 'en'
  const safeSlug = typeof slug === 'string' ? slug.trim() : ''

  if (!safeSlug) {
    console.error('Invalid slug parameter:', { market, lang, slug })
    return notFound()
  }

  // Fetch active takeover for product pages
  const takeover = await getActiveTakeover({
    market: safeMarket,
    segment: 'all',
    scope: 'product-pages-only',
  })

  // Map URL param to Sanity Region (e.g. 'uk' -> 'UK', 'de' -> 'EU')
  const marketMap: Record<string, string> = {
    us: 'US', // Add missing US mapping
    uk: 'UK',
    jp: 'JP',
    ca: 'CA',
    au: 'AU',
    de: 'EU',
    fr: 'EU',
    es: 'EU',
    it: 'EU',
  }
  const sanityRegion = marketMap[safeMarket] || 'US' // Fallback safe

  const { data: product } = await sanityFetch({
    query: PRODUCT_PAGE_BY_MARKET_QUERY,
    params: {
      slug: safeSlug,
      language: safeLang,
      market: sanityRegion,
    },
  })

  if (!product) return notFound()

  // Clean up any invisible Unicode characters from region names
  const cleanRegion = (region: string) => {
    if (!region || typeof region !== 'string') return ''
    // Remove invisible Unicode characters that might corrupt text comparison
    return region
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '')
      .trim()
  }

  const marketSettings =
    product.marketData ||
    product.product?.markets?.find((m: any) => {
      const cleanMarketRegion = cleanRegion(m.region)
      return cleanMarketRegion === sanityRegion
    })

  if (!marketSettings) {
    console.error(`🚨 Product not available in ${sanityRegion}:`, {
      productSlug: safeSlug,
      requestedMarket: safeMarket,
      mappedRegion: sanityRegion,
      availableMarkets:
        product.product?.markets?.map((m: any) => ({
          region: m.region,
          cleanRegion: cleanRegion(m.region),
          currency: m.currency,
          fulfillment: cleanRegion(m.fulfillmentMethod || ''),
        })) || [],
    })

    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <h1 className="text-3xl font-display uppercase text-white mb-6">
            Product Temporarily Unavailable
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            {product.title || 'This product'} is currently not available in your
            region ({safeMarket.toUpperCase()}).
            {product.product?.markets?.length > 0 && (
              <>
                <br />
                Available in:{' '}
                {product.product.markets
                  .map((m: any) => cleanRegion(m.region))
                  .filter(Boolean)
                  .join(', ')}
              </>
            )}
          </p>
          <div className="space-y-4">
            {sanityRegion === 'JP' && (
              <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-6">
                <h3 className="text-brand-primary font-heading-bold text-xl mb-2">
                  Coming Soon to Japan
                </h3>
                <p className="text-gray-300">
                  Find {brand.name} gear at select retailers. Check back soon
                  for direct availability.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <InventoryProvider
      variantId={marketSettings.shopifyVariantId}
      market={safeMarket}
    >
      <main className="bg-gradient-to-b from-black via-neutral-950 to-black min-h-screen">
        {/* Inject takeover theme CSS variables */}
        {takeover && shouldApplyCampaignTo(takeover, 'productPages') && (
          <style
            dangerouslySetInnerHTML={{
              __html: generateCampaignCSS(takeover.theme),
            }}
          />
        )}

        {/* Hero Section */}
        {product.hero && (
          <HeroProduct
            {...product.hero}
            product={{
              price: marketSettings.price,
              originalPrice: marketSettings.originalPrice,
              currency: marketSettings.currency,
              fulfillment: cleanRegion(marketSettings.fulfillmentMethod) as
                | 'direct'
                | 'retailer',
              shopifyVariantId: marketSettings.shopifyVariantId,
            }}
            market={safeMarket}
            language={safeLang}
            takeoverTheme={
              takeover && shouldApplyCampaignTo(takeover, 'productPages')
                ? takeover.theme
                : null
            }
          />
        )}

        {/* Features Carousel with Tech Specs */}
        {(product.features && product.features.length > 0) ||
        (product.techSpecs && product.techSpecs.length > 0) ||
        (product.whoIsItFor && product.whoIsItFor.length > 0) ? (
          <FeaturesCarousel
            features={product.features || []}
            techSpecs={product.techSpecs || []}
            whoIsItFor={product.whoIsItFor || []}
            productType={product.productType}
            market={safeMarket}
            language={safeLang}
            uiLabels={product.uiLabels}
          />
        ) : null}

        {/* Legacy Technical Specs (if no structured specs available) */}
        {(!product.techSpecs || product.techSpecs.length === 0) &&
          product.specs && <TechnicalSpecs specs={product.specs} />}

        {/* Additional Marketing Sections - Full Width */}
        {product.additionalSections &&
          product.additionalSections.length > 0 && (
            <div className="space-y-24 pb-24">
              {product.additionalSections.map((section: any) => {
                switch (section._type) {
                  case 'instagramVideoGrid':
                    return (
                      <InstagramVideoGrid
                        key={section._key}
                        {...section}
                        market={safeMarket}
                        language={safeLang}
                      />
                    )

                  case 'socialProofSection':
                    return (
                      <SocialProofSection
                        key={section._key}
                        {...section}
                        market={safeMarket}
                        language={safeLang}
                      />
                    )

                  case 'river':
                    return (
                      <River
                        key={section._key}
                        {...section}
                        market={safeMarket}
                        language={safeLang}
                      />
                    )

                  default:
                    return null
                }
              })}
            </div>
          )}

        {/* Floating Sticky BuyBox */}
        <FloatingBuyBox
          productTitle={product.title}
          price={marketSettings.price}
          currency={marketSettings.currency}
          fulfillment={
            cleanRegion(marketSettings.fulfillmentMethod) as
              | 'direct'
              | 'retailer'
          }
          shopifyVariantId={marketSettings.shopifyVariantId}
          language={safeLang}
        />
      </main>
    </InventoryProvider>
  )
}
