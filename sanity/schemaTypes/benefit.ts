import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  getLocalizedPreview,
} from '../lib/fieldHelpers'

/**
 * BENEFIT SCHEMA (Enhanced)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT IS A BENEFIT?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * A Benefit is an OUTCOME or VALUE that users gain from Scootorama.
 * It answers: "Why should I care? What's in it for me?"
 *
 * Benefits connect emotionally. They're about transformation,
 * not functionality.
 *
 * Examples:
 * ✓ "Get faster, guaranteed" - outcome
 * ✓ "Never ride alone" - emotional value
 * ✓ "Train smarter, not harder" - transformation
 * ✓ "Stay motivated all winter" - solving a pain point
 * ✓ "Race anyone in the world" - possibility unlocked
 *
 * NOT a benefit (these are FEATURES):
 * ✗ "Over 1000 workouts" - that's a capability
 * ✗ "Group ride events" - that's a function
 * ✗ "Power analysis graphs" - that's a tool
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE FEATURE vs BENEFIT DISTINCTION:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * FEATURE: "Scootorama has structured workouts with Auto-Kick mode"
 * BENEFIT: "Train smarter with workouts that adapt to your fitness"
 *          ↑ (the FEATURE enables this BENEFIT)
 *
 * FEATURE: "Scootorama has group rides 24/7"
 * BENEFIT: "Never ride alone, even at 5am"
 *          ↑ (the FEATURE enables this BENEFIT)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHEN TO CREATE A BENEFIT:
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ask: "Does this describe what the user GAINS emotionally or practically?"
 * - Yes → Create a Benefit (and link it to the Feature that powers it)
 * - No (it's what the product does) → Create a Feature instead
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default defineType({
  name: 'benefit',
  title: 'Benefit',
  type: 'document',
  icon: StarIcon,

  groups: [
    { name: 'core', title: '📝 Message', default: true },
    { name: 'context', title: '🎯 Context' },
    { name: 'display', title: '🖼️ Display' },
  ],

  fields: [
    // ─────────────────────────────────────────────────────────────
    // CORE MESSAGE - The benefit statement
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('title', 'Benefit Headline', {
        required: true,
        maxLength: 50,
        description: 'Short, punchy benefit (e.g., "Never ride alone")',
      }),
      group: 'core',
    },

    {
      ...localizedText('description', 'Supporting Copy', {
        required: true,
        rows: 2,
        maxLength: 200,
        description: 'Expand on the headline with proof or details',
      }),
      group: 'core',
    },

    defineField({
      name: 'emotionalCategory',
      title: 'Emotional Category',
      type: 'string',
      group: 'core',
      description: 'What core desire does this benefit tap into?',
      options: {
        list: [
          { title: '🏆 Achievement', value: 'achievement' },
          { title: '👥 Belonging', value: 'belonging' },
          { title: '❤️ Health & Wellness', value: 'health' },
          { title: '⚡ Convenience', value: 'convenience' },
          { title: '🎯 Mastery', value: 'mastery' },
          { title: '🎉 Fun & Enjoyment', value: 'fun' },
          { title: '💪 Confidence', value: 'confidence' },
        ],
        layout: 'dropdown',
      },
      validation: rule => rule.required(),
    }),

    // ─────────────────────────────────────────────────────────────
    // CONTEXT - What powers this benefit / who cares
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'enabledByFeatures',
      title: 'Enabled By Features',
      type: 'array',
      group: 'context',
      description: 'Which features make this benefit possible?',
      of: [{ type: 'reference', to: [{ type: 'feature' }] }],
      validation: rule => rule.max(5),
    }),

    defineField({
      name: 'targetPersonas',
      title: 'Resonates With Personas',
      type: 'array',
      group: 'context',
      description: 'Which personas care most about this benefit?',
      of: [{ type: 'reference', to: [{ type: 'persona' }] }],
      validation: rule => rule.max(5),
    }),

    defineField({
      name: 'supportsGoals',
      title: 'Supports Goals',
      type: 'array',
      group: 'context',
      description: 'Which fitness goals does this benefit address?',
      of: [{ type: 'reference', to: [{ type: 'fitnessGoal' }] }],
      validation: rule => rule.max(5),
    }),

    defineField({
      name: 'availability',
      title: 'Available In Plans',
      type: 'array',
      group: 'context',
      of: [{ type: 'string' }],
      options: {
        layout: 'grid',
        list: [
          { title: 'Clubhouse Pass', value: 'Clubhouse Pass' },
          { title: 'Deluxe Pass', value: 'Deluxe Pass' },
          { title: 'Family Pass', value: 'Family Pass' },
        ],
      },
      description: 'Leave empty if benefit applies to all plans',
    }),

    // ─────────────────────────────────────────────────────────────
    // DISPLAY - Visual presentation
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      group: 'display',
      description: 'Visual icon representing this benefit',
    }),

    defineField({
      name: 'displayPriority',
      title: 'Display Priority',
      type: 'number',
      group: 'display',
      description: 'Higher = shown first (100 = top, 1 = bottom)',
      initialValue: 50,
      validation: rule => rule.min(1).max(100),
    }),

    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Standard (icon + text)', value: 'standard' },
          { title: 'Compact (text only)', value: 'compact' },
          { title: 'Hero (large, featured)', value: 'hero' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'standard',
    }),

    // ─────────────────────────────────────────────────────────────
    // METADATA
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
      description: 'Inactive benefits are hidden from all displays',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      emotionalCategory: 'emotionalCategory',
      media: 'icon',
      isActive: 'isActive',
      availability: 'availability',
    },
    prepare({ title, emotionalCategory, media, isActive, availability }) {
      const categoryEmoji: Record<string, string> = {
        achievement: '🏆',
        belonging: '👥',
        health: '❤️',
        convenience: '⚡',
        mastery: '🎯',
        fun: '🎉',
        confidence: '💪',
      }

      const plans = availability?.length
        ? ` • ${availability.length} plan${availability.length > 1 ? 's' : ''}`
        : ' • All plans'

      return {
        title: `${isActive === false ? '⏸️ ' : ''}${getLocalizedPreview(title, 'Benefit')}`,
        subtitle: `${categoryEmoji[emotionalCategory] || '✨'} ${emotionalCategory || 'No category'}${plans}`,
        media: media || StarIcon,
      }
    },
  },

  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [{ field: 'displayPriority', direction: 'desc' }],
    },
    {
      title: 'Emotional Category',
      name: 'emotionalCategory',
      by: [{ field: 'emotionalCategory', direction: 'asc' }],
    },
  ],
})
