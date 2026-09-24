import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * BENEFITS SECTION
 *
 * A page block that displays a curated selection of benefits.
 * Content editors can:
 * - Choose specific benefits to display
 * - OR filter by persona/goal (auto-select matching benefits)
 * - Control layout and styling
 */
export default defineType({
  name: 'benefitsSection',
  title: 'Benefits Section',
  type: 'object',
  icon: StarIcon,

  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'filtering', title: 'Targeting' },
    { name: 'display', title: 'Display' },
  ],

  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
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
          initialValue: 'Why Scootorama?',
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
      name: 'selectionMode',
      title: 'Benefit Selection',
      type: 'string',
      group: 'content',
      description: 'Choose how to select benefits for this section',
      options: {
        list: [
          { title: 'Manual Selection', value: 'manual' },
          { title: 'Filter by Persona', value: 'persona' },
          { title: 'Filter by Goal', value: 'goal' },
          { title: 'Show All (by priority)', value: 'all' },
        ],
        layout: 'radio',
      },
      initialValue: 'manual',
    }),

    // Manual selection
    defineField({
      name: 'benefits',
      title: 'Select Benefits',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'benefit' }] }],
      hidden: ({ parent }) => parent?.selectionMode !== 'manual',
      validation: rule => rule.max(8),
    }),

    // --- FILTERING (for auto-selection modes) ---
    defineField({
      name: 'filterByPersona',
      title: 'Filter by Persona',
      type: 'reference',
      to: [{ type: 'persona' }],
      group: 'filtering',
      description: 'Show benefits that target this persona',
      hidden: ({ parent }) => parent?.selectionMode !== 'persona',
    }),

    defineField({
      name: 'filterByGoal',
      title: 'Filter by Goal',
      type: 'reference',
      to: [{ type: 'fitnessGoal' }],
      group: 'filtering',
      description: 'Show benefits that support this goal',
      hidden: ({ parent }) => parent?.selectionMode !== 'goal',
    }),

    defineField({
      name: 'maxItems',
      title: 'Maximum Benefits to Show',
      type: 'number',
      group: 'filtering',
      description: 'Limit number of benefits displayed (for filtered modes)',
      initialValue: 6,
      validation: rule => rule.min(1).max(12),
      hidden: ({ parent }) => parent?.selectionMode === 'manual',
    }),

    // --- DISPLAY ---
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Grid (3-Up)', value: 'grid' },
          { title: 'Grid (2-Up)', value: 'grid-2' },
          { title: 'Alternating (River)', value: 'alternating' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),

    defineField({
      name: 'showIcons',
      title: 'Show Benefit Icons',
      type: 'boolean',
      group: 'display',
      initialValue: true,
    }),

    defineField({
      name: 'showLinkedFeatures',
      title: 'Show Linked Features',
      type: 'boolean',
      group: 'display',
      description: 'Display the features that enable each benefit',
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
          { title: 'White', value: 'white' },
          { title: 'Grey', value: 'grey' },
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
      mode: 'selectionMode',
      benefitCount: 'benefits',
    },
    prepare({ title, mode, benefitCount }) {
      const count = benefitCount?.length || 0
      const subtitle =
        mode === 'manual'
          ? `${count} benefit${count !== 1 ? 's' : ''} selected`
          : `Mode: ${mode}`

      return {
        title: title || 'Benefits Section',
        subtitle,
      }
    },
  },
})
