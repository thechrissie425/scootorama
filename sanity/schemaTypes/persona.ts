import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  getLocalizedPreview,
} from '../lib/fieldHelpers'

/**
 * PERSONA SCHEMA
 *
 * Represents distinct audience archetypes who use Scootorama.
 * Used to tag content, features, and testimonials for audience-aware delivery.
 *
 * Examples:
 * - "The Competitor" → serious racers, Saucer Cup regulars, structured training
 * - "The Social Rider" → group rides, community, fun over metrics
 * - "The Busy Parent" → time-efficient, flexibility, home convenience
 * - "The Comeback Kid" → injury recovery, weight loss, health goals
 * - "The Winter Warrior" → seasonal scooters, weather-independent training
 *
 * Design principle: Easy to add new personas without touching existing content.
 * Content is tagged TO personas, not the other way around.
 */

export default defineType({
  name: 'persona',
  title: 'Persona',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'attributes', title: 'Attributes' },
    { name: 'messaging', title: 'Messaging' },
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
    // IDENTITY - Who is this person?
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('name', 'Persona Name', {
        required: true,
        maxLength: 50,
        description: 'Internal archetype name, e.g., "The Competitor"',
      }),
      group: 'identity',
    },

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      description: 'URL-safe identifier for filtering (e.g., "competitor")',
      options: {
        source: 'name.en',
        maxLength: 50,
      },
      validation: rule => rule.required(),
    }),

    {
      ...localizedText('description', 'Short Description', {
        rows: 3,
        description: 'One-liner describing this persona (for internal use)',
      }),
      group: 'identity',
    },

    defineField({
      name: 'avatar',
      title: 'Avatar / Illustration',
      type: 'image',
      group: 'identity',
      options: { hotspot: true },
      description: 'Representative image for this persona archetype',
    }),

    // ─────────────────────────────────────────────────────────────
    // ATTRIBUTES - Psychographic & behavioral traits
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'experienceLevel',
      title: 'Experience Level',
      type: 'string',
      group: 'attributes',
      description: 'Primary scootering/fitness experience level',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Any Level', value: 'any' },
        ],
        layout: 'radio',
      },
      initialValue: 'any',
    }),

    defineField({
      name: 'primaryMotivation',
      title: 'Primary Motivation',
      type: 'string',
      group: 'attributes',
      description: 'What drives this persona to ride?',
      options: {
        list: [
          { title: 'Competition & Performance', value: 'performance' },
          { title: 'Health & Fitness', value: 'health' },
          { title: 'Social & Community', value: 'social' },
          { title: 'Convenience & Flexibility', value: 'convenience' },
          { title: 'Fun & Exploration', value: 'fun' },
          { title: 'Time Efficiency', value: 'efficiency' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'secondaryMotivations',
      title: 'Secondary Motivations',
      type: 'array',
      group: 'attributes',
      description: 'Additional motivations (select all that apply)',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Competition & Performance', value: 'competition' },
          { title: 'Health & Fitness', value: 'health' },
          { title: 'Social & Community', value: 'social' },
          { title: 'Convenience & Flexibility', value: 'convenience' },
          { title: 'Fun & Exploration', value: 'fun' },
          { title: 'Weather Independence', value: 'weather' },
          { title: 'Structured Training', value: 'training' },
          { title: 'Time Efficiency', value: 'efficiency' },
          { title: 'Mastery & Skill', value: 'mastery' },
          { title: 'Achievement & Progress', value: 'achievement' },
          { title: 'Weight Loss', value: 'weight_loss' },
          { title: 'Recovery & Injury Prevention', value: 'recovery' },
        ],
      },
    }),

    defineField({
      name: 'lifestageIndicators',
      title: 'Lifestage Indicators',
      type: 'array',
      group: 'attributes',
      description: 'Life circumstances that define this persona',
      of: [{ type: 'string' }],
      options: {
        list: [
          // Life Stage
          { title: 'New Parent', value: 'new_parent' },
          { title: 'Working Professional', value: 'professional' },
          { title: 'Retiree', value: 'retiree' },
          { title: 'Student', value: 'student' },
          { title: 'Family Commitments', value: 'family' },
          // Scootering Experience
          { title: 'Has Power Meter', value: 'has_power_meter' },
          { title: 'Follows Training Plan', value: 'training_plan' },
          { title: 'Races or Race Goals', value: 'racer' },
          { title: 'Owns High-End Equipment', value: 'high_end_gear' },
          { title: 'New to Scootering', value: 'new_to_scootering' },
          { title: 'Seasonal Scooter', value: 'seasonal' },
          // Fitness Context
          { title: 'Recovering from Injury', value: 'recovery' },
          { title: 'Training for Event', value: 'event_training' },
          { title: 'New to Fitness', value: 'new_to_fitness' },
          { title: 'Cross-Trains Regularly', value: 'cross_trains' },
          { title: 'Runner Primary', value: 'runner' },
          // Environment
          { title: 'Lives in Cold/Wet Climate', value: 'bad_weather' },
          { title: 'Limited Daylight Hours', value: 'limited_daylight' },
          { title: 'Road Safety Concerns', value: 'safety_concerns' },
          // Social
          { title: 'Active in Group Rides', value: 'group_rider' },
          { title: 'Part of a Scooter Club', value: 'club_member' },
          { title: 'Prefers Solo Riding', value: 'solo_rider' },
        ],
      },
    }),

    defineField({
      name: 'painPoints',
      title: 'Pain Points',
      type: 'array',
      group: 'attributes',
      description: 'Key frustrations or challenges this persona faces',
      of: [{ type: 'string' }],
    }),

    // ─────────────────────────────────────────────────────────────
    // MESSAGING - How do we speak to them?
    // ─────────────────────────────────────────────────────────────
    {
      ...localizedString('headline', 'Marketing Headline', {
        maxLength: 80,
        description: 'Persona-specific headline for targeted landing pages',
      }),
      group: 'messaging',
    },

    {
      ...localizedText('valueProposition', 'Value Proposition', {
        rows: 4,
        description:
          'Why Scootorama is perfect for this persona (2-3 sentences)',
      }),
      group: 'messaging',
    },

    {
      ...localizedString('ctaText', 'Call-to-Action Text', {
        maxLength: 40,
        description: 'Persona-specific CTA button text',
      }),
      group: 'messaging',
    },

    defineField({
      name: 'sampleQuote',
      title: 'Sample Quote',
      type: 'object',
      group: 'messaging',
      description: "Fictional quote representing this persona's voice",
      fields: [
        {
          name: 'en',
          title: 'English',
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

    // ─────────────────────────────────────────────────────────────
    // CONNECTIONS - What content relates to this persona?
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: 'primaryGoals',
      title: 'Primary Fitness Goals',
      type: 'array',
      group: 'connections',
      description: 'Connect this persona to their fitness goals',
      of: [
        {
          type: 'reference',
          to: [{ type: 'fitnessGoal' }],
        },
      ],
    }),

    defineField({
      name: 'recommendedFeatures',
      title: 'Recommended Features',
      type: 'array',
      group: 'connections',
      description: 'Features that resonate most with this persona',
      of: [
        {
          type: 'reference',
          to: [{ type: 'feature' }],
        },
      ],
      validation: rule => rule.max(10),
    }),

    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      group: 'connections',
      description: 'Products this persona might be interested in',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'connections',
      description: 'Additional taxonomy tags for filtering',
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
      description: 'Toggle off to hide this persona from targeting options',
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
      title: 'name',
      motivation: 'primaryMotivation',
      level: 'experienceLevel',
      media: 'avatar',
      isActive: 'isActive',
    },
    prepare({ title, motivation, level, media, isActive }) {
      const motivationLabels: Record<string, string> = {
        competition: '🏆 Competition',
        health: '❤️ Health',
        social: '👥 Social',
        convenience: '⚡ Convenience',
        fun: '🎮 Fun',
      }
      const levelLabels: Record<string, string> = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        any: 'Any Level',
      }

      return {
        title: `${isActive === false ? '⏸️ ' : ''}${getLocalizedPreview(title, 'Persona')}`,
        subtitle: [
          motivationLabels[motivation] || motivation,
          levelLabels[level] || level,
        ]
          .filter(Boolean)
          .join(' • '),
        media: media || UsersIcon,
      }
    },
  },

  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'name',
      by: [{ field: 'name.en', direction: 'asc' }],
    },
  ],
})
