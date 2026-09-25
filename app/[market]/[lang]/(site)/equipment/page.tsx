import { ComponentProps } from 'react'
import { sanityFetch } from '@/sanity/lib/live'
import { PAGE_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries'
import { getLanguageByCode, DEFAULT_LANGUAGE } from '@/lib/i18n'

// Component Imports
import Firecracker from '@/components/blocks/Firecracker'
import River from '@/components/blocks/River'
import Carousel from '@/components/blocks/Carousel'
import PricingSection, { PricingTier } from '@/components/blocks/PricingSection'
import Hero from '@/components/blocks/Hero'
import HeroSplit from '@/components/blocks/HeroSplit'
import HeroProduct from '@/components/blocks/HeroProduct'
import Header from '@/components/blocks/Header'
import SocialProofSection from '@/components/blocks/SocialProofSection'
import { StatsGrid } from '@/components/blocks/StatsGrid'
import FeatureGrid from '@/components/blocks/FeatureGrid'
import { FeatureTabs } from '@/components/blocks/FeatureTabs'
import { FaqSection } from '@/components/blocks/FaqSection'
import ContentDisplay from '@/components/blocks/ContentDisplay'
import { ProductGrid } from '@/components/blocks/ProductGrid'

// --- Types ---
type HeroBlock = ComponentProps<typeof Hero> & { _type: 'hero'; _key: string }
type HeroSplitBlock = ComponentProps<typeof HeroSplit> & {
  _type: 'heroSplit'
  _key: string
}
type HeroProductBlock = ComponentProps<typeof HeroProduct> & {
  _type: 'heroProduct'
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
type PricingBlock = ComponentProps<typeof PricingSection> & {
  _type: 'pricingBlock'
  _key: string
  title?: string
  layoutVariant?: string
  tiers?: PricingTier[]
}
type SocialProofSectionBlock = ComponentProps<typeof SocialProofSection> & {
  _type: 'socialProofSection'
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
  _type: 'tabs'
  _key: string
}
type FaqSectionBlock = ComponentProps<typeof FaqSection> & {
  _type: 'faqSection'
  _key: string
}
type ContentDisplayBlock = ComponentProps<typeof ContentDisplay> & {
  _type: 'contentDisplay'
  _key: string
}
type ProductGridBlock = ComponentProps<typeof ProductGrid> & {
  _type: 'productGrid'
  _key: string
}

type Block =
  | HeroBlock
  | HeroSplitBlock
  | HeroProductBlock
  | FirecrackerBlock
  | RiverBlock
  | CarouselBlock
  | PricingBlock
  | SocialProofSectionBlock
  | StatsGridBlock
  | FeatureGridBlock
  | FeatureTabsBlock
  | FaqSectionBlock
  | ContentDisplayBlock
  | ProductGridBlock

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ market: string; lang: string }>
}) {
  const { market, lang } = await params

  // Validate and sanitize parameters to prevent object injection
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

  const languageConfig = getLanguageByCode(safeLang) || DEFAULT_LANGUAGE
  const pageSlug = 'equipment'

  // 2. Fetch Data
  const [pageData, settingsData] = await Promise.all([
    sanityFetch({
      query: PAGE_QUERY,
      params: {
        slug: pageSlug,
        language: languageConfig.code,
        market: safeMarket,
      },
    }),
    sanityFetch({
      query: SETTINGS_QUERY,
      params: { language: languageConfig.code },
    }),
  ])

  const page = pageData.data?.page
  const settings = settingsData.data

  if (!page) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>
    )
  }

  return (
    <>
      <Header
        navItems={settings?.mainNav}
        market={safeMarket}
        language={safeLang}
      />

      <main>
        {page.content?.map((block: Block) => {
          // 🟢 CRITICAL FIX: Pass strings directly. Do not spread a "context" object.
          // This prevents the "Maximum update depth exceeded" error.
          const key = block._key

          switch (block._type) {
            case 'hero':
              return (
                <Hero
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'heroSplit':
              return (
                <HeroSplit
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'heroProduct':
              return (
                <HeroProduct
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'firecracker':
              return (
                <Firecracker
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'river':
              return (
                <River
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'carousel':
              return (
                <Carousel
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'pricingBlock':
              return (
                <PricingSection
                  key={key}
                  data={{
                    title: block.title || '',
                    layoutVariant: block.layoutVariant as any,
                    tiers: block.tiers as any,
                  }}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'socialProofSection':
              return (
                <SocialProofSection
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'statsGrid':
              return (
                <StatsGrid
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'featureGrid':
              return (
                <FeatureGrid
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'tabs':
              return (
                <FeatureTabs
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'faqSection':
              return (
                <FaqSection
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'contentDisplay':
              return (
                <ContentDisplay
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            case 'productGrid':
              return (
                <ProductGrid
                  key={key}
                  {...block}
                  market={safeMarket}
                  language={safeLang}
                />
              )
            default:
              return null
          }
        })}
      </main>
    </>
  )
}
