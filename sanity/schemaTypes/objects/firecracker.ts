import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'firecracker',
  title: 'Firecracker Promo',
  type: 'object',
  icon: RocketIcon,
  fields: [
    // 1. DRAFT/HIDE TOGGLE
    defineField({
      name: 'disabled',
      title: 'Hide Section?',
      type: 'boolean',
      description:
        'Toggle ON to hide this section from the live site without deleting it.',
      initialValue: false,
    }),

    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),

    // 2. LAYOUT SELECTOR
    defineField({
      name: 'layout',
      title: 'Layout Style',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Banner (Inline)', value: 'banner' },
          { title: 'Homepage Takeover (Overlay)', value: 'takeover' },
        ],
        layout: 'radio',
      },
      initialValue: 'banner',
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
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
      title: 'Subheading',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
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
      title: 'Background Hex Color',
      type: 'string',
      initialValue: '#D64923',
    }),

    // PRODUCT DATA
    defineField({
      name: 'product',
      title: 'Primary Product (Legacy)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Select a single product to feature (older blocks).',
    }),
    defineField({
      name: 'products',
      title: 'Product Carousel',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Select multiple products to create a carousel.',
    }),
    defineField({
      name: 'carouselSettings',
      title: 'Carousel Settings',
      type: 'object',
      fields: [
        { name: 'autoRotate', type: 'boolean', initialValue: true },
        {
          name: 'rotationSpeed',
          type: 'number',
          title: 'Speed (seconds)',
          initialValue: 5,
        },
        { name: 'showIndicators', type: 'boolean', initialValue: true },
        { name: 'showArrows', type: 'boolean', initialValue: true },
      ],
    }),

    defineField({
      name: 'marketingImage',
      title: 'Marketing Image Override',
      type: 'image',
      description: 'Overrides the product image if set.',
    }),

    defineField({
      name: 'cta',
      title: 'Primary Call to Action',
      type: 'link',
    }),

    // STICKERS (Manual Override)
    defineField({
      name: 'stickers',
      title: 'Manual Stickers',
      type: 'array',
      of: [{ type: 'sticker' }],
      description: 'Add stickers manually here (overrides product stickers).',
    }),

    // CONFETTI - Commented out to allow Takeover Theme to control confetti
    // Use Takeover System → Takeover Themes to configure confetti colors, density, and particle shapes
    // defineField({
    //   name: 'confettiConfig',
    //   title: 'Confetti Configuration',
    //   type: 'object',
    //   fields: [
    //     { name: 'generate', type: 'boolean', title: 'Enable Confetti?' },
    //     {
    //       name: 'palette',
    //       type: 'array',
    //       of: [{ type: 'string' }],
    //       title: 'Color Palette',
    //       initialValue: ['#FFF', '#F36B26'],
    //     },
    //   ],
    // }),
  ],
  preview: {
    select: {
      title: 'heading.en',
      disabled: 'disabled',
      layout: 'layout',
    },
    prepare({ title, disabled, layout }) {
      const layoutLabel = layout === 'takeover' ? ' (Takeover)' : ''
      return {
        title: title || 'Untitled Firecracker',
        subtitle: disabled ? '🔴 HIDDEN' : `🟢 VISIBLE${layoutLabel}`,
      }
    },
  },
})
