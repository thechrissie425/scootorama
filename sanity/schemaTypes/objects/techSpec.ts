import { defineField, defineType } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'techSpec',
  title: 'Technical Specification',
  type: 'object',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'object',
      description: 'e.g., "Physical Dimensions", "Performance & Power"',
      validation: Rule => Rule.required(),
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'fr', title: 'French', type: 'string' },
        { name: 'de', title: 'German', type: 'string' },
        { name: 'ja', title: 'Japanese', type: 'string' },
      ],
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Specification',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'object',
              description:
                'e.g., "Weight", "Rider Fit Range", "Power Accuracy"',
              validation: Rule => Rule.required(),
              fields: [
                {
                  name: 'en',
                  title: 'English',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'ja', title: 'Japanese', type: 'string' },
              ],
            }),
            defineField({
              name: 'specType',
              title: 'Specification Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Single Value', value: 'single' },
                  { title: 'Range (Min-Max)', value: 'range' },
                  { title: 'Text Description', value: 'text' },
                ],
                layout: 'radio',
              },
              initialValue: 'single',
              validation: Rule => Rule.required(),
            }),
            // Single value
            defineField({
              name: 'value',
              title: 'Value',
              type: 'number',
              description:
                'Single numeric value (use metric as source when possible, for feet-inches use total inches)',
              hidden: ({ parent }) => parent?.specType !== 'single',
            }),
            // Range values
            defineField({
              name: 'minValue',
              title: 'Minimum Value',
              type: 'number',
              description:
                'Minimum value for range (use metric as source when possible, for feet-inches use total inches)',
              hidden: ({ parent }) => parent?.specType !== 'range',
            }),
            defineField({
              name: 'maxValue',
              title: 'Maximum Value',
              type: 'number',
              description:
                'Maximum value for range (use metric as source when possible, for feet-inches use total inches)',
              hidden: ({ parent }) => parent?.specType !== 'range',
            }),
            // Text value for complex descriptions
            defineField({
              name: 'textValue',
              title: 'Text Value',
              type: 'object',
              description:
                'For complex specs that cannot be converted (e.g., "Chain", "Flat Included")',
              hidden: ({ parent }) => parent?.specType !== 'text',
              fields: [
                { name: 'en', title: 'English', type: 'text', rows: 2 },
                { name: 'es', title: 'Spanish', type: 'text', rows: 2 },
                { name: 'fr', title: 'French', type: 'text', rows: 2 },
                { name: 'de', title: 'German', type: 'text', rows: 2 },
                { name: 'ja', title: 'Japanese', type: 'text', rows: 2 },
              ],
            }),
            defineField({
              name: 'unit',
              title: 'Unit Type',
              type: 'string',
              options: {
                list: [
                  { title: 'None (just number)', value: 'none' },
                  {
                    title: 'Kilograms (auto-converts to lbs)',
                    value: 'kilograms',
                  },
                  { title: 'Pounds (auto-converts to kg)', value: 'pounds' },
                  {
                    title: 'Centimeters (auto-converts to inches)',
                    value: 'centimeters',
                  },
                  {
                    title: 'Millimeters (auto-converts to inches)',
                    value: 'millimeters',
                  },
                  { title: 'Inches (auto-converts to cm)', value: 'inches' },
                  {
                    title:
                      'Feet-Inches (input in total inches, displays as 5\'2")',
                    value: 'feet-inches',
                  },
                  { title: 'Watts', value: 'watts' },
                  { title: 'Percent (%)', value: 'percent' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'none',
              hidden: ({ parent }) => parent?.specType === 'text',
              validation: Rule =>
                Rule.custom((unit, context) => {
                  const specType = (context?.parent as any)?.specType
                  if (specType !== 'text' && !unit) {
                    return 'Unit is required for numeric specifications'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'object',
              description: 'Optional clarification or additional info',
              fields: [
                { name: 'en', title: 'English', type: 'string' },
                { name: 'es', title: 'Spanish', type: 'string' },
                { name: 'fr', title: 'French', type: 'string' },
                { name: 'de', title: 'German', type: 'string' },
                { name: 'ja', title: 'Japanese', type: 'string' },
              ],
            }),
          ],
          preview: {
            select: {
              label: 'label',
              specType: 'specType',
              value: 'value',
              minValue: 'minValue',
              maxValue: 'maxValue',
              textValue: 'textValue',
              unit: 'unit',
            },
            prepare({
              label,
              specType,
              value,
              minValue,
              maxValue,
              textValue,
              unit,
            }) {
              // Extract English text from localized fields
              const labelText =
                typeof label === 'string' ? label : label?.en || 'Untitled'
              const textValueText =
                typeof textValue === 'string' ? textValue : textValue?.en
              let subtitle = ''

              if (specType === 'text') {
                subtitle = textValueText || 'Text specification'
              } else if (specType === 'range' && minValue && maxValue) {
                const unitDisplay =
                  unit === 'none'
                    ? ''
                    : unit === 'kilograms'
                      ? 'kg'
                      : unit === 'pounds'
                        ? 'lbs'
                        : unit === 'centimeters'
                          ? 'cm'
                          : unit === 'millimeters'
                            ? 'mm'
                            : unit === 'inches'
                              ? 'in'
                              : unit === 'feet-inches'
                                ? ''
                                : unit === 'watts'
                                  ? 'W'
                                  : unit === 'percent'
                                    ? '%'
                                    : ''

                subtitle =
                  unit === 'feet-inches'
                    ? `${Math.floor((minValue || 0) / 30.48)}'${Math.round((((minValue || 0) / 30.48) % 1) * 12)}" – ${Math.floor((maxValue || 0) / 30.48)}'${Math.round((((maxValue || 0) / 30.48) % 1) * 12)}"`
                    : `${minValue} – ${maxValue} ${unitDisplay}`
              } else if (specType === 'single' && value) {
                const unitDisplay =
                  unit === 'none'
                    ? ''
                    : unit === 'kilograms'
                      ? 'kg'
                      : unit === 'pounds'
                        ? 'lbs'
                        : unit === 'centimeters'
                          ? 'cm'
                          : unit === 'millimeters'
                            ? 'mm'
                            : unit === 'inches'
                              ? 'in'
                              : unit === 'watts'
                                ? 'W'
                                : unit === 'percent'
                                  ? '%'
                                  : ''

                subtitle = `${value} ${unitDisplay}`
              }

              return {
                title: labelText,
                subtitle: subtitle,
              }
            },
          },
        },
      ],
      validation: rule =>
        rule
          .min(1)
          .error('At least one specification required')
          .max(15)
          .warning(
            'Consider limiting to 15 specs per category for better readability'
          ),
    }),
  ],
  preview: {
    select: {
      category: 'category',
      specs: 'specs',
    },
    prepare({ category, specs }) {
      const categoryText =
        typeof category === 'string'
          ? category
          : category?.en || 'Untitled Category'
      return {
        title: categoryText,
        subtitle: `${specs?.length || 0} specifications`,
      }
    },
  },
})
