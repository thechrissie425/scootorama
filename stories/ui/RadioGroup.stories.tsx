import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the radio group is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Radio Buttons allow Scooters to select a single, exclusive option from a set of choices.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Small: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="s1" size="small" />
        <Label htmlFor="s1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="s2" size="small" />
        <Label htmlFor="s2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="s3" size="small" />
        <Label htmlFor="s3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const Medium: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="m1" size="medium" />
        <Label htmlFor="m1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="m2" size="medium" />
        <Label htmlFor="m2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="m3" size="medium" />
        <Label htmlFor="m3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const Large: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="l1" size="large" />
        <Label htmlFor="l1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="l2" size="large" />
        <Label htmlFor="l2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="l3" size="large" />
        <Label htmlFor="l3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" disabled {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="d1" size="medium" />
        <Label htmlFor="d1">Option 1 (Selected & Disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="d2" size="medium" />
        <Label htmlFor="d2">Option 2 (Disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="d3" size="medium" />
        <Label htmlFor="d3">Option 3 (Disabled)</Label>
      </div>
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Small</h3>
        <div className="space-y-4">
          <RadioGroup defaultValue="small-selected">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="small-unselected"
                id="small-unselected"
                size="small"
              />
              <Label htmlFor="small-unselected">Unselected</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="small-selected"
                id="small-selected"
                size="small"
              />
              <Label htmlFor="small-selected">Selected</Label>
            </div>
          </RadioGroup>
          <RadioGroup defaultValue="small-disabled-selected" disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="small-disabled-unselected"
                id="small-disabled-unselected"
                size="small"
              />
              <Label htmlFor="small-disabled-unselected">
                Disabled Unselected
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="small-disabled-selected"
                id="small-disabled-selected"
                size="small"
              />
              <Label htmlFor="small-disabled-selected">Disabled Selected</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Medium (Default)</h3>
        <div className="space-y-4">
          <RadioGroup defaultValue="medium-selected">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="medium-unselected"
                id="medium-unselected"
                size="medium"
              />
              <Label htmlFor="medium-unselected">Unselected</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="medium-selected"
                id="medium-selected"
                size="medium"
              />
              <Label htmlFor="medium-selected">Selected</Label>
            </div>
          </RadioGroup>
          <RadioGroup defaultValue="medium-disabled-selected" disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="medium-disabled-unselected"
                id="medium-disabled-unselected"
                size="medium"
              />
              <Label htmlFor="medium-disabled-unselected">
                Disabled Unselected
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="medium-disabled-selected"
                id="medium-disabled-selected"
                size="medium"
              />
              <Label htmlFor="medium-disabled-selected">
                Disabled Selected
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Large</h3>
        <div className="space-y-4">
          <RadioGroup defaultValue="large-selected">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="large-unselected"
                id="large-unselected"
                size="large"
              />
              <Label htmlFor="large-unselected">Unselected</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="large-selected"
                id="large-selected"
                size="large"
              />
              <Label htmlFor="large-selected">Selected</Label>
            </div>
          </RadioGroup>
          <RadioGroup defaultValue="large-disabled-selected" disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="large-disabled-unselected"
                id="large-disabled-unselected"
                size="large"
              />
              <Label htmlFor="large-disabled-unselected">
                Disabled Unselected
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="large-disabled-selected"
                id="large-disabled-selected"
                size="large"
              />
              <Label htmlFor="large-disabled-selected">Disabled Selected</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive view of all radio button states across all size variants. Interactive states (hover, focus, pressed) can be tested by interacting with the components.',
      },
    },
  },
}

export const WithoutLabels: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" {...args}>
      <RadioGroupItem value="option-1" id="wl1" size="medium" />
      <RadioGroupItem value="option-2" id="wl2" size="medium" />
      <RadioGroupItem value="option-3" id="wl3" size="medium" />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: args => (
    <RadioGroup defaultValue="option-1" className="flex space-x-4" {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="h1" size="medium" />
        <Label htmlFor="h1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="h2" size="medium" />
        <Label htmlFor="h2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="h3" size="medium" />
        <Label htmlFor="h3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}
