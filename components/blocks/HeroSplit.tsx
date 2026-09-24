'use client'

import { useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  BaseBlockProps,
  SanityImage,
  SanityCTA,
  LocalizedString,
} from '@/types'
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'
import { getVideoUrl } from '@/lib/fileHelpers'
import { cn } from '@/lib/utils'
import type { TakeoverTheme } from '@/lib/takeoverManager'

interface HeroSplitProps extends BaseBlockProps {
  heading?: LocalizedString
  subheading?: LocalizedString
  description?: LocalizedString
  heroImage?: SanityImage
  cta?: SanityCTA
  videoHardware?: { asset: { _ref: string; url?: string } }
  videoSoftware?: { asset: { _ref: string; url?: string } }
  takeoverTheme?: TakeoverTheme | null
}

// Helper to get localized text safely
function getLocalized(text?: LocalizedString, lang: string = 'en') {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

export default function HeroSplit({
  heading,
  subheading,
  cta,
  videoHardware,
  videoSoftware,
  market = 'us',
  language = 'en',
  takeoverTheme,
}: HeroSplitProps) {
  // 1. Text & Link Logic
  const title = getLocalized(heading, language) || 'UNLEASH'
  const subtitle = getLocalized(subheading, language)

  // 🔗 LINK RESOLVER (Prevents 307 Redirects)
  const { ctaLabel, ctaHref } = useMemo(() => {
    if (!cta?.label) return { ctaLabel: null, ctaHref: null }

    const label = getLocalized(cta.label, language)
    let href = null

    if (cta.externalUrl) {
      href = cta.externalUrl
    } else if (cta.internalLink?.slug) {
      const slug = cta.internalLink.slug.startsWith('/')
        ? cta.internalLink.slug.slice(1)
        : cta.internalLink.slug

      // Construct full localized path: /us/en/slug
      href = `/${market}/${language}/${slug}`
    }

    return { ctaLabel: label, ctaHref: href }
  }, [cta, market, language])

  // 2. Mouse Tracking Logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const maskImage = useMotionTemplate`radial-gradient(circle at ${smoothX}px ${smoothY}px, transparent 150px, black 350px)`

  // 3. Video Refs
  const hardwareRef = useRef<HTMLVideoElement>(null)
  const softwareRef = useRef<HTMLVideoElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    const { clientX, clientY, currentTarget } = e
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // 4. Asset URLs
  const hardwareUrl = getVideoUrl(videoHardware?.asset) || ''
  const softwareUrl = getVideoUrl(videoSoftware?.asset) || ''

  useEffect(() => {
    const v1 = hardwareRef.current
    const v2 = softwareRef.current
    if (v1 && v2 && hardwareUrl && softwareUrl) {
      v1.play().catch(() => {})
      v2.play().catch(() => {})
    }
  }, [hardwareUrl, softwareUrl])

  return (
    <section
      className="relative w-full h-[85vh] overflow-hidden bg-black cursor-none group"
      onMouseMove={handleMouseMove}
    >
      {/* --- LAYER 1: SOFTWARE (Background) --- */}
      <div className="absolute inset-0 z-0">
        {softwareUrl ? (
          <video
            ref={softwareRef}
            src={softwareUrl}
            className="w-full h-full object-cover opacity-90"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-red-600" />
        )}
      </div>

      {/* --- LAYER 2: HARDWARE (Masked Overlay) --- */}
      <motion.div
        className="absolute inset-0 z-10 bg-black"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {hardwareUrl ? (
          <video
            ref={hardwareRef}
            src={hardwareUrl}
            className="w-full h-full object-cover grayscale contrast-125"
            muted
            loop
            playsInline
            autoPlay
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* --- LAYER 3: CONTENT --- */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full pointer-events-none text-center px-4">
        <h1
          className="text-8xl md:text-[9rem] font-display text-white tracking-tighter uppercase drop-shadow-2xl mix-blend-overlay opacity-90"
          style={{
            fontFamily: takeoverTheme?.fonts?.heading || undefined,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-xl md:text-2xl font-heading-bold text-white tracking-widest uppercase">
            {subtitle}
          </p>
        )}

        {/* --- CTA BUTTON --- */}
        {ctaHref && ctaLabel && (
          <div className="mt-10 pointer-events-auto">
            <Link
              href={ctaHref}
              className={cn(
                'inline-flex items-center justify-center',
                'py-4 px-12 rounded-full',
                'font-heading-bold text-lg uppercase tracking-wide',
                'transition-all duration-300',
                'hover:scale-105',
                !takeoverTheme?.colors?.primary?.hex &&
                  'bg-white/10 backdrop-blur-md border border-white/50 text-white hover:bg-white hover:text-black'
              )}
              style={{
                backgroundColor:
                  takeoverTheme?.colors?.primary?.hex || undefined,
                color: takeoverTheme?.colors?.primary?.hex
                  ? '#ffffff'
                  : undefined,
                border: takeoverTheme?.colors?.primary?.hex
                  ? 'none'
                  : undefined,
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>

      {/* --- LAYER 4: CUSTOM CURSOR --- */}
      <motion.div
        className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full border border-white/30 pointer-events-none z-30 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs text-white/50 tracking-widest font-numeral uppercase animate-pulse">
            Breach Reality
          </span>
        </div>
      </motion.div>
    </section>
  )
}
