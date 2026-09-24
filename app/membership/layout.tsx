import { SanityLive, sanityFetch } from '@/sanity/lib/live'
import { SETTINGS_QUERY } from '@/sanity/lib/queries'
import Header from '@/components/blocks/Header'
import Footer from '@/components/blocks/Footer'

interface RootMembershipLayoutProps {
  children: React.ReactNode
}

export default async function RootMembershipLayout({
  children,
}: RootMembershipLayoutProps) {
  // Root-level membership serves US English content
  const market = 'us'
  const lang = 'en'

  // Fetch navigation settings
  const { data: settings } = await sanityFetch({
    query: SETTINGS_QUERY,
    params: { language: lang },
  })

  return (
    <>
      <Header navItems={settings?.mainNav} market={market} language={lang} />

      {children}

      <Footer navItems={settings?.footer} market={market} language={lang} />

      <SanityLive />
    </>
  )
}
