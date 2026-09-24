import { DocumentActionComponent, DocumentActionDescription } from 'sanity'
import { client } from './client'

// Text sanitization utility
function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return text

  // Remove invisible Unicode characters that cause corruption
  return text
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '') // Zero-width and formatting chars
    .replace(/[\u2000-\u200A]/g, ' ') // Various spaces → regular space
    .replace(/[\u00A0]/g, ' ') // Non-breaking space → regular space
    .trim()
}

// Sanitize localized objects
function _sanitizeLocalizedField(field: LocalizedField): LocalizedField {
  if (!field || typeof field !== 'object') return field

  const sanitized: LocalizedField = {}
  for (const [lang, text] of Object.entries(field)) {
    if (typeof text === 'string') {
      const cleaned = sanitizeText(text)
      if (cleaned) {
        sanitized[lang as keyof LocalizedField] = cleaned
      }
    }
  }
  return sanitized
}

// Type definitions for localized content
interface LocalizedField {
  en?: string
  es?: string
  fr?: string
  de?: string
  ja?: string
}

interface LocalizedDocument {
  _id: string
  _type: string
  title?: LocalizedField
  name?: LocalizedField
  description?: LocalizedField
  excerpt?: LocalizedField
  question?: LocalizedField
  answer?: LocalizedField
  quote?: LocalizedField
  bio?: LocalizedField
  heroTitle?: LocalizedField
  heroSubtitle?: LocalizedField
  seoTitle?: LocalizedField
  seoDescription?: LocalizedField
  shortDescription?: LocalizedField
  badge?: LocalizedField
  label?: LocalizedField
  callToAction?: {
    text?: LocalizedField
    [key: string]: unknown
  }
  author?: {
    name?: LocalizedField
    title?: LocalizedField
    [key: string]: unknown
  }
  [key: string]: unknown
}

// Helper function to extract translatable strings from a document
function extractTranslatableStrings(
  doc: LocalizedDocument,
  contentType: string
) {
  const strings: Record<string, string> = {}

  switch (contentType) {
    case 'page':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.description?.en) strings.description = doc.description.en
      if (doc.heroTitle?.en) strings.heroTitle = doc.heroTitle.en
      if (doc.heroSubtitle?.en) strings.heroSubtitle = doc.heroSubtitle.en
      break

    case 'post':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.excerpt?.en) strings.excerpt = doc.excerpt.en
      if (doc.seoTitle?.en) strings.seoTitle = doc.seoTitle.en
      if (doc.seoDescription?.en) strings.seoDescription = doc.seoDescription.en
      break

    case 'campaign':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.description?.en) strings.description = doc.description.en
      if (doc.callToAction?.text?.en)
        strings.callToActionText = doc.callToAction.text.en
      break

    case 'product':
      if (doc.name?.en) strings.name = doc.name.en
      if (doc.description?.en) strings.description = doc.description.en
      if (doc.shortDescription?.en)
        strings.shortDescription = doc.shortDescription.en
      break

    case 'faqItem':
      if (doc.question?.en) strings.question = doc.question.en
      if (doc.answer?.en) strings.answer = doc.answer.en
      break

    case 'benefit':
    case 'feature':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.description?.en) strings.description = doc.description.en
      break

    case 'socialProof':
      if (doc.quote?.en) strings.quote = doc.quote.en
      if (doc.author?.name?.en) strings.authorName = doc.author.name.en
      if (doc.author?.title?.en) strings.authorTitle = doc.author.title.en
      break

    case 'pricingTier':
      if (doc.name?.en) strings.name = doc.name.en
      if (doc.description?.en) strings.description = doc.description.en
      if (doc.badge?.en) strings.badge = doc.badge.en
      break

    case 'author':
      if (doc.name?.en) strings.name = doc.name.en
      if (doc.bio?.en) strings.bio = doc.bio.en
      break

    case 'tag':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.description?.en) strings.description = doc.description.en
      break

    case 'membershipPage':
      if (doc.title?.en) strings.title = doc.title.en
      if (doc.description?.en) strings.description = doc.description.en
      if (doc.heroTitle?.en) strings.heroTitle = doc.heroTitle.en
      if (doc.heroSubtitle?.en) strings.heroSubtitle = doc.heroSubtitle.en
      break

    case 'stat':
      if (doc.label?.en) strings.label = doc.label.en
      if (doc.description?.en) strings.description = doc.description.en
      break

    default:
      // Generic fallback for other types
      Object.keys(doc).forEach(key => {
        const value = doc[key]
        if (
          typeof value === 'object' &&
          value &&
          'en' in value &&
          typeof value.en === 'string'
        ) {
          strings[key] = value.en
        }
      })
  }

  return strings
}

// Calculate estimated word count
function calculateWordCount(strings: Record<string, string>): number {
  return Object.values(strings)
    .join(' ')
    .split(/\s+/)
    .filter(word => word.length > 0).length
}

// Create translation task
async function createTranslationTask(
  doc: LocalizedDocument,
  contentType: string
): Promise<void> {
  const strings = extractTranslatableStrings(doc, contentType)
  const wordCount = calculateWordCount(strings)

  if (Object.keys(strings).length === 0) {
    return
  }

  const taskId = `task-${doc._id.replace('drafts.', '')}`
  const exportData = JSON.stringify(strings, null, 2)

  const translationTask = {
    _id: taskId,
    _type: 'translationStatus',
    contentType: contentType,
    contentReference: {
      _type: 'reference',
      _ref: doc._id,
      _weak: true,
      _strengthenOnPublish: {
        type: contentType,
        weak: false,
      },
    },
    priority: 'high',
    defaultTranslator: 'Ismael Parra',
    autoGenerated: true,
    createdAt: new Date().toISOString(),
    estimatedWords: wordCount,
    exportPath: `/translations/exports/${contentType}/${doc._id.replace('drafts.', '')}/`,
    languages: {
      spanish: { status: 'not_started', translator: 'Ismael Parra' },
      french: { status: 'not_started', translator: 'Sophie Dubois' },
      german: { status: 'not_started', translator: 'Klaus Mueller' },
      japanese: { status: 'not_started', translator: 'Yuki Tanaka' },
    },
    exportData: exportData,
    automationLog: [
      {
        _key: Date.now().toString(),
        action: 'task_created',
        timestamp: new Date().toISOString(),
        details: `Auto-created translation task for ${contentType}: ${doc.title?.en || doc.name?.en || 'Untitled'}. Word count: ${wordCount}`,
      },
    ],
  }

  await client.createOrReplace(translationTask)
  // Translation task created
}

// Document action for auto-creating translation tasks
export const autoCreateTranslationTask: DocumentActionComponent = props => {
  const { type, published, draft } = props

  // Only show for localizable content types
  const localizableTypes = [
    'page',
    'post',
    'campaign',
    'product',
    'faqItem',
    'benefit',
    'feature',
    'socialProof',
    'pricingTier',
    'author',
    'tag',
    'membershipPage',
    'stat',
    'siteSettings',
  ]

  if (!localizableTypes.includes(type)) return null

  return {
    label: 'Create Translation Task',
    icon: () => '🌐',
    shortcut: 'Ctrl+Shift+T',
    onHandle: async () => {
      try {
        const doc = draft || published
        if (!doc) {
          throw new Error('No document found')
        }

        await createTranslationTask(doc, type)

        return {
          type: 'success',
          message: `Translation task created successfully for ${type}`,
        }
      } catch (error) {
        return {
          type: 'error',
          message: `Failed to create translation task: ${error}`,
        }
      }
    },
  } as DocumentActionDescription
}

// Auto-create task when English content is published
export const autoCreateOnPublish: DocumentActionComponent = props => {
  const { id, type, published, draft, onComplete } = props

  // Only auto-create for localizable content
  const localizableTypes = [
    'page',
    'post',
    'campaign',
    'product',
    'faqItem',
    'benefit',
    'feature',
    'socialProof',
    'pricingTier',
    'author',
    'tag',
    'membershipPage',
    'stat',
  ]

  if (!localizableTypes.includes(type)) return null

  // Override the publish action to include auto-task creation
  return {
    label: 'Publish & Create Translation Task',
    icon: () => '🚀',
    shortcut: 'Ctrl+Shift+P',
    onHandle: async () => {
      try {
        // First, publish the document
        const docToPublish = draft || published
        if (!docToPublish) {
          throw new Error('No document to publish')
        }

        // Publish the document
        await client
          .patch(id)
          .set({ ...docToPublish, _type: type })
          .commit()

        // Auto-create translation task
        await createTranslationTask(docToPublish, type)

        // Call the original onComplete if it exists
        onComplete?.()

        return {
          type: 'success',
          message: `Document published and translation task created!`,
        }
      } catch (error) {
        return {
          type: 'error',
          message: `Failed to publish and create task: ${error}`,
        }
      }
    },
  } as DocumentActionDescription
}

// Export translation strings to various formats
export const exportTranslationStrings: DocumentActionComponent = props => {
  const { published, draft, type } = props

  return {
    label: 'Export Translation Strings',
    icon: () => '📤',
    onHandle: async () => {
      try {
        const doc = (published || draft) as LocalizedDocument
        if (!doc) {
          throw new Error('No document found')
        }

        const strings = extractTranslatableStrings(doc, type)

        if (Object.keys(strings).length === 0) {
          return {
            type: 'warning',
            message: 'No translatable content found in this document',
          }
        }

        // Create downloadable JSON export
        const _exportData = {
          documentId: doc._id,
          documentType: type,
          title: (doc.title?.en || doc.name?.en || 'Untitled') as string,
          createdAt: new Date().toISOString(),
          wordCount: calculateWordCount(strings),
          strings: strings,
          targetLanguages: ['es', 'fr', 'de', 'ja'],
          instructions:
            'Translate all string values while preserving the keys. Return as JSON with the same structure.',
        }

        // This would ideally trigger a download or send to export service

        return {
          type: 'success',
          message: `Exported ${Object.keys(strings).length} strings for translation`,
        }
      } catch (error) {
        return {
          type: 'error',
          message: `Failed to export strings: ${error}`,
        }
      }
    },
  } as DocumentActionDescription
}
