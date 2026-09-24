import { defineField, defineType } from 'sanity'
import { HashIcon } from '@sanity/icons'

export default defineType({
  name: 'smartNumber',
  title: 'Smart Number',
  type: 'object',
  icon: HashIcon,
  fields: [
    // 1. THE VALUE
    defineField({
      name: 'value',
      title: 'Raw Value',
      type: 'number',
      description: 'Enter the base number. (e.g. for "500 miles", enter 500)',
      validation: Rule => Rule.required(),
    }),

    // 2. THE UNIT (Triggers Conversion)
    defineField({
      name: 'unit',
      title: 'Unit Type',
      type: 'string',
      description:
        'Select a unit to enable automatic conversion for international users.',
      options: {
        list: [
          { title: 'None / Count (e.g. Users, Rides)', value: 'none' },
          { title: 'Distance: Miles (-> km)', value: 'miles' },
          { title: 'Distance: Kilometers (-> miles)', value: 'kilometers' },
          { title: 'Weight: Pounds (-> kg)', value: 'pounds' },
          { title: 'Weight: Kilograms (-> lbs)', value: 'kilograms' },
          { title: 'Temperature: °F (-> °C)', value: 'fahrenheit' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),

    // 3. DISPLAY OPTIONS
    defineField({
      name: 'notation',
      title: 'Formatting',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (1,000)', value: 'standard' },
          { title: 'Compact (1K / 1M)', value: 'compact' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
      hidden: ({ parent }) => parent?.unit !== 'none', // Hide if we are using units (units usually enforce their own format)
    }),

    // 4. DECORATORS (For "Approximate" or "More than")
    defineField({
      name: 'prefix',
      title: 'Prefix',
      type: 'string',
      options: { list: ['~', '<', '>'] },
      description: 'e.g. "~500"',
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      options: { list: ['+', '*'] },
      description: 'e.g. "500+" (Note: Units will appear after this)',
    }),
  ],
  preview: {
    select: { val: 'value', unit: 'unit', prefix: 'prefix', suffix: 'suffix' },
    prepare({ val, unit, prefix, suffix }) {
      // Simple preview logic
      let unitLabel = ''
      if (unit === 'miles') unitLabel = ' mi'
      if (unit === 'kilometers') unitLabel = ' km'
      if (unit === 'pounds') unitLabel = ' lbs'
      if (unit === 'fahrenheit') unitLabel = ' °F'

      return {
        title: `${prefix || ''}${val}${suffix || ''}${unitLabel}`,
        subtitle:
          unit !== 'none' ? `Auto-converts from ${unit}` : 'Static Number',
        media: HashIcon,
      }
    },
  },
})
