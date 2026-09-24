'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { getImageUrl, getBlurDataURL } from '@/lib/imageHelpers'
import type { TakeoverTheme } from '@/lib/takeoverManager'
// 👇 Import the shared types we created
import {
  BaseBlockProps,
  SanityImage,
  SanityCTA,
  LocalizedString,
} from '@/types'

// 👇 Define props LOCALLY, extending the global BaseBlockProps
interface HeroProps extends BaseBlockProps {
  heading: LocalizedString
  subheading: LocalizedString
  cta?: SanityCTA
  backgroundImage?: SanityImage | null
  layout?: 'center' | 'left' | 'bottom-left'
  priority?: 'high' | 'normal' | 'low'
  ariaLabel?: string
  takeoverTheme?: TakeoverTheme | null
}

// Helper to extract localized text safely
const getLocalizedText = (text: LocalizedString, language = 'en'): string => {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[language] || text.en || Object.values(text)[0] || ''
}

export default function Hero({
  heading,
  subheading,
  cta,
  backgroundImage,
  layout: _layout = 'center',
  priority = 'high',
  ariaLabel,
  // 👇 Default values from BaseBlockProps
  language = 'en',
  market = 'us',
  theme,
  takeoverTheme,
}: HeroProps) {
  // 1. Text Processing
  const localizedHeading = useMemo(
    () => getLocalizedText(heading, language),
    [heading, language]
  )
  const localizedSubheading = useMemo(
    () => getLocalizedText(subheading, language),
    [subheading, language]
  )

  // 2. Image Processing
  // A campaign takeover can swap in its own key art
  const takeoverArt = takeoverTheme?.hero?.backgroundPattern
  const activeImage = takeoverArt?.asset ? takeoverArt : backgroundImage

  const imageUrl = useMemo(() => {
    if (!activeImage?.asset) return null
    return getImageUrl(activeImage, {
      width: 2400,
      height: 1600,
      quality: 85,
    })
  }, [activeImage])

  const blurDataURL = useMemo(() => {
    return getBlurDataURL(activeImage)
  }, [activeImage])

  // 3. Link Logic (Prevents 307 Redirects)
  const { ctaLabel, ctaHref } = useMemo(() => {
    if (!cta?.label) return { ctaLabel: null, ctaHref: null }

    const label = getLocalizedText(cta.label, language)
    let href = null

    if (cta.externalUrl) {
      href = cta.externalUrl
    } else if (cta.internalLink?.slug) {
      // Clean the slug
      const slug = cta.internalLink.slug.startsWith('/')
        ? cta.internalLink.slug.slice(1)
        : cta.internalLink.slug

      // Construct localized path: /us/en/shop
      href = `/${market}/${language}/${slug}`
    }

    return { ctaLabel: label, ctaHref: href }
  }, [cta, market, language])

  // Apply takeover theme styling
  // Overlay keeps text legible while leaving most of the art bright. Takeover
  // colors are applied inline: Tailwind can't generate classes at runtime.
  const overlayStyle = useMemo(() => {
    const hex = takeoverTheme?.hero?.gradientOverlay?.hex
    if (!hex) return undefined
    const alpha =
      Math.min(Math.max(takeoverTheme?.hero?.overlayOpacity ?? 70, 0), 100) /
      100
    const toHexAlpha = (a: number) =>
      Math.round(a * 255)
        .toString(16)
        .padStart(2, '0')
    return {
      backgroundImage: `linear-gradient(to top right, ${hex}${toHexAlpha(alpha)} 0%, ${hex}${toHexAlpha(alpha * 0.35)} 45%, transparent 75%)`,
    }
  }, [takeoverTheme])

  const textShadow = takeoverTheme?.hero?.textShadow
    ? 'drop-shadow-2xl'
    : 'drop-shadow-lg'

  // Layout-specific classes
  const layoutClasses = useMemo(() => {
    switch (_layout) {
      case 'left':
        return 'items-center justify-start text-left'
      case 'bottom-left':
        return 'items-end justify-start text-left'
      case 'center':
      default:
        return 'items-center justify-center text-center'
    }
  }, [_layout])

  return (
    <section
      className={cn(
        'relative h-svh min-h-[600px] flex text-white bg-black overflow-hidden',
        layoutClasses,
        theme === 'dark' ? 'bg-gray-900' : 'bg-black'
      )}
      style={{
        fontFamily: takeoverTheme?.fonts?.body || undefined,
      }}
      aria-label={ariaLabel}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={backgroundImage?.alt || 'Hero background'}
            fill
            className={cn(
              'object-cover',
              // The default art keeps its left side calm for the copy; on
              // narrow screens, where copy spans the width, show that side.
              // It's anchored to the bottom so short, wide windows crop
              // empty sky rather than the road and scooter. Campaign key art
              // is centered as designed.
              !takeoverArt?.asset && 'object-[20%_100%] md:object-bottom'
            )}
            priority={priority === 'high'}
            sizes="100vw"
            {...(blurDataURL && {
              placeholder: 'blur',
              blurDataURL,
            })}
          />
        )}
        <div
          className={cn(
            'absolute inset-0',
            !overlayStyle &&
              'bg-gradient-to-tr from-brand-ink/85 via-brand-ink/25 to-transparent'
          )}
          style={overlayStyle}
        />
      </div>

      {/* Content */}
      <header
        className={cn(
          'relative z-10 max-w-4xl px-6 md:px-12 flex flex-col',
          _layout === 'center' && 'items-center',
          (_layout === 'left' || _layout === 'bottom-left') && 'items-start',
          _layout === 'bottom-left' && 'mb-16 md:mb-24'
        )}
      >
        {localizedHeading && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              'text-6xl font-display md:text-8xl tracking-tighter mb-6 uppercase text-white',
              textShadow
            )}
            style={{
              fontFamily: takeoverTheme?.fonts?.heading || undefined,
            }}
          >
            {localizedHeading}
          </motion.h1>
        )}

        {localizedSubheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading-semibold text-2xl md:text-3xl mb-10 text-gray-100 max-w-2xl"
          >
            {localizedSubheading}
          </motion.p>
        )}

        {/* CTA Button */}
        {ctaHref && ctaLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={ctaHref}
              className={cn(
                'group relative inline-flex items-center justify-center',
                'py-4 px-12 rounded-full',
                'font-heading-bold text-lg uppercase tracking-wide',
                'overflow-hidden transition-all duration-300',
                'hover:scale-105 shadow-lg hover:shadow-xl',
                !takeoverTheme?.colors?.primary?.hex &&
                  'bg-brand-primary text-white'
              )}
              style={{
                backgroundColor:
                  takeoverTheme?.colors?.primary?.hex || undefined,
                color: '#ffffff',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {ctaLabel}
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        )}
      </header>
    </section>
  )
}
