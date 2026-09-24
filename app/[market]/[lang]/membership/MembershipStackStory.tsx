'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, cubicBezier, AnimatePresence } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import checkmarkIcon from '@/icons/system/checkmark.svg'
import { translate } from '@/lib/uiTranslations'
import { BrandCTAButton } from '@/components/ui/BrandButtons'
import { getLocalizedText } from '@/types'

// Shadcn Imports
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'

interface PlanInfo {
  prices: Array<{
    currency: string
    monthlyPrice: number
    annualPrice: number
    trialDays: number
  }>
  id: string
  title: string
}

interface Benefit {
  _key: string
  title: any // LocalizedString from Sanity
  description: any // LocalizedString from Sanity
  media: string
  layout: 'full' | 'half'
  availability: string[]
}

interface MembershipProps {
  data: {
    title: any // LocalizedString from Sanity
    plans: {
      standard: PlanInfo
      plus: PlanInfo
      household: PlanInfo
    }
    benefits: Benefit[]
  }
  market: string
  language: string
}

export default function MembershipStackStory({
  data,
  market: _market,
  language,
}: MembershipProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePlan, setActivePlan] = useState<
    'standard' | 'plus' | 'household'
  >('standard')
  const [activeSection, setActiveSection] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [isAnnual, setIsAnnual] = useState(true)

  // Market-aware formatting
  const { market: currentMarket, formatCurrency } = useMarketFormatting()

  // Simple approach: just use activeSection state for transforms
  // Remove scrollToSection function entirely and use direct CSS transforms

  // Auto-switch tier based on section progression
  const checkAndSwitchTier = useCallback(
    (sectionIndex: number) => {
      if (sectionIndex === 0) {
        // Hero section - keep current plan or set to standard
        if (activePlan !== 'standard') {
          setActivePlan('standard')
        }
        return
      }

      // Get the benefit for this section (section 1 = benefits[0], etc.)
      const benefitIndex = sectionIndex - 1
      const benefit = data?.benefits?.[benefitIndex]

      if (!benefit) return

      // Use actual availability data to determine required tier
      const availableFor = benefit.availability || []
      const cleanTitle = (title: string) =>
        title
          ?.replace(
            /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\u{E0000}-\u{E007F}]/gu,
            ''
          )
          .trim()
      const cleanAvailableFor = availableFor.map(cleanTitle)

      const standardTitle = cleanTitle(data?.plans?.standard?.title || '')
      const plusTitle = cleanTitle(data?.plans?.plus?.title || '')
      const householdTitle = cleanTitle(data?.plans?.household?.title || '')

      let targetTier: 'standard' | 'plus' | 'household' = 'standard'

      // Determine minimum tier needed for this benefit
      if (cleanAvailableFor.includes(standardTitle)) {
        targetTier = 'standard' // Available to all plans
      } else if (cleanAvailableFor.includes(plusTitle)) {
        targetTier = 'plus' // Available to Plus and Household
      } else if (cleanAvailableFor.includes(householdTitle)) {
        targetTier = 'household' // Only available to Household
      }

      if (activePlan !== targetTier) {
        console.log(
          `Auto-switching from ${activePlan} to ${targetTier} for section ${sectionIndex} (${benefit.title})`
        )
        setActivePlan(targetTier)
      }
    },
    [activePlan, data?.benefits, data?.plans]
  )

  // A24-style scroll detection with direction tracking
  useEffect(() => {
    const sectionRefs: HTMLElement[] = []
    let lastActiveSection = activeSection
    let currentScrollDirection = scrollDirection

    // Create intersection observer with more precise settings
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const sectionIndex = parseInt(
              entry.target.getAttribute('data-section') || '0'
            )

            // Track scroll direction
            if (sectionIndex > lastActiveSection) {
              currentScrollDirection = 'down'
              setScrollDirection('down')
            } else if (sectionIndex < lastActiveSection) {
              currentScrollDirection = 'up'
              setScrollDirection('up')
            }

            lastActiveSection = sectionIndex
            console.log(
              '🎯 Section in view:',
              sectionIndex,
              currentScrollDirection === 'down' ? '⬇️' : '⬆️'
            )
            setActiveSection(sectionIndex)
            checkAndSwitchTier(sectionIndex)
          }
        })
      },
      {
        threshold: [0.6], // More precise trigger at 60% visibility
        rootMargin: '-5% 0px', // Tighter margin for cleaner transitions
      }
    )

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach(section => {
      observer.observe(section)
      sectionRefs.push(section as HTMLElement)
    })

    return () => {
      observer.disconnect()
    }
  }, [checkAndSwitchTier, activeSection, scrollDirection])

  const currentPlanDetails = data?.plans?.[activePlan]

  // Dynamic color theming based on current plan
  const planTheme = {
    standard: {
      primary: 'rgb(0, 199, 255)', // Tailwind blue-500 equivalent
      planName: 'CLUBHOUSE PASS',
    },
    plus: {
      primary: 'rgb(214, 17, 122)', // brand primary
      planName: 'DELUXE PASS',
    },
    household: {
      primary: 'rgb(16, 185, 129)', // Tailwind emerald-500 equivalent
      planName: 'FAMILY PASS',
    },
  }
  const currentTheme = planTheme[activePlan]

  // Early return if no data
  if (!data || !currentPlanDetails) {
    return <div>Loading...</div>
  }

  // A24-style animation variants
  const sectionVariants = {
    hidden: (direction: 'up' | 'down') => ({
      opacity: 0,
      scale: direction === 'down' ? 0.8 : 1.2,
      y: direction === 'down' ? 100 : -100,
    }),
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.25, 0.46, 0.45, 0.94), // A24-style easing
      },
    },
    exit: (direction: 'up' | 'down') => ({
      opacity: 0,
      scale: direction === 'down' ? 1.2 : 0.8,
      y: direction === 'down' ? -100 : 100,
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
      },
    }),
  }

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
    <div
      ref={containerRef}
      className="dark bg-brand-ink text-brandWhite font-body relative overflow-y-scroll snap-y snap-mandatory h-screen"
    >
      {/* VISUAL FRAME BOUNDARIES */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-brandWhite/20" />
        {/* Bottom border - Remove this since we want normal page flow */}
        {/* Left border */}
        <div className="absolute top-0 left-0 bottom-0 w-px bg-brandWhite/20" />
        {/* Right border */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-brandWhite/20" />
      </div>

      {/* NORMAL PAGE LAYOUT */}
      <div className="grid grid-cols-12 min-h-screen">
        {/* MAIN SCROLLING CONTENT */}
        <div className="col-span-9 relative">
          {/* HERO SECTION */}
          <motion.section
            className="min-h-screen flex-shrink-0 flex items-center justify-center text-center px-6 relative snap-start snap-always"
            data-section="0"
            variants={sectionVariants}
            initial="hidden"
            animate={activeSection === 0 ? 'visible' : 'hidden'}
            custom={scrollDirection}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="overflow-hidden py-16 relative mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="whitespace-nowrap flex opacity-30"
                  variants={marqueeVariants}
                  animate="animate"
                >
                  {[...Array(3)].map((_, i) => (
                    <h1
                      key={i}
                      className="text-[8vw] font-display uppercase leading-none px-8 tracking-tighter text-transparent"
                      style={{
                        WebkitTextStroke: `2px ${currentTheme.primary}`,
                      }}
                    >
                      {getLocalizedText(data.title, language)} —
                    </h1>
                  ))}
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl font-display uppercase tracking-tight bg-brand-ink px-6 py-2 -rotate-2 mb-8 inline-block transition-colors duration-500"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {translate(language, 'membership')}
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl font-body text-lightGrey max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {translate(language, 'membershipGateway')}
              </motion.p>
            </div>
          </motion.section>

          {/* FEATURE SECTIONS */}
          {data.benefits?.map((benefit, index) => {
            const sectionIndex = index + 1

            // Use actual availability data from Sanity
            const availableFor = benefit.availability || []
            const currentPlanTitle = data?.plans?.[activePlan]?.title
            const standardTitle = data?.plans?.standard?.title
            const plusTitle = data?.plans?.plus?.title
            const householdTitle = data?.plans?.household?.title

            // Check if current plan has access (availability uses titles, not IDs)
            // Clean titles by removing invisible characters for comparison
            const cleanTitle = (title: string) =>
              title
                ?.replace(
                  /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\u{E0000}-\u{E007F}]/gu,
                  ''
                )
                .trim()

            const cleanCurrentPlanTitle = cleanTitle(currentPlanTitle || '')
            const cleanStandardTitle = cleanTitle(standardTitle || '')
            const cleanPlusTitle = cleanTitle(plusTitle || '')
            const cleanHouseholdTitle = cleanTitle(householdTitle || '')
            const cleanAvailableFor = availableFor.map(cleanTitle)

            const isAccessible = cleanAvailableFor.includes(
              cleanCurrentPlanTitle
            )

            // Determine badge logic based on availability
            const badges: Array<{
              text: string
              variant: 'included' | 'plus' | 'household'
            }> = []

            if (cleanAvailableFor.includes(cleanStandardTitle)) {
              badges.push({
                text: translate(language, 'included'),
                variant: 'included',
              })
            }

            if (
              cleanAvailableFor.includes(cleanPlusTitle) &&
              !cleanAvailableFor.includes(cleanStandardTitle)
            ) {
              badges.push({
                text: translate(language, 'plus'),
                variant: 'plus',
              })
              badges.push({
                text: translate(language, 'householdPlus'),
                variant: 'household',
              })
            }

            if (
              cleanAvailableFor.includes(cleanHouseholdTitle) &&
              !cleanAvailableFor.includes(cleanPlusTitle) &&
              !cleanAvailableFor.includes(cleanStandardTitle)
            ) {
              badges.push({
                text: translate(language, 'plusHouseholdOnly'),
                variant: 'household',
              })
            }

            return (
              <motion.section
                key={benefit._key}
                className="min-h-screen flex-shrink-0 flex items-center px-6 snap-start snap-always"
                data-section={sectionIndex.toString()}
                variants={sectionVariants}
                initial="hidden"
                animate={activeSection === sectionIndex ? 'visible' : 'hidden'}
                custom={scrollDirection}
              >
                <div className="max-w-full mx-auto w-full">
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
                            className="w-6 h-6 transition-colors duration-500"
                            style={{ color: currentTheme.primary }}
                          />
                          <div className="flex gap-2">
                            {badges.map((badge, badgeIndex) => (
                              <Badge
                                key={badgeIndex}
                                className={
                                  badge.variant === 'included'
                                    ? 'bg-brandWhite text-brand-ink'
                                    : badge.variant === 'plus'
                                      ? 'bg-brand-primary text-brandWhite'
                                      : 'bg-brand-lime text-brandWhite'
                                }
                              >
                                {badge.text}
                              </Badge>
                            ))}
                            {!isAccessible && (
                              <Badge className="bg-red-600 text-brandWhite">
                                {translate(
                                  language,
                                  'upgradeRequired'
                                ).toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-display leading-tight">
                        {getLocalizedText(benefit.title, language)}
                      </h2>

                      {benefit.description && (
                        <p className="text-lg text-lightGrey leading-relaxed max-w-lg">
                          {getLocalizedText(benefit.description, language)}
                        </p>
                      )}

                      {!isAccessible && (
                        <div>
                          <Button
                            onClick={() => setActivePlan('plus')}
                            className="bg-brand-primary hover:bg-brand-primary/80 text-brandWhite font-display uppercase tracking-wide px-8 py-3"
                          >
                            {translate(language, 'upgradeTo')}{' '}
                            {translate(language, 'plus')}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Visual side */}
                    <div className="relative">
                      <div
                        className={`aspect-square rounded-3xl overflow-hidden bg-darkGrey border-2 shadow-2xl transition-colors duration-500 ${
                          benefit.layout === 'full'
                            ? 'aspect-[21/9]'
                            : 'aspect-square'
                        }`}
                        style={{ borderColor: currentTheme.primary }}
                      >
                        {benefit.media && (
                          <Image
                            src={benefit.media}
                            alt={getLocalizedText(benefit.title, language)}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )
          })}
        </div>

        {/* SIDEBAR THAT SCROLLS WITH PAGE */}
        <div className="col-span-3 bg-brandWhite text-brand-ink sticky top-0 h-screen">
          <div className="p-8 flex-1 flex flex-col justify-center space-y-8 h-full">
            {/* Gas Station Rolling Plan Display */}
            <div className="flex justify-center">
              <div className="transition-all duration-500">
                <div className="h-14 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePlan}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.6,
                      }}
                      className="text-3xl font-display uppercase text-brand-ink"
                    >
                      {currentTheme.planName}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* A24 Line Rule */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* 1. Features */}
            <div>
              <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-heading">
                BENEFITS INCLUDE:
              </div>
              <div className="space-y-2">
                {data?.benefits?.slice(0, 6).map(benefit => {
                  const cleanTitle = (title: string) =>
                    title
                      ?.replace(
                        /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\u{E0000}-\u{E007F}]/gu,
                        ''
                      )
                      .trim()
                  const cleanAvailableFor =
                    benefit.availability?.map(cleanTitle) || []
                  const cleanCurrentPlanTitle = cleanTitle(
                    currentPlanDetails?.title || ''
                  )
                  const isAccessible = cleanAvailableFor.includes(
                    cleanCurrentPlanTitle
                  )

                  return (
                    <div
                      key={benefit._key}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                          style={{
                            backgroundColor: isAccessible
                              ? currentTheme.primary
                              : '#d1d5db',
                          }}
                        />
                        <span
                          className={`text-xs font-body ${
                            isAccessible ? 'text-brand-ink' : 'text-gray-400'
                          }`}
                        >
                          {getLocalizedText(benefit.title, language).length > 18
                            ? getLocalizedText(
                                benefit.title,
                                language
                              ).substring(0, 18) + '...'
                            : getLocalizedText(benefit.title, language)}
                        </span>
                      </div>
                      {!isAccessible && (
                        <span className="text-[10px] text-brand-primary font-heading uppercase">
                          {translate(language, 'upgrade').toUpperCase()}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* A24 Line Rule */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* 2. Monthly/Annual Toggle */}
            <div>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-heading transition-all ${
                    !isAnnual
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {translate(language, 'monthly').toUpperCase()}
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`flex-1 px-4 py-2 rounded-full text-sm font-heading transition-all ${
                    isAnnual
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {translate(language, 'annually').toUpperCase()}
                </button>
              </div>
              {isAnnual && (
                <div className="text-center mt-2">
                  {(() => {
                    const pricing =
                      currentPlanDetails?.prices?.find(
                        p => p.currency === currentMarket.currency.code
                      ) || currentPlanDetails?.prices?.[0]

                    let savingsPercent = 20 // Default fallback
                    if (pricing?.monthlyPrice && pricing?.annualPrice) {
                      const monthlyCostOfAnnual = pricing.annualPrice / 12
                      savingsPercent = Math.round(
                        ((pricing.monthlyPrice - monthlyCostOfAnnual) /
                          pricing.monthlyPrice) *
                          100
                      )
                    }

                    return (
                      <span className="bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-heading uppercase">
                        {translate(language, 'save')} {savingsPercent}%
                      </span>
                    )
                  })()}
                </div>
              )}
            </div>

            {/* 3. Pricing Widget */}
            <div>
              <div className="text-center">
                {(() => {
                  // Handle both old and new data structures
                  const pricing =
                    currentPlanDetails?.prices?.find(
                      p => p.currency === currentMarket.currency.code
                    ) || currentPlanDetails?.prices?.[0]

                  let monthlyPrice, annualPrice
                  if (pricing) {
                    // New structure with prices array
                    monthlyPrice = pricing.monthlyPrice
                    annualPrice = pricing.annualPrice
                  } else {
                    // Fallback - use first price if available
                    const fallbackPricing = currentPlanDetails?.prices?.[0]
                    monthlyPrice = fallbackPricing?.monthlyPrice || 0
                    annualPrice =
                      fallbackPricing?.annualPrice ||
                      (monthlyPrice ? monthlyPrice * 12 * 0.8 : 0)
                  }

                  if (!monthlyPrice) return <div>Loading prices...</div>

                  const displayPrice = isAnnual ? annualPrice : monthlyPrice

                  return (
                    <>
                      <div className="text-5xl font-display text-brand-ink mb-2">
                        {formatCurrency(displayPrice)}
                      </div>
                      <div className="text-sm text-gray-600 font-body">
                        {isAnnual
                          ? translate(language, 'perYear')
                          : translate(language, 'perMonth')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize font-body">
                        {getLocalizedText(
                          currentPlanDetails?.title,
                          language
                        ) || currentPlanDetails?.title}{' '}
                        {translate(language, 'plan')}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* A24 Line Rule */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* 4. CTA */}
            <div>
              <BrandCTAButton className="uppercase tracking-wide text-2xl py-6">
                {translate(language, 'join')}
              </BrandCTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
