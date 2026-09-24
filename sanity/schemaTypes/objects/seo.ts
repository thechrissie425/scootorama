import { defineField, defineType } from 'sanity'
import { SearchIcon } from '@sanity/icons'

export default defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  icon: SearchIcon,
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),
    // --- 1. META TITLES ---
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'object',
      description:
        'The title that appears in Google search results. Ideally 50-60 characters.',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          validation: Rule =>
            Rule.max(60).warning(
              'Longer titles may be truncated by search engines.'
            ),
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: Rule =>
            Rule.max(60).warning(
              'Longer titles may be truncated by search engines.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'fr',
          title: 'French',
          type: 'string',
          validation: Rule =>
            Rule.max(60).warning(
              'Longer titles may be truncated by search engines.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'de',
          title: 'German',
          type: 'string',
          validation: Rule =>
            Rule.max(60).warning(
              'Longer titles may be truncated by search engines.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'string',
          validation: Rule =>
            Rule.max(60).warning(
              'Longer titles may be truncated by search engines.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
      ],
    }),

    // --- 2. META DESCRIPTION ---
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'object',
      description:
        'The summary shown in search results. Ideally 150-160 characters.',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'text',
          rows: 3,
          validation: Rule =>
            Rule.max(160).warning(
              'Descriptions longer than 160 characters may be truncated.'
            ),
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'text',
          rows: 3,
          validation: Rule =>
            Rule.max(160).warning(
              'Descriptions longer than 160 characters may be truncated.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'fr',
          title: 'French',
          type: 'text',
          rows: 3,
          validation: Rule =>
            Rule.max(160).warning(
              'Descriptions longer than 160 characters may be truncated.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'de',
          title: 'German',
          type: 'text',
          rows: 3,
          validation: Rule =>
            Rule.max(160).warning(
              'Descriptions longer than 160 characters may be truncated.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'text',
          rows: 3,
          validation: Rule =>
            Rule.max(160).warning(
              'Descriptions longer than 160 characters may be truncated.'
            ),
          hidden: ({ document }) => !document?.showTranslationFields,
        },
      ],
    }),

    // --- 3. SOCIAL SHARE IMAGE ---
    defineField({
      name: 'shareImage',
      title: 'Social Share Image (OG Image)',
      type: 'image',
      description:
        'The image that appears when this page is shared on Slack, LinkedIn, or Twitter. (1200x630px recommended)',
      options: { hotspot: true },
    }),

    // --- 4. ADVANCED SETTINGS ---
    defineField({
      name: 'advanced',
      title: 'Advanced Settings',
      type: 'object',
      options: { collapsible: true, collapsed: true }, // Keep UI clean
      fields: [
        defineField({
          name: 'noIndex',
          title: 'Hide from Search Engines (noindex)',
          type: 'boolean',
          description:
            'Enable this to prevent Google from indexing this page (good for staging or landing pages).',
          initialValue: false,
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description:
            'Only use this if you need to point to a different "original" version of this page.',
        }),
      ],
    }),
  ],
})
