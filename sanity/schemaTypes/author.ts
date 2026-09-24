import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'
import {
  localizedString,
  localizedText,
  localizedBlock,
  getLocalizedPreview,
} from '../lib/fieldHelpers'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'profile', title: 'Profile' },
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
    // --- LOCALIZED NAME ---
    {
      ...localizedString('name', 'Author Name', { required: true }),
      group: 'content',
    },
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name.en' }, // Use English name for slug
      validation: rule => rule.required(),
    }),
    // --- LOCALIZED ROLE ---
    {
      ...localizedString('role', 'Role / Title', {
        description: 'e.g. "Senior Editor" or "Guest Coach"',
      }),
      group: 'profile',
    },
    defineField({
      name: 'image',
      title: 'Avatar',
      type: 'image',
      group: 'profile',
      options: { hotspot: true },
    }),
    // --- LOCALIZED BIO ---
    {
      ...localizedBlock('bio', 'Author Biography', {
        description: 'Appears at the bottom of their posts',
      }),
      group: 'profile',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: getLocalizedPreview(title, 'Author'),
        subtitle: getLocalizedPreview(subtitle),
        media: media || UserIcon,
      }
    },
  },
})
