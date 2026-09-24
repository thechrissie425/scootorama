import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'inlineIcon',
  title: 'Inline Icon',
  type: 'object',
  icon: () => '⚡',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Select an icon from the dropdown',
      options: {
        list: [
          // Badges
          { title: '🏅 Verified Badge', value: 'badges/badge-verified' },
          { title: '🏅 Ambassador Badge', value: 'badges/badge-ambassador' },
          { title: '🏅 Pro Scooter Badge', value: 'badges/badge-pro-ride' },
          { title: '🏅 Pro Run Badge', value: 'badges/badge-pro-run' },
          { title: '🏅 Pro Tri Badge', value: 'badges/badge-pro-tri' },
          { title: '🏅 Parade Leader Badge', value: 'badges/badge-parade-leader' },
          { title: '🏅 Route Badge', value: 'badges/badge-route' },
          {
            title: '🏅 Community Leader Badge',
            value: 'badges/badge-community-leader',
          },

          // Powerups
          { title: '⚡ Tailwind', value: 'powerups/powerup-aero' },
          { title: '⚡ Anvil Drop', value: 'powerups/powerup-anvil' },
          { title: '⚡ Rubber-Chicken Draft', value: 'powerups/powerup-draft' },
          {
            title: '⚡ Featherweight',
            value: 'powerups/powerup-featherweight',
          },
          { title: '⚡ Vanishing Act', value: 'powerups/powerup-invisibility' },
          { title: '⚡ Honk Points', value: 'powerups/powerup-xp' },
          { title: '⚡ Mega Honk Points', value: 'powerups/powerup-big-xp' },

          // Emotes
          { title: '📯 Honk', value: 'emotes/emote-honk' },
          { title: '🚀 Full Speed', value: 'emotes/emote-full-speed' },
          { title: '👋 Bell', value: 'emotes/emote-bell' },
          { title: '👋 Toast', value: 'emotes/emote-toast' },
          { title: '👋 Wave', value: 'emotes/emote-wave' },
          { title: '👋 Happy', value: 'emotes/emote-happy' },
          { title: '👋 Your Turn', value: 'emotes/emote-your-turn' },
          { title: '👋 Oop', value: 'emotes/emote-oop' },
          { title: '👋 Point', value: 'emotes/emote-point' },

          // Sports
          { title: '🛴 Scooter', value: 'sports/sport-scooter' },
          { title: '🏃 Running', value: 'sports/sport-running' },
          { title: '🚣 Rowing', value: 'sports/sport-rowing' },
          { title: '🏊 Triathlon', value: 'sports/sport-triathlon' },
          { title: '🧘 Yoga', value: 'sports/sport-yoga' },

          // Categories
          { title: '🏆 Category A', value: 'categories/category-a' },
          { title: '🏆 Category B', value: 'categories/category-b' },
          { title: '🏆 Category C', value: 'categories/category-c' },
          { title: '🏆 Category D', value: 'categories/category-d' },
          { title: '🏆 Category E', value: 'categories/category-e' },

          // Metrics
          { title: '📊 Zoom Power', value: 'metrics/power' },
          { title: '📊 Average Zoom Power', value: 'metrics/average-power' },
          { title: '📊 Power to Weight', value: 'metrics/power-to-weight' },
          { title: '📊 Kick Cadence', value: 'metrics/cadence-kick' },
          { title: '📊 Running Cadence', value: 'metrics/cadence-run' },
          { title: '📊 Heart Rate', value: 'metrics/heart-rate' },
          { title: '📊 Speed', value: 'metrics/speed' },
          { title: '📊 Calories', value: 'metrics/calories' },
          { title: '📊 Distance', value: 'metrics/distance' },
          { title: '📊 Elevation', value: 'metrics/elevation' },

          // Connections
          { title: '📡 Bluetooth', value: 'connections/connection-bluetooth' },
          { title: '📡 WiFi', value: 'connections/connection-wifi' },
          {
            title: '📡 Mobile App',
            value: 'connections/connection-app',
          },
          { title: '📡 ANT+', value: 'connections/connection-ant-plus' },
        ],
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'Size of the icon',
      options: {
        list: [
          { title: 'Small (16px)', value: 'small' },
          { title: 'Medium (20px)', value: 'medium' },
          { title: 'Large (24px)', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      icon: 'icon',
      size: 'size',
    },
    prepare({ icon, size }) {
      const iconName = icon?.split('/').pop()?.replace(/-/g, ' ') || 'Icon'
      return {
        title: `⚡ ${iconName}`,
        subtitle: `Size: ${size || 'medium'}`,
      }
    },
  },
})
