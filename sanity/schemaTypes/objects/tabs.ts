import { defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

export default defineType({
  name: 'tabs',
  title: 'Feature / Benefit Tabs',
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
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Tab Content',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Tab',
          fields: [
            // 1. The Label Users Click
            {
              name: 'tabLabel',
              type: 'string',
              title: 'Tab Label (Clickable)',
            },

            // 2. The Content Source
            {
              name: 'content',
              title: 'Linked Content',
              type: 'reference',
              // They can pick a Feature OR a Benefit!
              to: [{ type: 'feature' }, { type: 'benefit' }],
            },

            // 3. Optional Override (The "Just for this page" image)
            {
              name: 'customImage',
              title: 'Override Image (Optional)',
              type: 'image',
              description:
                'Leave blank to use the image from the Feature/Benefit document.',
            },
          ],
          preview: {
            select: { title: 'tabLabel', subtitle: 'content.title' },
          },
        },
      ],
    }),
  ],
})
