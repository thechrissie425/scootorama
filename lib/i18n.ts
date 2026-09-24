// Global language configuration for the application
// This centralizes all language-related mappings and prevents inconsistencies

export interface LanguageConfig {
  code: string // Route parameter (en, de, fr)
  locale: string // Full locale (en-US, de-DE, fr-FR)
  name: string // Display name
  flag: string // Flag emoji or code
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    locale: 'en-US',
    name: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'de',
    locale: 'de-DE',
    name: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    code: 'fr',
    locale: 'fr-FR',
    name: 'Français',
    flag: '🇫🇷',
  },
  {
    code: 'es',
    locale: 'es-ES',
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'ja',
    locale: 'ja-JP',
    name: '日本語',
    flag: '🇯🇵',
  },
]

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0] // English

// Quick lookup maps
export const LANGUAGE_CODE_TO_LOCALE: Record<string, string> =
  Object.fromEntries(SUPPORTED_LANGUAGES.map(lang => [lang.code, lang.locale]))

export const LOCALE_TO_LANGUAGE_CODE: Record<string, string> =
  Object.fromEntries(SUPPORTED_LANGUAGES.map(lang => [lang.locale, lang.code]))

// Validation functions
export const isValidLanguageCode = (code: string): boolean =>
  SUPPORTED_LANGUAGES.some(lang => lang.code === code)

export const isValidLocale = (locale: string): boolean =>
  SUPPORTED_LANGUAGES.some(lang => lang.locale === locale)

// Helper functions
export const getLanguageByCode = (code: string): LanguageConfig | undefined =>
  SUPPORTED_LANGUAGES.find(lang => lang.code === code)

export const getLanguageByLocale = (
  locale: string
): LanguageConfig | undefined =>
  SUPPORTED_LANGUAGES.find(lang => lang.locale === locale)

export const getLocaleFromCode = (code: string): string =>
  LANGUAGE_CODE_TO_LOCALE[code] || DEFAULT_LANGUAGE.locale

export const getCodeFromLocale = (locale: string): string =>
  LOCALE_TO_LANGUAGE_CODE[locale] || DEFAULT_LANGUAGE.code

// For middleware usage
export const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map(lang => lang.locale)
export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(
  lang => lang.code
)

// Market/Region configuration
export interface MarketConfig {
  code: string // Route parameter (us, de, fr, es, jp)
  name: string // Display name
  languages: string[] // Available language codes for this market
  flag: string // Flag emoji or code
  currency: {
    code: string // ISO currency code (USD, EUR, JPY, etc.)
    symbol: string // Currency symbol ($, €, ¥, etc.)
    position: 'before' | 'after' // Symbol position relative to amount
  }
  measurements: {
    distance: 'km' | 'mi' // Kilometers or Miles
    speed: 'kmh' | 'mph' // km/h or mph
    weight: 'kg' | 'lbs' // Kilograms or Pounds
    temperature: 'celsius' | 'fahrenheit' // °C or °F
    power: 'watts' // Watts (universal)
  }
  numberFormat: {
    decimal: '.' | ',' // Decimal separator
    thousands: ',' | '.' | ' ' // Thousands separator
  }
}

export const SUPPORTED_MARKETS: MarketConfig[] = [
  {
    code: 'us',
    name: 'United States',
    languages: ['en', 'es'],
    flag: '🇺🇸',
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before',
    },
    measurements: {
      distance: 'mi',
      speed: 'mph',
      weight: 'lbs',
      temperature: 'fahrenheit',
      power: 'watts',
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
  {
    code: 'de',
    name: 'Germany',
    languages: ['de', 'en'],
    flag: '🇩🇪',
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
    measurements: {
      distance: 'km',
      speed: 'kmh',
      weight: 'kg',
      temperature: 'celsius',
      power: 'watts',
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  {
    code: 'fr',
    name: 'France',
    languages: ['fr', 'en'],
    flag: '🇫🇷',
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
    measurements: {
      distance: 'km',
      speed: 'kmh',
      weight: 'kg',
      temperature: 'celsius',
      power: 'watts',
    },
    numberFormat: {
      decimal: ',',
      thousands: ' ',
    },
  },
  {
    code: 'es',
    name: 'Spain',
    languages: ['es', 'en'],
    flag: '🇪🇸',
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after',
    },
    measurements: {
      distance: 'km',
      speed: 'kmh',
      weight: 'kg',
      temperature: 'celsius',
      power: 'watts',
    },
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    languages: ['en'],
    flag: '🇬🇧',
    currency: {
      code: 'GBP',
      symbol: '£',
      position: 'before',
    },
    measurements: {
      distance: 'mi',
      speed: 'mph',
      weight: 'kg',
      temperature: 'celsius',
      power: 'watts',
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
  {
    code: 'jp',
    name: 'Japan',
    languages: ['ja', 'en'],
    flag: '🇯🇵',
    currency: {
      code: 'JPY',
      symbol: '¥',
      position: 'before',
    },
    measurements: {
      distance: 'km',
      speed: 'kmh',
      weight: 'kg',
      temperature: 'celsius',
      power: 'watts',
    },
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
  },
]

export const DEFAULT_MARKET = SUPPORTED_MARKETS[0] // US

// Market helper functions
export const getMarketByCode = (code: string): MarketConfig | undefined =>
  SUPPORTED_MARKETS.find(market => market.code === code)

export const isValidMarketCode = (code: string): boolean =>
  SUPPORTED_MARKETS.some(market => market.code === code)

export const getAvailableLanguagesForMarket = (
  marketCode: string
): LanguageConfig[] => {
  const market = getMarketByCode(marketCode)
  if (!market) return [DEFAULT_LANGUAGE]

  return market.languages
    .map(langCode => getLanguageByCode(langCode))
    .filter((lang): lang is LanguageConfig => lang !== undefined)
}

// Generate hreflang alternates for SEO
// Returns object mapping locale codes to URLs
export const generateHreflangAlternates = (
  basePath: string = ''
): Record<string, string> => {
  const alternates: Record<string, string> = {}

  // Add all market/language combinations
  SUPPORTED_MARKETS.forEach(market => {
    market.languages.forEach(langCode => {
      const lang = getLanguageByCode(langCode)
      if (!lang) return

      // Build the URL path
      let path = `/${market.code}/${langCode}`
      if (basePath) {
        path += `/${basePath}`
      }

      // Use locale code for hreflang (e.g., en-US, de-DE)
      alternates[lang.locale] = path
    })
  })

  // Add x-default (US English)
  alternates['x-default'] = basePath ? `/${basePath}` : '/'

  return alternates
}

// Formatting utilities based on market configuration
export const formatCurrency = (
  amount: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { currency, numberFormat: _numberFormat } = market

  // Format the number according to market rules
  const formattedNumber = formatNumber(amount, marketCode, 2)

  // Position currency symbol
  if (currency.position === 'before') {
    return `${currency.symbol}${formattedNumber}`
  } else {
    return `${formattedNumber} ${currency.symbol}`
  }
}

export const formatNumber = (
  value: number,
  marketCode: string = DEFAULT_MARKET.code,
  decimalPlaces: number = 0
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }

  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { numberFormat } = market

  const parts = value.toFixed(decimalPlaces).split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Add thousands separators
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    numberFormat.thousands
  )

  if (decimalPlaces > 0 && decimalPart) {
    return `${formattedInteger}${numberFormat.decimal}${decimalPart}`
  }

  return formattedInteger
}

export const formatDistance = (
  distanceInKm: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { measurements } = market

  if (measurements.distance === 'mi') {
    const miles = distanceInKm * 0.621371
    return `${formatNumber(miles, marketCode, 1)} mi`
  }

  return `${formatNumber(distanceInKm, marketCode, 1)} km`
}

export const formatSpeed = (
  speedInKmh: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { measurements } = market

  if (measurements.speed === 'mph') {
    const mph = speedInKmh * 0.621371
    return `${formatNumber(mph, marketCode, 1)} mph`
  }

  return `${formatNumber(speedInKmh, marketCode, 1)} km/h`
}

export const formatWeight = (
  weightInKg: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { measurements } = market

  if (measurements.weight === 'lbs') {
    const pounds = weightInKg * 2.20462
    return `${formatNumber(pounds, marketCode, 1)} lbs`
  }

  return `${formatNumber(weightInKg, marketCode, 1)} kg`
}

export const formatTemperature = (
  tempInCelsius: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  const market = getMarketByCode(marketCode) || DEFAULT_MARKET
  const { measurements } = market

  if (measurements.temperature === 'fahrenheit') {
    const fahrenheit = (tempInCelsius * 9) / 5 + 32
    return `${formatNumber(fahrenheit, marketCode, 1)}°F`
  }

  return `${formatNumber(tempInCelsius, marketCode, 1)}°C`
}

export const formatPower = (
  watts: number,
  marketCode: string = DEFAULT_MARKET.code
): string => {
  return `${formatNumber(watts, marketCode, 0)}W`
}

// UI Translations
export const UI_TRANSLATIONS = {
  en: {
    buyNow: 'Buy Now',
    adding: 'Adding...',
    findRetailer: 'Find Retailer',
    addToCart: 'Add to Cart',
  },
  es: {
    buyNow: 'Comprar Ahora',
    adding: 'Agregando...',
    findRetailer: 'Buscar Minorista',
    addToCart: 'Agregar al Carrito',
  },
  fr: {
    buyNow: 'Acheter Maintenant',
    adding: 'Ajout...',
    findRetailer: 'Trouver un Revendeur',
    addToCart: 'Ajouter au Panier',
  },
  de: {
    buyNow: 'Jetzt Kaufen',
    adding: 'Wird hinzugefügt...',
    findRetailer: 'Händler Finden',
    addToCart: 'In den Warenkorb',
  },
  ja: {
    buyNow: '今すぐ購入',
    adding: '追加中...',
    findRetailer: '販売店を探す',
    addToCart: 'カートに追加',
  },
} as const

export type UITranslationKey = keyof typeof UI_TRANSLATIONS.en

export const getUITranslation = (
  key: UITranslationKey,
  languageCode: string = 'en'
): string => {
  const lang = languageCode as keyof typeof UI_TRANSLATIONS
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key]
}
