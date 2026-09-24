import { defineType, defineField } from 'sanity'

/**
 * Enhanced Image Schema with mandatory alt text
 * Enforces accessibility best practices:
 * - Non-empty alt text for informative images
 * - Explicit alt="" for decorative images
 */
export default defineType({
  name: 'enhancedImage',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
    metadata: ['blurhash', 'lqip', 'palette'],
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description:
        'Required for SEO and accessibility. Describe the image content. Use empty string for decorative images.',
      validation: rule =>
        rule.custom(alt => {
          // Alt text is required (can be empty string for decorative images)
          if (alt === undefined || alt === null) {
            return 'Alt text is required. Use empty string ("") for decorative images.'
          }

          // If not empty, enforce quality standards
          if (alt.length > 0) {
            if (alt.length < 10) {
              return 'Descriptive alt text should be at least 10 characters.'
            }

            if (alt.length > 200) {
              return 'Alt text should be concise (max 200 characters). Consider moving detail to caption.'
            }

            // Discourage redundant phrases
            const lowerAlt = alt.toLowerCase()
            if (
              lowerAlt.startsWith('image of') ||
              lowerAlt.startsWith('picture of') ||
              lowerAlt.startsWith('photo of')
            ) {
              return 'Avoid starting with "image of" or "picture of" - describe what\'s actually shown.'
            }
          }

          return true
        }),
      placeholder:
        'Describe the image content (or leave empty for decorative images)',
    }),
    defineField({
      name: 'isDecorative',
      type: 'boolean',
      title: 'Decorative Image',
      description:
        'Mark as decorative if the image is purely visual and adds no content value. This will enforce alt="".',
      initialValue: false,
      validation: rule =>
        rule.custom((isDecorative, context) => {
          const alt = (context.parent as any)?.alt

          // If marked as decorative, alt must be empty
          if (isDecorative && alt && alt.length > 0) {
            return 'Decorative images must have empty alt text ("")'
          }

          // If alt is empty, must be marked as decorative
          if (!isDecorative && (!alt || alt.length === 0)) {
            return 'Images with empty alt text must be marked as decorative'
          }

          return true
        }),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption (Optional)',
      description: 'Optional caption displayed with the image',
      validation: rule => rule.max(300),
    }),
  ],
})
