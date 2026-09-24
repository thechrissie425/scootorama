import { ValidationContext } from 'sanity'
import type { Rule } from 'sanity'

/**
 * Advanced Translation Validation Utilities
 * Provides quality control for multilingual content
 */

// Translation completeness validation
export const requireTranslation =
  (languages: string[] = ['en-US', 'de-DE', 'fr-FR']) =>
  (Rule: Rule) => {
    return Rule.custom(
      (value: string | null | undefined, context: ValidationContext) => {
        const { document } = context
        if (!document) return true

        const currentLang = document.__i18n_lang as string
        const baseLanguage = languages[0] // First language is considered base
        const isBaseLanguage = currentLang === baseLanguage

        // Base language must have content
        if (isBaseLanguage && !value) {
          return `${baseLanguage} content is required`
        }

        // Validate that current language is in supported languages
        if (!languages.includes(currentLang)) {
          return `Language ${currentLang} is not in supported languages: ${languages.join(', ')}`
        }

        return true
      }
    )
  }

// Translation quality validation
export const validateTranslationQuality = () => (Rule: Rule) => {
  return Rule.custom((value: string, context: ValidationContext) => {
    if (!value) return true

    const issues: string[] = []

    // Check for common translation issues
    if (value.includes('TODO') || value.includes('TRANSLATE')) {
      issues.push('Contains translation placeholders')
    }

    // Check for untranslated English in non-English content
    const { document } = context
    if (document?.__i18n_lang !== 'en-US') {
      const commonEnglishWords = ['the', 'and', 'for', 'with', 'this', 'that']
      const hasEnglishWords = commonEnglishWords.some(word =>
        value.toLowerCase().includes(` ${word} `)
      )
      if (hasEnglishWords && value.length > 20) {
        issues.push('May contain untranslated English text')
      }
    }

    // Check minimum translation length (shouldn't be drastically shorter)
    if (document?.__i18n_base && value.length < 10) {
      issues.push('Translation appears too short')
    }

    return issues.length > 0
      ? `Translation quality issues: ${issues.join(', ')}`
      : true
  })
}

// Character limit validation with language-specific adjustments
export const validateTranslationLength =
  (maxLength: number) => (Rule: Rule) => {
    const languageMultipliers = {
      'en-US': 1.0,
      'de-DE': 1.3, // German tends to be longer
      'fr-FR': 1.2, // French slightly longer
    }

    return Rule.custom((value: string, context: ValidationContext) => {
      if (!value) return true

      const { document } = context
      const lang =
        (document?.__i18n_lang as keyof typeof languageMultipliers) || 'en-US'
      const adjustedMax = Math.floor(maxLength * languageMultipliers[lang])

      if (value.length > adjustedMax) {
        return `Content too long for ${lang} (${value.length}/${adjustedMax} characters)`
      }

      return true
    })
  }

// SEO slug validation for multilingual content
export const validateMultilingualSlug = () => (Rule: Rule) => {
  return Rule.custom(
    (
      value: { current?: string } | null | undefined,
      context: ValidationContext
    ) => {
      if (!value?.current) return true

      const slug = value.current as string
      const { document } = context
      const lang = document?.__i18n_lang as string

      // Language-specific slug validation
      if (lang === 'de-DE') {
        // German allows hyphens and umlauts in URLs
        if (!/^[a-z0-9äöüß-]+$/.test(slug)) {
          return 'German slug should only contain lowercase letters, numbers, umlauts, and hyphens'
        }
      } else if (lang === 'fr-FR') {
        // French allows accented characters
        if (!/^[a-z0-9àâäçéèêëïîôùûüÿ-]+$/.test(slug)) {
          return 'French slug should only contain lowercase letters, numbers, accented characters, and hyphens'
        }
      } else {
        // Standard English slug validation
        if (!/^[a-z0-9-]+$/.test(slug)) {
          return 'Slug should only contain lowercase letters, numbers, and hyphens'
        }
      }

      return true
    }
  )
}

// Translation status helper
interface TranslationDocument {
  __i18n_lang: string
  title?: string
  slug?: { current?: string }
  [key: string]: unknown
}

export const getTranslationStatus = (document: TranslationDocument) => {
  const requiredFields = ['title', 'slug']
  const lang = document.__i18n_lang

  const completedFields = requiredFields.filter(field => {
    const value = document[field]
    if (typeof value === 'string') return value.trim().length > 0
    if (
      typeof value === 'object' &&
      value &&
      'current' in value &&
      typeof value.current === 'string'
    )
      return value.current.trim().length > 0
    return false
  })

  return {
    language: lang,
    completed: completedFields.length,
    total: requiredFields.length,
    percentage: Math.round(
      (completedFields.length / requiredFields.length) * 100
    ),
    isComplete: completedFields.length === requiredFields.length,
  }
}
