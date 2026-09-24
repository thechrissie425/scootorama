import { defineType, defineField } from 'sanity'
import { ColorWheelIcon } from '@sanity/icons'

export default defineType({
  name: 'takeoverTheme',
  title: 'Takeover Theme',
  type: 'document',
  icon: ColorWheelIcon,
  fields: [
    // IDENTITY
    defineField({
      name: 'name',
      title: 'Theme Name',
      type: 'string',
      description:
        'Internal name for this theme (e.g., "Winter Warriors 2026")',
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Internal notes about this theme',
    }),

    // VISUAL IDENTITY - COLORS
    defineField({
      name: 'colors',
      title: 'Color Palette',
      type: 'object',
      fields: [
        {
          name: 'primary',
          title: 'Primary Color',
          type: 'color',
          description: 'Main CTAs, headers, key elements',
          options: {
            colorList: [
              { title: 'Hot Pink', value: '#D6117A' },
              { title: 'Turquoise', value: '#00858C' },
              { title: 'Sunshine', value: '#FFD21F' },
              { title: 'Lime', value: '#7CC21E' },
              { title: 'Grape', value: '#8B5CF6' },
            ],
          },
          validation: rule => rule.required(),
        },
        {
          name: 'secondary',
          title: 'Secondary Color',
          type: 'color',
          description: 'Accents, hover states, secondary elements',
          options: {
            colorList: [
              { title: 'Hot Pink', value: '#D6117A' },
              { title: 'Turquoise', value: '#00858C' },
              { title: 'Sunshine', value: '#FFD21F' },
              { title: 'Lime', value: '#7CC21E' },
              { title: 'Grape', value: '#8B5CF6' },
            ],
          },
        },
        {
          name: 'tertiary',
          title: 'Tertiary Color',
          type: 'color',
          description: 'Backgrounds, subtle elements',
          options: {
            colorList: [
              { title: 'Hot Pink', value: '#D6117A' },
              { title: 'Turquoise', value: '#00858C' },
              { title: 'Sunshine', value: '#FFD21F' },
              { title: 'Lime', value: '#7CC21E' },
              { title: 'Grape', value: '#8B5CF6' },
            ],
          },
        },
        {
          name: 'accent',
          title: 'Accent Color',
          type: 'color',
          description: 'Highlights, borders, sticker accents',
          options: {
            colorList: [
              { title: 'Hot Pink', value: '#D6117A' },
              { title: 'Turquoise', value: '#00858C' },
              { title: 'Sunshine', value: '#FFD21F' },
              { title: 'Lime', value: '#7CC21E' },
              { title: 'Grape', value: '#8B5CF6' },
            ],
          },
        },
        {
          name: 'confetti',
          title: 'Confetti Colors',
          type: 'array',
          of: [
            {
              type: 'color',
              options: {
                colorList: [
                  { title: 'Hot Pink', value: '#D6117A' },
                  { title: 'Turquoise', value: '#00858C' },
                  { title: 'Sunshine', value: '#FFD21F' },
                  { title: 'Lime', value: '#7CC21E' },
                  { title: 'Grape', value: '#8B5CF6' },
                ],
              },
            },
          ],
          description: 'Colors for confetti particles (firecracker effect)',
          validation: rule => rule.max(5),
        },
      ],
      options: {
        collapsible: false,
      },
    }),

    // EFFECTS
    defineField({
      name: 'effects',
      title: 'Visual Effects',
      type: 'object',
      fields: [
        {
          name: 'confetti',
          title: 'Enable Confetti',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'confettiDensity',
          title: 'Confetti Density',
          type: 'string',
          options: {
            list: [
              { title: 'Low', value: 'low' },
              { title: 'Medium', value: 'medium' },
              { title: 'High', value: 'high' },
            ],
            layout: 'radio',
          },
          initialValue: 'medium',
          hidden: ({ parent }) => !parent?.confetti,
        },
        {
          name: 'particles',
          title: 'Particle Style',
          type: 'string',
          options: {
            list: [
              { title: 'None', value: 'none' },
              { title: 'Stars', value: 'stars' },
              { title: 'Snowflakes', value: 'snowflakes' },
              { title: 'Hearts', value: 'hearts' },
            ],
          },
          initialValue: 'none',
        },
        {
          name: 'glow',
          title: 'Enable Glow Effect',
          type: 'boolean',
          description: 'Adds glow to CTAs and key elements',
          initialValue: false,
        },
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),

    // TYPOGRAPHY
    defineField({
      name: 'fonts',
      title: 'Typography',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading Font',
          type: 'string',
          description: 'Font family for headings',
          placeholder: 'Bebas Neue, Roboto Condensed',
        },
        {
          name: 'body',
          title: 'Body Font',
          type: 'string',
          description: 'Font family for body text',
          placeholder: 'Inter, Roboto',
        },
        {
          name: 'accent',
          title: 'Accent Font',
          type: 'string',
          description: 'Font for special callouts',
          placeholder: 'Permanent Marker',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // BRANDING ASSETS
    defineField({
      name: 'branding',
      title: 'Branding Assets',
      type: 'object',
      fields: [
        {
          name: 'logo',
          title: 'Campaign Logo',
          type: 'image',
          description: 'Campaign-specific logo or wordmark',
          options: { hotspot: true },
        },
        {
          name: 'logoLight',
          title: 'Light Logo Variant',
          type: 'image',
          description: 'Logo for dark backgrounds',
          options: { hotspot: true },
        },
        {
          name: 'logoDark',
          title: 'Dark Logo Variant',
          type: 'image',
          description: 'Logo for light backgrounds',
          options: { hotspot: true },
        },
        {
          name: 'icon',
          title: 'Icon/Badge',
          type: 'image',
          description: 'Small campaign icon for mobile/badges',
          options: { hotspot: true },
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // HERO CUSTOMIZATION
    defineField({
      name: 'hero',
      title: 'Hero Customization',
      type: 'object',
      fields: [
        {
          name: 'backgroundPattern',
          title: 'Background Pattern',
          type: 'image',
          description: 'Texture or pattern overlay for hero sections',
          options: { hotspot: true },
        },
        {
          name: 'backgroundVideo',
          title: 'Background Video',
          type: 'file',
          description: 'Optional video background for hero',
          options: {
            accept: 'video/*',
          },
        },
        {
          name: 'overlayOpacity',
          title: 'Overlay Opacity',
          type: 'number',
          description: 'Opacity of color overlay (0-100)',
          validation: rule => rule.min(0).max(100),
          initialValue: 50,
        },
        {
          name: 'gradientOverlay',
          title: 'Gradient Overlay',
          type: 'color',
          description: 'Tint color for hero gradient',
        },
        {
          name: 'textShadow',
          title: 'Enable Text Shadow',
          type: 'boolean',
          description: 'Adds shadow to hero text for better readability',
          initialValue: true,
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // STICKER PLACEHOLDER (for future Tier 2)
    defineField({
      name: 'stickers',
      title: 'Campaign Stickers',
      type: 'array',
      description: 'Available stickers for this campaign (coming soon)',
      of: [{ type: 'reference', to: [{ type: 'sticker' }] }],
      hidden: true, // Hide until we build Tier 2
    }),

    // A/B TESTING VARIANT
    defineField({
      name: 'isVariant',
      title: 'Is A/B Test Variant',
      type: 'boolean',
      description: 'Mark this as an A/B test variant',
      initialValue: false,
    }),

    defineField({
      name: 'parentTheme',
      title: 'Parent Theme',
      type: 'reference',
      to: [{ type: 'takeoverTheme' }],
      description: 'Original theme if this is a variant',
      hidden: ({ parent }) => !parent?.isVariant,
    }),

    defineField({
      name: 'variantName',
      title: 'Variant Name',
      type: 'string',
      options: {
        list: ['A', 'B', 'C', 'D'],
      },
      hidden: ({ parent }) => !parent?.isVariant,
    }),
  ],

  preview: {
    select: {
      title: 'name',
      primaryColor: 'colors.primary.hex',
      isVariant: 'isVariant',
      variantName: 'variantName',
    },
    prepare({ title, primaryColor, isVariant, variantName }) {
      return {
        title: isVariant ? `${title} (Variant ${variantName})` : title,
        subtitle: primaryColor
          ? `Primary: ${primaryColor}`
          : 'No primary color set',
        media: ColorWheelIcon,
      }
    },
  },
})
