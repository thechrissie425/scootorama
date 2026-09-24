'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowRight, X } from 'lucide-react'
import SvgIcon from '@/components/ui/SvgIcon'

// Import brand icons
import startFlagIcon from '@/icons/ui/start-flag.svg'
import trophyIcon from '@/icons/ui/trophy.svg'
import goalsIcon from '@/icons/ui/goals.svg'
import stopWatchIcon from '@/icons/ui/stop-watch.svg'
import dataGraphsIcon from '@/icons/ui/data-graphs.svg'
import workoutIcon from '@/icons/ui/workout.svg'
import trainingPlanIcon from '@/icons/ui/training-plan.svg'
import energyIcon from '@/icons/ui/energy.svg'
import powerIcon from '@/icons/ui/power.svg'
import crownIcon from '@/icons/ui/crown.svg'
import ribbonIcon from '@/icons/ui/ribbon.svg'
import podiumIcon from '@/icons/ui/podium.svg'
import finishLineIcon from '@/icons/ui/finish-line.svg'
import coffeeStopIcon from '@/icons/ui/coffee-stop.svg'
import temperatureIcon from '@/icons/ui/temperature.svg'
import weightIcon from '@/icons/ui/weight.svg'
import clubsIcon from '@/icons/ui/clubs.svg'
import followersIcon from '@/icons/ui/followers.svg'
import crystalBallIcon from '@/icons/ui/crystal-ball.svg'
import joystickIcon from '@/icons/ui/joystick.svg'
import { brand } from '@/lib/brand'

/**
 * GOALS SECTION
 *
 * Interactive goal selector with transformation preview.
 * Uses shadcn Card, Badge, and the brand icon system.
 *
 * Mobile UX:
 * - Cards stack vertically with touch-friendly targets
 * - Transformation shows as slide-up sheet on mobile
 * - Close button for easy dismissal
 */

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
}

interface GoalsSectionProps {
  heading?: string
  subheading?: string
  goals?: Goal[]
  layout?: 'grid-3' | 'grid-2' | 'scroll'
  showTimeframe?: boolean
  showTransformation?: boolean
  ctaText?: string
  backgroundColor?: 'black' | 'white' | 'gradient'
}

// Difficulty badge colors
const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

// Background style mapping
const bgStyles = {
  black: 'bg-black text-white',
  white: 'bg-white text-gray-900',
  gradient: 'bg-gradient-to-b from-gray-900 to-black text-white',
}

// Map schema icon values to imported SVGs
const iconMap: Record<string, typeof startFlagIcon> = {
  'start-flag': startFlagIcon,
  trophy: trophyIcon,
  goals: goalsIcon,
  'stop-watch': stopWatchIcon,
  'data-graphs': dataGraphsIcon,
  workout: workoutIcon,
  'training-plan': trainingPlanIcon,
  energy: energyIcon,
  power: powerIcon,
  crown: crownIcon,
  ribbon: ribbonIcon,
  podium: podiumIcon,
  'finish-line': finishLineIcon,
  'coffee-stop': coffeeStopIcon,
  temperature: temperatureIcon,
  weight: weightIcon,
  clubs: clubsIcon,
  followers: followersIcon,
  'Crystal Ball': crystalBallIcon,
  joystick: joystickIcon,
}

// Format timeframe enum to human-readable text
const formatTimeframe = (timeframe: string): string => {
  const timeframeLabels: Record<string, string> = {
    weeks: 'Days to Weeks',
    months_1_3: '1-3 Months',
    months_3_6: '3-6 Months',
    months_6_12: '6-12 Months',
    ongoing: 'Ongoing',
  }
  return timeframeLabels[timeframe] || timeframe
}

// Get icon SVG from schema value (returns null if not found)
const getIcon = (iconValue?: string) => {
  if (!iconValue) return goalsIcon // default fallback
  return iconMap[iconValue] || goalsIcon
}

export default function GoalsSection({
  heading = 'What do you want to achieve?',
  subheading = `Select a goal to see how ${brand.name} can help you get there.`,
  goals = [],
  layout = 'grid-3',
  showTimeframe = true,
  showTransformation = true,
  ctaText = 'Start My Journey',
  backgroundColor = 'black',
}: GoalsSectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

  const activeGoal = goals.find(g => g._id === selectedGoal)

  // Grid classes based on layout
  const gridClasses = {
    'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'grid-2': 'grid-cols-1 md:grid-cols-2',
    scroll: 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))] overflow-x-auto',
  }

  const isDark = backgroundColor !== 'white'

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

        {/* Goals Grid */}
        <div className={cn('grid gap-4 sm:gap-6', gridClasses[layout])}>
          {goals.map((goal, index) => {
            const isSelected = selectedGoal === goal._id
            const iconSrc = getIcon(goal.icon)

            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'relative h-full cursor-pointer transition-all duration-300',
                    'border-2 active:scale-[0.98]', // Touch feedback
                    isDark
                      ? 'bg-gray-900/50 hover:bg-gray-900'
                      : 'bg-gray-50 hover:bg-white',
                    isSelected
                      ? 'border-brand-primary shadow-lg shadow-brand-primary/20'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedGoal(isSelected ? null : goal._id)}
                >
                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-sm"
                      >
                        ✓
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <CardHeader className="pb-3">
                    {/* Icon & Title Row */}
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center',
                          isSelected
                            ? 'bg-brand-primary/20'
                            : isDark
                              ? 'bg-gray-800'
                              : 'bg-gray-200'
                        )}
                      >
                        <SvgIcon
                          src={iconSrc}
                          width={24}
                          height={24}
                          className={cn(
                            'sm:w-7 sm:h-7',
                            isSelected
                              ? 'text-brand-primary'
                              : isDark
                                ? 'text-gray-400'
                                : 'text-gray-600'
                          )}
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle
                          className={cn(
                            'text-base sm:text-lg leading-tight',
                            isDark ? 'text-white' : 'text-gray-900'
                          )}
                        >
                          {goal.title}
                        </CardTitle>
                        {showTimeframe && goal.timeframe && (
                          <span
                            className={cn(
                              'mt-1 inline-block text-xs',
                              isDark ? 'text-gray-500' : 'text-gray-400'
                            )}
                          >
                            {formatTimeframe(goal.timeframe)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription
                      className={cn(
                        'text-sm line-clamp-2 sm:line-clamp-3',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}
                    >
                      {goal.shortDescription || goal.description}
                    </CardDescription>

                    {/* Difficulty Badge */}
                    {goal.difficulty && (
                      <div className="mt-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            difficultyColors[goal.difficulty]
                          )}
                        >
                          {goal.difficulty}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Transformation Preview Panel - Below Grid */}
        <AnimatePresence mode="wait">
          {showTransformation &&
            activeGoal &&
            activeGoal.beforeState &&
            activeGoal.afterState && (
              <motion.div
                key={activeGoal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-6 sm:mt-8"
              >
                <div
                  className={cn(
                    'rounded-xl p-4 sm:p-6 md:p-8 relative',
                    isDark
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700'
                      : 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200'
                  )}
                >
                  {/* Close button - mobile friendly */}
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className={cn(
                      'absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full transition-colors',
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    )}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pr-10">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        'bg-brand-primary/20'
                      )}
                    >
                      <SvgIcon
                        src={getIcon(activeGoal.icon)}
                        width={20}
                        height={20}
                        className="text-brand-primary"
                        alt=""
                      />
                    </div>
                    <h3
                      className={cn(
                        'text-lg sm:text-xl font-semibold',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}
                    >
                      Your {activeGoal.title} Journey
                    </h3>
                  </div>

                  {/* Transformation content - stacked on mobile, side-by-side on desktop */}
                  <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr,auto,1fr] sm:gap-6 sm:items-stretch">
                    {/* Before State */}
                    <div
                      className={cn(
                        'rounded-lg p-4 sm:p-5',
                        isDark ? 'bg-gray-800/50' : 'bg-white'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block mb-2 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded',
                          isDark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-500'
                        )}
                      >
                        Today
                      </span>
                      <p
                        className={cn(
                          'text-sm sm:text-base leading-relaxed',
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        )}
                      >
                        {activeGoal.beforeState}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center items-center py-1 sm:py-0">
                      <div
                        className={cn(
                          'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center',
                          'bg-brand-primary text-white'
                        )}
                      >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-90 sm:rotate-0" />
                      </div>
                      {activeGoal.timeframe && (
                        <span
                          className={cn(
                            'ml-3 sm:hidden text-xs',
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          )}
                        >
                          {formatTimeframe(activeGoal.timeframe)}
                        </span>
                      )}
                    </div>

                    {/* After State */}
                    <div
                      className={cn(
                        'rounded-lg p-4 sm:p-5 border-2 border-brand-primary/30',
                        isDark ? 'bg-brand-primary/10' : 'bg-brand-primary-50'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block mb-2 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded',
                          'bg-brand-primary text-white'
                        )}
                      >
                        With {brand.name}
                      </span>
                      <p
                        className={cn(
                          'text-sm sm:text-base leading-relaxed font-medium',
                          isDark ? 'text-white' : 'text-gray-900'
                        )}
                      >
                        {activeGoal.afterState}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* CTA Section */}
        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-center"
          >
            <button
              className={cn(
                'rounded-full px-8 py-4 text-lg font-semibold transition-all',
                'bg-brand-primary text-white hover:bg-brand-primary-dark',
                'shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40'
              )}
            >
              {ctaText}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
