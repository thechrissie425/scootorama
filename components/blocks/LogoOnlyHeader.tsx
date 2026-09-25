import Link from 'next/link'
import Image from 'next/image'
import { brand } from '@/lib/brand'

interface LogoOnlyHeaderProps {
  market: string
  language: string
}

/**
 * Minimal chrome for focused flows (the membership experience): just the
 * wordmark in the corner, linking back to the homepage. No nav, no footer.
 */
export default function LogoOnlyHeader({
  market,
  language,
}: LogoOnlyHeaderProps) {
  return (
    <header className="pointer-events-none fixed left-0 top-0 z-50 p-5 md:p-7">
      <Link
        href={`/${market}/${language}`}
        aria-label={`${brand.name} home`}
        className="pointer-events-auto inline-flex rounded-md transition-transform hover:-rotate-2 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brandWhite"
      >
        <Image
          src={brand.logo.wordmark}
          alt={brand.name}
          width={185}
          height={38}
          className="h-7 w-auto md:h-8"
          unoptimized
          priority
        />
      </Link>
    </header>
  )
}
