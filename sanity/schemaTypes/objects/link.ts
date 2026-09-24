import { defineField, defineType } from 'sanity'
import { siteOrExternalUrl } from '../../lib/fieldHelpers'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'link',
  title: 'Link / CTA',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),
    // --- 1. VISUALS (Always Visible) ---
    defineField({
      name: 'label',
      title: 'Button Label',
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
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Orange)', value: 'primary' },
          { title: 'Secondary (Outlined)', value: 'secondary' },
          { title: 'Text Link (No Button)', value: 'link' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),

    // --- 2. LOGIC (The Controller) ---
    defineField({
      name: 'linkType',
      title: 'Destination Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Video Modal', value: 'videoModal' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
    }),

    // --- 3. DESTINATIONS (Conditional) ---
    // A. Internal Link
    defineField({
      name: 'internalLink',
      title: 'Select Page',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'post' },
        { type: 'campaign' },
        { type: 'membershipPage' },
        { type: 'product' },
      ],
      // Show if Type is 'internal' OR if Type is undefined (default state)
      hidden: ({ parent }) =>
        !!parent?.linkType && parent?.linkType !== 'internal',
    }),

    // B. External Link
    defineField({
      name: 'externalUrl',
      title: 'URL',
      type: 'url',
      validation: siteOrExternalUrl,
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab?',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),

    // C. Video Modal
    defineField({
      name: 'videoUrl',
      title: 'Video URL (YouTube/Vimeo)',
      description:
        'Paste the full link. This will open in a cinematic overlay.',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'videoModal',
    }),
  ],
  preview: {
    select: {
      title: 'label.en',
      subtitle: 'linkType',
      url: 'externalUrl',
      internal: 'internalLink.title',
    },
    prepare({ title, subtitle, url, internal }) {
      const target = subtitle === 'internal' ? internal : url
      return {
        title: title || 'No Label',
        subtitle: `[${subtitle || 'internal'}] ${target || ''}`,
        media: LinkIcon,
      }
    },
  },
})
