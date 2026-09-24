import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'
import { localizedString } from '../lib/fieldHelpers'

export default defineType({
  name: 'membershipPage',
  title: 'Membership Brochure (A24)',
  type: 'document',
  icon: StarIcon,
  groups: [
    { name: 'hero', title: 'Marquee Hero' },
    { name: 'config', title: 'Plan Configuration' },
    { name: 'stack', title: 'The Benefit Stack' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      group: 'hero',
      initialValue: false,
    }),
    { ...localizedString('title', 'Marquee Text'), group: 'hero' },

    // --- SLUG FOR NAVIGATION ---
    defineField({
      name: 'slug',
      title: 'Page URL Slug',
      type: 'slug',
      group: 'hero',
      options: {
        source: 'title.en',
        maxLength: 96,
        slugify: () => 'membership', // Force to always be 'membership'
      },
      validation: Rule => Rule.required(),
      description: 'URL path for this page (should be "membership")',
      initialValue: { current: 'membership' },
    }),

    // --- 1. PLAN CONFIGURATION (Added Household) ---
    defineField({
      name: 'standardTier',
      title: 'Standard Plan',
      type: 'reference',
      to: [{ type: 'pricingTier' }],
      group: 'config',
    }),
    defineField({
      name: 'plusTier',
      title: 'Plus Plan',
      type: 'reference',
      to: [{ type: 'pricingTier' }],
      group: 'config',
    }),
    defineField({
      name: 'householdTier',
      title: 'Household / Family Plan',
      type: 'reference',
      to: [{ type: 'pricingTier' }],
      group: 'config',
      description: 'The top-tier plan (e.g. Family Pass).',
    }),

    // --- 2. THE BENEFIT STACK (Simplified) ---
    defineField({
      name: 'benefits',
      title: 'Benefit Stack',
      type: 'array',
      group: 'stack',
      of: [
        {
          type: 'object',
          fields: [
            // A. The Logic (Source of Truth)
            defineField({
              name: 'feature',
              title: 'Linked Feature',
              type: 'reference',
              to: [{ type: 'feature' }],
              // WE RELY ON THIS DOCUMENT'S 'availability' ARRAY NOW
            }),

            // B. The Visuals (Specific to this page)
            defineField({
              name: 'media',
              type: 'image',
              title: 'Cinematic Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'layout',
              title: 'Card Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Full Width (Heroic)', value: 'full' },
                  { title: 'Half Width (Split)', value: 'half' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'feature.title.en',
              media: 'media',
              layout: 'layout',
            },
            prepare({ title, media, layout }) {
              return {
                title: title || 'Feature Benefit',
                subtitle: layout ? `${layout} layout` : 'Standard layout',
                media,
              }
            },
          },
        },
      ],
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'seo',
      group: 'seo',
      description:
        'Override meta title and description for search engines and social sharing.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      firstBenefitTitle: 'benefits.0.feature.title.en',
    },
    prepare(selection) {
      const { title, firstBenefitTitle } = selection
      const displayTitle =
        title?.en ||
        title?.es ||
        title?.fr ||
        title?.de ||
        title?.ja ||
        'Membership Page'
      return {
        title: displayTitle,
        subtitle: firstBenefitTitle
          ? `First benefit: ${firstBenefitTitle}`
          : 'No benefits yet',
        media: StarIcon,
      }
    },
  },
})
