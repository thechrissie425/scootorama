import { defineField, defineType } from 'sanity'
import { TransferIcon } from '@sanity/icons'

/**
 * TRANSFORMATION TABS
 *
 * Before/After comparison tabs using goals.
 * Shows the emotional journey from current state to desired outcome.
 * Uses shadcn Tabs component.
 */
export default defineType({
  name: 'transformationTabs',
  title: 'Transformation Tabs',
  type: 'object',
  icon: TransferIcon,

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'display', title: 'Display' },
  ],

  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields',
      initialValue: false,
    }),

    // --- CONTENT ---
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'Your Transformation Journey',
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
      title: 'Section Subheading',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'text',
          rows: 2,
          initialValue:
            'See where you are today vs. where Scootorama can take you.',
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
    }),

    defineField({
      name: 'goals',
      title: 'Select Goals for Tabs',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'fitnessGoal' }] }],
      validation: rule => rule.required().min(2).max(5),
      description:
        'Select 2-5 goals. Each becomes a tab showing before/after states.',
    }),

    // --- DISPLAY ---
    defineField({
      name: 'tabStyle',
      title: 'Tab Style',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Pills', value: 'pills' },
          { title: 'Underline', value: 'underline' },
          { title: 'Boxed', value: 'boxed' },
        ],
        layout: 'radio',
      },
      initialValue: 'pills',
    }),

    defineField({
      name: 'showBenefits',
      title: 'Show Related Benefits',
      type: 'boolean',
      group: 'display',
      description: 'Display benefits that support this goal transformation',
      initialValue: true,
    }),

    defineField({
      name: 'showFeatures',
      title: 'Show Enabling Features',
      type: 'boolean',
      group: 'display',
      description: 'Display features that enable this transformation',
      initialValue: false,
    }),

    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'Gray', value: 'gray' },
          { title: 'White', value: 'white' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'gray',
    }),
  ],

  preview: {
    select: {
      title: 'heading.en',
      goalCount: 'goals',
    },
    prepare({ title, goalCount }) {
      const count = goalCount?.length || 0
      return {
        title: title || 'Transformation Tabs',
        subtitle: `${count} transformation${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
