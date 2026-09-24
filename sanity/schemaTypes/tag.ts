import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'
import { localizedString } from '../lib/fieldHelpers'

export default defineType({
  name: 'tag',
  title: 'Taxonomy Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'showTranslationFields',
      title: '🌐 Enable Translation Fields',
      type: 'boolean',
      description: 'Toggle to show/hide translation fields for this document',
      initialValue: false,
    }),

    {
      ...localizedString('title', 'Tag Name', {
        required: true,
        description:
          'e.g. "Hardware", "Cruiser Deluxe", "Game Features", "Pricing Table"',
      }),
    },
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Tag Color (Studio Only)',
      type: 'string',
      description: 'Choose a color to organize and identify this tag in lists.',
      options: {
        list: [
          { title: '🔵 Blue (General/Default)', value: 'blue' },
          { title: '🟢 Green (Hardware/Equipment)', value: 'green' },
          { title: '🟣 Purple (Game Features)', value: 'purple' },
          { title: '🟠 Orange (Pricing/Business)', value: 'orange' },
          { title: '🔴 Red (Important/Priority)', value: 'red' },
          { title: '🟡 Yellow (New/Beta)', value: 'yellow' },
          { title: '🟤 Brown (Legacy/Support)', value: 'brown' },
          { title: '⚪ Gray (Inactive/Archive)', value: 'gray' },
          { title: '🟢 Mint (Performance)', value: 'mint' },
          { title: '🟦 Cyan (Connectivity)', value: 'cyan' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'blue',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color',
    },
    prepare({ title, color }) {
      const colorConfig = {
        blue: '🔵',
        green: '🟢',
        purple: '🟣',
        orange: '🟠',
        red: '🔴',
        yellow: '🟡',
        brown: '🟤',
        gray: '⚪',
        mint: '🟢',
        cyan: '🟦',
      }

      const emoji =
        colorConfig[color as keyof typeof colorConfig] || colorConfig.blue
      const displayTitle =
        title?.en ||
        title?.es ||
        title?.fr ||
        title?.de ||
        title?.ja ||
        'Untitled Tag'

      return {
        title: displayTitle,
        subtitle: `${emoji} ${(color || 'blue').toUpperCase()}`,
      }
    },
  },
})
