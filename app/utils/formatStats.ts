/**
 * Format statistics for clean display in StatsGrid
 * Handles large numbers with K/M abbreviations and proper rounding
 */
export function formatStatsNumber(
  smartValue: {
    value: number
    unit?: string
    prefix?: string
    suffix?: string
    notation?: 'standard' | 'compact'
  },
  locale: string = 'en-US'
): string {
  const { value, prefix = '', suffix = '', notation = 'compact' } = smartValue

  // For membership/count statistics, always use compact notation for large numbers
  let formattedNumber: string

  if (notation === 'compact' || value >= 1000) {
    // Use Intl.NumberFormat with compact notation for large numbers
    const formatter = new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    })
    formattedNumber = formatter.format(value)
  } else {
    // For smaller numbers, use standard formatting with proper rounding
    const formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })
    formattedNumber = formatter.format(value)
  }

  return `${prefix}${formattedNumber}${suffix}`
}

/**
 * Get the appropriate unit text for statistics
 * Returns localized unit labels for different stat types
 */
export function getStatUnit(
  smartValue: {
    value: number
    unit?: string
  },
  label: string,
  locale: string = 'en-US'
): string {
  const { unit = 'none' } = smartValue
  const lowerLabel = label.toLowerCase()

  // If it's a unit conversion type, let formatSmartNumber handle it
  if (
    ['miles', 'kilometers', 'pounds', 'kilograms', 'fahrenheit'].includes(unit)
  ) {
    return '' // formatSmartNumber will handle the unit
  }

  // For count-based statistics, infer unit from label
  if (lowerLabel.includes('member')) return 'members'
  if (lowerLabel.includes('community') || lowerLabel.includes('communities'))
    return 'communities'
  if (lowerLabel.includes('rider')) return 'riders'
  if (lowerLabel.includes('workout')) return 'workouts'
  if (lowerLabel.includes('ride')) return 'rides'
  if (lowerLabel.includes('user')) return 'users'
  if (lowerLabel.includes('country') || lowerLabel.includes('countries'))
    return 'countries'
  if (lowerLabel.includes('class')) return 'classes'

  // Default to empty string for pure numbers
  return ''
}

/**
 * Format complete stat with number and unit
 */
export function formatCompleteStats(
  smartValue: {
    value: number
    unit?: string
    prefix?: string
    suffix?: string
    notation?: 'standard' | 'compact'
  },
  label: string,
  locale: string = 'en-US'
): { number: string; unit: string } {
  const { unit = 'none' } = smartValue

  // For unit conversion types (distance/weight), use the existing formatSmartNumber
  if (
    ['miles', 'kilometers', 'pounds', 'kilograms', 'fahrenheit'].includes(unit)
  ) {
    // Import this dynamically to avoid circular dependency
    return {
      number: '', // Will be handled by formatSmartNumber in component
      unit: '',
    }
  }

  // For count-based statistics, use our new formatting
  const number = formatStatsNumber(smartValue, locale)
  const unitText = getStatUnit(smartValue, label, locale)

  return { number, unit: unitText }
}
