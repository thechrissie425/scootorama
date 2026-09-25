import LogoOnlyHeader from '@/components/blocks/LogoOnlyHeader'

interface MembershipLayoutProps {
  children: React.ReactNode
  params: Promise<{
    market: string
    lang: string
  }>
}

// The membership experience is a focused flow: no site nav or footer, just
// the logo back to the homepage. It sits outside the (site) route group, so
// the site header and footer don't wrap it.
export default async function MembershipLayout({
  children,
  params,
}: MembershipLayoutProps) {
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

  return (
    <>
      <LogoOnlyHeader market={safeMarket} language={safeLang} />
      {children}
    </>
  )
}
