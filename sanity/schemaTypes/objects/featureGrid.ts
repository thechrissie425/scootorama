import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featureGrid',
  title: 'Bento Feature Grid',
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
      title: 'Grid Items',
      type: 'array',
      of: [
        // Manual Item (Current Implementation)
        {
          type: 'object',
          name: 'manualItem',
          title: 'Manual Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
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
            }),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'size',
              title: 'Card Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Standard Square (1x1)', value: 'square' },
                  { title: 'Wide Rectangle (2x1)', value: 'wide' },
                  { title: 'Tall Rectangle (1x2)', value: 'tall' },
                  { title: 'Big Box (2x2)', value: 'big' },
                ],
                layout: 'radio',
              },
              initialValue: 'square',
            }),
            defineField({
              name: 'theme',
              title: 'Text Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Light Text (Dark BG)', value: 'light' },
                  { title: 'Dark Text (Light BG)', value: 'dark' },
                ],
                layout: 'radio',
              },
              initialValue: 'light',
            }),
            defineField({
              name: 'link',
              title: 'Link URL',
              type: 'url',
            }),
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'size',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Manual Item',
                subtitle: `Manual • ${subtitle || 'square'}`,
                media,
              }
            },
          },
        },
        // Content Reference Item (New)
        {
          type: 'object',
          name: 'contentReference',
          title: 'Content Reference',
          fields: [
            defineField({
              name: 'content',
              title: 'Content Item',
              type: 'reference',
              to: [
                { type: 'campaign' },
                { type: 'feature' },
                // Add other content types here as you build them
              ],
              validation: rule => rule.required(),
            }),
            defineField({
              name: 'size',
              title: 'Card Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Standard Square (1x1)', value: 'square' },
                  { title: 'Wide Rectangle (2x1)', value: 'wide' },
                  { title: 'Tall Rectangle (1x2)', value: 'tall' },
                  { title: 'Big Box (2x2)', value: 'big' },
                ],
                layout: 'radio',
              },
              initialValue: 'square',
            }),
            defineField({
              name: 'theme',
              title: 'Text Theme',
              type: 'string',
              options: {
                list: [
                  { title: 'Light Text (Dark BG)', value: 'light' },
                  { title: 'Dark Text (Light BG)', value: 'dark' },
                ],
                layout: 'radio',
              },
              initialValue: 'light',
            }),
            defineField({
              name: 'overrideTitle',
              title: 'Override Title (Optional)',
              type: 'string',
              description: "Use a custom title instead of the content's title",
            }),
            defineField({
              name: 'overrideSubtitle',
              title: 'Override Subtitle (Optional)',
              type: 'string',
              description: 'Use a custom subtitle',
            }),
          ],
          preview: {
            select: {
              title: 'content.title.en',
              type: 'content._type',
              subtitle: 'size',
              media: 'content.image', // For all content types
              featureMedia: 'content.image', // For features
            },
            prepare({ title, type, subtitle, media, featureMedia }) {
              return {
                title: title || 'Referenced Item',
                subtitle: `${type || 'Content'} • ${subtitle || 'square'}`,
                media: media || featureMedia,
              }
            },
          },
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
        title: title || 'Bento Grid',
        subtitle: 'Feature Grid Section',
      }
    },
  },
})
