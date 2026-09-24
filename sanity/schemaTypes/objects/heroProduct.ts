import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroProduct',
  title: 'Product Hero',
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
      name: 'eyebrow',
      title: 'Eyebrow / Badge',
      type: 'object',
      description: 'e.g. "The Ultimate Upgrade"',
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
      name: 'title',
      title: 'Product Name (Big Text)',
      type: 'object',
      description: 'e.g. "CRUISER DELUXE"',
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
      name: 'description',
      title: 'Short Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'text',
          rows: 3,
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'text',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'fr',
          title: 'French',
          type: 'text',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'de',
          title: 'German',
          type: 'text',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'text',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
        },
      ],
    }),
    // THE LAYERED ASSETS
    defineField({
      name: 'productImage',
      title: 'Product Cutout (Transparent PNG)',
      type: 'image',
      options: { hotspot: true },
      description:
        'High-res image with NO background. This sits in front of the text.',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Texture/Environment',
      type: 'image',
      options: { hotspot: true },
      description:
        'Abstract texture, smoke, or blurred room. Sits behind everything.',
    }),
    // LAYOUT CONTROL
    defineField({
      name: 'theme',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (Orange/Black)', value: 'dark' },
          { title: 'Light (White/Grey)', value: 'light' },
        ],
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'productImage',
    },
    prepare({ title, media }) {
      return {
        title: title?.en || title?.['en'] || 'Hero Product',
        subtitle: 'Product Hero Component',
        media,
      }
    },
  },
})
