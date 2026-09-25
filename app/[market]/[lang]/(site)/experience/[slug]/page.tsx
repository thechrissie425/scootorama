import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { CAMPAIGN_EXPERIENCE_QUERY } from '@/sanity/lib/queries'
import { CampaignExperience } from '@/components/blocks/CampaignExperience'
import {
  generateHreflangAlternates,
  getLanguageByCode,
  isValidMarketCode,
} from '@/lib/i18n'
import { brand } from '@/lib/brand'

// ============================================================================
// TYPES
// ============================================================================

interface PageParams {
  params: Promise<{
    market: string
    lang: string
    slug: string
  }>
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { market, lang, slug } = await params

  // Validate market
  if (!isValidMarketCode(market)) {
    return { title: `Not Found | ${brand.name}` }
  }

  const languageConfig = getLanguageByCode(lang)
  if (!languageConfig) {
    return { title: `Not Found | ${brand.name}` }
  }

  const { data } = await sanityFetch({
    query: CAMPAIGN_EXPERIENCE_QUERY,
    params: { slug, language: lang },
  })

  if (!data) {
    return {
      title: `Experience Not Found | ${brand.name}`,
    }
  }

  const title = data.seo?.metaTitle || `${data.title} | ${brand.name}`
  const description =
    data.seo?.metaDescription || data.description || data.tagline || ''
  const canonicalPath = `/${market}/${lang}/experience/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: generateHreflangAlternates(`experience/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: languageConfig.locale,
      url: canonicalPath,
      images: data.shareImage?.asset?.url
        ? [{ url: data.shareImage.asset.url, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function LocalizedCampaignExperiencePage({
  params,
}: PageParams) {
  const { market, lang, slug } = await params

  // Validate market and language
  if (!isValidMarketCode(market)) {
    notFound()
  }

  const languageConfig = getLanguageByCode(lang)
  if (!languageConfig) {
    notFound()
  }

  const { data } = await sanityFetch({
    query: CAMPAIGN_EXPERIENCE_QUERY,
    params: { slug, language: lang },
  })

  if (!data) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      <CampaignExperience data={data} language={lang} />
    </main>
  )
}
