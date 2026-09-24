import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { StatsGrid } from '@/components/blocks/StatsGrid'

const meta: Meta<typeof StatsGrid> = {
  title: 'Blocks/StatsGrid',
  component: StatsGrid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatsGrid>

export const FourStats: Story = {
  args: {
    stats: [
      {
        _id: '1',
        label: 'Active Riders',
        smartValue: {
          value: 4000000,
          suffix: '+',
          notation: 'compact',
        },
      },
      {
        _id: '2',
        label: 'Countries',
        smartValue: {
          value: 190,
          suffix: '+',
        },
      },
      {
        _id: '3',
        label: 'Events Daily',
        smartValue: {
          value: 24,
          suffix: '/7',
        },
      },
      {
        _id: '4',
        label: 'Virtual Worlds',
        smartValue: {
          value: 10,
          suffix: '+',
        },
      },
    ],
    language: 'en',
    market: 'us',
  },
}

export const ThreeStats: Story = {
  args: {
    stats: [
      {
        _id: '1',
        label: 'More Engaging',
        smartValue: {
          value: 2.5,
          suffix: 'x',
        },
      },
      {
        _id: '2',
        label: 'Fitness Improvement',
        smartValue: {
          value: 40,
          suffix: '%',
        },
      },
      {
        _id: '3',
        label: 'Stick With It',
        smartValue: {
          value: 85,
          suffix: '%',
        },
      },
    ],
    language: 'en',
    market: 'us',
  },
}

export const Spanish: Story = {
  args: {
    stats: [
      {
        _id: '1',
        label: 'Miles Ridden',
        smartValue: {
          value: 1000000000,
          suffix: '+',
          notation: 'compact',
        },
      },
      {
        _id: '2',
        label: 'Events Hosted',
        smartValue: {
          value: 500000,
          suffix: '+',
          notation: 'compact',
        },
      },
      {
        _id: '3',
        label: 'User Satisfaction',
        smartValue: {
          value: 95,
          suffix: '%',
        },
      },
    ],
    language: 'es',
    market: 'us',
  },
}
