import { defineType, defineField } from 'sanity'
import { siteOrExternalUrl } from '../lib/fieldHelpers'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'takeoverActivation',
  title: 'Takeover Activation',
  type: 'document',
  icon: RocketIcon,
  fields: [
    // IDENTITY
    defineField({
      name: 'name',
      title: 'Activation Name',
      type: 'string',
      description: 'Internal name (e.g., "Winter Warriors - US New Users")',
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'What is this campaign activation for?',
    }),

    // THEME REFERENCE
    defineField({
      name: 'theme',
      title: 'Campaign Theme',
      type: 'reference',
      to: [{ type: 'takeoverTheme' }],
      description: 'The visual theme to apply',
      validation: rule => rule.required(),
    }),

    // SCHEDULING
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When this campaign goes live',
      validation: rule => rule.required(),
    }),

    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When this campaign ends',
      validation: rule => rule.required().min(rule.valueOfField('startDate')),
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Manual override - disable campaign regardless of dates',
      initialValue: true,
    }),

    // TARGETING
    defineField({
      name: 'targeting',
      title: 'Targeting Rules',
      type: 'object',
      fields: [
        {
          name: 'markets',
          title: 'Markets',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Which markets see this campaign',
          options: {
            list: [
              { title: 'United States', value: 'us' },
              { title: 'United Kingdom', value: 'uk' },
              { title: 'Germany', value: 'de' },
              { title: 'France', value: 'fr' },
              { title: 'Spain', value: 'es' },
              { title: 'Japan', value: 'jp' },
            ],
          },
          validation: rule => rule.required().min(1),
        },
        {
          name: 'segments',
          title: 'User Segments',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Which user types see this campaign',
          options: {
            list: [
              { title: 'All Users', value: 'all' },
              { title: 'New Users', value: 'new-users' },
              { title: 'Lapsed Members', value: 'lapsed-members' },
              { title: 'Active Subscribers', value: 'active-subscribers' },
              { title: 'Trial Users', value: 'trial-users' },
            ],
          },
          validation: rule => rule.required().min(1),
        },
        {
          name: 'excludeSegments',
          title: 'Exclude Segments',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'User types to exclude',
          options: {
            list: [
              { title: 'Active Subscribers', value: 'active-subscribers' },
              { title: 'Lifetime Members', value: 'lifetime-members' },
            ],
          },
        },
      ],
      options: {
        collapsible: false,
      },
    }),

    // A/B TESTING
    defineField({
      name: 'abTest',
      title: 'A/B Testing',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable A/B Testing',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'variants',
          title: 'Test Variants',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'theme',
                  title: 'Theme',
                  type: 'reference',
                  to: [{ type: 'takeoverTheme' }],
                  validation: rule => rule.required(),
                },
                {
                  name: 'weight',
                  title: 'Traffic Weight (%)',
                  type: 'number',
                  description: 'Percentage of traffic for this variant',
                  validation: rule => rule.required().min(0).max(100).integer(),
                  initialValue: 50,
                },
              ],
              preview: {
                select: {
                  themeName: 'theme.name',
                  weight: 'weight',
                },
                prepare({ themeName, weight }) {
                  return {
                    title: themeName || 'Unnamed theme',
                    subtitle: `${weight}% traffic`,
                  }
                },
              },
            },
          ],
          hidden: ({ parent }) => !parent?.enabled,
          validation: rule =>
            rule.custom((variants: any, context: any) => {
              if (!context?.parent?.enabled) return true
              if (
                !variants ||
                !Array.isArray(variants) ||
                variants.length < 2
              ) {
                return 'Add at least 2 variants for A/B testing'
              }
              const totalWeight = variants.reduce(
                (sum: number, v: any) => sum + (v.weight || 0),
                0
              )
              if (totalWeight !== 100) {
                return `Traffic weights must sum to 100% (currently ${totalWeight}%)`
              }
              return true
            }),
        },
        {
          name: 'conversionGoal',
          title: 'Conversion Goal',
          type: 'string',
          description: 'What action are you measuring?',
          options: {
            list: [
              { title: 'Sign Up', value: 'sign-up' },
              { title: 'Purchase', value: 'purchase' },
              { title: 'Free Trial', value: 'free-trial' },
              { title: 'Click Through', value: 'click-through' },
            ],
          },
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // TAKEOVER SETTINGS
    defineField({
      name: 'takeover',
      title: 'Site Takeover',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Takeover',
          type: 'boolean',
          description: 'Apply theme globally across the site',
          initialValue: false,
        },
        {
          name: 'scope',
          title: 'Takeover Scope',
          type: 'string',
          options: {
            list: [
              { title: 'Global (Entire Site)', value: 'global' },
              { title: 'Campaign Pages Only', value: 'campaign-pages-only' },
              { title: 'Product Pages Only', value: 'product-pages-only' },
            ],
          },
          initialValue: 'campaign-pages-only',
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'navBar',
          title: 'Navigation Bar Customization',
          type: 'object',
          fields: [
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'color',
            },
            {
              name: 'logo',
              title: 'Custom Logo',
              type: 'image',
              description: 'Override default brand logo',
              options: { hotspot: true },
            },
          ],
          hidden: ({ parent }) => !parent?.enabled,
          options: {
            collapsible: true,
            collapsed: true,
          },
        },
        {
          name: 'globalBanner',
          title: 'Global Banner',
          type: 'object',
          fields: [
            {
              name: 'enabled',
              title: 'Show Banner',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'text',
              title: 'Banner Text',
              type: 'object',
              fields: [
                { name: 'en', type: 'text', rows: 2, title: 'English' },
                { name: 'es', type: 'text', rows: 2, title: 'Spanish' },
                { name: 'fr', type: 'text', rows: 2, title: 'French' },
                { name: 'de', type: 'text', rows: 2, title: 'German' },
                { name: 'ja', type: 'text', rows: 2, title: 'Japanese' },
              ],
              hidden: ({ parent }) => !parent?.enabled,
            },
            {
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'color',
              hidden: ({ parent }) => !parent?.enabled,
            },
            {
              name: 'ctaText',
              title: 'CTA Text',
              type: 'object',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'es', type: 'string', title: 'Spanish' },
                { name: 'fr', type: 'string', title: 'French' },
                { name: 'de', type: 'string', title: 'German' },
                { name: 'ja', type: 'string', title: 'Japanese' },
              ],
              hidden: ({ parent }) => !parent?.enabled,
            },
            {
              name: 'ctaUrl',
              title: 'CTA URL',
              type: 'url',
              description:
                'A site path like /campaigns/luau-week, or a full URL',
              validation: siteOrExternalUrl,
              hidden: ({ parent }) => !parent?.enabled,
            },
          ],
          hidden: ({ parent }) => !parent?.enabled,
          options: {
            collapsible: true,
            collapsed: true,
          },
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // INTEGRATION POINTS
    defineField({
      name: 'applyTo',
      title: 'Apply Theme To',
      type: 'object',
      description: 'Which components should use this theme',
      fields: [
        {
          name: 'firecracker',
          title: 'Firecracker Promos',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'hero',
          title: 'Hero Sections',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'productPages',
          title: 'Product Pages',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'checkout',
          title: 'Checkout Flow',
          type: 'boolean',
          initialValue: false,
        },
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),

    // PREVIEW
    defineField({
      name: 'previewToken',
      title: 'Preview Token',
      type: 'string',
      description: 'Secret token for preview URLs (auto-generated)',
      readOnly: true,
      initialValue: () => Math.random().toString(36).substring(2, 15),
    }),

    // ANALYTICS
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'utmCampaign',
          title: 'UTM Campaign',
          type: 'string',
          description: 'For tracking in analytics',
        },
        {
          name: 'impressions',
          title: 'Impressions',
          type: 'number',
          description: 'Total views (auto-updated)',
          readOnly: true,
          initialValue: 0,
        },
        {
          name: 'conversions',
          title: 'Conversions',
          type: 'number',
          description: 'Goal completions (auto-updated)',
          readOnly: true,
          initialValue: 0,
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],

  preview: {
    select: {
      title: 'name',
      themeName: 'theme.name',
      isActive: 'isActive',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare({ title, themeName, isActive, startDate, endDate }) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)

      let status = '⏸️ Inactive'
      if (isActive) {
        if (now < start) status = '⏰ Scheduled'
        else if (now > end) status = '✅ Ended'
        else status = '🟢 Active'
      }

      return {
        title,
        subtitle: `${themeName || 'No theme'} • ${status}`,
        media: RocketIcon,
      }
    },
  },
})
