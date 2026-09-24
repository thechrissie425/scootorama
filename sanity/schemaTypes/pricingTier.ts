import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'
import { localizedString, localizedText } from '../lib/fieldHelpers'

export default defineType({
  name: 'pricingTier',
  title: 'Pricing Tier',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'details', title: 'Plan Details' },
    { name: 'pricing', title: 'Pricing & Currency' },
    { name: 'visuals', title: 'Visuals (Card View)' },
  ],
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      group: 'details',
      initialValue: false,
    }),
    // --- BASIC DETAILS ---
    {
      ...localizedString('title', 'Plan Name', { required: true }),
      group: 'details',
    },

    // --- 1. NEW CONNECTOR (Replaces includedFeatures) ---
    defineField({
      name: 'tierId',
      title: 'Tier Connection ID',
      type: 'string',
      group: 'details',
      description:
        'Connects this tier to features. Must match the Feature Availability checkboxes exactly.',
      validation: rule => rule.required(),
      options: {
        list: [
          // Matches your "Feature" schema options exactly
          { title: 'Clubhouse Pass', value: 'Clubhouse Pass' },
          { title: 'Deluxe Pass', value: 'Deluxe Pass' },
          { title: 'Family Pass', value: 'Family Pass' },
        ],
      },
    }),

    {
      ...localizedText('tagline', 'Short Description', {
        rows: 3,
        description:
          'Appears on the Card view (e.g., "Training plans, 1000+ workouts...")',
      }),
      group: 'details',
    },

    // --- PRICING (Supports your Currency Demo) ---
    defineField({
      name: 'prices',
      title: 'Regional Pricing',
      type: 'array',
      group: 'pricing',
      description:
        'Define specific prices per region (Zero Math, Zero Hardcoding)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'currency',
              type: 'string',
              title: 'Currency Code (e.g. USD, GBP)',
              initialValue: 'USD',
            },
            { name: 'monthlyPrice', type: 'number', title: 'Monthly Price' },
            { name: 'annualPrice', type: 'number', title: 'Annual Price' },
            {
              name: 'trialDays',
              type: 'number',
              title: 'Trial Duration (Days)',
              initialValue: 14,
            },
          ],
          preview: {
            select: {
              title: 'currency',
              price: 'monthlyPrice',
            },
            prepare({ title, price }) {
              return { title: `${title} - ${price}/mo` }
            },
          },
        },
      ],
    }),

    // --- VISUALS (For the Card View) ---
    {
      ...localizedString('badgeText', 'Promo Badge', {
        description: 'e.g., "Save up to 50%". Leave empty to hide.',
      }),
      group: 'visuals',
    },
    defineField({
      name: 'heroImage',
      title: 'Avatar / Hero Image',
      type: 'image',
      group: 'visuals',
      options: { hotspot: true },
    }),
    defineField({
      name: 'themeColor',
      title: 'Theme Color',
      type: 'string',
      group: 'visuals',
      options: {
        list: [
          { title: 'Hot Pink', value: '#D6117A' },
          { title: 'Turquoise', value: '#00858C' },
          { title: 'Grape', value: '#8B5CF6' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'cta',
      title: 'Primary Call to Action',
      type: 'link',
      group: 'visuals',
    }),
  ],

  // --- PREVIEW ---
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      tier: 'tierId',
    },
    prepare({ title, media, tier }) {
      const displayTitle =
        title?.en ||
        title?.es ||
        title?.fr ||
        title?.de ||
        title?.ja ||
        'Untitled'
      return {
        title: displayTitle,
        subtitle: tier ? `ID: ${tier}` : 'No ID Set',
        media: media,
      }
    },
  },
})
