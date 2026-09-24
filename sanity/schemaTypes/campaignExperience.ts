import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'
import { localizedString, localizedText } from '../lib/fieldHelpers'

/**
 * Campaign Experience - A scroll-driven storytelling experience
 * Used for major launches like "Scootorama: Unlocked" for Deluxe Pass
 */
export default defineType({
  name: 'campaignExperience',
  title: 'Campaign Experience',
  type: 'document',
  icon: SparklesIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'scenes', title: 'Scenes' },
    { name: 'branding', title: 'Branding & Theme' },
    { name: 'xpSettings', title: 'XP Settings' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // --- CONTENT GROUP ---

    // Internal Title
    defineField({
      name: 'internalTitle',
      title: 'Internal Title',
      type: 'string',
      description:
        'For internal reference only (e.g., "Deluxe Pass Launch 2025")',
      group: 'content',
      validation: rule => rule.required(),
    }),

    // Slug
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description:
        'The URL path (e.g., "scootorama-unlocked" → /scootorama-unlocked)',
      options: {
        source: 'internalTitle',
        maxLength: 96,
      },
      group: 'content',
      validation: rule => rule.required(),
    }),

    // Localization Toggle
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this experience',
      initialValue: false,
      group: 'content',
    }),

    // Public Title
    {
      ...localizedString('title', 'Experience Title', {
        required: true,
        description: 'Public-facing title (e.g., "Scootorama: Unlocked")',
      }),
      group: 'content',
    },

    // Tagline
    {
      ...localizedString('tagline', 'Experience Tagline', {
        description: 'Short tagline (e.g., "Level Up Your Training")',
      }),
      group: 'content',
    },

    // Description
    {
      ...localizedText('description', 'Experience Description', {
        rows: 3,
        description: 'Brief description for SEO and sharing',
      }),
      group: 'content',
    },

    // --- SCENES GROUP ---

    defineField({
      name: 'scenes',
      title: 'Experience Scenes',
      type: 'array',
      of: [{ type: 'experienceScene' }],
      description:
        'Scenes that unlock as the user scrolls (ordered by XP threshold)',
      group: 'scenes',
      validation: rule =>
        rule.required().min(1).error('At least one scene is required'),
    }),

    // --- BRANDING GROUP ---

    defineField({
      name: 'takeoverTheme',
      title: 'Takeover Theme',
      type: 'reference',
      to: [{ type: 'takeoverTheme' }],
      description: 'Optional takeover theme for branded styling',
      group: 'branding',
    }),

    defineField({
      name: 'heroLogo',
      title: 'Hero Logo',
      type: 'image',
      description:
        'Logo displayed prominently in the experience (e.g., Deluxe Pass badge)',
      options: { hotspot: true },
      group: 'branding',
    }),

    defineField({
      name: 'themeColor',
      title: 'Theme Accent Color',
      type: 'string',
      description: 'Primary accent color for the experience (hex code)',
      initialValue: '#F85A17',
      group: 'branding',
    }),

    defineField({
      name: 'particleConfig',
      title: 'Particle Effects Configuration',
      type: 'object',
      group: 'branding',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Particles',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'style',
          title: 'Particle Style',
          type: 'string',
          options: {
            list: [
              { title: 'XP Orbs', value: 'orbs' },
              { title: 'Stars', value: 'stars' },
              { title: 'Confetti', value: 'confetti' },
              { title: 'Geometric', value: 'geometric' },
            ],
          },
          initialValue: 'orbs',
        },
        {
          name: 'colors',
          title: 'Particle Colors',
          type: 'array',
          of: [{ type: 'string' }],
          initialValue: ['#F85A17', '#FF8A50', '#FFB347'],
        },
        {
          name: 'density',
          title: 'Base Density (1-10)',
          type: 'number',
          initialValue: 5,
          validation: rule => rule.min(1).max(10),
        },
      ],
    }),

    // --- XP SETTINGS GROUP ---

    defineField({
      name: 'xpConfig',
      title: 'XP Configuration',
      type: 'object',
      group: 'xpSettings',
      fields: [
        {
          name: 'maxXP',
          title: 'Maximum XP',
          type: 'number',
          description: 'Total XP at 100% scroll (default: 10000)',
          initialValue: 10000,
          validation: rule => rule.required().min(1000),
        },
        {
          name: 'showXPCounter',
          title: 'Show XP Counter',
          type: 'boolean',
          description: 'Display XP counter overlay',
          initialValue: true,
        },
        {
          name: 'showProgressBar',
          title: 'Show Progress Bar',
          type: 'boolean',
          description: 'Display scroll progress bar',
          initialValue: true,
        },
        {
          name: 'progressBarPosition',
          title: 'Progress Bar Position',
          type: 'string',
          options: {
            list: [
              { title: 'Top', value: 'top' },
              { title: 'Bottom', value: 'bottom' },
              { title: 'Left', value: 'left' },
              { title: 'Right', value: 'right' },
            ],
          },
          initialValue: 'right',
          hidden: ({ parent }) => !parent?.showProgressBar,
        },
        {
          name: 'velocityMultiplier',
          title: 'Velocity Multiplier',
          type: 'number',
          description: 'How much scroll speed affects effects (1.0 = normal)',
          initialValue: 1.0,
          validation: rule => rule.min(0.1).max(3.0),
        },
      ],
    }),

    // Sticky Navigation
    defineField({
      name: 'navigation',
      title: 'Scene Navigation',
      type: 'object',
      group: 'xpSettings',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Scene Navigation',
          type: 'boolean',
          description: 'Show navigation dots/tabs for scenes',
          initialValue: true,
        },
        {
          name: 'style',
          title: 'Navigation Style',
          type: 'string',
          options: {
            list: [
              { title: 'Dots', value: 'dots' },
              { title: 'Scene Names', value: 'names' },
              { title: 'XP Markers', value: 'markers' },
            ],
          },
          initialValue: 'dots',
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'position',
          title: 'Position',
          type: 'string',
          options: {
            list: [
              { title: 'Right', value: 'right' },
              { title: 'Left', value: 'left' },
            ],
          },
          initialValue: 'right',
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
    }),

    // --- SEO GROUP ---

    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),

    defineField({
      name: 'shareImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image for social media sharing (1200x630 recommended)',
      options: { hotspot: true },
      group: 'seo',
    }),
  ],

  // --- PREVIEW ---
  preview: {
    select: {
      internalTitle: 'internalTitle',
      title: 'title',
      scenes: 'scenes',
      heroLogo: 'heroLogo',
    },
    prepare({ internalTitle, title, scenes, heroLogo }) {
      const displayTitle = internalTitle || title?.en || 'Untitled Experience'
      const sceneCount = scenes?.length || 0
      return {
        title: displayTitle,
        subtitle: `${sceneCount} scene${sceneCount !== 1 ? 's' : ''}`,
        media: heroLogo || SparklesIcon,
      }
    },
  },

  // --- ORDERINGS ---
  orderings: [
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'internalTitle', direction: 'asc' }],
    },
    {
      title: 'Recently Updated',
      name: 'updatedDesc',
      by: [{ field: '_updatedAt', direction: 'desc' }],
    },
  ],
})
