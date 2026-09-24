'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { brand } from '@/lib/brand'

/**
 * FEATURES BY CATEGORY
 *
 * Tabbed feature browser using shadcn Tabs and Card.
 * Dynamically fetches features grouped by category.
 */

interface Feature {
  _id: string
  title: string
  tagline?: string
  description?: string
  featureType: string
  image?: {
    asset?: {
      url?: string
    }
    alt?: string
  }
  slug?: string
  isNewFeature?: boolean
  isFeatured?: boolean
}

interface FeaturesByCategoryProps {
  heading?: string
  subheading?: string
  categories?: string[]
  features?: Feature[]
  cardLayout?: 'grid-3' | 'grid-2' | 'list'
  showImages?: boolean
  showDescription?: boolean
  backgroundColor?: 'black' | 'gray' | 'white'
  maxFeaturesPerCategory?: number
}

// Background style mapping
const bgStyles = {
  black: 'bg-black text-white',
  gray: 'bg-gray-900 text-white',
  white: 'bg-white text-gray-900',
}

// Category metadata
const categoryMeta: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  training: {
    label: 'Training & Workouts',
    emoji: '🚴',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  social: {
    label: 'Social & Community',
    emoji: '👥',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  racing: {
    label: 'Racing & Events',
    emoji: '🏁',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  worlds: {
    label: 'Worlds & Routes',
    emoji: '🌍',
    color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  analytics: {
    label: 'Analytics & Progress',
    emoji: '📊',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  hardware: {
    label: 'Hardware & Integrations',
    emoji: '⚙️',
    color:
      'bg-brand-primary/20 text-brand-primary-light border-brand-primary/30',
  },
  gamification: {
    label: 'Gamification',
    emoji: '🎮',
    color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
}

// Grid classes based on layout
const gridClasses = {
  'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'grid-2': 'grid-cols-1 md:grid-cols-2',
  list: 'grid-cols-1',
}

export default function FeaturesByCategory({
  heading = `Everything ${brand.name} Has to Offer`,
  subheading = 'Explore our features by category to find what matters most to you.',
  categories = ['training', 'social', 'racing'],
  features = [],
  cardLayout = 'grid-3',
  showImages = true,
  showDescription = true,
  backgroundColor = 'black',
  maxFeaturesPerCategory = 6,
}: FeaturesByCategoryProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0] || 'training'
  )

  const isDark = backgroundColor !== 'white'

  if (!categories.length) return null

  return (
    <section className={cn('py-16 md:py-24', bgStyles[backgroundColor])}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {subheading && (
            <p
              className={cn(
                'mx-auto mt-4 max-w-2xl text-lg',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList
            className={cn(
              'mx-auto mb-10 flex h-auto w-fit flex-wrap justify-center gap-2',
              'bg-transparent'
            )}
          >
            {categories.map(category => {
              const meta = categoryMeta[category] || {
                label: category,
                emoji: '✨',
                color: 'bg-gray-500/20 text-gray-400',
              }

              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    'rounded-full border px-5 py-2.5 transition-all duration-200',
                    'data-[state=inactive]:border-gray-700 data-[state=inactive]:bg-gray-800/50',
                    'data-[state=active]:border-brand-primary data-[state=active]:bg-brand-primary',
                    'data-[state=active]:text-white'
                  )}
                >
                  <span className="mr-2">{meta.emoji}</span>
                  {meta.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Feature Content */}
          {categories.map(category => {
            const categoryFeatures = features
              .filter(f => f.featureType === category)
              .slice(0, maxFeaturesPerCategory)

            return (
              <TabsContent key={category} value={category} className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={cn('grid gap-6', gridClasses[cardLayout])}
                  >
                    {categoryFeatures.length === 0 ? (
                      <div
                        className={cn(
                          'col-span-full py-12 text-center',
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        )}
                      >
                        No features in this category yet.
                      </div>
                    ) : (
                      categoryFeatures.map((feature, index) => {
                        const meta = categoryMeta[feature.featureType]

                        return (
                          <motion.div
                            key={feature._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className={cn(
                                'h-full overflow-hidden transition-all duration-300',
                                'border-2 hover:border-brand-primary/50',
                                isDark
                                  ? 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'
                                  : 'border-gray-200 bg-white hover:bg-gray-50',
                                cardLayout === 'list' && 'md:flex md:flex-row'
                              )}
                            >
                              {/* Feature Image */}
                              {showImages && feature.image?.asset?.url && (
                                <div
                                  className={cn(
                                    'relative overflow-hidden',
                                    cardLayout === 'list'
                                      ? 'h-48 md:h-auto md:w-64 md:flex-shrink-0'
                                      : 'h-48'
                                  )}
                                >
                                  <Image
                                    src={feature.image.asset.url}
                                    alt={feature.image.alt || feature.title}
                                    fill
                                    className="object-cover"
                                  />
                                  {/* Category Badge Overlay */}
                                  {meta && (
                                    <div className="absolute left-3 top-3">
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          'backdrop-blur-sm',
                                          meta.color
                                        )}
                                      >
                                        {meta.emoji}
                                      </Badge>
                                    </div>
                                  )}

                                  {/* New/Featured Badge */}
                                  {(feature.isNewFeature ||
                                    feature.isFeatured) && (
                                    <div className="absolute right-3 top-3">
                                      <Badge
                                        className={cn(
                                          feature.isNewFeature
                                            ? 'bg-green-500'
                                            : 'bg-brand-primary',
                                          'text-white'
                                        )}
                                      >
                                        {feature.isNewFeature
                                          ? 'New'
                                          : 'Featured'}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div
                                className={cn(
                                  cardLayout === 'list' &&
                                    'flex flex-col justify-center'
                                )}
                              >
                                <CardHeader className="pb-2">
                                  <CardTitle
                                    className={cn(
                                      'text-lg',
                                      isDark ? 'text-white' : 'text-gray-900'
                                    )}
                                  >
                                    {feature.title}
                                  </CardTitle>

                                  {feature.tagline && (
                                    <CardDescription
                                      className={cn(
                                        'text-sm',
                                        isDark
                                          ? 'text-gray-400'
                                          : 'text-gray-600'
                                      )}
                                    >
                                      {feature.tagline}
                                    </CardDescription>
                                  )}
                                </CardHeader>

                                {showDescription && feature.description && (
                                  <CardContent className="pt-0">
                                    <p
                                      className={cn(
                                        'line-clamp-3 text-sm',
                                        isDark
                                          ? 'text-gray-500'
                                          : 'text-gray-500'
                                      )}
                                    >
                                      {feature.description}
                                    </p>
                                  </CardContent>
                                )}
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
