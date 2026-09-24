import { defineField, defineType } from 'sanity'
import { BarChartIcon } from '@sanity/icons'

export default defineType({
  name: 'statsGrid',
  title: 'Stats Grid',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'stats',
      title: 'Metrics to Show',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'stat' }],
        },
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Background Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (Black/Orange)', value: 'dark' },
          { title: 'Light (White/Grey)', value: 'light' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {
      stats0: 'stats.0.label.en',
      stats1: 'stats.1.label.en',
      stats2: 'stats.2.label.en',
      stats3: 'stats.3.label.en',
    },
    prepare(selection) {
      const stats = Object.values(selection).filter(Boolean)
      return {
        title: 'Stats Grid',
        subtitle:
          stats.length > 0
            ? `Showing: ${stats.join(', ')}`
            : 'No stats selected',
        media: BarChartIcon,
      }
    },
  },
})
