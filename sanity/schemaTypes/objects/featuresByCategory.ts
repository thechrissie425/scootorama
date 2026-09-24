import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

/**
 * FEATURES BY CATEGORY
 *
 * Tabbed feature browser organized by category.
 * Uses shadcn Tabs to filter, Card for feature display.
 */
export default defineType({
  name: 'featuresByCategory',
  title: 'Features by Category',
  type: 'object',
  icon: CogIcon,

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
          initialValue: 'Everything Scootorama Has to Offer',
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
            'Explore our features by category to find what matters most to you.',
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
      name: 'categories',
      title: 'Categories to Display',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🚴 Training & Workouts', value: 'training' },
          { title: '👥 Social & Community', value: 'social' },
          { title: '🏁 Racing & Events', value: 'racing' },
          { title: '🌍 Worlds & Routes', value: 'worlds' },
          { title: '📊 Analytics & Progress', value: 'analytics' },
          { title: '⚙️ Hardware & Integrations', value: 'hardware' },
          { title: '🎮 Gamification', value: 'gamification' },
        ],
      },
      initialValue: ['training', 'social', 'racing'],
      description: 'Select which categories to show as tabs',
    }),

    defineField({
      name: 'maxFeaturesPerCategory',
      title: 'Max Features per Category',
      type: 'number',
      group: 'content',
      validation: rule => rule.min(3).max(12),
      initialValue: 6,
    }),

    // --- DISPLAY ---
    defineField({
      name: 'cardLayout',
      title: 'Feature Card Layout',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Grid (3 columns)', value: 'grid-3' },
          { title: 'Grid (2 columns)', value: 'grid-2' },
          { title: 'List', value: 'list' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid-3',
    }),

    defineField({
      name: 'showImages',
      title: 'Show Feature Images',
      type: 'boolean',
      group: 'display',
      initialValue: true,
    }),

    defineField({
      name: 'showDescription',
      title: 'Show Feature Description',
      type: 'boolean',
      group: 'display',
      initialValue: true,
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
      initialValue: 'black',
    }),
  ],

  preview: {
    select: {
      title: 'heading.en',
      categories: 'categories',
    },
    prepare({ title, categories }) {
      const count = categories?.length || 0
      return {
        title: title || 'Features by Category',
        subtitle: `${count} categor${count !== 1 ? 'ies' : 'y'}`,
      }
    },
  },
})
