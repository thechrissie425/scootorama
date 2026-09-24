import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Hero from '@/components/blocks/Hero'

const meta: Meta<typeof Hero> = {
  title: 'Blocks/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['center', 'left', 'bottom-left'],
    },
    priority: {
      control: 'select',
      options: ['high', 'normal', 'low'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Hero>

export const Center: Story = {
  args: {
    heading: {
      en: 'Welcome to Scootorama',
      es: 'Bienvenido a Scootorama',
    },
    subheading: {
      en: 'The wackiest indoor scooter adventure',
      es: 'La mejor experiencia de ciclismo indoor',
    },
    cta: {
      label: 'Get Started',
      linkType: 'internal',
      internalLink: {
        _type: 'page',
        slug: 'membership',
      },
    },
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-placeholder',
        _type: 'reference',
      },
      alt: 'Scooters in Bora Bora',
    },
    layout: 'center',
    language: 'en',
    market: 'us',
  },
}

export const LeftAligned: Story = {
  args: {
    heading: {
      en: 'Train Smarter',
      es: 'Entrena Mejor',
    },
    subheading: {
      en: 'Join millions of riders worldwide',
      es: 'Únete a millones de ciclistas en todo el mundo',
    },
    cta: {
      label: 'Start Free Trial',
      linkType: 'internal',
      internalLink: {
        _type: 'page',
        slug: 'trial',
      },
    },
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-placeholder',
        _type: 'reference',
      },
      alt: 'Indoor training',
    },
    layout: 'left',
    language: 'en',
    market: 'us',
  },
}

export const BottomLeft: Story = {
  args: {
    heading: {
      en: 'Scootorama Cruise',
      es: 'Scootorama Cruise',
    },
    subheading: {
      en: 'Take your running to new heights',
      es: 'Lleva tu carrera a nuevas alturas',
    },
    cta: {
      label: 'Learn More',
      linkType: 'internal',
      internalLink: {
        _type: 'page',
        slug: 'run',
      },
    },
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-placeholder',
        _type: 'reference',
      },
      alt: 'Cruising the Alamo',
    },
    layout: 'bottom-left',
    language: 'en',
    market: 'us',
  },
}

export const Spanish: Story = {
  args: {
    heading: {
      en: 'Ride With Friends',
      es: 'Pedalea con Amigos',
    },
    subheading: {
      en: 'Connect with riders around the world',
      es: 'Conéctate con ciclistas de todo el mundo',
    },
    cta: {
      label: 'Join Now',
      linkType: 'internal',
      internalLink: {
        _type: 'page',
        slug: 'membership',
      },
    },
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-placeholder',
        _type: 'reference',
      },
      alt: 'Group ride',
    },
    layout: 'center',
    language: 'es',
    market: 'us',
  },
}

export const NoCTA: Story = {
  args: {
    heading: {
      en: 'Explore Bora Bora',
      es: 'Explora Bora Bora',
    },
    subheading: {
      en: 'Discover endless virtual worlds',
      es: 'Descubre mundos virtuales infinitos',
    },
    backgroundImage: {
      _type: 'image',
      asset: {
        _ref: 'image-placeholder',
        _type: 'reference',
      },
      alt: 'Bora Bora Bungalow Bay',
    },
    layout: 'center',
    language: 'en',
    market: 'us',
  },
}
