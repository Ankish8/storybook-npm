import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Checkbox, type CheckedState } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A tri-state checkbox component with label support. Supports checked, unchecked, and indeterminate states.

\`\`\`bash
npx myoperator-ui add checkbox
\`\`\`

## Import

\`\`\`tsx
import { Checkbox } from "@myoperator/ui"
\`\`\`

## Design Tokens

| Token | Value |
|-------|-------|
| Primary Color | \`#343E55\` |
| Border Color | \`#E5E7EB\` |
| Text Color | \`#333333\` |
| Border Radius | \`4px\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'Size of the checkbox',
    },
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'Whether the checkbox is checked, unchecked, or indeterminate',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    label: {
      control: 'text',
      description: 'Optional label text',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the label',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

export const LabelLeft: Story = {
  args: {
    label: 'Remember me',
    labelPosition: 'left',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small checkbox',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large checkbox',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled checkbox',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    label: 'Disabled checked',
  },
}

export const DisabledIndeterminate: Story = {
  args: {
    disabled: true,
    checked: 'indeterminate',
    label: 'Disabled indeterminate',
  },
}

const ControlledExample = () => {
  const [checked, setChecked] = useState<CheckedState>(false)
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        label="Controlled checkbox"
      />
      <p className="text-sm text-gray-600">
        Current state: {checked === 'indeterminate' ? 'INDETERMINATE' : checked ? 'CHECKED' : 'UNCHECKED'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setChecked(false)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Uncheck
        </button>
        <button
          onClick={() => setChecked(true)}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Check
        </button>
        <button
          onClick={() => setChecked('indeterminate')}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Indeterminate
        </button>
      </div>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

const SelectAllExample = () => {
  const [items, setItems] = useState([
    { id: 1, label: 'Item 1', checked: false },
    { id: 2, label: 'Item 2', checked: false },
    { id: 3, label: 'Item 3', checked: false },
  ])

  const allChecked = items.every(item => item.checked)
  const someChecked = items.some(item => item.checked)
  const selectAllState: CheckedState = allChecked ? true : someChecked ? 'indeterminate' : false

  const handleSelectAll = () => {
    const newChecked = !allChecked
    setItems(items.map(item => ({ ...item, checked: newChecked })))
  }

  const handleItemChange = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={selectAllState}
        onCheckedChange={handleSelectAll}
        label="Select all"
      />
      <div className="ml-6 flex flex-col gap-2">
        {items.map(item => (
          <Checkbox
            key={item.id}
            checked={item.checked}
            onCheckedChange={() => handleItemChange(item.id)}
            label={item.label}
          />
        ))}
      </div>
    </div>
  )
}

export const SelectAllPattern: Story = {
  name: 'Select All Pattern',
  render: () => <SelectAllExample />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the indeterminate state for "select all" functionality. The parent checkbox shows indeterminate when some (but not all) children are selected.',
      },
    },
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Checkbox size="sm" checked label="Small" />
      </div>
      <div className="flex items-center gap-4">
        <Checkbox size="default" checked label="Default" />
      </div>
      <div className="flex items-center gap-4">
        <Checkbox size="lg" checked label="Large" />
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Unchecked" />
      <Checkbox checked label="Checked" />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled unchecked" />
      <Checkbox disabled checked label="Disabled checked" />
      <Checkbox disabled checked="indeterminate" label="Disabled indeterminate" />
    </div>
  ),
}
