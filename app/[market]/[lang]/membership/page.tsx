import { sanityFetch } from '@/sanity/lib/live'
import { MEMBERSHIP_PAGE_QUERY } from '@/sanity/lib/queries'
import MembershipStackStory from './MembershipStackStory'
import { notFound, redirect } from 'next/navigation'

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ lang: string; market: string }>
}) {
  // Validate and sanitize parameters to prevent object injection
  const { market, lang } = await params
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

  // Redirect US English to root level
  if (safeMarket === 'us' && safeLang === 'en') {
    redirect('/membership')
  }
  // Map language codes to simple language codes for Sanity
  const LANGUAGE_MAP: Record<string, string> = {
    en: 'en',
    de: 'de',
    fr: 'fr',
    es: 'es',
    ja: 'ja',
  }

  const sanityLang = LANGUAGE_MAP[safeLang] || 'en'

  // Fetch membership data
  const membershipResult = await sanityFetch({
    query: MEMBERSHIP_PAGE_QUERY,
    params: { language: sanityLang },
    perspective: 'drafts',
  })

  if (!membershipResult.data) return notFound()

  return (
    <MembershipStackStory
      data={membershipResult.data}
      market={safeMarket}
      language={safeLang}
    />
  )
}
