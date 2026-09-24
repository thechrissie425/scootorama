import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { PRODUCT_PAGE_BY_MARKET_QUERY } from '@/sanity/lib/queries'
import {
  getLanguageByCode,
  DEFAULT_LANGUAGE,
  generateHreflangAlternates,
} from '@/lib/i18n'
import { PortableText } from '@portabletext/react'
import { getImageUrl } from '@/lib/imageHelpers'

// --- COMPONENTS ---
import River from '@/components/blocks/River'
import Firecracker from '@/components/blocks/Firecracker'
import { StatsGrid } from '@/components/blocks/StatsGrid'
import HeroProduct from '@/components/blocks/HeroProduct'
import Carousel from '@/components/blocks/Carousel'
import InstagramVideoGrid from '@/components/blocks/InstagramVideoGrid'
import SocialProofSection from '@/components/blocks/SocialProofSection'
import BuyBox from '@/components/pdp/BuyBox'
import {
  getActiveTakeover,
  shouldApplyCampaignTo,
  generateCampaignCSS,
} from '@/lib/takeoverManager'
import { brand } from '@/lib/brand'

// --- TYPES ---
interface MarketData {
  region: string
  price: number
  currency: string
  fulfillmentMethod: 'direct' | 'retailer'
  shopifyVariantId?: string
}

interface PageParams {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params
  const languageConfig = DEFAULT_LANGUAGE

  // Fetch product data for SEO
  const { data: product } = await sanityFetch({
    query: PRODUCT_PAGE_BY_MARKET_QUERY,
    params: {
      slug,
      language: languageConfig.code,
      market: 'US',
    },
  })

  const title =
    product?.seoTitle ||
    (product?.hero?.title
      ? `${product.hero.title} | ${brand.name}`
      : `${brand.name} Gear`)
  const description =
    product?.seoDescription ||
    product?.hero?.description ||
    `Explore ${brand.name} scooters, trainers and controllers for the wackiest indoor ride on Earth.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: languageConfig.locale,
      url: `/products/${slug}`,
    },
    alternates: {
      canonical: `/products/${slug}`,
      languages: generateHreflangAlternates(`products/${slug}`),
    },
  }
}

export default async function RootProductPage({ params }: PageParams) {
  // Root-level products serve US English content
  const market = 'us'
  const lang = 'en'
  const { slug } = await params

  const takeover = await getActiveTakeover({
    market,
    segment: 'all',
    scope: 'product-pages-only',
  })

  // Use default language configuration (US English)
  const languageConfig = getLanguageByCode(lang) || DEFAULT_LANGUAGE

  // 1. FETCH DATA
  const { data: product } = await sanityFetch({
    query: PRODUCT_PAGE_BY_MARKET_QUERY,
    params: {
      slug,
      language: languageConfig.code,
      market: market.toUpperCase(),
    },
  })

  // 2. HANDLE 404
  if (!product) {
    return notFound()
  }

  // 3. RESOLVE MARKET CONFIG
  const marketSettings =
    product.marketData ||
    product.product?.markets?.find(
      (m: MarketData) => m.region === market.toUpperCase()
    ) ||
    product.product?.markets?.[0]

  // If no market settings are available, we can't sell the product
  if (!marketSettings) {
    console.error(`No market config found for ${market.toUpperCase()}`, {
      availableMarkets: product.product?.markets?.map(
        (m: MarketData) => m.region
      ),
      requestedMarket: market.toUpperCase(),
    })
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Product Unavailable
        </h1>
        <p className="text-gray-600">
          This product is not available in your region ({market.toUpperCase()}).
        </p>
        {product.product?.markets?.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Available in:{' '}
            {product.product.markets
              .map((m: MarketData) => m.region)
              .join(', ')}
          </p>
        )}
      </div>
    )
  }

  console.log('Product page marketSettings:', marketSettings)

  console.log('Product data:', {
    hasAdditionalSections: !!product.additionalSections,
    additionalSectionsLength: product.additionalSections?.length,
    additionalSections: product.additionalSections,
  })

  const heroProductData = {
    price: marketSettings.price,
    currency: marketSettings.currency,
    fulfillment: marketSettings.fulfillmentMethod,
    shopifyVariantId: marketSettings.shopifyVariantId || '44479649644751', // Hardcoded fallback for testing
  }
  console.log('Hero product data being passed:', heroProductData)

  return (
    <main className="bg-black min-h-screen">
      {takeover && shouldApplyCampaignTo(takeover, 'productPages') && (
        <style
          dangerouslySetInnerHTML={{
            __html: generateCampaignCSS(takeover.theme),
          }}
        />
      )}

      {product.hero && (
        <HeroProduct
          eyebrow={product.hero.eyebrow}
          title={product.hero.title}
          description={product.hero.description}
          productImage={product.hero.productImage}
          backgroundImage={product.hero.backgroundImage}
          theme={product.hero.theme}
          product={heroProductData}
          market={market}
          language={languageConfig.code}
          takeoverTheme={
            takeover && shouldApplyCampaignTo(takeover, 'productPages')
              ? takeover.theme
              : null
          }
        />
      )}

      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            {product.features?.map((section: any) => {
              switch (section._type) {
                case 'firecracker':
                  return (
                    <Firecracker
                      key={section._key}
                      {...section}
                      market={market}
                      language={languageConfig.code}
                      takeoverTheme={
                        takeover &&
                        shouldApplyCampaignTo(takeover, 'productPages')
                          ? takeover.theme
                          : null
                      }
                    />
                  )

                case 'river':
                  return <River key={section._key} {...section} />

                case 'statsGrid':
                  return (
                    <StatsGrid
                      key={section._key}
                      theme="dark"
                      stats={section.stats}
                    />
                  )

                case 'carousel':
                  return <Carousel key={section._key} {...section} />

                default:
                  return null
              }
            })}

            {product.specs && (
              <div className="bg-neutral-900 rounded-2xl p-8">
                <h2 className="text-3xl font-display uppercase text-white mb-6">
                  Technical Specifications
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <PortableText value={product.specs} />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {product.product && marketSettings && (
                <BuyBox
                  productTitle={product.product.title || 'Product'}
                  price={marketSettings.price}
                  currency={marketSettings.currency}
                  fulfillment={marketSettings.fulfillmentMethod}
                  shopifyVariantId={marketSettings.shopifyVariantId}
                  language={languageConfig.code}
                  productImage={
                    product.hero?.productImage?.asset
                      ? getImageUrl(product.hero.productImage, {
                          width: 400,
                          quality: 80,
                        }) || undefined
                      : undefined
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Marketing Sections - Full Width */}
      {product.additionalSections && product.additionalSections.length > 0 && (
        <div className="space-y-24 pb-24">
          {product.additionalSections.map((section: any) => {
            switch (section._type) {
              case 'instagramVideoGrid':
                return (
                  <InstagramVideoGrid
                    key={section._key}
                    {...section}
                    market={market}
                    language={languageConfig.code}
                  />
                )

              case 'socialProofSection':
                return (
                  <SocialProofSection
                    key={section._key}
                    {...section}
                    market={market}
                    language={languageConfig.code}
                  />
                )

              case 'river':
                return (
                  <River
                    key={section._key}
                    {...section}
                    market={market}
                    language={languageConfig.code}
                  />
                )

              default:
                return null
            }
          })}
        </div>
      )}
    </main>
  )
}
