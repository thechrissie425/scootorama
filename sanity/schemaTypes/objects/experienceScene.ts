import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'
import { localizedString, localizedText } from '../../lib/fieldHelpers'

/**
 * Experience Scene - A single scene within a campaign experience
 * Each scene unlocks at an XP threshold and contains unique content
 */
export default defineType({
  name: 'experienceScene',
  title: 'Experience Scene',
  type: 'object',
  icon: RocketIcon,
  fields: [
    // --- SCENE IDENTITY ---
    defineField({
      name: 'sceneId',
      title: 'Scene ID',
      type: 'string',
      description:
        'Unique identifier for this scene (e.g., "base-pass", "hardware")',
      validation: rule => rule.required(),
    }),

    // --- XP THRESHOLD ---
    defineField({
      name: 'xpThreshold',
      title: 'XP Threshold to Unlock',
      type: 'number',
      description: 'XP required to unlock this scene (0-10000)',
      initialValue: 0,
      validation: rule => rule.required().min(0).max(10000),
    }),

    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields',
      initialValue: false,
    }),

    // --- UNLOCK MESSAGE ---
    {
      ...localizedString('unlockMessage', 'Unlock Message', {
        description:
          'Text shown when scene unlocks (e.g., "HARDWARE UNLOCKED")',
        maxLength: 50,
      }),
    },

    // --- HEADLINE ---
    {
      ...localizedString('headline', 'Scene Headline', {
        required: true,
        description: 'Large display headline for the scene',
      }),
    },

    // --- SUBHEADLINE ---
    {
      ...localizedString('subheadline', 'Scene Subheadline', {
        description: 'Secondary headline text',
      }),
    },

    // --- DESCRIPTION ---
    {
      ...localizedText('description', 'Scene Description', {
        rows: 3,
        description: 'Brief explanatory text for this scene',
      }),
    },

    // --- BACKGROUND ---
    defineField({
      name: 'background',
      title: 'Background',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Background Type',
          type: 'string',
          options: {
            list: [
              { title: 'Video', value: 'video' },
              { title: 'Image', value: 'image' },
              { title: 'Gradient', value: 'gradient' },
            ],
            layout: 'radio',
          },
          initialValue: 'gradient',
        },
        {
          name: 'video',
          title: 'Background Video',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
          hidden: ({ parent }) => parent?.type !== 'video',
        },
        {
          name: 'image',
          title: 'Background Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.type !== 'image',
        },
        {
          name: 'gradient',
          title: 'Gradient',
          type: 'string',
          description:
            'CSS gradient (e.g., "linear-gradient(135deg, #000 0%, #1a1a1a 100%)")',
          hidden: ({ parent }) => parent?.type !== 'gradient',
          initialValue: 'linear-gradient(135deg, #1E1E23 0%, #2C2C33 100%)',
        },
        {
          name: 'overlayOpacity',
          title: 'Dark Overlay Opacity',
          type: 'number',
          description: '0-100 (higher = darker)',
          initialValue: 40,
          validation: rule => rule.min(0).max(100),
        },
      ],
    }),

    // --- FEATURED CONTENT ---
    defineField({
      name: 'featuredProduct',
      title: 'Featured Product',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Optional product to feature in this scene',
    }),

    defineField({
      name: 'features',
      title: 'Scene Features',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'feature' }] }],
      description: 'Features to display in this scene',
    }),

    defineField({
      name: 'benefits',
      title: 'Scene Benefits',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'benefit' }] }],
      description: 'Benefits to display in this scene',
    }),

    // --- PRICING TIER (for Premium scene) ---
    defineField({
      name: 'pricingTiers',
      title: 'Pricing Tiers',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'pricingTier' }] }],
      description:
        'Pricing tiers to display (for subscription comparison scenes)',
    }),

    // --- VISUAL EFFECTS ---
    defineField({
      name: 'effects',
      title: 'Visual Effects',
      type: 'object',
      fields: [
        {
          name: 'confetti',
          title: 'Enable Confetti on Unlock',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'confettiColors',
          title: 'Confetti Colors',
          type: 'array',
          of: [{ type: 'string' }],
          hidden: ({ parent }) => !parent?.confetti,
        },
        {
          name: 'glow',
          title: 'Enable Glow Effect',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'glowColor',
          title: 'Glow Color',
          type: 'string',
          hidden: ({ parent }) => !parent?.glow,
          initialValue: '#F85A17',
        },
        {
          name: 'velocityEffects',
          title: 'Velocity Effects',
          type: 'string',
          description: 'How scroll velocity affects this scene',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Speed Blur', value: 'blur' },
              { title: 'Particle Density', value: 'particles' },
              { title: 'Animation Speed', value: 'speed' },
            ],
          },
          initialValue: 'none',
        },
      ],
    }),

    // --- CTA ---
    defineField({
      name: 'cta',
      title: 'Scene Call to Action',
      type: 'link',
      description: 'Optional CTA button for this scene',
    }),
  ],

  // --- PREVIEW ---
  preview: {
    select: {
      headline: 'headline',
      xpThreshold: 'xpThreshold',
      unlockMessage: 'unlockMessage',
    },
    prepare({ headline, xpThreshold, unlockMessage }) {
      const displayTitle = headline?.en || 'Untitled Scene'
      const displayUnlock = unlockMessage?.en || `Unlocks at ${xpThreshold} XP`
      return {
        title: displayTitle,
        subtitle: `${xpThreshold} XP - ${displayUnlock}`,
        media: RocketIcon,
      }
    },
  },
})
