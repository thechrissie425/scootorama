import { sanityFetch } from '@/sanity/lib/live'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/blocks/Header'
import Footer from '@/components/blocks/Footer'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root-level blog is US English
  const market = 'us'
  const language = 'en'

  // Fetch Global Settings
  const { data: settings } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { language },
  })

  return (
    <>
      <Header
        navItems={settings?.mainNav}
        market={market}
        language={language}
      />

      {children}

      <Footer
        market={market}
        language={language}
        navItems={settings?.footerNav}
        socialLinks={settings?.socialLinks}
        copyrightText={settings?.copyrightText}
      />
    </>
  )
}
