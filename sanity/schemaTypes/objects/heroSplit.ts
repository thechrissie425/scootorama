import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSplit',
  title: 'Hero (Reality Breach)',
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
      title: 'Heading',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'RIDE THE WORLD.',
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
      name: 'subheading',
      title: 'Subheading',
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
    // VIDEO 1: The "Top Layer" (e.g., The Hardware/Rider - Black & White?)
    defineField({
      name: 'videoHardware',
      title: 'Hardware Video (Top Layer)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'The "Real World" view. Ideally moody or B&W.',
    }),
    // VIDEO 2: The "Bottom Layer" (e.g., The Game - Colorful)
    defineField({
      name: 'videoSoftware',
      title: 'Software Video (Reveal Layer)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'The "Game World" view revealed by the magic flashlight.',
    }),
  ],
  preview: {
    select: { title: 'heading.en' },
    prepare({ title }) {
      return {
        title: title || 'Reality Breach Hero',
        subtitle: 'Interactive Video',
      }
    },
  },
})
