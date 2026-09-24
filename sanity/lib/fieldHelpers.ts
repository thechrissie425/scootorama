import { defineField } from 'sanity'

/**
 * Helper to create localized string field object
 * Reduces duplication across all document schemas
 */
export const localizedString = (
  name: string,
  title: string,
  options: {
    required?: boolean
    maxLength?: number
    description?: string
  } = {}
) =>
  defineField({
    name,
    title,
    type: 'object',
    description: options.description,
    validation: options.required ? rule => rule.required() : undefined,
    fields: [
      {
        name: 'en',
        title: 'English (Primary)',
        type: 'string',
        validation: (rule: any) => {
          const r = options.required ? rule.required() : rule
          return options.maxLength ? r.max(options.maxLength) : r
        },
      },
      {
        name: 'es',
        title: 'Spanish',
        type: 'string',
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'fr',
        title: 'French',
        type: 'string',
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'de',
        title: 'German',
        type: 'string',
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'ja',
        title: 'Japanese',
        type: 'string',
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
    ],
  })

/**
 * Helper to create localized text (textarea) field object
 */
export const localizedText = (
  name: string,
  title: string,
  options: {
    required?: boolean
    maxLength?: number
    rows?: number
    description?: string
  } = {}
) =>
  defineField({
    name,
    title,
    type: 'object',
    description: options.description,
    validation: options.required ? rule => rule.required() : undefined,
    fields: [
      {
        name: 'en',
        title: 'English (Primary)',
        type: 'text',
        rows: options.rows || 3,
        validation: (rule: any) => {
          const r = options.required ? rule.required() : rule
          return options.maxLength ? r.max(options.maxLength) : r
        },
      },
      {
        name: 'es',
        title: 'Spanish',
        type: 'text',
        rows: options.rows || 3,
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'fr',
        title: 'French',
        type: 'text',
        rows: options.rows || 3,
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'de',
        title: 'German',
        type: 'text',
        rows: options.rows || 3,
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'ja',
        title: 'Japanese',
        type: 'text',
        rows: options.rows || 3,
        validation: options.maxLength
          ? (rule: any) => rule.max(options.maxLength)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
    ],
  })

/**
 * Helper to extract English text from localized field for preview
 */
export const getLocalizedPreview = (
  field: any,
  fallback: string = 'Untitled'
): string => {
  if (typeof field === 'string') return field
  return (
    field?.en || field?.es || field?.fr || field?.de || field?.ja || fallback
  )
}

/**
 * Helper to create localized block content (portable text) field object
 */
export const localizedBlock = (
  name: string,
  title: string,
  options: {
    required?: boolean
    maxBlocks?: number
    description?: string
  } = {}
) =>
  defineField({
    name,
    title,
    type: 'object',
    description: options.description,
    validation: options.required ? rule => rule.required() : undefined,
    fields: [
      {
        name: 'en',
        title: 'English (Primary)',
        type: 'array',
        of: [{ type: 'block' }],
        validation: (rule: any) => {
          const r = options.required ? rule.required() : rule
          return options.maxBlocks
            ? r
                .max(options.maxBlocks)
                .warning(
                  `Consider keeping content concise - ${options.maxBlocks} blocks max recommended`
                )
            : r
        },
      },
      {
        name: 'es',
        title: 'Spanish',
        type: 'array',
        of: [{ type: 'block' }],
        validation: options.maxBlocks
          ? (rule: any) => rule.max(options.maxBlocks)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'fr',
        title: 'French',
        type: 'array',
        of: [{ type: 'block' }],
        validation: options.maxBlocks
          ? (rule: any) => rule.max(options.maxBlocks)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'de',
        title: 'German',
        type: 'array',
        of: [{ type: 'block' }],
        validation: options.maxBlocks
          ? (rule: any) => rule.max(options.maxBlocks)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
      {
        name: 'ja',
        title: 'Japanese',
        type: 'array',
        of: [{ type: 'block' }],
        validation: options.maxBlocks
          ? (rule: any) => rule.max(options.maxBlocks)
          : undefined,
        hidden: ({ document }: any) => !document?.showTranslationFields,
      },
    ],
  })
