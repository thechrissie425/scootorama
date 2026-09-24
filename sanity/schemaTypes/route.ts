import { defineField, defineType } from 'sanity'
import { localizedString, localizedText } from '../lib/fieldHelpers'
import { RouteSelector } from '../components/RouteSelector'

export default defineType({
  name: 'route',
  title: 'Route',
  type: 'document',
  icon: () => '🗺️',
  groups: [
    { name: 'content', title: 'Marketing Content' },
    { name: 'data', title: 'Route Data (from world catalog)' },
  ],
  fields: [
    // --- SELECT ROUTE FROM GAME DICTIONARY ---
    defineField({
      name: 'routeId',
      title: 'Select Route',
      type: 'string',
      description:
        'Search and select a route from the Scootorama world catalog',
      validation: Rule => Rule.required(),
      components: {
        input: RouteSelector,
      },
    }),

    // --- MARKETING CONTENT (User-editable) ---
    {
      ...localizedText('description', 'Marketing Description', {
        description: 'Add a compelling description for this route',
        rows: 4,
      }),
      group: 'content',
    },
    {
      ...localizedText('highlights', 'Route Highlights', {
        description:
          'Key features, challenges, or fun facts (bullet points work great)',
        rows: 3,
      }),
      group: 'content',
    },
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Professional marketing photo (replaces game screenshot)',
      options: { hotspot: true },
      group: 'content',
    }),
    defineField({
      name: 'mapImage',
      title: 'Route Map',
      type: 'image',
      description: 'Clean route map visual (transparent PNG recommended)',
      options: { hotspot: true },
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Categorize this route for filtering',
      options: {
        list: [
          { title: 'Flat', value: 'flat' },
          { title: 'Hilly', value: 'hilly' },
          { title: 'Climbing', value: 'climbing' },
          { title: 'Sprint', value: 'sprint' },
          { title: 'Beginner Friendly', value: 'beginner' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'Scenic', value: 'scenic' },
          { title: 'Popular', value: 'popular' },
          { title: 'Race Route', value: 'race' },
        ],
      },
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Route',
      type: 'boolean',
      description: 'Display prominently on the website',
      initialValue: false,
      group: 'content',
    }),

    // --- ROUTE DATA (Read-only from the world catalog) ---
    defineField({
      ...localizedString('name', 'Route Name', { required: true }),
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name.en' },
      group: 'data',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'world',
      title: 'World',
      type: 'string',
      description: 'From the world catalog',
      group: 'data',
      readOnly: true,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sportType',
      title: 'Ride Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Kick (workout)', value: 'KICK' },
          { title: 'Cruise (sightseeing)', value: 'CRUISE' },
        ],
      },
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'distance',
      title: 'Distance (km)',
      type: 'number',
      description: 'From the world catalog',
      validation: Rule => Rule.required().positive(),
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'elevation',
      title: 'Elevation Gain (m)',
      type: 'number',
      description: 'From the world catalog',
      validation: Rule => Rule.required().positive(),
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty (1-5)',
      type: 'number',
      description: 'From the world catalog',
      validation: Rule => Rule.required().min(1).max(5),
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'imageUrl',
      title: 'CDN Image URL',
      type: 'url',
      description: 'Optional external route image URL',
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'profileImageUrl',
      title: 'CDN Profile/Map URL',
      type: 'url',
      description: 'Optional external route profile/map URL',
      group: 'data',
      readOnly: true,
    }),
    defineField({
      name: 'deeplink',
      title: 'App Deep Link',
      type: 'url',
      description: 'Optional override for scootorama://... deep link',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      world: 'world',
      distance: 'distance',
      elevation: 'elevation',
      media: 'heroImage',
    },
    prepare({ title, world, distance, elevation, media }) {
      return {
        title: title || 'Untitled Route',
        subtitle:
          world && distance
            ? `${world} • ${distance.toFixed(1)} km • ${Math.round(elevation)} m`
            : 'Select a route from the world catalog',
        media,
      }
    },
  },
})
