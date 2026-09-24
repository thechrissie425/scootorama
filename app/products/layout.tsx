import { sanityFetch } from '@/sanity/lib/live'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/blocks/Header'
import Footer from '@/components/blocks/Footer'
import { getActiveTakeover } from '@/lib/takeoverManager'
import TakeoverLayer from '@/components/takeover/TakeoverLayer'

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root-level products are US English
  const market = 'us'
  const language = 'en'

  // Fetch Global Settings
  const { data: settings } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { language },
  })

  const activeTakeover = await getActiveTakeover({
    market,
    segment: 'all',
    scope: 'product-pages-only',
  })

  return (
    <>
      <Header
        navItems={settings?.mainNav}
        market={market}
        language={language}
        takeoverNavBar={activeTakeover?.takeover?.navBar}
        takeoverGlobalBanner={activeTakeover?.takeover?.globalBanner}
      />

      <TakeoverLayer takeover={activeTakeover} />

      {children}

      <Footer market={market} language={language} />
    </>
  )
}
