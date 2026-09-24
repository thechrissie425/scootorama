import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

/**
 * Hero Section Schema
 *
 * A versatile hero component with localization support and multiple layout options.
 * Supports centered, split, and overlay layouts with rich text content and CTA functionality.
 *
 * Features:
 * - Multi-language support with conditional field visibility
 * - Flexible content alignment options
 * - Image optimization with hotspot support
 * - Accessibility-ready alt text fields
 * - Link integration with validation
 *
 * @version 2.0.0
 * @author Scootorama Development Team
 */

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  icon: StarIcon,
  description:
    'A flexible hero component with localization and multiple layout options',

  // Group fields logically for better UX
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'design',
      title: 'Design & Layout',
    },
    {
      name: 'accessibility',
      title: 'Accessibility',
    },
  ],

  fields: [
    // === LOCALIZATION SETTINGS ===
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description:
        'Toggle to show/hide translation fields for all content in this hero section. Enable this to add translations for different markets.',
      initialValue: false,
      group: 'content',
      validation: rule => rule.required(),
    }),
    // === PRIMARY CONTENT ===
    defineField({
      name: 'heading',
      title: 'Hero Heading',
      type: 'object',
      description:
        'Main headline text - keep it impactful and concise (recommended: 2-8 words)',
      group: 'content',
      validation: rule => rule.required().error('Hero heading is required'),
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'string',
          description: 'Primary heading text in English',
          validation: rule =>
            rule
              .required()
              .min(2)
              .error('Heading too short - should be at least 2 characters')
              .max(120)
              .warning(
                'Heading might be too long - consider shortening for better impact'
              ),
          placeholder: 'Your powerful headline here...',
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          description: 'Spanish translation of the heading',
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'Spanish translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'fr',
          title: 'French',
          type: 'string',
          description: 'French translation of the heading',
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'French translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'de',
          title: 'German',
          type: 'string',
          description: 'German translation of the heading',
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'German translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'string',
          description: 'Japanese translation of the heading',
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'Japanese translation is recommended when translations are enabled'
              }
              return true
            }),
        },
      ],
    }),
    defineField({
      name: 'subheading',
      title: 'Hero Subheading',
      type: 'object',
      description:
        'Supporting text that elaborates on the main headline (optional but recommended)',
      group: 'content',
      fields: [
        {
          name: 'en',
          title: 'English (Primary)',
          type: 'text',
          description: 'Supporting subheading text in English',
          rows: 3,
          validation: rule =>
            rule
              .max(300)
              .warning(
                'Subheading might be too long - consider shortening for better readability'
              ),
          placeholder: 'Elaborate on your headline with compelling details...',
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'text',
          description: 'Spanish translation of the subheading',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'Spanish translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'fr',
          title: 'French',
          type: 'text',
          description: 'French translation of the subheading',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'French translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'de',
          title: 'German',
          type: 'text',
          description: 'German translation of the subheading',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'German translation is recommended when translations are enabled'
              }
              return true
            }),
        },
        {
          name: 'ja',
          title: 'Japanese',
          type: 'text',
          description: 'Japanese translation of the subheading',
          rows: 3,
          hidden: ({ document }) => !document?.showTranslationFields,
          validation: rule =>
            rule.custom((value, context) => {
              const doc = context.document as any
              const parent = context.parent as any
              if (doc?.showTranslationFields && parent?.en && !value) {
                return 'Japanese translation is recommended when translations are enabled'
              }
              return true
            }),
        },
      ],
    }),
    // === DESIGN & LAYOUT ===
    defineField({
      name: 'layout',
      title: 'Content Layout',
      type: 'string',
      description:
        'Choose how content is positioned relative to the background image',
      group: 'design',
      options: {
        list: [
          {
            title: '🎯 Center Aligned',
            value: 'center',
          },
          {
            title: '↔️ Left Aligned (Split)',
            value: 'left',
          },
          {
            title: '↙️ Bottom Left (Overlay)',
            value: 'bottom-left',
          },
        ],
        layout: 'radio',
        direction: 'vertical',
      },
      initialValue: 'center',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description:
        'Hero background image - recommended size: 2400x1600px for optimal quality',
      group: 'design',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette'],
        accept: '.jpg,.jpeg,.png,.webp',
      },
      validation: rule =>
        rule.required().error('Background image is required for hero section'),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description:
            'Describe the image for screen readers and SEO (required for accessibility)',
          validation: rule =>
            rule
              .required()
              .min(10)
              .error('Alt text should be descriptive (minimum 10 characters)')
              .max(200)
              .warning('Alt text should be concise (maximum 200 characters)')
              .custom((alt: string) => {
                if (
                  alt &&
                  (alt.toLowerCase().startsWith('image of') ||
                    alt.toLowerCase().startsWith('picture of'))
                ) {
                  return 'Avoid starting with "image of" or "picture of" - describe what\'s actually shown'
                }
                return true
              }),
          placeholder: "Describe what's shown in the image...",
          group: 'accessibility',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Image Caption (Optional)',
          description: 'Optional caption that may be displayed with the image',
          validation: rule => rule.max(150),
          placeholder: 'Optional caption text...',
          group: 'design',
        },
      ],
    }),
    // === CALL TO ACTION ===
    defineField({
      name: 'cta',
      title: 'Primary Call to Action',
      type: 'link',
      description:
        'Main action button for the hero - should be compelling and action-oriented',
      group: 'content',
      validation: rule =>
        rule.custom((cta: any) => {
          // If CTA exists, ensure it has proper content
          if (
            cta &&
            cta.label &&
            (!cta.linkType || (!cta.internalLink && !cta.externalUrl))
          ) {
            return 'CTA must have both label text and a valid link destination'
          }
          return true
        }),
    }),

    // === ACCESSIBILITY ENHANCEMENTS ===
    defineField({
      name: 'ariaLabel',
      title: 'ARIA Label Override',
      type: 'string',
      description:
        'Optional: Override the default aria-label for the hero section (advanced accessibility)',
      group: 'accessibility',
      validation: rule => rule.max(100),
      placeholder: 'Custom accessibility label...',
    }),

    defineField({
      name: 'priority',
      title: 'Loading Priority',
      type: 'string',
      description:
        'Image loading priority - use "high" for above-the-fold heroes',
      group: 'design',
      options: {
        list: [
          { title: 'High Priority (Above Fold)', value: 'high' },
          { title: 'Normal Priority', value: 'normal' },
          { title: 'Low Priority (Below Fold)', value: 'low' },
        ],
        layout: 'radio',
      },
      initialValue: 'high',
    }),
  ],
  preview: {
    select: {
      heading: 'heading.en',
      subheading: 'subheading.en',
      media: 'backgroundImage',
      layout: 'layout',
      ctaLabel: 'cta.label.en',
      hasTranslations: 'showTranslationFields',
    },
    prepare({
      heading,
      subheading,
      media,
      layout,
      ctaLabel,
      hasTranslations,
    }: {
      heading?: string
      subheading?: string
      media?: any
      layout?: 'center' | 'left' | 'bottom-left'
      ctaLabel?: string
      hasTranslations?: boolean
    }) {
      // Create a more descriptive subtitle
      const layoutMap: Record<string, string> = {
        center: 'Center Layout',
        left: 'Split Layout',
        'bottom-left': 'Overlay Layout',
      }

      const parts: string[] = []
      if (layout) parts.push(layoutMap[layout] || layout)
      if (ctaLabel) parts.push(`CTA: ${ctaLabel}`)
      if (hasTranslations) parts.push('🌐 Multilingual')

      const subtitle =
        parts.length > 0 ? `Hero • ${parts.join(' • ')}` : 'Hero Section'

      return {
        title: heading || subheading || 'Untitled Hero',
        subtitle,
        media: media || StarIcon,
      }
    },
  },
})
