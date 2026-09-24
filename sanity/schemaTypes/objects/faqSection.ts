import { defineField, defineType } from 'sanity'
import { HelpCircleIcon, TagIcon } from '@sanity/icons' // Removed UnorderedListIcon

export default defineType({
  name: 'faqSection',
  title: 'FAQ Accordion',
  type: 'object',
  icon: HelpCircleIcon, // Default icon (used for Manual mode too)
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'Frequently Asked Questions',
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'fr',
          title: 'French',
          type: 'string',
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'de',
          title: 'German',
          type: 'string',
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'string',
          hidden: ({ document }) => !document?.showTranslationFields,
        },
      ],
    }),

    // --- 1. THE MODE SWITCH ---
    defineField({
      name: 'loadMode',
      title: 'How should we load questions?',
      type: 'string',
      options: {
        list: [
          { title: 'Manual Selection (Curated)', value: 'manual' },
          { title: 'Dynamic by Tag (Automatic)', value: 'tag' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),

    // --- 2. OPTION A: MANUAL PICKER ---
    defineField({
      name: 'questions',
      title: 'Select Questions',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faqItem' }] }],
      hidden: ({ parent }) => parent?.loadMode !== 'manual',
    }),

    // --- 3. OPTION B: TAG PICKER ---
    defineField({
      name: 'filterTag',
      title: 'Select Topic to Load',
      description:
        'The section will automatically show all questions with this tag.',
      type: 'reference',
      to: [{ type: 'tag' }],
      hidden: ({ parent }) => parent?.loadMode !== 'tag',
    }),

    // --- LIMITER ---
    defineField({
      name: 'limit',
      title: 'Max Questions to Show',
      type: 'number',
      initialValue: 5,
      hidden: ({ parent }) => parent?.loadMode !== 'tag',
    }),

    defineField({
      name: 'footerLink',
      title: 'Footer Link',
      type: 'link',
    }),
  ],
  preview: {
    select: {
      title: 'heading.en',
      mode: 'loadMode',
      tagName: 'filterTag.title',
      manualCount: 'questions',
    },
    prepare({ title, mode, tagName, manualCount }) {
      const subtitle =
        mode === 'tag'
          ? `Auto-load: ${tagName || 'No tag selected'}`
          : `Manual: ${manualCount ? Object.keys(manualCount).length : 0} items`

      return {
        title: title || 'FAQ Section',
        subtitle,
        // LOGIC UPDATE: Use HelpCircle (default) for manual, Tag for dynamic
        media: mode === 'tag' ? TagIcon : HelpCircleIcon,
      }
    },
  },
})
