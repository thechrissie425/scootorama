import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  getLocalizedPreview,
} from '../lib/fieldHelpers'

/**
 * FEATURE SCHEMA (Optimized)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT IS A FEATURE?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A Feature is a CAPABILITY or FUNCTION of the Scootorama platform.
 * It answers: "What can I DO with Scootorama?"
 *
 * Examples:
 * ✓ "Structured Workouts" - the workout library capability
 * ✓ "Group Rides" - the ability to ride with others
 * ✓ "Racing" - competitive events and leagues
 * ✓ "Training Plans" - guided training programs
 * ✓ "Honk-Honk Buttons" - hardware integration
 *
 * NOT a feature (these are BENEFITS):
 * ✗ "Get faster" - that's an outcome
 * ✗ "Never ride alone" - that's emotional value
 * ✗ "Train smarter" - that's a benefit
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHEN TO CREATE A NEW FEATURE:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ask: "Is this something the product DOES or HAS?"
 * - Yes → Create a Feature
 * - No (it's a feeling/outcome) → Create a Benefit instead
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  icon: SparklesIcon,

  groups: [
    { name: 'core', title: '📝 Core Info', default: true },
    { name: 'media', title: '🖼️ Visual' },
    { name: 'pricing', title: '💳 Plans' },
    { name: 'targeting', title: '🎯 Audience' },
  ],

  fields: [
    // ─────────────────────────────────────────────────────────────
    // CORE INFO - The essentials (always visible)
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('title', 'Feature Name', {
        required: true,
        maxLength: 60,
        description: 'Capability name, e.g., "Structured Workouts"',
      }),
      group: 'core',
    },

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'core',
      options: { source: 'title.en', maxLength: 60 },
      description: 'URL-safe identifier',
    }),

    {
      ...localizedText('description', 'Short Description', {
        required: true,
        rows: 2,
        maxLength: 160,
        description: 'One-liner explaining this feature (for cards, lists)',
      }),
      group: 'core',
    },

    {
      ...localizedText('longDescription', 'Detailed Description', {
        rows: 4,
        maxLength: 500,
        description: 'Fuller explanation (for dedicated feature pages)',
      }),
      group: 'core',
    },

    defineField({
      name: 'featureType',
      title: 'Feature Category',
      type: 'string',
      group: 'core',
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
        layout: 'dropdown',
      },
      validation: rule => rule.required(),
    }),

    // ─────────────────────────────────────────────────────────────
    // VISUAL - Media assets (collapsed by default)
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Feature Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      description:
        'Primary visual (16:9 recommended). Falls back to category icon if empty.',
    }),

    defineField({
      name: 'video',
      title: 'Video Loop (Optional)',
      type: 'file',
      group: 'media',
      options: { accept: 'video/mp4,video/webm' },
      description: 'Short loop for carousels (max 10MB, silent)',
    }),

    {
      ...localizedString('overlayHeading', 'Overlay Heading', {
        maxLength: 100,
        description: 'Optional: Override title in carousel expanded view',
      }),
      group: 'media',
    },

    defineField({
      name: 'content',
      title: 'Overlay Content',
      type: 'object',
      group: 'media',
      description: 'Rich text displayed when carousel item is expanded',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'fr',
          title: 'French',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'de',
          title: 'German',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
          hidden: ({ document }) => !document?.showTranslationFields,
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
          hidden: ({ document }) => !document?.showTranslationFields,
        },
      ],
    }),

    defineField({
      name: 'icon',
      title: 'Icon (Optional)',
      type: 'image',
      group: 'media',
      description: 'Small icon for lists and compact displays',
    }),

    // ─────────────────────────────────────────────────────────────
    // PLANS - Tier availability for pricing tables
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'availability',
      title: 'Included in Plans',
      type: 'array',
      group: 'pricing',
      of: [{ type: 'string' }],
      options: {
        layout: 'grid',
        list: [
          { title: 'Clubhouse Pass', value: 'Clubhouse Pass' },
          { title: 'Deluxe Pass', value: 'Deluxe Pass' },
          { title: 'Family Pass', value: 'Family Pass' },
        ],
      },
      description: 'Which subscription tiers include this feature?',
    }),

    defineField({
      name: 'isPremiumHighlight',
      title: 'Premium Highlight',
      type: 'boolean',
      group: 'pricing',
      description: 'Show "Plus" badge on this feature in marketing',
      initialValue: false,
    }),

    defineField({
      name: 'rank',
      title: 'Display Order',
      type: 'number',
      group: 'pricing',
      description: 'Sort order in pricing tables (1 = first)',
      initialValue: 50,
      hidden: ({ document }) =>
        !document?.availability ||
        !Array.isArray(document.availability) ||
        document.availability.length === 0,
    }),

    {
      ...localizedString('pricingLabel', 'Pricing Table Label', {
        maxLength: 60,
        description:
          'Short label for pricing table (defaults to title if empty)',
      }),
      group: 'pricing',
      hidden: ({ document }) =>
        !document?.availability ||
        !Array.isArray(document.availability) ||
        document.availability.length === 0,
    },

    {
      ...localizedText('tooltipDescription', 'Tooltip Text', {
        rows: 2,
        maxLength: 200,
        description: 'Help text shown on hover in pricing tables',
      }),
      group: 'pricing',
      hidden: ({ document }) =>
        !document?.availability ||
        !Array.isArray(document.availability) ||
        document.availability.length === 0,
    },

    // ─────────────────────────────────────────────────────────────
    // AUDIENCE TARGETING - Connect to personas and goals
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'targetPersonas',
      title: 'Target Personas',
      type: 'array',
      group: 'targeting',
      description: 'Which personas care most about this feature?',
      of: [{ type: 'reference', to: [{ type: 'persona' }] }],
      validation: rule => rule.max(5),
    }),

    defineField({
      name: 'supportsGoals',
      title: 'Supports Goals',
      type: 'array',
      group: 'targeting',
      description: 'Which fitness goals does this feature help achieve?',
      of: [{ type: 'reference', to: [{ type: 'fitnessGoal' }] }],
      validation: rule => rule.max(5),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'targeting',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      options: { layout: 'tags' },
    }),

    // ─────────────────────────────────────────────────────────────
    // METADATA (hidden until needed)
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Show Translations',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Inactive features are hidden from all displays',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      type: 'featureType',
      availability: 'availability',
      media: 'image',
      isActive: 'isActive',
    },
    prepare({ title, type, availability, media, isActive }) {
      const typeEmoji: Record<string, string> = {
        training: '🚴',
        social: '👥',
        racing: '🏁',
        worlds: '🌍',
        analytics: '📊',
        hardware: '⚙️',
        gamification: '🎮',
      }

      const plans = availability?.length
        ? availability.map((p: string) => p.replace(' Pass', '')).join(', ')
        : 'No plans'

      return {
        title: `${isActive === false ? '⏸️ ' : ''}${getLocalizedPreview(title, 'Feature')}`,
        subtitle: `${typeEmoji[type] || '✨'} ${plans}`,
        media: media || SparklesIcon,
      }
    },
  },

  orderings: [
    {
      title: 'Display Rank',
      name: 'rank',
      by: [{ field: 'rank', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'featureType',
      by: [{ field: 'featureType', direction: 'asc' }],
    },
  ],
})
