import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Button (Design System)',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary_ds',
        'tertiary',
        'plus',
        'outlinedPrimary',
        'outlinedSecondary',
        'outlinedTertiary',
        'textPrimary',
        'textSecondary',
        'textTertiary',
      ],
    },
    size: { control: 'select', options: ['small', 'medium'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', size: 'medium', children: 'Label' },
}

export const Secondary: Story = {
  args: { variant: 'secondary_ds', size: 'medium', children: 'Label' },
}

export const Tertiary: Story = {
  args: { variant: 'tertiary', size: 'medium', children: 'Label' },
}

/** Honk-Honk Buttons gradient fill, built from the `color.gradient.*` stops. */
export const Plus: Story = {
  args: { variant: 'plus', size: 'medium', children: 'Label' },
}

export const Outlined: Story = {
  args: { variant: 'outlinedPrimary', size: 'medium', children: 'Label' },
}

export const Text: Story = {
  args: { variant: 'textPrimary', size: 'medium', children: 'Label' },
}

/** Every type × size combination defined in Figma for web. */
export const Matrix: Story = {
  args: { children: 'Label' },
  render: () => (
    <div className="flex flex-col gap-6 bg-white p-8">
      {(['small', 'medium'] as const).map(size => (
        <div key={size} className="flex flex-col gap-3">
          <p className="font-body-bold text-xs uppercase text-neutral-500">
            {size}
          </p>
          <div className="flex items-center gap-4">
            {(['primary', 'secondary_ds', 'tertiary', 'plus'] as const).map(
              variant => (
                <Button key={variant} variant={variant} size={size}>
                  Label
                </Button>
              )
            )}
            <Button variant="primary" size={size} disabled>
              Disabled
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}
