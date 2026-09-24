import { sanityFetch } from '@/sanity/lib/live'
import { CAMPAIGN_QUERY } from '@/sanity/lib/queries'
import { notFound, redirect } from 'next/navigation'
import CampaignContent from '@/components/blocks/CampaignContent'
import { getLanguageByCode, DEFAULT_LANGUAGE } from '@/lib/i18n'
import { getActiveTakeover } from '@/lib/takeoverManager'

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string; market: string }>
}) {
  // Validate and sanitize parameters to prevent object injection
  const { market, lang, slug } = await params
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
  const safeSlug =
    typeof slug === 'string' &&
    !slug.includes('[object') &&
    !slug.includes('%5Bobject')
      ? slug.trim()
      : ''

  // Redirect US English to root level
  if (safeMarket === 'us' && safeLang === 'en') {
    redirect(`/campaigns/${safeSlug}`)
  }
  // Validate language configuration
  const languageConfig = getLanguageByCode(safeLang) || DEFAULT_LANGUAGE
  const takeover = await getActiveTakeover({
    market: safeMarket,
    segment: 'all',
    scope: 'campaign-pages-only',
  })

  const { data: campaign } = await sanityFetch({
    query: CAMPAIGN_QUERY,
    params: {
      slug: safeSlug,
      language: languageConfig.code,
    },
  })

  if (!campaign) {
    notFound()
  }

  return <CampaignContent campaign={campaign} takeoverTheme={takeover?.theme} />
}
