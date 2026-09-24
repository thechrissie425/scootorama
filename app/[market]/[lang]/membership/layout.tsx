import { sanityFetch } from '@/sanity/lib/live'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/blocks/Header'
import Footer from '@/components/blocks/Footer'

interface MembershipLayoutProps {
  children: React.ReactNode
  params: Promise<{
    market: string
    lang: string
  }>
}

export default async function MembershipLayout({
  children,
  params,
}: MembershipLayoutProps) {
  // Await params for Next.js 15
  const { market, lang } = await params

  // Validate params to prevent object injection
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

  // Fetch navigation settings
  const { data: settings } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { language: safeLang },
  })

  return (
    <>
      <Header
        navItems={settings?.mainNav}
        market={safeMarket}
        language={safeLang}
      />

      {children}

      <Footer market={safeMarket} language={safeLang} />
    </>
  )
}
