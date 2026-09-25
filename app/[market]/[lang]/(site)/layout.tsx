import { sanityFetch } from '@/sanity/lib/live'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/blocks/Header'
// 🔴 DELETE THIS: import FooterWrapper from '@/components/layout/FooterWrapper'
// 🟢 ADD THIS: Import Footer directly
import Footer from '@/components/blocks/Footer'
import { getActiveTakeover } from '@/lib/takeoverManager'
import TakeoverLayer from '@/components/takeover/TakeoverLayer'

interface MarketLayoutProps {
  children: React.ReactNode
  params: Promise<{
    market: string
    lang: string
  }>
}

export default async function MarketLayout({
  children,
  params,
}: MarketLayoutProps) {
  // 1. Destructure and validate params to prevent object injection
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

  // 2. Fetch Global Settings
  const { data: settings } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { language: safeLang },
  })

  // 3. Fetch Active Takeover Theme
  const activeTakeover = await getActiveTakeover({
    market: safeMarket,
    segment: 'all', // TODO: Replace with actual user segment from cookies/auth
    // Includes both campaign-pages-only and global takeovers.
    scope: 'campaign-pages-only',
  })

  return (
    <>
      <Header
        navItems={settings?.mainNav}
        market={safeMarket}
        language={safeLang}
        takeoverNavBar={activeTakeover?.takeover?.navBar}
        takeoverGlobalBanner={activeTakeover?.takeover?.globalBanner}
      />

      <TakeoverLayer takeover={activeTakeover} />

      {children}

      {/* 🟢 RENDER FOOTER DIRECTLY 
          We pass the data we fetched (settings.footerNav) 
          so the footer doesn't have to fetch it again.
      */}
      <Footer
        market={market}
        language={lang}
        navItems={settings?.footerNav}
        socialLinks={settings?.socialLinks}
        copyrightText={settings?.copyrightText}
      />
    </>
  )
}
