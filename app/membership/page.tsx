import { sanityFetch } from '@/sanity/lib/live'
import { MEMBERSHIP_PAGE_QUERY } from '@/sanity/lib/queries'
import MembershipStackStory from '@/app/[market]/[lang]/membership/MembershipStackStory'
import { notFound } from 'next/navigation'
import { getLanguageByCode, DEFAULT_LANGUAGE } from '@/lib/i18n'

export default async function RootMembershipPage() {
  // Root-level membership serves US English content
  const market = 'us'
  const lang = 'en'
  const languageConfig = getLanguageByCode(lang) || DEFAULT_LANGUAGE

  // Fetch membership data
  const membershipResult = await sanityFetch({
    query: MEMBERSHIP_PAGE_QUERY,
    params: { language: languageConfig.code },
    perspective: 'drafts',
  })

  if (!membershipResult.data) return notFound()

  return (
    <MembershipStackStory
      data={membershipResult.data}
      market={market}
      language={lang}
    />
  )
}
