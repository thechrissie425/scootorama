import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'shadcn/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Get Started',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Learn More',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Action',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '→',
  },
}
