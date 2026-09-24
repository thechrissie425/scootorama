import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export default defineType({
  name: 'instagramVideoCard',
  title: 'Instagram Video',
  type: 'document',
  icon: PlayIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'metadata', title: 'Metadata' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description:
        'For organizing in CMS (e.g., "Sarah Johnson - Cruiser Deluxe Review")',
      validation: rule => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'video',
      title: 'Video File',
      type: 'file',
      description:
        'Upload the Instagram video directly (MP4 format recommended). Sanity will handle CDN hosting automatically.',
      options: {
        accept: 'video/mp4,video/webm,video/mov',
      },
      validation: rule => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Video Thumbnail (Optional)',
      type: 'image',
      description: 'Optional: Custom thumbnail image while video loads',
      options: {
        hotspot: true,
      },
      group: 'content',
    }),
    defineField({
      name: 'username',
      title: 'Display Name',
      type: 'string',
      description: 'e.g., "Sarah Johnson"',
      validation: rule => rule.required(),
      group: 'metadata',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'e.g., "@sarahjohnson" or "sarahjohnson"',
      validation: rule => rule.required(),
      group: 'metadata',
    }),
    defineField({
      name: 'instagramPostUrl',
      title: 'Instagram Post URL',
      type: 'url',
      description: 'Link to the original Instagram post or reel',
      validation: rule =>
        rule.required().uri({
          scheme: ['http', 'https'],
        }),
      group: 'metadata',
    }),
    defineField({
      name: 'caption',
      title: 'Caption (Optional)',
      type: 'text',
      rows: 2,
      description: 'Short caption or quote from the post',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'username',
      media: 'thumbnail',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Instagram Video',
        subtitle: subtitle ? `@${subtitle}` : 'No username',
      }
    },
  },
})
