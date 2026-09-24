import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'socialProofSection',
  title: 'Social Proof / Quotes',
  type: 'object',
  icon: UsersIcon,
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
      title: 'Section Heading',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'Loved by millions',
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
    defineField({
      name: 'items',
      title: 'Select Quotes',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'socialProof' }] }],
      validation: rule => rule.required().min(1),
    }),
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (3-Up)', value: 'grid' },
          { title: 'Masonry (Staggered)', value: 'masonry' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {
      title: 'heading.en',
      items: 'items',
    },
    prepare({ title, items }) {
      return {
        title: title || 'Social Proof',
        subtitle: `${items?.length || 0} quotes selected`,
      }
    },
  },
})
