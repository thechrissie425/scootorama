import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import River from '@/components/blocks/River'

const meta: Meta<typeof River> = {
  title: 'Blocks/River',
  component: River,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof River>

export const Default: Story = {
  args: {
    heading: {
      en: 'Why Choose Scootorama',
      es: '¿Por Qué Elegir Scootorama?',
    },
    subtitle: {
      en: 'The features that make training better',
      es: 'Las características que hacen que el entrenamiento sea mejor',
    },
    items: [
      {
        _key: '1',
        layout: 'left',
        title: {
          en: 'Virtual Worlds',
          es: 'Mundos Virtuales',
        },
        description: {
          en: 'Scoot through wacky worlds from Bora Bora to the Alamo',
          es: 'Recorre mundos locos desde Bora Bora hasta el Álamo',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-1',
            _type: 'reference',
          },
          alt: 'Virtual world',
        },
      },
      {
        _key: '2',
        layout: 'right',
        title: {
          en: 'Structured Training',
          es: 'Entrenamiento Estructurado',
        },
        description: {
          en: 'Follow professionally designed training plans tailored to your goals',
          es: 'Sigue planes de entrenamiento diseñados profesionalmente adaptados a tus objetivos',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-2',
            _type: 'reference',
          },
          alt: 'Training session',
        },
      },
      {
        _key: '3',
        layout: 'left',
        title: {
          en: 'Social Riding',
          es: 'Ciclismo Social',
        },
        description: {
          en: 'Join group rides and races with riders from around the world',
          es: 'Únete a paseos grupales y carreras con ciclistas de todo el mundo',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-3',
            _type: 'reference',
          },
          alt: 'Group ride',
        },
      },
    ],
    language: 'en',
    market: 'us',
  },
}

export const TwoItems: Story = {
  args: {
    heading: {
      en: 'Train Your Way',
      es: 'Entrena a Tu Manera',
    },
    items: [
      {
        _key: '1',
        layout: 'left',
        title: {
          en: 'Indoor Scootering',
          es: 'Ciclismo Indoor',
        },
        description: {
          en: 'Smart trainer integration for the most realistic ride feel',
          es: 'Integración de entrenador inteligente para la sensación de conducción más realista',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-1',
            _type: 'reference',
          },
          alt: 'Smart trainer',
        },
      },
      {
        _key: '2',
        layout: 'right',
        title: {
          en: 'Running',
          es: 'Correr',
        },
        description: {
          en: 'Connect your treadmill and run in virtual worlds',
          es: 'Conecta tu cinta de correr y corre en mundos virtuales',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-2',
            _type: 'reference',
          },
          alt: 'Treadmill running',
        },
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
    subtitle: {
      en: 'Everything you need',
      es: 'Todo lo que necesitas',
    },
    items: [
      {
        _key: '1',
        layout: 'left',
        title: {
          en: 'Training Plans',
          es: 'Planes de Entrenamiento',
        },
        description: {
          en: 'Structured workouts for every level',
          es: 'Entrenamientos estructurados para todos los niveles',
        },
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-1',
            _type: 'reference',
          },
          alt: 'Training',
        },
      },
    ],
    language: 'es',
    market: 'us',
  },
}
