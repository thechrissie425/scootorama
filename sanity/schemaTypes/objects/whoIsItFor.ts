import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'whoIsItFor',
  title: 'Who Is It Good For',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "Perfect for New Scooters"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'e.g., "Complete all-in-one solution"',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {
        list: [
          { title: '👥 Users (General audience)', value: 'Users' },
          { title: '🔧 Wrench (Technical/DIY)', value: 'Wrench' },
          { title: '⚡ Zap (Performance/Power)', value: 'Zap' },
        ],
        layout: 'radio',
      },
      initialValue: 'Users',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Key Features/Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of bullet points explaining who this is good for',
      validation: Rule => Rule.min(1).max(6).error('Include 1-6 key features'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      features: 'features',
    },
    prepare({ title, subtitle, features }) {
      return {
        title,
        subtitle: `${subtitle} • ${features?.length || 0} features`,
      }
    },
  },
})
