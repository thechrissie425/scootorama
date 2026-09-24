import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'sticker',
  title: 'Sticker',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Sticker Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Sticker Type',
      type: 'string',
      options: {
        list: [
          { title: 'Sale', value: 'sale' },
          { title: 'New', value: 'new' },
          { title: 'Hot', value: 'hot' },
          { title: 'Limited', value: 'limited' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'sale',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: '#FF0000',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      initialValue: '#FFFFFF',
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
        ],
        layout: 'radio',
      },
      initialValue: 'top-right',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      type: 'type',
      backgroundColor: 'backgroundColor',
    },
    prepare({ text, type, backgroundColor }) {
      return {
        title: text || 'Untitled Sticker',
        subtitle: `${type} - ${backgroundColor}`,
        media: TagIcon,
      }
    },
  },
})