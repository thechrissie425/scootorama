import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

/**
 * GOALS SECTION
 *
 * Interactive goal selector that displays fitness goals as clickable cards.
 * Users can explore goals and see the transformation (before/after states).
 * Uses shadcn Card and Badge components.
 */
export default defineType({
  name: 'goalsSection',
  title: 'Goals Section',
  type: 'object',
  icon: RocketIcon,

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
          initialValue: 'What do you want to achieve?',
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
            'Select a goal to see how Scootorama can help you get there.',
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
      title: 'Select Goals',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'fitnessGoal' }] }],
      validation: rule => rule.required().min(2).max(6),
      description: 'Select 2-6 goals to display',
    }),

    // --- DISPLAY ---
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Grid (3 columns)', value: 'grid-3' },
          { title: 'Grid (2 columns)', value: 'grid-2' },
          { title: 'Horizontal Scroll', value: 'scroll' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid-3',
    }),

    defineField({
      name: 'showTimeframe',
      title: 'Show Timeframe Badge',
      type: 'boolean',
      group: 'display',
      initialValue: true,
    }),

    defineField({
      name: 'showTransformation',
      title: 'Show Before/After States',
      type: 'boolean',
      group: 'display',
      description: 'Display transformation preview on hover/click',
      initialValue: true,
    }),

    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'object',
      group: 'display',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          initialValue: 'Start My Journey',
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
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Black', value: 'black' },
          { title: 'White', value: 'white' },
          { title: 'Gradient', value: 'gradient' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'black',
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
        title: title || 'Goals Section',
        subtitle: `${count} goal${count !== 1 ? 's' : ''} selected`,
      }
    },
  },
})
