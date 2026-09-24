import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the checkbox',
    },
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
      description: 'Checked state of the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Small: Story = {
  args: {
    size: 'small',
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-small" {...args} />
      <Label htmlFor="terms-small">Small Checkbox</Label>
    </div>
  ),
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-medium" {...args} />
      <Label htmlFor="terms-medium">Medium Checkbox (Default)</Label>
    </div>
  ),
}

export const Large: Story = {
  args: {
    size: 'large',
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-large" {...args} />
      <Label htmlFor="terms-large">Large Checkbox</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-checked" {...args} />
      <Label htmlFor="terms-checked">Checked</Label>
    </div>
  ),
}

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-indeterminate" {...args} />
      <Label htmlFor="terms-indeterminate">Indeterminate</Label>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-disabled" {...args} />
      <Label htmlFor="terms-disabled">Disabled</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
  render: (args: React.ComponentProps<typeof Checkbox>) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-disabled-checked" {...args} />
      <Label htmlFor="terms-disabled-checked">Disabled Checked</Label>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Small Size</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="small-unchecked" size="small" />
          <Label htmlFor="small-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="small-checked" size="small" defaultChecked />
          <Label htmlFor="small-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="small-indeterminate"
            size="small"
            checked="indeterminate"
          />
          <Label htmlFor="small-indeterminate">Indeterminate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="small-disabled" size="small" disabled />
          <Label htmlFor="small-disabled">Disabled</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Medium Size (Default)</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="medium-unchecked" size="medium" />
          <Label htmlFor="medium-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="medium-checked" size="medium" defaultChecked />
          <Label htmlFor="medium-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medium-indeterminate"
            size="medium"
            checked="indeterminate"
          />
          <Label htmlFor="medium-indeterminate">Indeterminate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="medium-disabled" size="medium" disabled />
          <Label htmlFor="medium-disabled">Disabled</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Large Size</h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="large-unchecked" size="large" />
          <Label htmlFor="large-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="large-checked" size="large" defaultChecked />
          <Label htmlFor="large-checked">Checked</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="large-indeterminate"
            size="large"
            checked="indeterminate"
          />
          <Label htmlFor="large-indeterminate">Indeterminate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="large-disabled" size="large" disabled />
          <Label htmlFor="large-disabled">Disabled</Label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-xs font-semibold mb-2">Design Tokens Used:</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>✓ ColorInputFillDefault (checked background: #0093CD)</li>
          <li>✓ ColorNeutralWhiteBase (unchecked background: #FCFCFC)</li>
          <li>✓ ColorInputStroke (checked border: #00668F)</li>
          <li>✓ ColorFormFieldStrokeDefault (unchecked border: #CBD0D8)</li>
          <li>✓ ColorInputContent (icon color: #FFFFFF)</li>
          <li>✓ RadiusXSmall (4px rounded corners)</li>
          <li>✓ StrokeChonk (2px border width)</li>
        </ul>
      </div>
    </div>
  ),
}
