'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import checkmarkIcon from '@/icons/system/checkmark.svg'

// Shadcn Imports
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { brand } from '@/lib/brand'

// Localization helper function
const getLocalizedString = (
  text: string | { [key: string]: string } | undefined | null,
  fallback = ''
): string => {
  if (!text) return fallback
  if (typeof text === 'string') return text
  // Try common language keys, then first available value
  return text.en || text.enUS || text.eng || Object.values(text)[0] || fallback
}

// --- TYPES ---
interface Benefit {
  _key: string
  title: string | { [key: string]: string }
  description: string | { [key: string]: string }
  media: string
  tier: 'standard' | 'plus'
  layout: 'full' | 'half'
}

interface MembershipProps {
  data: {
    title: string
    standardPrice: string
    plusPrice: string
    benefits: Benefit[]
  }
}

export default function MembershipStack({ data }: MembershipProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTier, setActiveTier] = useState<string>('standard')
  const [activeSection, setActiveSection] = useState(0)
  const [debugInfo, setDebugInfo] = useState('Component loaded')
  const [eventCount, setEventCount] = useState(0)

  // Market-aware formatting
  const { formatCurrency } = useMarketFormatting()

  const totalSections = data.benefits.length + 2 // +2 for hero and CTA

  // Test function to see if basic React works
  const testFunction = () => {
    setDebugInfo('Button clicked!')
    setEventCount(prev => prev + 1)
  }

  // Auto-switch tier when encountering plus-only content
  const checkAndSwitchTier = useCallback(
    (sectionIndex: number) => {
      setDebugInfo(`Checking section ${sectionIndex}, tier: ${activeTier}`)

      if (sectionIndex === 0) return // Skip hero section
      if (sectionIndex >= data.benefits.length + 1) return // Skip CTA section

      const benefitIndex = sectionIndex - 1
      const benefit = data.benefits[benefitIndex]

      if (benefit?.tier === 'plus' && activeTier === 'standard') {
        setActiveTier('plus')
        setDebugInfo('Auto-switched to Plus!')
      }
    },
    [activeTier, data.benefits]
  )

  // Handle scroll events for section navigation
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      setDebugInfo(`Global key: ${e.key}`)
      setEventCount(prev => prev + 1)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(activeSection + 1, totalSections - 1)
        setActiveSection(next)
        checkAndSwitchTier(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveSection(prev => Math.max(prev - 1, 0))
      }
    }

    const handleGlobalWheel = (e: WheelEvent) => {
      setDebugInfo(`Global wheel: ${e.deltaY}`)
      setEventCount(prev => prev + 1)

      e.preventDefault()

      if (e.deltaY > 0) {
        const next = Math.min(activeSection + 1, totalSections - 1)
        setActiveSection(next)
        checkAndSwitchTier(next)
      } else {
        setActiveSection(prev => Math.max(prev - 1, 0))
      }
    }

    // Attach to document immediately
    document.addEventListener('keydown', handleGlobalKey)
    document.addEventListener('wheel', handleGlobalWheel, { passive: false })

    return () => {
      document.removeEventListener('keydown', handleGlobalKey)
      document.removeEventListener('wheel', handleGlobalWheel)
    }
  }, [totalSections, activeSection, activeTier, checkAndSwitchTier])

  // Marquee Animation
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: 30,
          ease: 'linear' as const,
        },
      },
    },
  }

  return (
    // FORCE DARK MODE WRAPPER
    <div
      ref={containerRef}
      className="dark min-h-screen bg-brand-ink text-brandWhite font-body selection:bg-brand-primary selection:text-brandWhite outline-none"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* VISUAL FRAME BOUNDARIES */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute top-0 left-0 right-0 h-px bg-brandWhite/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-brandWhite/20" />
        <div className="absolute top-0 left-0 bottom-0 w-px bg-brandWhite/20" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-brandWhite/20" />
      </div>

      {/* SIDEBAR NAVIGATION */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
        <nav className="space-y-4">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSection(index)
                checkAndSwitchTier(index)
              }}
              aria-label={`Go to section ${index + 1} of ${totalSections}`}
              aria-current={activeSection === index ? 'step' : undefined}
              className={`w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none ${
                activeSection === index
                  ? 'bg-brand-primary'
                  : 'bg-transparent hover:bg-brandWhite/10'
              }`}
            >
              <span
                className={`block w-3 h-3 rounded-full ${activeSection === index ? 'bg-white' : 'bg-brandWhite/30'}`}
              />
            </button>
          ))}
        </nav>
      </div>
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-brand-ink/90 backdrop-blur-xl border-b border-brandWhite/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-numeral uppercase text-lightGrey tracking-widest">
              {String(activeSection + 1).padStart(2, '0')} /{' '}
              {String(totalSections).padStart(2, '0')}
            </span>
          </div>

          {/* SHADCN TABS as the "Lens Switcher" */}
          <Tabs
            value={activeTier}
            onValueChange={val => setActiveTier(val)}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-2 h-10 bg-brandWhite/10 text-lightGrey rounded-full p-1 border border-brandWhite/10">
              <TabsTrigger
                value="standard"
                className="rounded-full text-xs font-display uppercase data-[state=active]:bg-brandWhite data-[state=active]:text-brand-ink transition-all px-4"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger
                value="plus"
                className="rounded-full text-xs font-display uppercase data-[state=active]:bg-brand-primary data-[state=active]:text-brandWhite transition-all px-4"
              >
                Plus
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Current price */}
          <div className="text-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTier}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex flex-col items-end"
              >
                <div className="text-2xl font-display text-brand-primary">
                  {activeTier === 'standard'
                    ? formatCurrency(
                        parseFloat(data.standardPrice.replace(/[^0-9.]/g, ''))
                      )
                    : formatCurrency(
                        parseFloat(data.plusPrice.replace(/[^0-9.]/g, ''))
                      )}
                </div>
                <div className="text-xs text-lightGrey">per month</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CONSTRAINED CONTENT AREA */}
      <div className="fixed inset-4 top-20 bottom-4">
        {/* HERO SECTION */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeSection === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="overflow-hidden py-16 relative mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeSection === 0 ? 1 : 0 }}
              >
                <motion.div
                  className="whitespace-nowrap flex opacity-30"
                  variants={marqueeVariants}
                  animate="animate"
                >
                  {[...Array(3)].map((_, i) => (
                    <h1
                      key={i}
                      className="text-[8vw] font-display uppercase leading-none px-8 tracking-tighter text-transparent stroke-brandWhite"
                      style={{ WebkitTextStroke: '2px #373F4D' }}
                    >
                      {data.title} —
                    </h1>
                  ))}
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl font-display uppercase tracking-tight bg-brand-ink px-6 py-2 border border-brandWhite/20 -rotate-2 mb-8 inline-block"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: activeSection === 0 ? 1 : 0,
                  y: activeSection === 0 ? 0 : 50,
                }}
                transition={{ delay: 0.5 }}
              >
                Membership
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl font-body text-lightGrey max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: activeSection === 0 ? 1 : 0,
                  y: activeSection === 0 ? 0 : 30,
                }}
                transition={{ delay: 0.8 }}
              >
                Your ticket to everything {brand.name}. Scroll to discover
                what’s included in your plan.
              </motion.p>
            </div>
          </div>
        </div>

        {/* FEATURE SECTIONS */}
        {data.benefits.map((benefit, index) => {
          const isPlusOnly = benefit.tier === 'plus'
          const sectionIndex = index + 1

          return (
            <div
              key={benefit._key}
              className={`absolute inset-0 transition-opacity duration-500 ${
                activeSection === sectionIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-full flex items-center px-6">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content side */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-6xl font-display text-brandWhite/20">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-3">
                          <SvgIcon
                            src={checkmarkIcon}
                            className="w-6 h-6 text-brand-lime"
                          />
                          <Badge
                            className={
                              isPlusOnly
                                ? 'bg-brand-primary text-brandWhite'
                                : 'bg-brandWhite text-brand-ink'
                            }
                          >
                            {isPlusOnly ? 'PLUS EXCLUSIVE' : 'INCLUDED'}
                          </Badge>
                        </div>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-display leading-tight">
                        {getLocalizedString(benefit.title)}
                      </h2>

                      {benefit.description && (
                        <p className="text-lg text-lightGrey leading-relaxed max-w-lg">
                          {getLocalizedString(benefit.description)}
                        </p>
                      )}

                      {isPlusOnly && activeTier === 'standard' && (
                        <div>
                          <Button
                            onClick={() => setActiveTier('plus')}
                            className="bg-brand-primary hover:bg-brand-primary/80 text-brandWhite font-display uppercase tracking-wide px-8 py-3"
                          >
                            Upgrade to Plus
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Visual side */}
                    <div className="relative">
                      <div
                        className={`aspect-square rounded-3xl overflow-hidden bg-darkGrey border border-brandWhite/10 shadow-2xl ${
                          benefit.layout === 'full'
                            ? 'aspect-[21/9]'
                            : 'aspect-square'
                        }`}
                      >
                        {benefit.media && (
                          <Image
                            src={benefit.media}
                            alt={getLocalizedString(
                              benefit.title,
                              'Membership benefit'
                            )}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* FINAL CTA SECTION */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            activeSection === totalSections - 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-full flex items-center justify-center text-center px-6 bg-gradient-to-br from-brand-primary/10 to-brand-lime/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-display mb-8">
                Ready to Start?
              </h2>
              <p className="text-xl text-lightGrey mb-12 max-w-2xl mx-auto">
                Join thousands of {brand.memberNounPlural} already enjoying the
                complete {brand.name}
                experience.
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTier}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <Button
                    size="lg"
                    className="bg-brand-primary hover:bg-brand-primary/80 text-brandWhite font-display uppercase tracking-wide px-12 py-4 text-lg rounded-full"
                  >
                    Get {activeTier === 'plus' ? 'Plus' : 'Standard'} -{' '}
                    {activeTier === 'standard'
                      ? formatCurrency(
                          parseFloat(data.standardPrice.replace(/[^0-9.]/g, ''))
                        )
                      : formatCurrency(
                          parseFloat(data.plusPrice.replace(/[^0-9.]/g, ''))
                        )}
                    /month
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
