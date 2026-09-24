'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { getImageProps } from '@/lib/imageHelpers'
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// --- Types ---
interface Feature {
  _id: string
  title: string
  slug: string
}

interface Benefit {
  _id: string
  title: string
  description: string
  emotionalCategory: string
  displayPriority: number
  displayStyle: 'standard' | 'compact' | 'hero'
  icon?: SanityImage
  enabledByFeatures?: Feature[]
  targetPersonaIds?: string[]
  supportsGoalIds?: string[]
}

export interface BenefitsSectionProps extends BaseBlockProps {
  heading?: LocalizedString
  subheading?: LocalizedString
  selectionMode: 'manual' | 'persona' | 'goal' | 'all'
  layout: 'grid' | 'grid-2' | 'alternating' | 'carousel'
  showIcons?: boolean
  showLinkedFeatures?: boolean
  backgroundColor?: 'black' | 'white' | 'grey'
  maxItems?: number
  manualBenefits?: Benefit[]
  filterPersonaId?: string
  filterGoalId?: string
  allBenefits?: Benefit[]
}

// Helper to get string from localized field
function getLocalized(text?: LocalizedString, lang: string = 'en'): string {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

// Emotional category icons/colors
const categoryStyles: Record<string, { emoji: string; color: string }> = {
  achievement: { emoji: '🏆', color: 'text-yellow-500' },
  belonging: { emoji: '👥', color: 'text-blue-400' },
  health: { emoji: '❤️', color: 'text-red-400' },
  convenience: { emoji: '⚡', color: 'text-amber-400' },
  mastery: { emoji: '🎯', color: 'text-purple-400' },
  fun: { emoji: '🎉', color: 'text-pink-400' },
  confidence: { emoji: '💪', color: 'text-green-400' },
}

export default function BenefitsSection({
  heading,
  subheading,
  selectionMode = 'manual',
  layout = 'grid',
  showIcons = true,
  showLinkedFeatures = false,
  backgroundColor = 'black',
  maxItems = 6,
  manualBenefits = [],
  filterPersonaId,
  filterGoalId,
  allBenefits = [],
  language = 'en',
}: BenefitsSectionProps) {
  // Determine which benefits to display based on selection mode
  let benefits: Benefit[] = []

  switch (selectionMode) {
    case 'manual':
      benefits = manualBenefits
      break
    case 'persona':
      benefits = allBenefits
        .filter(b => b.targetPersonaIds?.includes(filterPersonaId || ''))
        .slice(0, maxItems)
      break
    case 'goal':
      benefits = allBenefits
        .filter(b => b.supportsGoalIds?.includes(filterGoalId || ''))
        .slice(0, maxItems)
      break
    case 'all':
      benefits = allBenefits.slice(0, maxItems)
      break
  }

  if (!benefits.length) return null

  const displayHeading = getLocalized(heading, language)
  const displaySubheading = getLocalized(subheading, language)

  // Background styles
  const bgStyles: Record<string, string> = {
    black: 'bg-black text-white',
    white: 'bg-white text-black',
    grey: 'bg-grey-900 text-white',
  }

  // Grid styles based on layout
  const gridStyles: Record<string, string> = {
    grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    alternating: 'grid-cols-1',
    carousel: 'grid-cols-1',
  }

  return (
    <section className={`py-20 md:py-28 ${bgStyles[backgroundColor]}`}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        {(displayHeading || displaySubheading) && (
          <div className="text-center mb-16">
            {displayHeading && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display uppercase tracking-tight mb-4"
              >
                {displayHeading}
              </motion.h2>
            )}
            {displaySubheading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-grey-400 max-w-2xl mx-auto"
              >
                {displaySubheading}
              </motion.p>
            )}
          </div>
        )}

        {/* Benefits Grid */}
        {layout === 'alternating' ? (
          <div className="space-y-16">
            {benefits.map((benefit, idx) => (
              <BenefitAlternating
                key={benefit._id}
                benefit={benefit}
                index={idx}
                showIcons={showIcons}
                showLinkedFeatures={showLinkedFeatures}
                isReversed={idx % 2 === 1}
              />
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 ${gridStyles[layout]}`}>
            {benefits.map((benefit, idx) => (
              <BenefitCard
                key={benefit._id}
                benefit={benefit}
                index={idx}
                showIcons={showIcons}
                showLinkedFeatures={showLinkedFeatures}
                isHero={benefit.displayStyle === 'hero'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// --- Card Component ---
function BenefitCard({
  benefit,
  index,
  showIcons,
  showLinkedFeatures,
  isHero,
}: {
  benefit: Benefit
  index: number
  showIcons: boolean
  showLinkedFeatures: boolean
  isHero: boolean
}) {
  const category = categoryStyles[benefit.emotionalCategory] || {
    emoji: '✨',
    color: 'text-brand-primary',
  }
  const imageProps = benefit.icon ? getImageProps(benefit.icon) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative p-6 md:p-8 rounded-2xl border border-grey-800 
        bg-gradient-to-br from-grey-900/50 to-black
        hover:border-brand-primary/50 transition-all duration-300
        ${isHero ? 'md:col-span-2 lg:col-span-1' : ''}
      `}
    >
      {/* Icon or Emoji */}
      {showIcons && (
        <div className="mb-4">
          {imageProps ? (
            <div className="w-12 h-12 relative">
              <Image
                {...imageProps}
                alt={benefit.title}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span className={`text-4xl ${category.color}`}>
              {category.emoji}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-heading-bold mb-3">
        {benefit.title}
      </h3>

      {/* Description */}
      <p className="text-grey-400 leading-relaxed mb-4">
        {benefit.description}
      </p>

      {/* Linked Features */}
      {showLinkedFeatures && benefit.enabledByFeatures?.length ? (
        <div className="pt-4 border-t border-grey-800">
          <p className="text-xs uppercase tracking-wider text-grey-500 mb-2">
            Powered by
          </p>
          <div className="flex flex-wrap gap-2">
            {benefit.enabledByFeatures.map(feature => (
              <span
                key={feature._id}
                className="text-xs px-2 py-1 bg-grey-800 rounded-full text-grey-300"
              >
                {feature.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}

// --- Alternating Layout Component ---
function BenefitAlternating({
  benefit,
  index,
  showIcons,
  showLinkedFeatures,
  isReversed,
}: {
  benefit: Benefit
  index: number
  showIcons: boolean
  showLinkedFeatures: boolean
  isReversed: boolean
}) {
  const category = categoryStyles[benefit.emotionalCategory] || {
    emoji: '✨',
    color: 'text-brand-primary',
  }
  const imageProps = benefit.icon ? getImageProps(benefit.icon) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`
        flex flex-col md:flex-row items-center gap-8 md:gap-16
        ${isReversed ? 'md:flex-row-reverse' : ''}
      `}
    >
      {/* Icon Side */}
      {showIcons && (
        <div className="flex-shrink-0">
          {imageProps ? (
            <div className="w-24 h-24 md:w-32 md:h-32 relative">
              <Image
                {...imageProps}
                alt={benefit.title}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span className={`text-6xl md:text-8xl ${category.color}`}>
              {category.emoji}
            </span>
          )}
        </div>
      )}

      {/* Content Side */}
      <div className={`flex-1 ${isReversed ? 'text-right md:text-left' : ''}`}>
        <h3 className="text-2xl md:text-3xl font-heading-bold mb-4">
          {benefit.title}
        </h3>
        <p className="text-lg text-grey-400 leading-relaxed mb-4">
          {benefit.description}
        </p>

        {showLinkedFeatures && benefit.enabledByFeatures?.length ? (
          <div className="flex flex-wrap gap-2">
            {benefit.enabledByFeatures.map(feature => (
              <span
                key={feature._id}
                className="text-sm px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-brand-primary"
              >
                {feature.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
