import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { CAMPAIGN_EXPERIENCE_QUERY } from '@/sanity/lib/queries'
import { CampaignExperience } from '@/components/blocks/CampaignExperience'
import { generateHreflangAlternates } from '@/lib/i18n'
import { brand } from '@/lib/brand'

// ============================================================================
// TYPES
// ============================================================================

interface PageParams {
  params: Promise<{
    slug: string
  }>
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params

  const { data } = await sanityFetch({
    query: CAMPAIGN_EXPERIENCE_QUERY,
    params: { slug, language: 'en' },
  })

  if (!data) {
    return {
      title: `Experience Not Found | ${brand.name}`,
    }
  }

  const title = data.seo?.metaTitle || `${data.title} | ${brand.name}`
  const description =
    data.seo?.metaDescription || data.description || data.tagline || ''

  return {
    title,
    description,
    alternates: {
      canonical: `/experience/${slug}`,
      languages: generateHreflangAlternates(`experience/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en-US',
      url: `/experience/${slug}`,
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

export default async function CampaignExperiencePage({ params }: PageParams) {
  const { slug } = await params

  const { data } = await sanityFetch({
    query: CAMPAIGN_EXPERIENCE_QUERY,
    params: { slug, language: 'en' },
  })

  if (!data) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      <CampaignExperience data={data} language="en" />
    </main>
  )
}
