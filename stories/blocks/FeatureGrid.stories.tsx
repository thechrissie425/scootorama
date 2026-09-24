import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import FeatureGrid from '@/components/blocks/FeatureGrid'

const meta: Meta<typeof FeatureGrid> = {
  title: 'Blocks/FeatureGrid',
  component: FeatureGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FeatureGrid>

export const ThreeFeatures: Story = {
  args: {
    heading: {
      en: 'Everything You Need',
      es: 'Todo Lo Que Necesitas',
    },
    items: [
      {
        _key: '1',
        _type: 'manualItem',
        title: {
          en: 'Structured Workouts',
          es: 'Entrenamientos Estructurados',
        },
        subtitle: {
          en: 'Follow professionally designed training plans',
          es: 'Sigue planes de entrenamiento diseñados profesionalmente',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Structured workouts',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
      {
        _key: '2',
        _type: 'manualItem',
        title: {
          en: 'Virtual Worlds',
          es: 'Mundos Virtuales',
        },
        subtitle: {
          en: 'Explore stunning virtual landscapes',
          es: 'Explora impresionantes paisajes virtuales',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Virtual worlds',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
      {
        _key: '3',
        _type: 'manualItem',
        title: {
          en: 'Performance Analytics',
          es: 'Análisis de Rendimiento',
        },
        subtitle: {
          en: 'Track your progress with detailed metrics',
          es: 'Rastrea tu progreso con métricas detalladas',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Performance analytics',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
    ],
    language: 'en',
    market: 'us',
  },
}

export const Spanish: Story = {
  args: {
    heading: {
      en: 'Features',
      es: 'Características',
    },
    items: [
      {
        _key: '1',
        _type: 'manualItem',
        title: { en: 'Realistic Physics', es: 'Física Realista' },
        subtitle: {
          en: 'Experience realistic gradient changes',
          es: 'Experimenta cambios de gradiente realistas',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Physics',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
      {
        _key: '2',
        _type: 'manualItem',
        title: { en: 'Social Features', es: 'Características Sociales' },
        subtitle: {
          en: 'Ride with friends anywhere',
          es: 'Pedalea con amigos en cualquier lugar',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Social',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
      {
        _key: '3',
        _type: 'manualItem',
        title: { en: 'Custom Avatars', es: 'Avatares Personalizados' },
        subtitle: {
          en: 'Personalize your rider',
          es: 'Personaliza tu ciclista',
        },
        image: {
          _type: 'image',
          asset: { _ref: 'placeholder', _type: 'reference' },
          alt: 'Avatars',
        },
        size: 'square' as const,
        theme: 'light' as const,
      },
    ],
    language: 'es',
    market: 'us',
  },
}
