import { defineField, defineType } from 'sanity'
import { BarChartIcon } from '@sanity/icons'
import { localizedString } from '../lib/fieldHelpers'

export default defineType({
  name: 'stat',
  title: 'Statistic / Metric',
  type: 'document',
  icon: BarChartIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'data', title: 'Data' },
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

    defineField({
      name: 'smartValue',
      title: 'The Metric',
      type: 'smartNumber',
      group: 'data',
    }),

    // --- LOCALIZED LABEL ---
    {
      ...localizedString('label', 'The Context', {
        description: 'e.g. "Structured Workouts"',
      }),
      group: 'content',
    },
  ],
  preview: {
    select: {
      title: 'label.en',
      subtitle: 'smartValue.value',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Statistic',
        subtitle: subtitle ? `Value: ${subtitle}` : undefined,
      }
    },
  },
})
