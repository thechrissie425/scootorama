import { defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'
import { localizedString, localizedBlock } from '../lib/fieldHelpers'

export default defineType({
  name: 'faqItem',
  title: 'FAQ Question',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      initialValue: false,
    }),

    { ...localizedString('question', 'Question', { required: true }) },

    { ...localizedBlock('answer', 'Answer', { required: true }) },
    // --- NEW: THE TAG RELATION ---
    defineField({
      name: 'tags',
      title: 'Related Topics',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description:
        'Tag this question (e.g. "Billing", "Hardware") to make it findable dynamically.',
    }),
  ],
  preview: {
    select: {
      question: 'question.en',
      tagTitle: 'tags.0.title.en',
    },
    prepare(selection) {
      const { question, tagTitle } = selection

      return {
        title: question || 'Untitled Question',
        subtitle: tagTitle ? `Tag: ${tagTitle}` : 'No tags',
        media: HelpCircleIcon,
      }
    },
  },
})
