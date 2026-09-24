import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Firecracker from '@/components/blocks/Firecracker'

const meta: Meta<typeof Firecracker> = {
  title: 'Blocks/Firecracker',
  component: Firecracker,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Firecracker>

export const CruiserDeluxe: Story = {
  args: {
    heading: {
      en: 'Cruiser Deluxe',
      es: 'Cruiser Deluxe',
    },
    subheading: {
      en: 'The ultimate smart scooter for indoor adventures',
      es: 'La bicicleta inteligente definitiva para entrenamiento indoor',
    },
    cta: {
      text: 'Pre-order Now',
      url: '/products/cruiser-deluxe',
    },
    marketingImage: {
      asset: {
        _ref: 'image-placeholder',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop',
      },
      alt: { en: 'Cruiser Deluxe' },
    },
    product: {
      title: 'Cruiser Deluxe',
      slug: { current: 'cruiser-deluxe' },
      image: {
        asset: {
          _ref: 'product-image',
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
        },
        alt: 'Cruiser Deluxe',
      },
      marketData: {
        price: 1299.99,
        compareAtPrice: 1499.99,
        currency: 'USD',
      },
    },
    language: 'en',
    market: 'us',
  },
}

export const KickStand: Story = {
  args: {
    heading: {
      en: 'Kick-Stand',
      es: 'Kick-Stand',
    },
    subheading: {
      en: 'Smart trainer for every scooter',
      es: 'Entrenador inteligente para todos los ciclistas',
    },
    cta: {
      text: 'Buy Now',
      url: '/products/kick-stand',
    },
    marketingImage: {
      asset: {
        _ref: 'image-placeholder',
        url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&h=1080&fit=crop',
      },
      alt: { en: 'Kick-Stand' },
    },
    product: {
      title: 'Kick-Stand',
      slug: { current: 'kick-stand' },
      image: {
        asset: {
          _ref: 'product-image',
          url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=800&fit=crop',
        },
        alt: 'Kick-Stand',
      },
      marketData: {
        price: 549.99,
        currency: 'USD',
      },
    },
    language: 'en',
    market: 'us',
  },
}

export const Spanish: Story = {
  args: {
    heading: {
      en: 'Limited Edition',
      es: 'Edición Limitada',
    },
    subheading: {
      en: 'Exclusive gear for Scootorama enthusiasts',
      es: 'Equipo exclusivo para entusiastas de Scootorama',
    },
    cta: {
      text: 'Shop Now',
      url: '/shop',
    },
    marketingImage: {
      asset: {
        _ref: 'image-placeholder',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
      },
      alt: { en: 'Limited edition gear' },
    },
    product: {
      title: 'Limited Edition Kit',
      slug: { current: 'limited-kit' },
      image: {
        asset: {
          _ref: 'product-image',
          url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&h=800&fit=crop',
        },
        alt: 'Kit',
      },
      marketData: {
        price: 89.99,
        currency: 'USD',
      },
    },
    language: 'es',
    market: 'us',
  },
}

export const OnSale: Story = {
  args: {
    heading: {
      en: 'Black Friday Sale',
      es: 'Venta Black Friday',
    },
    subheading: {
      en: 'Save big on Scootorama hardware',
      es: 'Ahorra en grande en hardware de Scootorama',
    },
    cta: {
      text: 'Shop Sale',
      url: '/sale',
    },
    marketingImage: {
      asset: {
        _ref: 'image-placeholder',
        url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1920&h=1080&fit=crop',
      },
      alt: { en: 'Sale' },
    },
    product: {
      title: 'Cruiser Deluxe Bundle',
      slug: { current: 'ride-bundle' },
      image: {
        asset: {
          _ref: 'product-image',
          url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=800&fit=crop',
        },
        alt: 'Bundle',
      },
      marketData: {
        price: 999.99,
        compareAtPrice: 1299.99,
        currency: 'USD',
      },
    },
    language: 'en',
    market: 'us',
  },
}
