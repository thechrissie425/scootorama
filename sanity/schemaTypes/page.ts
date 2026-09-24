import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { localizedString } from '../lib/fieldHelpers'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO & Social' },
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
    {
      ...localizedString('title', 'Page Title', { required: true }),
      group: 'content',
    },
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      of: [
        { type: 'hero' },
        { type: 'firecracker' },
        { type: 'featureGrid' },
        { type: 'carousel' },
        { type: 'contentDisplay' },
        { type: 'pricingBlock' },
        { type: 'river' },
        { type: 'socialProofSection' },
        { type: 'benefitsSection' },
        { type: 'goalsSection' },
        { type: 'transformationTabs' },
        { type: 'featuresByCategory' },
        { type: 'instagramVideoGrid' },
        { type: 'faqSection' },
        { type: 'statsGrid' },
        { type: 'tabs' },
        { type: 'productGrid' },
        { type: 'heroSplit' },
      ],
      options: {
        insertMenu: {
          views: [
            { name: 'list' }, // List view for the insert menu
            { name: 'grid' }, // Grid view (if you had preview images for blocks)
          ],
        },
      },
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
      title: 'title',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { title, slug } = selection
      return {
        title:
          title?.en ||
          title?.es ||
          title?.fr ||
          title?.de ||
          title?.ja ||
          'Untitled Page',
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
