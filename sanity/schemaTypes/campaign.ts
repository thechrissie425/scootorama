import { defineField, defineType } from 'sanity'
import { CalendarIcon, LinkIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  siteOrExternalUrl,
} from '../lib/fieldHelpers'

export default defineType({
  name: 'campaign',
  title: 'Campaign / Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    { name: 'overview', title: 'The Brochure Cover' },
    { name: 'specs', title: 'Event Specs (The FAQ)' },
    { name: 'rewards', title: 'Unlocks & Rewards' },
    { name: 'resources', title: 'Deep Dives & Links' },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      initialValue: false,
    }),

    // --- 1. THE COVER (Hub View) ---
    {
      ...localizedString('title', 'Campaign Name', {
        required: true,
        maxLength: 150,
      }),
      group: 'overview',
    },
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title.en' },
      group: 'overview',
      description:
        'Creates the unique "Sheet" URL (e.g. /events/scootorama-camp-2026)',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Campaign Status',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Upcoming (Tease)', value: 'upcoming' },
          { title: 'Active (Live)', value: 'active' },
          { title: 'Ending Soon (Urgency)', value: 'ending' },
          { title: 'Completed (Archive)', value: 'completed' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'dates',
      title: 'Event Duration',
      type: 'object',
      group: 'overview',
      fields: [
        { name: 'start', type: 'datetime', title: 'Starts' },
        { name: 'end', type: 'datetime', title: 'Ends' },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Cover Art',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
      description:
        'The visual hook. Think "Movie Poster" or "Car Brochure Front".',
      validation: rule => rule.required(),
    }),

    // --- BRANDING & THEME ---
    defineField({
      name: 'logo',
      title: 'Campaign Logo',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
      description:
        'Custom logo for this campaign (optional). Recommended: transparent PNG, min 400px wide.',
    }),
    defineField({
      name: 'primaryColor',
      title: 'Primary Brand Color',
      type: 'color',
      group: 'overview',
      description: 'Main accent color for this campaign (e.g., headers, CTAs)',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Brand Color',
      type: 'color',
      group: 'overview',
      description: 'Supporting accent color (e.g., badges, highlights)',
    }),

    // --- 2. THE SPECS (The "Quick Read" / FAQ Killer) ---
    {
      ...localizedText('hook', 'The Hook (1-Sentence Pitch)', {
        description:
          'Why should I care? (e.g. "The ultimate winter training camp.")',
        required: true,
        rows: 2,
        maxLength: 350,
      }),
      group: 'specs',
    },
    defineField({
      name: 'mechanics',
      title: 'How It Works (Bullet Points)',
      type: 'array',
      group: 'specs',
      of: [{ type: 'string' }],
      validation: rule =>
        rule.max(10).warning('Consider keeping mechanics list concise'),
      description:
        'Quick steps: "1. Register. 2. Ride 4 stages. 3. Unlock the kit."',
    }),

    // --- 3. THE CARROT (Incentives) ---
    defineField({
      name: 'unlocks',
      title: 'Unlocks / Rewards',
      type: 'array',
      group: 'rewards',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Item Name',
              type: 'object',
              validation: rule => rule.required(),
              fields: [
                {
                  name: 'en',
                  title: 'English (Primary)',
                  type: 'string',
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
            },
            { name: 'image', type: 'image', title: 'Item Image' },
            {
              name: 'description',
              title: 'Description',
              type: 'object',
              description: 'Brief description of the unlock item',
              fields: [
                {
                  name: 'en',
                  title: 'English (Primary)',
                  type: 'text',
                  rows: 2,
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'text',
                  rows: 2,
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'fr',
                  title: 'French',
                  type: 'text',
                  rows: 2,
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'de',
                  title: 'German',
                  type: 'text',
                  rows: 2,
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'ja',
                  title: 'Japanese',
                  type: 'text',
                  rows: 2,
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
              ],
            },
            {
              name: 'requirement',
              type: 'string',
              title: 'How to get (e.g. "Complete Stage 1")',
            },
          ],
        },
      ],
    }),

    // --- 4. ACTION ---
    defineField({
      name: 'faqs',
      title: 'Key FAQs',
      type: 'array',
      group: 'specs',
      description:
        'Select existing FAQ items or create new ones to feature in this campaign',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faqItem' }],
        },
      ],
      validation: rule =>
        rule.max(6).warning('Consider limiting to 6 key FAQs for better UX'),
    }),

    // --- CTA ACTION ---
    defineField({
      name: 'cta',
      title: 'Primary Call to Action',
      type: 'link',
      group: 'overview',
    }),

    // --- NEW: QUICK LINKS (The "Go Nuts" Valve) ---
    defineField({
      name: 'resources',
      title: 'Related Resources / Deep Dives',
      description:
        'Link out to blogs, rulebooks, or route pages instead of cluttering this page.',
      type: 'array',
      group: 'resources',
      of: [
        {
          type: 'object',
          icon: LinkIcon,
          fields: [
            { name: 'label', type: 'string', title: 'Link Label' },
            {
              name: 'url',
              type: 'url',
              title: 'Destination URL',
              validation: siteOrExternalUrl,
            },
            {
              name: 'type',
              type: 'string',
              options: {
                list: ['PDF', 'Blog', 'Route', 'Video'],
                layout: 'radio',
              },
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'type' },
          },
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      startDate: 'startDate',
    },
    prepare(selection) {
      const { title, slug, startDate } = selection
      const displayTitle =
        title?.en ||
        title?.es ||
        title?.fr ||
        title?.de ||
        title?.ja ||
        'Untitled Campaign'
      const subtitle = startDate
        ? `${startDate} • /${slug || 'no-slug'}`
        : `/${slug || 'no-slug'}`

      return {
        title: displayTitle,
        subtitle: subtitle,
      }
    },
  },
})
