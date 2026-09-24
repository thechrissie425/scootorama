import { defineField, defineType } from 'sanity'
import { localizedString, localizedText } from '../lib/fieldHelpers'

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'commerce', title: 'Commerce' },
    { name: 'locally', title: 'Locally' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      group: 'content',
      initialValue: false,
    }),
    // --- LOCALIZED TITLE ---
    {
      ...localizedString('title', 'Product Title', { required: true }),
      group: 'content',
    },
    defineField({
      name: 'image',
      title: 'Main Product Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    // --- LOCALIZED DESCRIPTION ---
    {
      ...localizedText('description', 'Product Description', {
        description:
          'Marketing description for use in grids and content displays',
        rows: 3,
        maxLength: 200,
      }),
      group: 'content',
    },
    defineField({
      name: 'stickers',
      title: 'Product Stickers',
      type: 'array',
      group: 'content',
      description: 'Custom stickers for this specific product',
      of: [
        {
          type: 'object',
          title: 'Sticker',
          fields: [
            defineField({
              name: 'text',
              title: 'Sticker Text',
              type: 'string',
              description:
                'Text to display on sticker (leave empty for price display)',
            }),
            defineField({
              name: 'style',
              title: 'Sticker Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Starburst (Star shape)', value: 'starburst' },
                  { title: 'Circle', value: 'circle' },
                  { title: 'Pill/Oval', value: 'pill' },
                  { title: 'Blob/Organic', value: 'blob' },
                ],
              },
              initialValue: 'starburst',
            }),
            defineField({
              name: 'rotation',
              title: 'Rotation (degrees)',
              type: 'number',
              validation: Rule => Rule.min(-180).max(180),
              initialValue: 0,
            }),
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Top Left', value: 'top-left' },
                  { title: 'Top Right', value: 'top-right' },
                  { title: 'Bottom Left', value: 'bottom-left' },
                  { title: 'Bottom Right', value: 'bottom-right' },
                  { title: 'Price Tag (right side)', value: 'price-tag' },
                  { title: 'Custom Position', value: 'custom' },
                ],
              },
              initialValue: 'top-left',
            }),
            defineField({
              name: 'displayType',
              title: 'Display Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text Sticker', value: 'text' },
                  { title: 'Price Display', value: 'price' },
                ],
              },
              initialValue: 'text',
            }),
            defineField({
              name: 'customPosition',
              title: 'Custom Position (%)',
              type: 'object',
              hidden: ({ parent }) => parent?.position !== 'custom',
              fields: [
                defineField({
                  name: 'top',
                  title: 'Top (%)',
                  type: 'number',
                  validation: Rule => Rule.min(0).max(100),
                }),
                defineField({
                  name: 'left',
                  title: 'Left (%)',
                  type: 'number',
                  validation: Rule => Rule.min(0).max(100),
                }),
                defineField({
                  name: 'bottom',
                  title: 'Bottom (%)',
                  type: 'number',
                  validation: Rule => Rule.min(0).max(100),
                }),
                defineField({
                  name: 'right',
                  title: 'Right (%)',
                  type: 'number',
                  validation: Rule => Rule.min(0).max(100),
                }),
              ],
            }),
            defineField({
              name: 'color',
              title: 'Sticker Color',
              type: 'string',
              description: 'Leave empty for automatic color based on content',
            }),
          ],
          preview: {
            select: {
              title: 'text',
              displayType: 'displayType',
              style: 'style',
              position: 'position',
            },
            prepare(selection) {
              const { title, displayType, style, position } = selection
              return {
                title: title || `${displayType || 'text'} sticker`,
                subtitle: `${style} • ${position}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'markets',
      title: 'Market Availability',
      type: 'array',
      group: 'commerce',
      description: 'Define price and IDs for each store (US, UK, EU)',
      of: [
        {
          type: 'object',
          title: 'Market Config',
          fields: [
            defineField({
              name: 'region',
              title: 'Region',
              type: 'string',
              options: {
                list: [
                  { title: 'USA', value: 'US' },
                  { title: 'United Kingdom', value: 'UK' },
                  { title: 'Europe', value: 'EU' },
                  { title: 'Japan', value: 'JP' },
                ],
              },
            }),
            defineField({
              name: 'currency',
              title: 'Currency Code (ISO 4217)',
              type: 'string',
              options: {
                list: [
                  { title: 'USD ($)', value: 'USD' },
                  { title: 'EUR (€)', value: 'EUR' },
                  { title: 'GBP (£)', value: 'GBP' },
                  { title: 'JPY (¥)', value: 'JPY' },
                ],
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'releaseDate',
              title: 'Launch Date',
              type: 'date',
              description:
                'Used to calculate if this item is "New" in this region.',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Display Price',
              type: 'number',
              description:
                'The local currency price (e.g. 599 for US, 499 for UK)',
              validation: Rule => Rule.required().min(0),
            }),
            defineField({
              name: 'compareAtPrice',
              title: 'MSRP / Original Price',
              type: 'number',
              description:
                'If set higher than Price, this triggers the strikethrough UI.',
              validation: Rule =>
                Rule.min(0).warning(
                  'Should be higher than current price to show savings'
                ),
            }),

            defineField({
              name: 'fulfillmentMethod',
              title: 'Method',
              type: 'string',
              options: {
                list: [
                  { title: 'Direct (Shopify)', value: 'direct' },
                  { title: 'Partner Link', value: 'external' },
                ],
                layout: 'radio',
              },
              initialValue: 'direct',
            }),
            // IF DIRECT (Shopify)
            defineField({
              name: 'shopifyVariantId',
              title: 'Shopify Variant ID',
              type: 'string',
              description:
                'The ID for this region specifically (e.g. US Plug vs UK Plug)',
              hidden: ({ parent }) => parent?.fulfillmentMethod !== 'direct',
            }),
            // IF EXTERNAL (Partner)
            defineField({
              name: 'externalUrl',
              title: 'Partner URL',
              type: 'url',
              hidden: ({ parent }) => parent?.fulfillmentMethod !== 'external',
            }),
          ],
          preview: {
            select: { region: 'region', price: 'price', currency: 'currency' },
            prepare({ region, price, currency }) {
              return {
                title: `${region} Market`,
                subtitle: `${price} ${currency}`,
              }
            },
          },
        },
      ],
    }),

    // sanity/schemaTypes/product.ts
    defineField({
      name: 'locallyIds',
      title: 'Locally Integration',
      type: 'object',
      group: 'locally',
      fields: [
        {
          name: 'upc',
          title: 'UPC / EAN',
          description:
            'The universal product code used by Locally to find stock.',
          type: 'string',
        },
        {
          name: 'styleId',
          title: 'Locally Style ID',
          description:
            'Optional: Use if you want to show all variants of a style.',
          type: 'string',
        },
      ],
    }),

    // --- SEO ---
    defineField({
      name: 'seo',
      title: 'SEO Metadata',
      type: 'seo',
      group: 'seo',
      description:
        'Override meta title and description for search engines and social sharing.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      const displayTitle =
        title?.en ||
        title?.es ||
        title?.fr ||
        title?.de ||
        title?.ja ||
        'Untitled Product'
      return {
        title: displayTitle,
        subtitle: subtitle ? `/${subtitle}` : undefined,
        media,
      }
    },
  },
})
