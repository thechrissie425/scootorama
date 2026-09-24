import { defineField, defineType } from 'sanity'
import { CreditCardIcon, DocumentTextIcon } from '@sanity/icons'

export default defineType({
  name: 'pricingBlock',
  title: 'Pricing Section',
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
      name: 'title',
      title: 'Section Title',
      type: 'object',
      validation: rule => rule.required(),
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'Choose Your Plan',
          validation: rule => rule.required(),
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
    // 1. THE LAYOUT SWITCH
    defineField({
      name: 'layoutVariant',
      title: 'Layout Design',
      type: 'string',
      options: {
        list: [
          { title: 'Marketing Cards (Visual)', value: 'cards' },
          { title: 'Comparison Table (Detailed)', value: 'table' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
    }),
    defineField({
      name: 'tiers',
      title: 'Plans to Display',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pricingTier' }] }],
      validation: rule =>
        rule.min(1).error('Select at least one pricing tier.'),
    }),
  ],

  // 2. THE VISUAL PREVIEW
  preview: {
    select: {
      title: 'title.en',
      variant: 'layoutVariant',
      tier0: 'tiers.0.title.en',
      tier1: 'tiers.1.title.en',
    },
    // TypeScript now knows these are generic values, but we can cast if needed
    prepare({ title, variant, tier0, tier1 }) {
      const tiersList = [tier0, tier1].filter(Boolean).join(', ')
      const subtitle =
        variant === 'table'
          ? `Table View • ${tiersList || 'No tiers selected'}...`
          : `Card View • ${tiersList || 'No tiers selected'}...`

      return {
        title: title || 'Untitled Pricing Section',
        subtitle: subtitle,
        // Dynamic Icon based on the variant selected
        media: variant === 'table' ? DocumentTextIcon : CreditCardIcon,
      }
    },
  },
})
