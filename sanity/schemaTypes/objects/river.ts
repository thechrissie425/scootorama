import { defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

export default defineType({
  name: 'river',
  title: 'River (Zig-Zag)',
  type: 'object',
  icon: SplitVerticalIcon,
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
      name: 'subtitle',
      title: 'Section Subtitle',
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
    defineField({
      name: 'items',
      title: 'River Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'riverItem',
          title: 'Item',
          fields: [
            // 1. THE SWITCH
            defineField({
              name: 'source',
              title: 'Content Source',
              type: 'string',
              options: {
                list: [
                  { title: 'Use Existing Feature', value: 'reference' },
                  { title: 'Custom Content (One-off)', value: 'manual' },
                ],
                layout: 'radio',
              },
              initialValue: 'reference',
            }),

            // 2. PATH A: The Reference
            defineField({
              name: 'featureRef',
              title: 'Select Feature',
              type: 'reference',
              to: [{ type: 'feature' }], // Points to your EXISTING schema
              hidden: ({ parent }) => parent?.source !== 'reference',
            }),

            // 3. PATH B: Manual Fields
            defineField({
              name: 'title',
              title: 'Custom Title',
              type: 'object',
              hidden: ({ parent }) => parent?.source !== 'manual',
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
              name: 'description',
              title: 'Custom Description',
              type: 'object',
              hidden: ({ parent }) => parent?.source !== 'manual',
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
            defineField({
              name: 'image',
              title: 'Custom Image',
              type: 'image',
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.source !== 'manual',
            }),
            defineField({
              name: 'video',
              title: 'Custom Video',
              type: 'file',
              options: { accept: 'video/mp4' },
              hidden: ({ parent }) => parent?.source !== 'manual',
            }),

            // 4. LAYOUT OVERRIDE (Works for both)
            defineField({
              name: 'layout',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Auto (Zig-Zag)', value: 'auto' },
                  { title: 'Force Left', value: 'left' },
                  { title: 'Force Right', value: 'right' },
                ],
                layout: 'radio',
              },
              initialValue: 'auto',
            }),
          ],
          preview: {
            select: {
              source: 'source',
              manualTitle: 'title.en', // Access English version of localized string
              refTitle: 'featureRef.title.en', // Access English version of referenced feature title
              manualImage: 'image',
              refImage: 'featureRef.image', // Use 'image' instead of 'thumbnail'
            },
            prepare({ source, manualTitle, refTitle, manualImage, refImage }) {
              const isManual = source === 'manual'
              const title = isManual
                ? manualTitle || 'Untitled'
                : refTitle || 'Referenced Feature'
              return {
                title,
                subtitle: isManual ? '(Custom One-off)' : '(Existing Feature)',
                media: isManual ? manualImage : refImage,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading.en',
      itemCount: 'items',
    },
    prepare({ heading, itemCount }) {
      return {
        title: heading || 'River Section',
        subtitle: `${itemCount?.length || 0} items`,
      }
    },
  },
})
