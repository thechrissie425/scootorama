import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  getLocalizedPreview,
} from '../lib/fieldHelpers'

/**
 * FITNESS GOAL SCHEMA
 *
 * Represents the "why" behind someone using Scootorama.
 * Goals connect to features (how we help), testimonials (proof), and personas (who).
 *
 * Examples:
 * - "Train for my first century ride"
 * - "Lose 30 pounds and feel great"
 * - "Stay connected with riding buddies"
 * - "Come back stronger after injury"
 * - "Beat my personal best"
 * - "Survive winter without losing fitness"
 *
 * Design principle: Goals are the emotional bridge between features and outcomes.
 * Features are "what you get", goals are "why it matters to you".
 */

export default defineType({
  name: 'fitnessGoal',
  title: 'Fitness Goal',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'emotional', title: 'Emotional Hook' },
    { name: 'connections', title: 'Connections' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────
    // LOCALIZATION TOGGLE
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      initialValue: false,
    }),

    // ─────────────────────────────────────────────────────────────
    // CONTENT - The goal itself
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('title', 'Goal Title', {
        required: true,
        maxLength: 60,
        description: 'Action-oriented goal, e.g., "Train for your first event"',
      }),
      group: 'content',
    },

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-safe identifier (e.g., "train-for-event")',
      options: {
        source: 'title.en',
        maxLength: 60,
      },
      validation: rule => rule.required(),
    }),

    {
      ...localizedText('description', 'Description', {
        rows: 3,
        description: 'Brief explanation of this goal (1-2 sentences)',
      }),
      group: 'content',
    },

    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      group: 'content',
      description: 'Select an icon from the brand icon set',
      options: {
        list: [
          { title: '🏁 Start Flag', value: 'start-flag' },
          { title: '🏆 Trophy', value: 'trophy' },
          { title: '🎯 Goals', value: 'goals' },
          { title: '⏱️ Stop Watch', value: 'stop-watch' },
          { title: '📊 Data Graphs', value: 'data-graphs' },
          { title: '💪 Workout', value: 'workout' },
          { title: '📋 Training Plan', value: 'training-plan' },
          { title: '⚡ Energy', value: 'energy' },
          { title: '🔌 Power', value: 'power' },
          { title: '👑 Crown', value: 'crown' },
          { title: '🎖️ Ribbon', value: 'ribbon' },
          { title: '🏅 Podium', value: 'podium' },
          { title: '🚩 Finish Line', value: 'finish-line' },
          { title: '☕ Coffee Stop', value: 'coffee-stop' },
          { title: '🌡️ Temperature', value: 'temperature' },
          { title: '⚖️ Weight', value: 'weight' },
          { title: '👥 Clubs', value: 'clubs' },
          { title: '👤 Followers', value: 'followers' },
          { title: '🔮 Crystal Ball', value: 'Crystal Ball' },
          { title: '🎮 Joystick', value: 'joystick' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'category',
      title: 'Goal Category',
      type: 'string',
      group: 'content',
      description: 'Primary category for grouping goals',
      options: {
        list: [
          { title: '🏆 Performance', value: 'performance' },
          { title: '❤️ Health & Wellness', value: 'health' },
          { title: '👥 Social & Community', value: 'social' },
          { title: '🎯 Event Preparation', value: 'event' },
          { title: '🔄 Recovery & Comeback', value: 'recovery' },
          { title: '🎮 Fun & Enjoyment', value: 'enjoyment' },
          { title: '📅 Habit Building', value: 'habit' },
          { title: '🌡️ Year-Round Maintenance', value: 'maintenance' },
        ],
        layout: 'dropdown',
      },
      validation: rule => rule.required(),
    }),

    // ─────────────────────────────────────────────────────────────
    // EMOTIONAL HOOK - The "feel good" messaging
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('emotionalHook', 'Emotional Hook', {
        maxLength: 100,
        description:
          'The feeling they\'ll achieve, e.g., "Cross that finish line feeling strong"',
      }),
      group: 'emotional',
    },

    {
      ...localizedText('successStory', 'Success Story Framing', {
        rows: 4,
        description:
          'How does someone describe achieving this goal? Paint the picture.',
      }),
      group: 'emotional',
    },

    {
      ...localizedText('beforeState', 'Before State', {
        rows: 3,
        description:
          'What life looks like BEFORE achieving this goal (pain points)',
      }),
      group: 'emotional',
    },

    {
      ...localizedText('afterState', 'After State', {
        rows: 3,
        description:
          'What life looks like AFTER achieving this goal (transformation)',
      }),
      group: 'emotional',
    },

    defineField({
      name: 'timeframe',
      title: 'Typical Timeframe',
      type: 'string',
      group: 'emotional',
      description: 'How long to achieve this goal?',
      options: {
        list: [
          { title: 'Days to Weeks', value: 'weeks' },
          { title: '1-3 Months', value: 'months_1_3' },
          { title: '3-6 Months', value: 'months_3_6' },
          { title: '6-12 Months', value: 'months_6_12' },
          { title: 'Ongoing', value: 'ongoing' },
        ],
      },
    }),

    // ─────────────────────────────────────────────────────────────
    // CONNECTIONS - What helps achieve this goal?
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'supportingFeatures',
      title: 'Supporting Features',
      type: 'array',
      group: 'connections',
      description: 'Scootorama features that help achieve this goal',
      of: [
        {
          type: 'reference',
          to: [{ type: 'feature' }],
        },
      ],
    }),

    defineField({
      name: 'socialProofExamples',
      title: 'Social Proof Examples',
      type: 'array',
      group: 'connections',
      description: 'Testimonials from people who achieved this goal',
      of: [
        {
          type: 'reference',
          to: [{ type: 'socialProof' }],
        },
      ],
    }),

    defineField({
      name: 'relatedRoutes',
      title: 'Related Routes',
      type: 'array',
      group: 'connections',
      description:
        'Routes that support this goal (e.g., training routes for event prep)',
      of: [
        {
          type: 'reference',
          to: [{ type: 'route' }],
        },
      ],
    }),

    defineField({
      name: 'relatedCampaigns',
      title: 'Related Campaigns',
      type: 'array',
      group: 'connections',
      description: 'Challenges or events aligned with this goal',
      of: [
        {
          type: 'reference',
          to: [{ type: 'campaign' }],
        },
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'connections',
      description: 'Additional taxonomy for filtering',
      of: [
        {
          type: 'reference',
          to: [{ type: 'tag' }],
        },
      ],
    }),

    // ─────────────────────────────────────────────────────────────
    // METADATA
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Toggle off to hide this goal from targeting options',
      initialValue: true,
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in lists (lower = first)',
      initialValue: 100,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      hook: 'emotionalHook',
      icon: 'icon',
      isActive: 'isActive',
    },
    prepare({ title, category, hook, icon, isActive }) {
      const categoryLabels: Record<string, string> = {
        performance: '🏆 Performance',
        health: '❤️ Health',
        social: '👥 Social',
        event: '🎯 Event',
        recovery: '🔄 Recovery',
        enjoyment: '🎮 Enjoyment',
        habit: '📅 Habit',
        maintenance: '🌡️ Maintenance',
      }

      // Map icon values to emojis for preview
      const iconEmojis: Record<string, string> = {
        'start-flag': '🏁',
        trophy: '🏆',
        goals: '🎯',
        'stop-watch': '⏱️',
        'data-graphs': '📊',
        workout: '💪',
        'training-plan': '📋',
        energy: '⚡',
        power: '🔌',
        crown: '👑',
        ribbon: '🎖️',
        podium: '🏅',
        'finish-line': '🚩',
        'coffee-stop': '☕',
        temperature: '🌡️',
        weight: '⚖️',
        clubs: '👥',
        followers: '👤',
        'Crystal Ball': '🔮',
        joystick: '🎮',
      }
      const iconEmoji = icon ? iconEmojis[icon] || '🎯' : '🎯'

      return {
        title: `${iconEmoji} ${isActive === false ? '⏸️ ' : ''}${getLocalizedPreview(title, 'Goal')}`,
        subtitle: [
          categoryLabels[category] || category,
          getLocalizedPreview(hook),
        ]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },

  orderings: [
    {
      title: 'Category',
      name: 'category',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
      ],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
})
