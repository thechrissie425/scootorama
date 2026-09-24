import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Input> = {
  title: 'shadcn/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter your email',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Password: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="password">Password</Label>
      <Input type="password" id="password" placeholder="••••••••" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="scooter123" />
      <p className="text-sm text-muted-foreground">
        Choose a unique username for your Scootorama profile
      </p>
    </div>
  ),
}
