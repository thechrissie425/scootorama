// schemaTypes/siteSettings.ts
import { defineField, defineType } from 'sanity'
import { localizedString } from '../lib/fieldHelpers'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'product', title: 'Product UI' }, // 🆕 New Group
    { name: 'seo', title: 'Global SEO' },
  ],
  fields: [
    // --- 1. HEADER NAVIGATION ---
    defineField({
      name: 'mainNav',
      title: 'Main Navigation',
      description: 'Links that appear in the top center.',
      type: 'array',
      group: 'navigation',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'headerCta',
      title: 'Header Button',
      description: 'The primary action button (e.g. "Free Trial") top right.',
      type: 'link',
      group: 'navigation',
    }),

    // --- 2. FOOTER ---
    defineField({
      name: 'footerNav',
      title: 'Footer Links',
      type: 'array',
      group: 'footer',
      of: [{ type: 'navItem' }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Icons',
      description: 'These typically appear in the footer or mobile menu.',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['Twitter', 'Instagram', 'TikTok', 'YouTube', 'Facebook'],
              },
            },
            { name: 'url', title: 'Profile URL', type: 'url' },
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        },
      ],
    }),

    // ✨ REFACTOR: Replaced 40 lines of manual fields with 1 helper
    // Note: You lose the "initialValue" defaults, but it's much cleaner.
    localizedString('copyrightText', 'Copyright Text', {
      description:
        'e.g. Scootorama, Inc. All rights reserved. (Year is automatic)',
    }),

    // --- 3. PRODUCT UI LABELS ---
    defineField({
      name: 'productPageLabels',
      title: 'Product Page UI Labels',
      type: 'object',
      group: 'product', // 🆕 Added to group
      description: 'Labels used on the product details page',
      fields: [
        localizedString('productInfo', 'Product Information Heading', {
          required: true,
          description: 'Default: Product Information',
        }),
        localizedString('keyFeatures', 'Key Features Button', {
          required: true,
          description: 'Default: Key Features',
        }),
        localizedString('techSpecs', 'Tech Specs Button', {
          required: true,
          description: 'Default: Tech Specs',
        }),
        localizedString('whoItsFor', 'Who It Is For Button', {
          required: true,
          description: "Default: Who It's For",
        }),
      ],
    }),

    // --- 4. GLOBAL SEO ---
    defineField({
      name: 'fallbackSeo',
      title: 'Default SEO Settings',
      description:
        'Used as a fallback when a page forgets to set its own metadata.',
      type: 'seo',
      group: 'seo',
    }),

    // --- 5. ROBOTS.TXT CONFIGURATION ---
    defineField({
      name: 'robots',
      title: 'Robots.txt Configuration',
      description: 'Configure crawl behavior to prevent bot traps.',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'userAgent',
          title: 'User Agent',
          type: 'string',
          initialValue: '*',
          validation: rule => rule.required(),
        },
        {
          name: 'allow',
          title: 'Allowed Paths',
          type: 'array',
          of: [{ type: 'string' }],
          validation: rule =>
            rule.custom((paths: any) => {
              if (!paths?.length) return true
              return paths.every((p: string) => p.startsWith('/'))
                ? true
                : 'Paths must start with /'
            }),
        },
        {
          name: 'disallow',
          title: 'Additional Blocked Paths',
          type: 'array',
          of: [{ type: 'string' }],
          validation: rule =>
            rule.custom((paths: any) => {
              if (!paths?.length) return true
              return paths.every((p: string) => p.startsWith('/'))
                ? true
                : 'Paths must start with /'
            }),
        },
        {
          name: 'crawlDelay',
          title: 'Crawl Delay (seconds)',
          type: 'number',
          validation: rule => rule.min(0).max(60),
        },
      ],
    }),
    defineField({
      name: 'pricingUI',
      title: 'Pricing Section UI',
      type: 'object',
      group: 'product',
      fields: [
        localizedString('monthlyLabel', 'Monthly Toggle Label', {
          // initialValue: 'Monthly',
          required: true,
        }),
        localizedString('annualLabel', 'Annual Toggle Label', {
          // initialValue: 'Annual',
          required: true,
        }),
        localizedString('discountLabel', 'Discount Badge Text', {
          description: 'e.g. "Save 17%" or "Best Value"',
          // initialValue: 'Save 17%',
        }),
        localizedString('saveUpTo', 'Card Savings Prefix', {
          description: 'The text before the percentage. e.g. "Save"',
          // initialValue: 'Save',
        }),
        localizedString('ctaFallback', 'Default Button Text', {
          // initialValue: 'Start Trial',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
        subtitle: 'Navigation, Footer, SEO',
        media: CogIcon,
      }
    },
  },
})
