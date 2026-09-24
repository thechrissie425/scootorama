import { definePlugin } from 'sanity'
import { DocumentActionComponent, DocumentActionsContext } from 'sanity'
import { TranslateIcon, CopyIcon } from '@sanity/icons'

// Auto-translation action for Sanity Studio
const AutoTranslateAction: DocumentActionComponent = props => {
  const { id, type, published } = props

  return {
    icon: TranslateIcon,
    label: 'Auto-translate',
    tone: 'primary',
    onHandle: async () => {
      try {
        // Call our translation API
        const response = await fetch('/api/auto-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: published?._id || id,
            fromLanguage: 'en',
            targetLanguages: ['de', 'fr', 'es', 'ja'],
          }),
        })

        const result = await response.json()

        if (result.success) {
          // Show success toast
          props.onComplete()
          alert(`✅ Created ${result.translations.length} translations!`)
        } else {
          alert(`❌ Translation failed: ${result.error}`)
        }
      } catch (error) {
        console.error('Translation action failed:', error)
        alert('❌ Translation failed. Check console for details.')
      }
    },
  }
}

// Batch translation action
const BatchTranslateAction: DocumentActionComponent = props => {
  const { type } = props

  return {
    icon: CopyIcon,
    label: 'Translate all of this type',
    tone: 'caution',
    onHandle: async () => {
      if (!confirm(`Translate all ${type} documents? This may take a while.`)) {
        return
      }

      try {
        const response = await fetch(
          `/api/auto-translate?type=${type}&batchSize=20`
        )
        const result = await response.json()

        if (result.success) {
          alert(`✅ Processed ${result.processedDocuments} ${type} documents!`)
          props.onComplete()
        } else {
          alert(`❌ Batch translation failed: ${result.error}`)
        }
      } catch (error) {
        console.error('Batch translation failed:', error)
        alert('❌ Batch translation failed. Check console for details.')
      }
    },
  }
}

// Plugin configuration
export const autoTranslatePlugin = definePlugin({
  name: 'auto-translate',
  document: {
    actions: (prev, context) => {
      // Only show translation actions for localizable content types
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

      if (!localizableTypes.includes(context.schemaType)) {
        return prev
      }

      return [...prev, AutoTranslateAction, BatchTranslateAction]
    },
  },
})
