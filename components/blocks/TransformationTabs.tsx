'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { brand } from '@/lib/brand'

/**
 * TRANSFORMATION TABS
 *
 * Before/After comparison using shadcn Tabs.
 * Shows emotional journey from current state to desired outcome.
 */

interface Benefit {
  _id: string
  title: string
  emotionalCategory?: string
}

interface Feature {
  _id: string
  title: string
  slug?: string
}

interface Goal {
  _id: string
  title: string
  description?: string
  shortDescription?: string
  timeframe?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  beforeState?: string
  afterState?: string
  icon?: string
  supportingBenefits?: Benefit[]
  enablingFeatures?: Feature[]
}

interface TransformationTabsProps {
  heading?: string
  subheading?: string
  goals?: Goal[]
  tabStyle?: 'pills' | 'underline' | 'boxed'
  showBenefits?: boolean
  showFeatures?: boolean
  backgroundColor?: 'black' | 'gray' | 'white'
}

// Background style mapping
const bgStyles = {
  black: 'bg-black text-white',
  gray: 'bg-gray-900 text-white',
  white: 'bg-white text-gray-900',
}

// Tab style variations
const tabStyles = {
  pills: {
    list: 'bg-gray-800/50 p-1 rounded-full',
    trigger:
      'rounded-full data-[state=active]:bg-brand-primary data-[state=active]:text-white px-6',
  },
  underline: {
    list: 'bg-transparent border-b border-gray-700',
    trigger:
      'border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:text-brand-primary rounded-none pb-3',
  },
  boxed: {
    list: 'bg-gray-800/30 p-1 rounded-lg',
    trigger:
      'rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white px-6',
  },
}

// Goal icons mapping
const goalIcons: Record<string, string> = {
  'lose-weight': '🏃‍♂️',
  'build-fitness': '💪',
  'race-compete': '🏆',
  'train-smarter': '🎯',
  'stay-consistent': '📈',
  'have-fun': '🎉',
}

// Emotional category styling
const categoryStyles: Record<string, { emoji: string; color: string }> = {
  confidence: { emoji: '💪', color: 'bg-purple-500/20 text-purple-400' },
  freedom: { emoji: '🦋', color: 'bg-blue-500/20 text-blue-400' },
  belonging: { emoji: '🤝', color: 'bg-green-500/20 text-green-400' },
  achievement: { emoji: '🏆', color: 'bg-yellow-500/20 text-yellow-400' },
  joy: { emoji: '🎉', color: 'bg-pink-500/20 text-pink-400' },
  peace: { emoji: '🧘', color: 'bg-teal-500/20 text-teal-400' },
}

export default function TransformationTabs({
  heading = 'Your Transformation Journey',
  subheading = `See where you are today vs. where ${brand.name} can take you.`,
  goals = [],
  tabStyle = 'pills',
  showBenefits = true,
  showFeatures = false,
  backgroundColor = 'gray',
}: TransformationTabsProps) {
  const [activeTab, setActiveTab] = useState(goals[0]?._id || '')

  const isDark = backgroundColor !== 'white'
  const styles = tabStyles[tabStyle]

  if (!goals.length) return null

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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab List */}
          <TabsList
            className={cn(
              'mx-auto mb-8 flex w-fit justify-center',
              styles.list
            )}
          >
            {goals.map(goal => {
              const iconKey = goal._id.toLowerCase().replace(/[^a-z-]/g, '-')
              const icon = goal.icon || goalIcons[iconKey] || '🎯'

              return (
                <TabsTrigger
                  key={goal._id}
                  value={goal._id}
                  className={cn('transition-all duration-200', styles.trigger)}
                >
                  <span className="mr-2">{icon}</span>
                  {goal.title}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tab Content */}
          {goals.map(goal => (
            <TabsContent key={goal._id} value={goal._id} className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Before/After Cards */}
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Before Card */}
                    <div
                      className={cn(
                        'relative rounded-2xl p-8',
                        isDark ? 'bg-gray-800/50' : 'bg-gray-100'
                      )}
                    >
                      <div className="absolute -top-3 left-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            'px-4 py-1 text-sm font-medium',
                            isDark
                              ? 'border-gray-600 bg-gray-900 text-gray-400'
                              : 'border-gray-300 bg-white text-gray-500'
                          )}
                        >
                          Before
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <p
                          className={cn(
                            'text-xl leading-relaxed',
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          )}
                        >
                          {goal.beforeState || 'Current state not defined'}
                        </p>

                        <div
                          className={cn(
                            'mt-6 flex items-center gap-2 text-sm',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          )}
                        >
                          <span>😔</span>
                          <span>Where you might be now</span>
                        </div>
                      </div>
                    </div>

                    {/* After Card */}
                    <div
                      className={cn(
                        'relative rounded-2xl p-8',
                        'bg-gradient-to-br from-brand-primary/20 to-brand-primary-dark/10',
                        'border border-brand-primary/30'
                      )}
                    >
                      <div className="absolute -top-3 left-6">
                        <Badge className="bg-brand-primary px-4 py-1 text-sm font-medium text-white hover:bg-brand-primary">
                          After
                        </Badge>
                      </div>

                      <div className="mt-4">
                        <p
                          className={cn(
                            'text-xl font-medium leading-relaxed',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {goal.afterState || 'Desired outcome not defined'}
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-sm text-brand-primary-light">
                          <span>🎯</span>
                          <span>Where {brand.name} takes you</span>
                          {goal.timeframe && (
                            <>
                              <span className="mx-2">·</span>
                              <span>{goal.timeframe}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Benefits */}
                  {showBenefits &&
                    goal.supportingBenefits &&
                    goal.supportingBenefits.length > 0 && (
                      <div className="mt-8">
                        <h4
                          className={cn(
                            'mb-4 text-sm font-medium uppercase tracking-wider',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          )}
                        >
                          Benefits you'll experience
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {goal.supportingBenefits.map(benefit => {
                            const category = categoryStyles[
                              benefit.emotionalCategory || ''
                            ] || {
                              emoji: '✨',
                              color: 'bg-gray-500/20 text-gray-400',
                            }

                            return (
                              <Badge
                                key={benefit._id}
                                variant="outline"
                                className={cn(
                                  'px-4 py-2 text-sm',
                                  category.color,
                                  'border-transparent'
                                )}
                              >
                                <span className="mr-2">{category.emoji}</span>
                                {benefit.title}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  {/* Enabling Features */}
                  {showFeatures &&
                    goal.enablingFeatures &&
                    goal.enablingFeatures.length > 0 && (
                      <div className="mt-8">
                        <h4
                          className={cn(
                            'mb-4 text-sm font-medium uppercase tracking-wider',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          )}
                        >
                          Features that make it happen
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {goal.enablingFeatures.map(feature => (
                            <Badge
                              key={feature._id}
                              variant="outline"
                              className={cn(
                                'px-4 py-2 text-sm',
                                isDark
                                  ? 'border-gray-700 text-gray-300'
                                  : 'border-gray-300 text-gray-600'
                              )}
                            >
                              {feature.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
