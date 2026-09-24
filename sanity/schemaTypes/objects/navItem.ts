import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this component',
      initialValue: false,
    }),

    // --- MAIN LABEL ---
    defineField({
      name: 'label',
      title: 'Menu Label (English Primary)',
      type: 'string',
      validation: rule => rule.required(),
    }),

    // Localized Labels
    defineField({
      name: 'labelLocal',
      title: 'Localized Labels',
      type: 'object',
      hidden: ({ parent }) => !parent?.showTranslationFields,
      fields: [
        { name: 'es', type: 'string', title: 'Spanish' },
        { name: 'fr', type: 'string', title: 'French' },
        { name: 'de', type: 'string', title: 'German' },
        { name: 'ja', type: 'string', title: 'Japanese' },
      ],
    }),

    // 1. TOP LEVEL LINK
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'membershipPage' },
        { type: 'campaign' },
        { type: 'post' },
      ],
      description: 'Where does clicking this top-level text go?',
    }),

    defineField({
      name: 'type',
      title: 'Menu Type',
      type: 'string',
      options: {
        list: [
          { title: 'Simple Link (No Dropdown)', value: 'link' },
          { title: 'Mega Menu (Dropdown)', value: 'mega' },
        ],
        layout: 'radio',
      },
      initialValue: 'link',
    }),

    // --- MEGA MENU CONFIGURATION ---

    // 2. FEATURE CARD
    defineField({
      name: 'featuredCard',
      title: 'Featured Highlight',
      type: 'object',
      hidden: ({ parent }) => parent?.type !== 'mega',
      fields: [
        {
          name: 'heading',
          type: 'string',
          title: 'Card Headline (English)',
        },
        // Localized heading fields
        {
          name: 'headingLocal',
          title: 'Localized Headings',
          type: 'object',
          hidden: ({ parent }) => !parent?.parent?.showTranslationFields,
          fields: [
            { name: 'es', type: 'string', title: 'Spanish' },
            { name: 'fr', type: 'string', title: 'French' },
            { name: 'de', type: 'string', title: 'German' },
            { name: 'ja', type: 'string', title: 'Japanese' },
          ],
        },
        {
          name: 'image',
          type: 'image',
          title: 'Card Image',
          options: { hotspot: true },
        },
        {
          name: 'link',
          type: 'reference',
          to: [
            { type: 'page' },
            { type: 'membershipPage' },
            { type: 'campaign' },
            { type: 'post' },
          ],
          title: 'Card Destination',
        },
      ],
    }),

    // 3. SUB-LINKS
    defineField({
      name: 'subLinks',
      title: 'Menu Columns',
      type: 'array',
      hidden: ({ parent }) => parent?.type !== 'mega',
      of: [
        {
          type: 'object',
          name: 'subLink',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Link Title (English)',
            },
            // Localized title fields
            {
              name: 'titleLocal',
              title: 'Localized Titles',
              type: 'object',
              hidden: ({ document }) => {
                // Check if any navItem has showTranslationFields enabled
                return (
                  !Array.isArray(document?.mainNav) ||
                  !document?.mainNav?.some(
                    (item: any) => item.showTranslationFields
                  )
                )
              },
              fields: [
                { name: 'es', type: 'string', title: 'Spanish' },
                { name: 'fr', type: 'string', title: 'French' },
                { name: 'de', type: 'string', title: 'German' },
                { name: 'ja', type: 'string', title: 'Japanese' },
              ],
            },
            {
              name: 'targetPage',
              type: 'reference',
              to: [
                { type: 'page' },
                { type: 'membershipPage' },
                { type: 'campaign' },
                { type: 'post' },
                { type: 'productPage' },
              ],
              title: 'Destination Page',
            },
            {
              name: 'icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Bike', value: 'bike' },
                  { title: 'Trainer', value: 'trainer' },
                  { title: 'Map', value: 'map' },
                  { title: 'Chart', value: 'chart' },
                  { title: 'Heart', value: 'heart' },
                  { title: 'Sun', value: 'sun' },
                ],
              },
            },
            {
              name: 'description',
              type: 'string',
              title: 'Description (English)',
            },
            // Localized description fields
            {
              name: 'descriptionLocal',
              title: 'Localized Descriptions',
              type: 'object',
              hidden: ({ document }) => {
                // Check if any navItem has showTranslationFields enabled
                return (
                  !Array.isArray(document?.mainNav) ||
                  !document?.mainNav?.some(
                    (item: any) => item.showTranslationFields
                  )
                )
              },
              fields: [
                { name: 'es', type: 'string', title: 'Spanish' },
                { name: 'fr', type: 'string', title: 'French' },
                { name: 'de', type: 'string', title: 'German' },
                { name: 'ja', type: 'string', title: 'Japanese' },
              ],
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),
  ],
})
