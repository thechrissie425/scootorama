import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'productPage',
  title: 'Product Marketing Page',
  type: 'document',
  groups: [
    { name: 'commerce', title: 'Commerce Data' },
    { name: 'content', title: 'Marketing Content' },
  ],
  preview: {
    select: {
      title: 'product.title',
      marketingTitle: 'marketingTitle.en',
      subtitle: 'slug.current',
      media: 'hero.image',
    },
    prepare(selection) {
      const { title, marketingTitle, subtitle, media } = selection
      return {
        title: marketingTitle || title || 'Product Marketing Page',
        subtitle: subtitle ? `/${subtitle}` : undefined,
        media,
      }
    },
  },
  fields: [
    // --- 1. PRODUCT REFERENCE ---
    defineField({
      name: 'product',
      title: 'Associated Product',
      type: 'reference',
      to: [{ type: 'product' }],
      group: 'commerce',
      validation: rule => rule.required(),
      description: 'The core product this marketing page is for',
    }),
    defineField({
      name: 'slug',
      title: 'Marketing Page Slug',
      type: 'slug',
      options: { source: 'product.title' }, // Generate from referenced product title
      group: 'commerce',
      description:
        'URL slug for this marketing page (can be different from product slug)',
    }),

    // --- 2. MARKETING OVERRIDES (Optional) ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      group: 'commerce',
      initialValue: false,
    }),
    defineField({
      name: 'marketingTitle',
      title: 'Marketing Title Override (Optional)',
      type: 'object',
      group: 'commerce',
      description: 'Override the product title for marketing purposes',
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

    // --- 2. MARKETING CONTENT ---
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroProduct', // Reusing your new fancy hero!
      group: 'content',
    }),
    defineField({
      name: 'features',
      title: 'Feature Modules',
      type: 'array',
      group: 'content',
      of: [
        { type: 'river' }, // Zig-zag text/image
        { type: 'firecracker' }, // High impact promo
        { type: 'statsGrid' }, // Technical specs
        { type: 'carousel' }, // Lifestyle shots
      ],
    }),
    defineField({
      name: 'additionalSections',
      title: 'Additional Marketing Sections',
      type: 'array',
      group: 'content',
      description: 'Content blocks that appear after the tabbed content module',
      of: [
        { type: 'instagramVideoGrid' }, // Ambassador content
        { type: 'socialProofSection' }, // Testimonials
        { type: 'river' }, // Additional zig-zag sections
      ],
    }),
    defineField({
      name: 'techSpecs',
      title: 'Technical Specifications',
      type: 'array',
      group: 'content',
      description:
        'Structured technical specifications with automatic unit conversion',
      of: [{ type: 'techSpec' }],
      validation: rule =>
        rule
          .max(8)
          .warning(
            'Consider limiting to 8 categories maximum to avoid overwhelming users'
          ),
    }),
    defineField({
      name: 'whoIsItFor',
      title: 'Who Is It Good For',
      type: 'array',
      group: 'content',
      description: 'Target audience segments and use cases',
      of: [{ type: 'whoIsItFor' }],
      validation: Rule =>
        Rule.max(3).warning(
          'Consider limiting to 3 target segments for clarity'
        ),
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      group: 'content',
      description: 'Used for default "who is it for" content',
      options: {
        list: [
          { title: 'Cruiser Deluxe (Smart scooter)', value: 'cruiser' },
          { title: 'Kick-Stand (Indoor trainer)', value: 'kickstand' },
          { title: 'Honk-Honk Buttons (Controllers)', value: 'controller' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
    }),
  ],
})
