import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant from Figma design specs',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    size: 'small',
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode-small" {...args} />
      <Label htmlFor="airplane-mode-small">Small Switch</Label>
    </div>
  ),
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode-medium" {...args} />
      <Label htmlFor="airplane-mode-medium">Medium Switch (Default)</Label>
    </div>
  ),
}

export const Large: Story = {
  args: {
    size: 'large',
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode-large" {...args} />
      <Label htmlFor="airplane-mode-large">Large Switch</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: {
    size: 'medium',
    defaultChecked: true,
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="checked-switch" {...args} />
      <Label htmlFor="checked-switch">Checked by default</Label>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    size: 'medium',
    disabled: true,
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" {...args} />
      <Label htmlFor="disabled-switch">Disabled Switch</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  args: {
    size: 'medium',
    disabled: true,
    defaultChecked: true,
  },
  render: (args: React.ComponentProps<typeof Switch>) => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked-switch" {...args} />
      <Label htmlFor="disabled-checked-switch">Disabled & Checked</Label>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Small Size</h3>
        <div className="flex items-center space-x-2">
          <Switch id="small-unchecked" size="small" />
          <Label htmlFor="small-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="small-checked" size="small" defaultChecked />
          <Label htmlFor="small-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="small-disabled" size="small" disabled />
          <Label htmlFor="small-disabled">Disabled</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Medium Size (Default)</h3>
        <div className="flex items-center space-x-2">
          <Switch id="medium-unchecked" size="medium" />
          <Label htmlFor="medium-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="medium-checked" size="medium" defaultChecked />
          <Label htmlFor="medium-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="medium-disabled" size="medium" disabled />
          <Label htmlFor="medium-disabled">Disabled</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Large Size</h3>
        <div className="flex items-center space-x-2">
          <Switch id="large-unchecked" size="large" />
          <Label htmlFor="large-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="large-checked" size="large" defaultChecked />
          <Label htmlFor="large-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="large-disabled" size="large" disabled />
          <Label htmlFor="large-disabled">Disabled</Label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-xs font-semibold mb-2">Design Tokens Used:</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>✓ ColorToggleFillActive (checked background: #0093CD)</li>
          <li>✓ ColorToggleFillInactive (unchecked background: #E5E8EC)</li>
          <li>✓ ColorToggleStrokeActive (checked border: #00668F)</li>
          <li>✓ ColorToggleStrokeInactive (unchecked border: #CBD0D8)</li>
          <li>✓ ColorToggleContentActive (checked thumb: #FCFCFC)</li>
          <li>✓ ColorToggleContentInactive (unchecked thumb: #373F4D)</li>
          <li>✓ RadiusCircular (99px for fully rounded)</li>
          <li>✓ StrokeChonk (2px border width)</li>
        </ul>
      </div>
    </div>
  ),
}
