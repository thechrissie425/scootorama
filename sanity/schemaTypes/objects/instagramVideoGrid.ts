import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'instagramVideoGrid',
  title: 'Instagram Video Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'e.g., "What Our Athletes Are Saying"',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading (Optional)',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'videos',
      title: 'Instagram Videos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'instagramVideoCard' }] }],
      validation: rule => rule.min(1).max(12),
    }),
    defineField({
      name: 'columns',
      title: 'Grid Columns (Desktop)',
      type: 'number',
      initialValue: 3,
      options: {
        list: [
          { title: '2 Columns', value: 2 },
          { title: '3 Columns', value: 3 },
          { title: '4 Columns', value: 4 },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'showCaptions',
      title: 'Show Captions',
      type: 'boolean',
      initialValue: true,
      description: 'Display video captions below each card',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      videos: 'videos',
    },
    prepare({ title, videos }) {
      const videoCount = videos?.length || 0
      return {
        title: title || 'Instagram Video Grid',
        subtitle: `${videoCount} video${videoCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
