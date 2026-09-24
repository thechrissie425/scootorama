// GROQ query helpers for localized content
// Uses centralized language configuration from @/lib/i18n

import { LOCALE_TO_LANGUAGE_CODE } from '@/lib/i18n'

/**
 * Creates a GROQ coalesce pattern for localized strings/text/blocks
 * @param fieldName - The field name (e.g., 'title', 'description')
 * @returns GROQ coalesce pattern string
 */
export const localizedField = (fieldName: string): string => {
  // This pattern handles both localized objects and simple strings
  // For localized objects: tries field.en first, then fallback to plain field
  // For simple strings: field.en won't exist, so it uses the plain field
  return `coalesce(${fieldName}.en, ${fieldName})`
}

/**
 * Shorthand helper for common localized field patterns in GROQ
 * Usage: ${t('title')} instead of writing full coalesce
 */
export const t = (field: string): string => localizedField(field)

// Language mapping for URL params to field names (from centralized config)
export const LANGUAGE_FIELD_MAP = LOCALE_TO_LANGUAGE_CODE
export const LOCALIZED_FIELDS = {
  title: t('title'),
  description: t('description'),
  eyebrow: t('eyebrow'),
  subtitle: t('subtitle'),
  label: t('label'),
  quote: t('quote'),
  author: t('author'),
  role: t('role'),
} as const
