'use client'

import { usePathname } from 'next/navigation'
import {
  formatCurrency,
  formatDistance,
  formatSpeed,
  formatWeight,
  formatTemperature,
  formatPower,
  formatNumber,
  getMarketByCode,
  DEFAULT_MARKET,
} from '@/lib/i18n'

/**
 * Hook for market-aware formatting based on current route
 * Automatically detects market from URL and provides formatting functions
 */
export function useMarketFormatting() {
  const pathname = usePathname()

  // Extract market from pathname
  function getCurrentMarket(): string {
    // Handle SSR case where pathname might not be available
    if (!pathname) {
      return DEFAULT_MARKET.code
    }

    const segments = pathname.split('/').filter(Boolean)

    // Check if path starts with market/language format
    if (
      segments.length >= 2 &&
      segments[0].length === 2 &&
      segments[1].length === 2
    ) {
      return segments[0]
    }

    // Default to US market for root-level paths
    return DEFAULT_MARKET.code
  }

  const currentMarket = getCurrentMarket()
  const marketConfig = getMarketByCode(currentMarket) || DEFAULT_MARKET

  return {
    // Current market information
    market: marketConfig,
    marketCode: currentMarket,

    // Formatting functions (automatically use current market)
    formatCurrency: (amount: number) => formatCurrency(amount, currentMarket),
    formatNumber: (value: number, decimalPlaces?: number) =>
      formatNumber(value, currentMarket, decimalPlaces),
    formatDistance: (distanceInKm: number) =>
      formatDistance(distanceInKm, currentMarket),
    formatSpeed: (speedInKmh: number) => formatSpeed(speedInKmh, currentMarket),
    formatWeight: (weightInKg: number) =>
      formatWeight(weightInKg, currentMarket),
    formatTemperature: (tempInCelsius: number) =>
      formatTemperature(tempInCelsius, currentMarket),
    formatPower: (watts: number) => formatPower(watts, currentMarket),

    // Market-specific settings for direct access
    currency: marketConfig.currency,
    measurements: marketConfig.measurements,
    numberFormat: marketConfig.numberFormat,
  }
}
