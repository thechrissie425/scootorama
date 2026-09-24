// utils/formatNumber.ts

interface SmartNumber {
  value: number
  unit?: string // Keeping string is safer if you add new units later
  notation?: string
}

export function formatSmartNumber(
  data: SmartNumber | null | undefined,
  locale: string
) {
  // 1. Safety Check: If data is missing (loading state), return empty
  if (!data || data.value === null || data.value === undefined) {
    return ''
  }

  // 2. Destructure with default values to prevent crashes
  let { value } = data
  const { unit = 'none', notation = 'standard' } = data

  let displayUnit: string | undefined = undefined

  // 3. DO THE MATH (Conversion Logic)
  // Check if the locale is Metric (Everything except US, Liberia, Myanmar)
  const isMetric = !['en-US', 'en-GB', 'mm-MM', 'lr-LR'].includes(locale)

  // DISTANCE: Miles -> Kilometers
  if (unit === 'miles' && isMetric) {
    value = value * 1.60934
    displayUnit = 'kilometer'
  } else if (unit === 'miles') {
    displayUnit = 'mile'
  }

  // DISTANCE: Kilometers -> Miles
  if (unit === 'kilometers' && !isMetric) {
    value = value * 0.621371
    displayUnit = 'mile'
  } else if (unit === 'kilometers') {
    displayUnit = 'kilometer'
  }

  // WEIGHT: Pounds -> Kilograms
  if (unit === 'pounds' && isMetric) {
    value = value * 0.453592
    displayUnit = 'kilogram'
  } else if (unit === 'pounds') {
    displayUnit = 'pound'
  }

  // 4. DO THE FORMATTING (Localization)
  try {
    return new Intl.NumberFormat(locale, {
      notation:
        (notation as Intl.NumberFormatOptions['notation']) || 'standard',
      // If we have a unit, use 'unit' style. Otherwise just decimal.
      style: displayUnit ? 'unit' : 'decimal',
      unit: displayUnit,
      maximumFractionDigits: 0, // Keep it clean (no decimals for big stats)
    }).format(value)
  } catch {
    // Fallback if the browser doesn't support a specific unit
    return value.toString()
  }
}
