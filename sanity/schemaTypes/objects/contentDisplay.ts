import { defineField, defineType } from 'sanity'
import { siteOrExternalUrl } from '../../lib/fieldHelpers'

export default defineType({
  name: 'contentDisplay',
  title: 'Content Display',
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
    {
      name: 'layout',
      title: 'Layout Type',
      type: 'string',
      options: {
        list: [
          { title: 'Grid (Bento Box)', value: 'grid' },
          { title: 'Standard Carousel', value: 'carousel' },
          { title: 'Expanding Carousel', value: 'expandingCarousel' },
        ],
      },
      validation: rule => rule.required(),
      description:
        'Choose how content items are displayed. Grid for bento box layout, Standard Carousel for basic sliding, or Expanding Carousel for interactive expandable cards.',
    },
    {
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
    },
    {
      name: 'items',
      title: 'Content Items',
      type: 'array',
      of: [
        // Manual Grid Items
        {
          type: 'object',
          name: 'manualItem',
          title: 'Manual Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
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
            {
              name: 'subtitle',
              title: 'Subtitle',
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
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: rule => rule.required(),
            },
            {
              name: 'size',
              title: 'Grid Size',
              type: 'string',
              options: {
                list: [
                  { title: '1x1 (Square)', value: 'square' },
                  { title: '2x1 (Wide)', value: 'wide' },
                  { title: '1x2 (Tall)', value: 'tall' },
                  { title: '2x2 (Big)', value: 'big' },
                ],
              },
              initialValue: 'square',
              hidden: ({ parent }) => parent?.layout === 'carousel',
            },
            {
              name: 'theme',
              title: 'Text Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Light text (on dark images)', value: 'light' },
                  { title: 'Dark text (on light images)', value: 'dark' },
                ],
              },
              initialValue: 'light',
              hidden: ({ document }) => document?.layout === 'carousel',
            },
            {
              name: 'link',
              title: 'Link URL',
              type: 'url',
              description: 'A site path like /us/en/routes, or a full URL',
              validation: siteOrExternalUrl,
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'subtitle.en',
              media: 'image',
            },
          },
        },
        // Content References
        {
          type: 'object',
          name: 'contentReference',
          title: 'Content Reference',
          fields: [
            {
              name: 'content',
              title: 'Referenced Content',
              type: 'reference',
              to: [
                { type: 'campaign' },
                { type: 'feature' },
                { type: 'product' },
                { type: 'socialProof' },
              ],
              validation: rule => rule.required(),
            },
            {
              name: 'size',
              title: 'Grid Size',
              type: 'string',
              options: {
                list: [
                  { title: '1x1 (Square)', value: 'square' },
                  { title: '2x1 (Wide)', value: 'wide' },
                  { title: '1x2 (Tall)', value: 'tall' },
                  { title: '2x2 (Big)', value: 'big' },
                ],
              },
              initialValue: 'square',
              hidden: ({ document }) => document?.layout === 'carousel',
            },
            {
              name: 'theme',
              title: 'Text Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Light text (on dark images)', value: 'light' },
                  { title: 'Dark text (on light images)', value: 'dark' },
                ],
              },
              initialValue: 'light',
              hidden: ({ document }) => document?.layout === 'carousel',
            },
            {
              name: 'overrideTitle',
              title: 'Override Title',
              type: 'object',
              description: 'Optional: Override the content title',
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
            },
            {
              name: 'overrideSubtitle',
              title: 'Override Subtitle',
              type: 'object',
              description: 'Optional: Override the content subtitle/status',
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
            },
          ],
          preview: {
            select: {
              title: 'content.title.en',
              overrideTitle: 'overrideTitle.en',
              media: 'content.image',
              contentType: 'content._type',
            },
            prepare(selection) {
              const { title, overrideTitle, contentType, media } = selection
              return {
                title: overrideTitle || title || 'Referenced Content',
                subtitle: `${contentType || 'content'} reference`,
                media,
              }
            },
          },
        },
        // Carousel Items
        {
          type: 'object',
          name: 'carouselItem',
          title: 'Carousel Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
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
            {
              name: 'thumbnail',
              title: 'Thumbnail Image',
              type: 'image',
              options: { hotspot: true },
              validation: rule => rule.required(),
            },
            {
              name: 'videoUrl',
              title: 'Video URL',
              type: 'url',
              description: 'Optional video that plays on hover',
            },
            {
              name: 'overlayHeading',
              title: 'Overlay Heading',
              type: 'object',
              description: 'Optional different heading for the overlay modal',
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
            },
            {
              name: 'content',
              title: 'Overlay Content',
              type: 'object',
              fields: [
                {
                  name: 'en',
                  title: 'English (Primary)',
                  type: 'array',
                  of: [{ type: 'block' }],
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'array',
                  of: [{ type: 'block' }],
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'fr',
                  title: 'French',
                  type: 'array',
                  of: [{ type: 'block' }],
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'de',
                  title: 'German',
                  type: 'array',
                  of: [{ type: 'block' }],
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
                {
                  name: 'ja',
                  title: 'Japanese',
                  type: 'array',
                  of: [{ type: 'block' }],
                  hidden: ({ document }) => !document?.showTranslationFields,
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'overlayHeading.en',
              media: 'thumbnail',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Carousel Item',
                subtitle: subtitle || 'Interactive item',
                media,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      layout: 'layout',
      heading: 'heading.en',
      itemCount: 'items.length',
    },
    prepare(selection) {
      const { layout, heading, itemCount } = selection
      return {
        title: heading || `${layout} Display`,
        subtitle: `${itemCount || 0} items • ${layout} layout`,
      }
    },
  },
})
