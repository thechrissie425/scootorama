import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Badge> = {
  title: 'shadcn/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'New',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Featured',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Deprecated',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Beta',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
