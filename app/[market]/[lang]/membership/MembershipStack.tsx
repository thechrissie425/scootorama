'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import lockedIcon from '@/icons/system/locked.svg'

// Shadcn Imports
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'

interface PlanInfo {
  price: number
  id: string
  title: string
}

interface Benefit {
  _key: string
  title: string
  description: string
  media: string
  layout: 'full' | 'half'
  availability: string[]
}

interface MembershipProps {
  data: {
    title: string
    plans: {
      standard: PlanInfo
      plus: PlanInfo
      household: PlanInfo
    }
    benefits: Benefit[]
  }
}

export default function MembershipStack({ data }: MembershipProps) {
  // 3-Way State
  const [activePlan, setActivePlan] = useState<
    'standard' | 'plus' | 'household'
  >('standard')

  // Market-aware formatting
  const { market: _currentMarket, formatCurrency } = useMarketFormatting()

  // Helper function to clean text with invisible Unicode characters
  const cleanText = (text: string): string => {
    return text.replace(/[\u200B-\u200D\uFEFF\u00A0\u202F\u2060]/g, '').trim()
  }

  // Get current plan details helper
  const currentPlanDetails = data.plans[activePlan]

  // Early return if no plan data
  if (!currentPlanDetails) {
    return <div>Loading plan details...</div>
  }

  // Animation variants
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
    // Uses brand-ink and the body font
    <div className="dark min-h-screen bg-brand-ink text-brandWhite font-body selection:bg-brand-primary selection:text-brandWhite">
      {/* HERO MARQUEE */}
      <div className="overflow-hidden py-16 border-b border-brandWhite/10 relative z-0">
        <motion.div
          className="whitespace-nowrap flex opacity-50"
          variants={marqueeVariants}
          animate="animate"
        >
          {[...Array(4)].map((_, i) => (
            // UPDATED: font-display
            <h1
              key={i}
              className="text-[12vw] font-display uppercase leading-none px-8 tracking-tighter text-transparent stroke-brandWhite"
              style={{ WebkitTextStroke: '2px #F4F1EA' }}
            >
              {cleanText(data.title)} —
            </h1>
          ))}
        </motion.div>
      </div>

      {/* --- CONTROLS (3-WAY TOGGLE) --- */}
      <div className="sticky top-0 z-50 bg-brand-ink/80 backdrop-blur-xl border-b border-brandWhite/10 py-4 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* UPDATED: font-numeral and text-lightGrey */}
          <span className="text-xs font-numeral uppercase text-lightGrey tracking-widest hidden md:block">
            Select Plan Tier
          </span>

          <Tabs
            defaultValue="standard"
            onValueChange={val =>
              setActivePlan(val as 'standard' | 'plus' | 'household')
            }
            className="w-full md:w-auto"
          >
            {/* 3-Column Grid for the 3 Plans */}
            <TabsList className="grid w-full grid-cols-3 h-12 bg-brandWhite/10 text-lightGrey rounded-full p-1 border border-brandWhite/10 min-w-[320px]">
              {/* UPDATED: font-display for tabs */}
              <TabsTrigger
                value="standard"
                className="rounded-full text-[10px] md:text-xs font-display uppercase data-[state=active]:bg-brandWhite data-[state=active]:text-brand-ink transition-all"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger
                value="plus"
                className="rounded-full text-[10px] md:text-xs font-display uppercase data-[state=active]:bg-brand-primary data-[state=active]:text-brandWhite transition-all"
              >
                Deluxe Pass
              </TabsTrigger>
              <TabsTrigger
                value="household"
                className="rounded-full text-[10px] md:text-xs font-display uppercase data-[state=active]:bg-brand-lime data-[state=active]:text-brandWhite transition-all"
              >
                Household
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="hidden md:flex items-center gap-2">
            {/* UPDATED: bg-brand-lime */}
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
            <span className="text-xs font-heading-bold text-brand-lime uppercase">
              Live Preview
            </span>
          </div>
        </div>
      </div>

      {/* --- THE STACK --- */}
      <div className="max-w-[1600px] mx-auto px-4 py-20 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-y-24 md:gap-x-12 relative z-10">
          {data.benefits.map((card, idx) => {
            // Clean the availability array and current plan ID
            const cleanAvailability = card.availability?.map(cleanText) || []
            const cleanPlanId = cleanText(currentPlanDetails?.id || '')

            // --- CORE LOGIC: CHECK AVAILABILITY ---
            const isUnlocked = cleanAvailability.includes(cleanPlanId)
            const isLocked = !isUnlocked

            const colSpan =
              card.layout === 'full' ? 'md:col-span-2' : 'md:col-span-1'

            return (
              <motion.div
                key={card._key}
                layout
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative ${colSpan}`}
              >
                {/* Visual */}
                <div
                  className={`relative w-full overflow-hidden rounded-[2rem] border transition-all duration-500 ${
                    isLocked
                      ? 'border-brandWhite/5 bg-brandWhite/5 grayscale blur-[2px] opacity-50'
                      : 'border-brandWhite/20 bg-darkGrey shadow-2xl'
                  } ${card.layout === 'full' ? 'aspect-[21/9]' : 'aspect-[4/5] md:aspect-square'}`}
                >
                  {card.media && (
                    <Image
                      src={card.media}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}

                  {/* Badge Logic - UPDATED FONTS & COLORS */}
                  <div className="absolute top-6 right-6 z-20">
                    {isLocked && (
                      <Badge
                        variant="outline"
                        className="bg-brand-ink/50 border-brandWhite/20 text-brandWhite backdrop-blur-md px-4 py-2 font-numeral uppercase tracking-widest gap-2"
                      >
                        <SvgIcon src={lockedIcon} className="w-3 h-3" /> Not in{' '}
                        {activePlan}
                      </Badge>
                    )}
                    {!isLocked && activePlan === 'plus' && (
                      <Badge className="bg-brand-primary border-none px-4 py-2 font-numeral uppercase tracking-widest shadow-lg shadow-brand-primary/20">
                        Unlocked
                      </Badge>
                    )}
                    {!isLocked && activePlan === 'household' && (
                      <Badge className="bg-brand-lime border-none px-4 py-2 font-numeral uppercase tracking-widest shadow-lg shadow-brand-lime/20">
                        Household Active
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Typography */}
                <div className="mt-6 flex items-start justify-between px-2">
                  <div className="max-w-xl">
                    {/* UPDATED: font-display */}
                    <h2
                      className={`font-display uppercase tracking-tighter leading-[0.9] mb-4 ${
                        isLocked ? 'text-grey' : 'text-brandWhite'
                      } ${card.layout === 'full' ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'}`}
                    >
                      {cleanText(card.title)}
                    </h2>
                    {/* UPDATED: font-numeral and text-lightGrey */}
                    <p className="text-lightGrey font-numeral text-sm leading-relaxed max-w-sm">
                      {cleanText(card.description || '')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="sticky bottom-0 z-50 bg-brand-ink/90 backdrop-blur text-brandWhite py-6 px-6 md:px-12 flex justify-between items-center border-t border-brandWhite/10">
        <div className="flex flex-col">
          {/* UPDATED: font-display and text-grey */}
          <span className="text-[10px] font-display uppercase tracking-[0.2em] text-grey mb-1">
            Current Plan: {activePlan}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlan}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-baseline gap-2"
            >
              {/* UPDATED: font-display */}
              <span
                className={`text-5xl md:text-6xl font-display tracking-tighter leading-none ${
                  activePlan === 'standard'
                    ? 'text-brandWhite'
                    : activePlan === 'plus'
                      ? 'text-brand-primary'
                      : 'text-brand-lime'
                }`}
              >
                {(() => {
                  // Use the simple price from the current plan
                  const monthlyPrice = currentPlanDetails?.price || 0
                  return formatCurrency(monthlyPrice)
                })()}
              </span>
              {/* UPDATED: font-heading-bold */}
              <span className="text-lg font-heading-bold opacity-60">/mo</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <Button
          size="lg"
          // UPDATED: font-display
          className={`h-16 px-10 rounded-full text-brandWhite hover:scale-105 transition-all text-xl font-display uppercase tracking-wide ${
            activePlan === 'standard'
              ? 'bg-brandWhite text-brand-ink hover:bg-lightGrey'
              : activePlan === 'plus'
                ? 'bg-brand-primary hover:bg-brand-primary-dark'
                : 'bg-brand-lime hover:bg-green-600'
          }`}
        >
          Select {activePlan}
        </Button>
      </div>
    </div>
  )
}
