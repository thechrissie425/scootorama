import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'carousel',
  title: 'Carousel Section',
  type: 'object',
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),
    // --- LAYOUT OPTIONS ---
    defineField({
      name: 'layout',
      title: 'Carousel Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Carousel', value: 'carousel' },
          { title: 'Expanding Carousel', value: 'expandingCarousel' },
        ],
      },
      validation: rule => rule.required(),
      initialValue: 'carousel',
      description:
        'Choose between standard sliding carousel or interactive expanding cards.',
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
      title: 'Features',
      type: 'array',
      of: [
        // This is the Magic: We Reference the Feature Document
        {
          type: 'reference',
          to: [{ type: 'feature' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading.en',
    },
    prepare({ title }) {
      return {
        title: title || 'Carousel',
        subtitle: 'Linked Features',
      }
    },
  },
})
