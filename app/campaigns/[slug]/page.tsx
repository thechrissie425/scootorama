import { sanityFetch } from '@/sanity/lib/live'
import { CAMPAIGN_QUERY } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import CampaignContent from '@/components/blocks/CampaignContent'
import { getLanguageByCode, DEFAULT_LANGUAGE } from '@/lib/i18n'
import { getActiveTakeover } from '@/lib/takeoverManager'

export default async function RootCampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Root-level campaigns serve US English content
  const market = 'us'
  const lang = 'en'
  const { slug } = await params
  const languageConfig = getLanguageByCode(lang) || DEFAULT_LANGUAGE
  const takeover = await getActiveTakeover({
    market,
    segment: 'all',
    scope: 'campaign-pages-only',
  })

  const { data: campaign } = await sanityFetch({
    query: CAMPAIGN_QUERY,
    params: {
      slug,
      language: languageConfig.code,
    },
  })

  if (!campaign) {
    notFound()
  }

  return <CampaignContent campaign={campaign} takeoverTheme={takeover?.theme} />
}
