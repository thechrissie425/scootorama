'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/blocks/Footer'
import { DEFAULT_LANGUAGE, DEFAULT_MARKET } from '@/lib/i18n'
import { ComponentProps } from 'react'

// 1. Derive types directly from the Footer component
type FooterProps = ComponentProps<typeof Footer>

// 2. The Wrapper accepts all Footer props (like navItems), plus optional overrides
interface FooterWrapperProps extends Partial<FooterProps> {
  market?: string
  language?: string
}

export default function FooterWrapper({
  market: propMarket,
  language: propLanguage,
  ...rest // 🟢 3. Capture all other props (navItems, copyrightText, etc.)
}: FooterWrapperProps) {
  const pathname = usePathname()

  function getMarketAndLanguage() {
    // Priority 1: Props passed directly
    if (propMarket && propLanguage) {
      return { market: propMarket, language: propLanguage }
    }

    // Priority 2: Parse from URL (e.g. /us/en/...)
    const segments = pathname?.split('/').filter(Boolean) || []
    if (
      segments.length >= 2 &&
      segments[0].length === 2 &&
      segments[1].length === 2
    ) {
      return { market: segments[0], language: segments[1] }
    }

    // Priority 3: Fallback defaults
    return {
      market: propMarket || DEFAULT_MARKET.code,
      language: propLanguage || DEFAULT_LANGUAGE.code,
    }
  }

  const { market, language } = getMarketAndLanguage()

  return (
    <Footer
      {...rest} // 🟢 4. Pass the data down to the Footer component
      market={market}
      language={language}
    />
  )
}
