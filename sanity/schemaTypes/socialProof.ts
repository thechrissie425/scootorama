import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'
import { localizedText, localizedString } from '../lib/fieldHelpers'

export default defineType({
  name: 'socialProof',
  title: 'Social Proof',
  type: 'document',
  icon: CommentIcon,
  groups: [
    { name: 'content', title: 'The Quote' },
    { name: 'author', title: 'Author & Source' },
    { name: 'visuals', title: 'Visual Styling' },
    { name: 'meta', title: 'Taxonomy' },
  ],
  fields: [
    // --- LOCALIZATION TOGGLE ---
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      group: 'meta',
      initialValue: false,
    }),
    // --- LOCALIZED QUOTE ---
    {
      ...localizedText('quote', 'Quote Text', {
        required: true,
        maxLength: 200,
        rows: 3,
        description:
          'The shorter the better. Highlight key phrases in *bold* for emphasis.',
      }),
      group: 'content',
    },

    // --- 2. SOURCE TYPE (The Fork in the Road) ---
    defineField({
      name: 'type',
      title: 'Source Type',
      type: 'string',
      group: 'author',
      options: {
        list: [
          { title: 'Community (Scooter)', value: 'community' },
          { title: 'Industry (Press/Media)', value: 'industry' },
        ],
        layout: 'radio',
      },
      initialValue: 'community',
    }),

    // --- LOCALIZED AUTHOR ---
    {
      ...localizedString('author', 'Author Name', {
        required: true,
        description: 'e.g. "Sarah J." or "The Daily Kick"',
      }),
      group: 'author',
    },
    {
      ...localizedString('role', 'Role / Context', {
        description: 'e.g. "Level 50 Scooter" or "Senior Gear Editor"',
      }),
      group: 'author',
    },

    // --- 4. VISUALS ---
    // A. For Community: The Face
    defineField({
      name: 'avatar',
      title: 'User Avatar',
      type: 'image',
      group: 'visuals',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== 'community',
      description: 'Real faces build trust. Use a high-res selfie if possible.',
    }),
    // B. For Industry: The "Workaround" Styling
    defineField({
      name: 'publicationColor',
      title: 'Brand Accent Color',
      type: 'string',
      group: 'visuals',
      hidden: ({ parent }) => parent?.type !== 'industry',
      description:
        "The clever workaround. Use the publication's brand color (e.g. red for a newspaper, purple for a podcast) to imply the brand without paying for the logo.",
      options: {
        list: [
          { title: 'Ink', value: '#241E3A' },
          { title: 'Turquoise', value: '#00858C' },
          { title: 'Editorial Red', value: '#E0262D' },
          { title: 'Hot Pink', value: '#D6117A' },
          { title: 'Grape', value: '#8B5CF6' },
        ],
      },
    }),
    defineField({
      name: 'starRating',
      title: 'Star Rating',
      type: 'number',
      group: 'visuals',
      description: 'Optional. Leave empty to hide stars.',
      options: {
        list: [5, 4.5, 4],
      },
    }),

    // --- 5. TAXONOMY (The Smart Engine) ---
    defineField({
      name: 'tags',
      title: 'Context Tags',
      type: 'array',
      group: 'meta',
      description:
        'Where should this appear? (e.g. Tag "Hardware" to show this on the Cruiser Deluxe page)',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      options: { layout: 'tags' },
    }),
  ],

  preview: {
    select: {
      author: 'author',
      quote: 'quote',
      media: 'avatar',
      type: 'type',
    },
    prepare({ author, quote, media, type }) {
      const displayAuthor =
        author?.en ||
        author?.es ||
        author?.fr ||
        author?.de ||
        author?.ja ||
        'Social Proof'
      const displayQuote =
        quote?.en || quote?.es || quote?.fr || quote?.de || quote?.ja || ''
      return {
        title: displayAuthor,
        subtitle: `${type === 'industry' ? '📰 ' : '👤 '}${displayQuote}`,
        media: media,
      }
    },
  },
})
