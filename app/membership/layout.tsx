import { SanityLive } from '@/sanity/lib/live'
import LogoOnlyHeader from '@/components/blocks/LogoOnlyHeader'

interface RootMembershipLayoutProps {
  children: React.ReactNode
}

// The membership experience is a focused flow: no site nav or footer, just
// the logo back to the homepage. Root-level membership serves US English.
export default function RootMembershipLayout({
  children,
}: RootMembershipLayoutProps) {
  return (
    <>
      <LogoOnlyHeader market="us" language="en" />

      {children}

      <SanityLive />
    </>
  )
}
