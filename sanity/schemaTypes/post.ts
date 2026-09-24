import { defineField, defineType } from 'sanity'
import { DocumentTextIcon, ImageIcon, StarIcon } from '@sanity/icons'

// 🟢 REMOVED: import { localizedString, localizedText } from '../lib/fieldHelpers'
// Reason: We are moving to Document-Level localization.
// The document itself determines the language, so fields should be plain strings.

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'editorial', title: 'Editorial' },
    { name: 'content', title: 'Content' },
    { name: 'settings', title: 'Settings' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    // --- 1. EDITORIAL METADATA ---
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string', // 🟢 WAS: localizedString object. NOW: Simple string.
      validation: rule => rule.required().max(80),
      group: 'editorial',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' }, // 🟢 WAS: 'title.en'. NOW: Just 'title'.
      group: 'editorial',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Summary',
      description: 'Appears on the homepage/grid. Keep it punchy.',
      type: 'text', // 🟢 WAS: localizedText object. NOW: Simple text.
      rows: 3,
      validation: rule => rule.max(300),
      group: 'editorial',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      group: 'editorial',
    }),

    // --- 2. HERO CONFIGURATION ---
    defineField({
      name: 'hero',
      title: 'Hero / Header',
      type: 'object',
      icon: ImageIcon,
      group: 'content',
      fields: [
        {
          name: 'style',
          type: 'string',
          options: { list: ['Standard', 'Split', 'Minimal', 'Video Loop'] },
        },
        {
          name: 'image',
          type: 'image',
          options: { hotspot: true },
        },
        {
          name: 'videoUrl',
          type: 'url',
          title: 'Video URL',
          description: 'For "Video Loop" style only (mp4 link)',
        },
      ],
    }),

    // --- 3. THE "TL;DR" BOX ---
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways (TL;DR)',
      type: 'array',
      group: 'content',
      // 🟢 THIS NOW WORKS PERFECTLY:
      // Since the document is specific to a language (e.g., French),
      // this array will just contain French strings. No complex objects needed.
      of: [{ type: 'string' }],
      validation: rule =>
        rule.max(8).warning('Keep takeaways concise - 5-8 items recommended'),
      description: 'Renders a "What You Will Learn" box at the top.',
    }),

    // --- 4. THE HYBRID BODY ---
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        // A. Standard Text
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    validation: rule =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
        // B. Power Blocks
        {
          type: 'image',
          icon: ImageIcon,
          options: { hotspot: true },
          title: 'Inline Image',
          fields: [
            {
              name: 'caption',
              type: 'string', // 🟢 Plain string (localized by document)
              title: 'Caption',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Colored Callout Box',
          icon: StarIcon,
          fields: [
            {
              name: 'type',
              type: 'string',
              options: { list: ['Pro Tip', 'Warning', 'Note'] },
            },
            { name: 'text', type: 'text', rows: 3 }, // 🟢 Plain text
          ],
        },
        {
          type: 'object',
          name: 'productPlug',
          title: 'Product/Shop Card',
          fields: [
            {
              name: 'product',
              type: 'reference',
              to: [{ type: 'pricingTier' }],
            },
            {
              name: 'customLabel',
              type: 'string',
              title: 'Override CTA Label',
            },
          ],
        },
        {
          type: 'object',
          name: 'routeCard',
          title: 'Route Card',
          description:
            'Reference a curated Scootorama route with its marketing images',
          fields: [
            {
              name: 'route',
              type: 'reference',
              title: 'Select Route',
              to: [{ type: 'route' }],
              validation: Rule => Rule.required(),
            },
            {
              name: 'customDeeplink',
              type: 'url',
              title: 'Custom Deep Link (Optional)',
            },
          ],
          preview: {
            select: {
              // 🟢 PREVIEW FIX: Use plain fields
              title: 'route.name.en',
              subtitle: 'route.world',
              media: 'route.heroImage',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'No route selected',
                subtitle: subtitle || '',
                media,
              }
            },
          },
        },
      ],
    }),

    // --- 5. SMART CONNECTIONS ---
    defineField({
      name: 'relatedCampaign',
      title: 'Tie to Campaign',
      type: 'reference',
      to: [{ type: 'campaign' }],
      group: 'settings',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title', // 🟢 WAS: 'title.en'. NOW: Just 'title'
      publishedAt: '_createdAt',
      media: 'hero.image',
    },
    prepare(selection) {
      const { title, publishedAt, media } = selection
      return {
        title: title || 'Untitled Post',
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : 'Draft',
        media,
      }
    },
  },
})
