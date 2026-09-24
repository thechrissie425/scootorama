import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productGrid',
  title: 'Product Grid',
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
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'object',
      description: 'Main heading for the product grid section',
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
      name: 'columns',
      title: 'Grid Columns (Desktop)',
      type: 'number',
      initialValue: 3,
      validation: rule => rule.min(2).max(4),
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: rule => rule.max(12).error('Maximum 12 products allowed'),
    }),
    defineField({
      name: 'showPricing',
      title: 'Show Pricing',
      type: 'boolean',
      initialValue: true,
      description: 'Display product pricing in the grid',
    }),
    defineField({
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'object',
      description: 'Text for product action buttons (localizable)',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'View Product',
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
  ],
  preview: {
    select: {
      title: 'heading.en',
      products: 'products',
      columns: 'columns',
    },
    prepare({ title, products, columns }) {
      const productCount = products?.length || 0
      return {
        title: title || 'Product Grid',
        subtitle: `${productCount} products • ${columns} columns`,
      }
    },
  },
})
