'use client'

import { cn } from '@/lib/utils'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
// 👇 Import shared types
import { BaseBlockProps } from '@/types'

// 1. DEFINE THE SHAPE
interface StatItem {
  _id: string
  label: string
  smartValue: {
    value: number
    unit?: string
    notation?: string
    prefix?: string
    suffix?: string
  }
}

// 👇 Extend BaseBlockProps to accept context from page.tsx
export interface StatsGridProps extends BaseBlockProps {
  theme?: 'dark' | 'light'
  stats: StatItem[]
  locale?: string
}

export function StatsGrid({
  theme = 'dark',
  stats,
  locale: _locale = 'en-US',
  // 👇 Receive context props (prevents TS error)
  market = 'us',
  language = 'en',
}: StatsGridProps) {
  // Use market-aware formatting
  const { market: _currentMarket } = useMarketFormatting()

  // Fix: Always use props for locale generation (ignore passed locale for market conversion)
  const marketLocale = `${language}-${market.toUpperCase()}`

  // Safety check
  if (!stats || stats.length === 0) return null

  // THEME LOGIC
  const isDark = theme === 'dark'
  const bgClass = isDark
    ? 'bg-brand-ink text-white'
    : 'bg-lightGrey text-brand-ink'
  const labelClass = isDark ? 'text-grey' : 'text-grey-dark'

  return (
    <section className={cn('py-8 md:py-8', bgClass)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            'grid gap-8 md:gap-12 text-center',
            stats.length === 2 && 'grid-cols-2 max-w-2xl mx-auto',
            stats.length === 3 &&
              'grid-cols-2 md:grid-cols-3 max-w-3xl mx-auto',
            stats.length >= 4 && 'grid-cols-2 md:grid-cols-4'
          )}
        >
          {stats.map((stat, idx) => {
            if (!stat.smartValue) return null

            const {
              unit = 'none',
              value,
              prefix = '',
              suffix = '',
            } = stat.smartValue

            const isUnitConversion = [
              'miles',
              'kilometers',
              'pounds',
              'kilograms',
              'fahrenheit',
            ].includes(unit)

            let displayNumber: string
            let unitText: string = ''

            if (isUnitConversion) {
              // Conversion Logic
              let convertedValue = value
              let unitSuffix = ''

              // Simple check for metric markets (excluding US, GB, etc)
              const isMetric = !['en-US', 'en-GB', 'mm-MM', 'lr-LR'].includes(
                marketLocale
              )

              if (unit === 'miles') {
                convertedValue = isMetric
                  ? Math.round(value * 1.60934)
                  : Math.round(value)
                unitSuffix = isMetric ? ' km' : ' mi'
              } else if (unit === 'kilometers') {
                convertedValue = isMetric
                  ? Math.round(value)
                  : Math.round(value * 0.621371)
                unitSuffix = isMetric ? ' km' : ' mi'
              } else if (unit === 'pounds') {
                convertedValue = isMetric
                  ? Math.round(value * 0.453592)
                  : Math.round(value)
                unitSuffix = isMetric ? ' kg' : ' lbs'
              } else if (unit === 'kilograms') {
                convertedValue = isMetric
                  ? Math.round(value)
                  : Math.round(value * 2.20462)
                unitSuffix = isMetric ? ' kg' : ' lbs'
              } else if (unit === 'fahrenheit') {
                convertedValue = isMetric
                  ? Math.round(((value - 32) * 5) / 9)
                  : Math.round(value)
                unitSuffix = isMetric ? '°C' : '°F'
              }

              if (convertedValue >= 1000) {
                // Use consistent formatting to avoid hydration mismatches
                const formatter = new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 0,
                })
                displayNumber = formatter.format(convertedValue) + unitSuffix
              } else {
                displayNumber = convertedValue.toString() + unitSuffix
              }
            } else {
              // Count Logic
              const roundedValue = Math.round(value)

              if (roundedValue >= 1000) {
                // Use consistent formatting to avoid hydration mismatches
                const formatter = new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                  minimumFractionDigits: 0,
                })
                displayNumber = formatter.format(roundedValue)
              } else {
                // Use consistent formatting to avoid hydration mismatches
                const formatter = new Intl.NumberFormat('en-US', {
                  maximumFractionDigits: 0,
                })
                displayNumber = formatter.format(roundedValue)
              }

              // Infer Label
              const lowerLabel = stat.label.toLowerCase()
              if (lowerLabel.includes('member')) unitText = ' Members'
              else if (lowerLabel.includes('community'))
                unitText = ' Communities'
              else if (lowerLabel.includes('rider')) unitText = ' Riders'
              else if (lowerLabel.includes('ride')) unitText = ' Rides'
              else if (lowerLabel.includes('country')) unitText = ' Countries'

              displayNumber = displayNumber + unitText
              unitText = ''
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="text-4xl md:text-5xl font-numeral tracking-tight">
                  <span className="opacity-80">{prefix}</span>
                  {displayNumber}
                  <span className="text-brand-primary">{suffix}</span>
                </div>
                <p
                  className={cn(
                    'text-sm md:text-base font-heading-semibold uppercase tracking-wider',
                    labelClass
                  )}
                >
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
